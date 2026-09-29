"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = { reducedMotion: boolean };

const IMAGE_WIDTH = 1672;
const IMAGE_HEIGHT = 941;
const PURPLE = 0x9e77ed;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const point = (x: number, imageY: number) => new THREE.Vector3(x, IMAGE_HEIGHT - imageY, 0);

/**
 * These points follow pedestrian paving and entrances in the generated base plate.
 * They are illustrative choreography, not a claim that a particular person was measured.
 */
function buildSignal(scene: THREE.Scene) {
  const mainCurve = new THREE.CatmullRomCurve3([
    point(1340, 832),
    point(1298, 737),
    point(1245, 650),
    point(1215, 578),
    point(1178, 507),
    point(1138, 437),
    point(1080, 372),
    point(1008, 320),
    point(927, 281),
  ], false, "centripetal");

  const branchCurve = new THREE.CatmullRomCurve3([
    point(1215, 578),
    point(1263, 525),
    point(1308, 470),
    point(1330, 408),
  ], false, "centripetal");

  // A short continuation reaches the existing vehicle lane, then disappears.
  // It does not encode vehicle occupancy or equate vehicles with visits.
  const vehicleCurve = new THREE.CatmullRomCurve3([
    point(1340, 832),
    point(1460, 812),
    point(1540, 784),
    point(1618, 735),
  ], false, "centripetal");

  const arcCurve = new THREE.QuadraticBezierCurve3(
    point(887, 357),
    point(1034, 253),
    point(1184, 356),
  );

  const makeStroke = (
    curve: THREE.Curve<THREE.Vector3>,
    segments: number,
    radius: number,
    opacity: number,
  ) => {
    const geometry = new THREE.TubeGeometry(curve, segments, radius, 5, false);
    geometry.setDrawRange(0, 0);
    const material = new THREE.MeshBasicMaterial({
      color: PURPLE,
      transparent: true,
      opacity,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 2;
    scene.add(mesh);
    return { geometry, material, segments };
  };

  const main = makeStroke(mainCurve, 160, 2.05, .82);
  const branch = makeStroke(branchCurve, 48, 1.2, .32);
  const arc = makeStroke(arcCurve, 64, .8, .16);
  const vehicle = makeStroke(vehicleCurve, 52, 1.05, .22);

  // One shared soft texture gives a travelling signal and brief highlights over people.
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const distance = Math.hypot(x - 31.5, y - 31.5) / 31.5;
      const alpha = Math.pow(Math.max(0, 1 - distance), 2.4);
      const index = (y * size + x) * 4;
      pixels[index] = 255;
      pixels[index + 1] = 255;
      pixels[index + 2] = 255;
      pixels[index + 3] = Math.round(alpha * 255);
    }
  }
  const glowTexture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  glowTexture.needsUpdate = true;
  glowTexture.magFilter = THREE.LinearFilter;
  glowTexture.minFilter = THREE.LinearFilter;

  const makeGlow = (x: number, y: number, diameter: number) => {
    const material = new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: PURPLE,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(diameter, diameter), material);
    mesh.position.copy(point(x, y));
    mesh.position.z = 2;
    mesh.renderOrder = 4;
    scene.add(mesh);
    return { mesh, material };
  };

  const traveller = makeGlow(1340, 832, 34);
  const vehicleTraveller = makeGlow(1340, 832, 22);
  const people = [
    { x: 1298, y: 735, progress: .13 },
    { x: 1246, y: 651, progress: .27 },
    { x: 1217, y: 576, progress: .39 },
    { x: 1180, y: 510, progress: .52 },
    { x: 1138, y: 435, progress: .64 },
    { x: 1080, y: 373, progress: .76 },
    { x: 1009, y: 320, progress: .88 },
  ].map((person) => ({
    ...person,
    ...makeGlow(person.x, person.y, 25),
  }));

  // An elliptical ground ring gathers a small group without attaching identity to anyone.
  const dwellMaterial = new THREE.MeshBasicMaterial({
    color: PURPLE,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const dwell = new THREE.Mesh(new THREE.RingGeometry(30, 31.5, 64), dwellMaterial);
  dwell.position.copy(point(1227, 574));
  dwell.position.z = 1;
  dwell.scale.y = .39;
  dwell.renderOrder = 3;
  scene.add(dwell);

  const setRange = (
    stroke: { geometry: THREE.TubeGeometry; segments: number },
    fraction: number,
  ) => stroke.geometry.setDrawRange(0, Math.floor(clamp01(fraction) * stroke.segments) * 5 * 6);

  const update = (seconds: number, reduced: boolean) => {
    const signal = reduced ? 1 : clamp01((seconds - 1.2) / 2.3);
    const understanding = reduced ? 1 : clamp01((seconds - 3.5) / 1.3);
    const settle = reduced ? 1 : clamp01((seconds - 3.5) / 1.3);
    const transient = reduced ? 0 : 1 - clamp01((seconds - 3.9) / 1.1);

    setRange(main, signal);
    main.material.opacity = .82 - .35 * settle;

    setRange(branch, reduced ? 1 : clamp01((seconds - 2.75) / 1.05));
    branch.material.opacity = .06 + .26 * transient;

    setRange(arc, understanding);
    arc.material.opacity = understanding * (.1 + .15 * transient);

    const vehicleProgress = reduced ? 1 : clamp01((seconds - 3.15) / 1.1);
    const vehicleFade = reduced ? 0 : 1 - clamp01((seconds - 4.15) / .7);
    setRange(vehicle, vehicleProgress);
    vehicle.material.opacity = .22 * vehicleFade;
    const vehicleMoving = !reduced && seconds >= 3.15 && seconds < 4.35;
    vehicleTraveller.mesh.visible = vehicleMoving;
    if (vehicleMoving) {
      vehicleTraveller.mesh.position.copy(vehicleCurve.getPointAt(vehicleProgress));
      vehicleTraveller.mesh.position.z = 2;
      vehicleTraveller.material.opacity = .34 * vehicleFade;
    }

    const travelling = !reduced && seconds >= 1.2 && seconds < 3.5;
    traveller.mesh.visible = travelling;
    if (travelling) {
      traveller.mesh.position.copy(mainCurve.getPointAt(signal));
      traveller.mesh.position.z = 2;
      traveller.material.opacity = .92;
    }

    people.forEach((person) => {
      if (reduced) {
        person.material.opacity = .06;
      } else if (travelling) {
        person.material.opacity = Math.max(0, 1 - Math.abs(signal - person.progress) * 8) * .5;
      } else {
        person.material.opacity = understanding * (.06 + .1 * transient);
      }
    });

    const dwellProgress = reduced ? 1 : clamp01((seconds - 3.1) / 1.3);
    dwellMaterial.opacity = dwellProgress * (.12 + .22 * transient);
    const expansion = .58 + dwellProgress * .42;
    dwell.scale.set(expansion, expansion * .39, 1);
  };

  const dispose = () => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      }
    });
    glowTexture.dispose();
  };

  return { update, dispose };
}

export function UnifiedIntroScene({ reducedMotion }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      // The photographic base and DOM CTA remain usable without WebGL.
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, IMAGE_WIDTH, IMAGE_HEIGHT, 0, .1, 20);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    const signal = buildSignal(scene);

    const resize = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      const scale = Math.max(width / IMAGE_WIDTH, height / IMAGE_HEIGHT);
      const drawnWidth = IMAGE_WIDTH * scale;
      const drawnHeight = IMAGE_HEIGHT * scale;
      const position = width <= 1100 ? 1 : .85; // mirrors object-position in CSS
      const offsetX = (width - drawnWidth) * position;
      const offsetY = (height - drawnHeight) / 2;
      camera.left = -offsetX / scale;
      camera.right = (width - offsetX) / scale;
      camera.top = IMAGE_HEIGHT + offsetY / scale;
      camera.bottom = IMAGE_HEIGHT - (height - offsetY) / scale;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const seconds = (now - start) / 1000;
      signal.update(reducedMotion ? 5 : seconds, reducedMotion);
      if (document.visibilityState === "visible") renderer.render(scene, camera);
      if (!reducedMotion && seconds < 5) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      signal.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div ref={host} style={{ width: "100%", height: "100%" }} />;
}
