"""
Schematic measurement-principle explainers for the "How does this work?" drawer.

    python3 scripts/explainer-illustrations.py

Writes seven SVGs to public/assets/technology/explainers/. They close the
illustration gaps named in docs/content/EXPLAINER-BRIEF.md (six) and the Retail
classification gap (CONTENT-REVIEW-2026-09-27.md, proposal 5).

What they are: axonometric line drawings on the PFM black canvas, with the
measurement principle drawn as the brand's glass layers in the red-to-purple
range (03-shared/brand/visual-style.md, "Use glass layers for concept
explanation"). They are NOT the photographic artwork the brief asks for; that
remains a production task, and these carry an illustration note saying they are
schematic.

The brief's rules, and how each is kept here:
  - No faces: figures are a body and a plain head, no features.
  - No text, numbers or labels: the drawings contain no <text> element, which a
    test asserts. Labels are the localized approach name and explanation.
  - No brands: fascias are blank.
  - Its own kind of place: each segment has its own architecture — a store
    interior, a mall concourse, a retail-park unit with a car park, an outlet
    village gateway and street. Nothing is reused with a different overlay.
  - No hardware claims: a sensor is a small generic disc or dome.
  - No completeness: coverage is drawn as partial, with gaps.

Colours are the brand tokens (03-shared/brand/design-tokens.json): neutral
950/900/800/700/600/400/300, purple 200–700, red 300–500. Nothing else.
"""

from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public/assets/technology/explainers"
W, H = 1672, 941

# Brand tokens.
N950, N900, N800, N700, N600, N400, N300 = (
    "#0C111D", "#161B26", "#1F242F", "#333741", "#61646C", "#94969C", "#CECFD2",
)
P200, P300, P400, P500, P600, P700 = "#E9D7FE", "#D6BBFB", "#B692F6", "#9E77ED", "#7F56D9", "#6941C6"
R300, R400, R500 = "#FDA29B", "#F97066", "#F04438"

COS30, SIN30 = math.cos(math.radians(30)), 0.5


class Scene:
    """An axonometric drawing: metres in, pixels out."""

    def __init__(self, scale: float = 40):
        self.ox, self.oy, self.s = 0.0, 0.0, scale
        self.parts: list[str] = []
        self.bounds = [math.inf, math.inf, -math.inf, -math.inf]
        self.fit_to: tuple[float, float, float] = (0.0, 0.0, 1.0)
        self.focus_pts: list[tuple[float, float, float]] = []

    def focus(self, *pts3) -> None:
        """Frame the render on these world points; the rest runs off the edge, like a crop."""
        self.focus_pts = list(pts3)

    def p(self, x: float, y: float, z: float = 0.0) -> tuple[float, float]:
        sx = self.ox + (x - y) * COS30 * self.s
        sy = self.oy + (x + y) * SIN30 * self.s - z * self.s
        b = self.bounds
        b[0], b[1], b[2], b[3] = min(b[0], sx), min(b[1], sy), max(b[2], sx), max(b[3], sy)
        return sx, sy

    def render(self, x: float, y: float, w: float, h: float) -> str:
        """The drawing, scaled and centred to fill the box (x, y, w, h)."""
        bx0, by0, bx1, by1 = self.bounds
        if self.focus_pts:
            saved = list(self.bounds)
            self.bounds = [math.inf, math.inf, -math.inf, -math.inf]
            for q in self.focus_pts:
                self.p(*q)
            bx0, by0, bx1, by1 = self.bounds
            self.bounds = saved
        k = min(w / (bx1 - bx0), h / (by1 - by0))
        tx = x + (w - (bx1 - bx0) * k) / 2 - bx0 * k
        ty = y + (h - (by1 - by0) * k) / 2 - by0 * k
        self.fit_to = (tx, ty, k)
        return f'<g transform="translate({tx:.1f} {ty:.1f}) scale({k:.4f})">\n{self.svg()}\n</g>'

    def mapped(self, pt: tuple[float, float]) -> tuple[float, float]:
        """A drawing point, after `render` has placed the drawing."""
        tx, ty, k = self.fit_to
        return tx + pt[0] * k, ty + pt[1] * k

    def add(self, svg: str) -> None:
        self.parts.append(svg)

    def poly(self, pts3, fill="none", stroke="none", sw=1.5, opacity=1.0, extra=""):
        pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in (self.p(*q) for q in pts3))
        self.add(
            f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
            f'stroke-linejoin="round" opacity="{opacity}" {extra}/>'
        )

    def line(self, a, b, stroke=N700, sw=1.5, opacity=1.0, extra=""):
        (x1, y1), (x2, y2) = self.p(*a), self.p(*b)
        self.add(
            f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="round" opacity="{opacity}" {extra}/>'
        )

    def floor(self, x0, y0, x1, y1, fill=N900, stroke=N800):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], fill=fill, stroke=stroke)

    def grid(self, x0, y0, x1, y1, step=1.0, stroke=N800, opacity=0.55):
        x = x0
        while x <= x1 + 1e-6:
            self.line((x, y0), (x, y1), stroke=stroke, sw=1, opacity=opacity)
            x += step
        y = y0
        while y <= y1 + 1e-6:
            self.line((x0, y), (x1, y), stroke=stroke, sw=1, opacity=opacity)
            y += step

    def box(self, x, y, z, w, d, h, top=N800, left=N900, right=N800, stroke=N700, sw=1.2):
        """Visible faces for a viewer looking from +x, +y: top, +y side, +x side."""
        self.poly([(x, y + d, z), (x + w, y + d, z), (x + w, y + d, z + h), (x, y + d, z + h)],
                  fill=left, stroke=stroke, sw=sw)
        self.poly([(x + w, y, z), (x + w, y + d, z), (x + w, y + d, z + h), (x + w, y, z + h)],
                  fill=right, stroke=stroke, sw=sw)
        self.poly([(x, y, z + h), (x + w, y, z + h), (x + w, y + d, z + h), (x, y + d, z + h)],
                  fill=top, stroke=stroke, sw=sw)

    def wall_y(self, x0, x1, y, h, fill=N900, stroke=N700, openings=()):
        """A wall in the plane y = const, facing +y, with door or window openings."""
        self.poly([(x0, y, 0), (x1, y, 0), (x1, y, h), (x0, y, h)], fill=fill, stroke=stroke)
        for ox0, ox1, oz0, oz1, ofill in openings:
            self.poly([(ox0, y, oz0), (ox1, y, oz0), (ox1, y, oz1), (ox0, y, oz1)],
                      fill=ofill, stroke=N600, sw=1.2)

    def wall_x(self, y0, y1, x, h, fill=N800, stroke=N700, openings=()):
        """A wall in the plane x = const, facing +x."""
        self.poly([(x, y0, 0), (x, y1, 0), (x, y1, h), (x, y0, h)], fill=fill, stroke=stroke)
        for oy0, oy1, oz0, oz1, ofill in openings:
            self.poly([(x, oy0, oz0), (x, oy1, oz0), (x, oy1, oz1), (x, oy0, oz1)],
                      fill=ofill, stroke=N600, sw=1.2)

    def gable_x(self, y0, y1, x, h, ridge):
        """Pitched-roof end, in the plane x = const."""
        self.poly([(x, y0, h), (x, y1, h), (x, (y0 + y1) / 2, h + ridge)], fill=N800, stroke=N700)

    def person(self, x, y, tone=N400, head=N300, h=1.72, bag=False):
        """A figure with no features: shadow, body, head. Never a face."""
        cx, cy = self.p(x, y, 0)
        s = self.s
        bw = 0.58 * s
        top = self.p(x, y, h * 0.84)[1]
        self.add(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{bw * 0.7:.1f}" ry="{bw * 0.3:.1f}" fill="{N950}" opacity="0.7"/>')
        self.add(
            f'<rect x="{cx - bw / 2:.1f}" y="{top:.1f}" width="{bw:.1f}" height="{cy - top:.1f}" '
            f'rx="{bw / 2:.1f}" fill="{tone}"/>'
        )
        hy = self.p(x, y, h * 0.93)[1]
        self.add(f'<circle cx="{cx:.1f}" cy="{hy:.1f}" r="{0.19 * s:.1f}" fill="{head}"/>')
        if bag:
            by = self.p(x, y, h * 0.42)[1]
            self.add(
                f'<rect x="{cx + bw * 0.45:.1f}" y="{by:.1f}" width="{bw * 0.5:.1f}" height="{bw * 0.6:.1f}" '
                f'rx="3" fill="{head}" opacity="0.85"/>'
            )

    def pram(self, x, y, tone=N400):
        self.box(x - 0.3, y - 0.2, 0.25, 0.6, 0.4, 0.45, top=tone, left=N600, right=tone, stroke=N600, sw=1)
        for dx in (-0.22, 0.22):
            cx, cy = self.p(x + dx, y + 0.22, 0.12)
            self.add(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{0.1 * self.s:.1f}" fill="none" stroke="{tone}" stroke-width="2"/>')

    def car(self, x, y, w=1.9, d=4.2, tone=N700):
        """A plain car: two stacked boxes, no plate, no marque."""
        self.box(x, y, 0.2, w, d, 0.7, top=N600, left=N800, right=tone, stroke=N600, sw=1)
        self.box(x + 0.15, y + 1.0, 0.9, w - 0.3, d - 2.0, 0.55, top=N700, left=N900, right=N800, stroke=N600, sw=1)

    def bbox(self, x, y, h=1.72, pad=0.35, extra_x=0.0):
        """Screen-space box around a figure, for a frame."""
        cx, cy = self.p(x, y, 0)
        s = self.s
        top = self.p(x, y, h)[1]
        half = (0.36 + pad + extra_x) * s
        return cx - half, top - pad * s * 0.6, 2 * half, (cy - top) + pad * s * 1.1

    def frame(self, box, color=P400, fill_opacity=0.14, sw=2.4):
        x, y, w, h = box
        self.add(
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="14" '
            f'fill="{color}" fill-opacity="{fill_opacity}" stroke="{color}" stroke-width="{sw}"/>'
        )

    def sensor(self, x, y, z, glow=True):
        """A small generic disc: a principle, not a product."""
        cx, cy = self.p(x, y, z)
        r = 0.2 * self.s
        if glow:
            self.add(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r * 2.6:.1f}" fill="{P500}" opacity="0.25" filter="url(#blur)"/>')
        self.add(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{r:.1f}" ry="{r * 0.55:.1f}" fill="{N300}" stroke="{P300}" stroke-width="1.5"/>')

    def cone(self, apex, footprint, gid="coneGrad"):
        """A glass cone from a sensor to a floor footprint (a list of floor points)."""
        ax, ay = self.p(*apex)
        pts = [self.p(*q) for q in footprint]
        # The cone's silhouette: apex plus the footprint's outermost points on screen.
        left = min(pts, key=lambda q: q[0])
        right = max(pts, key=lambda q: q[0])
        lower = max(pts, key=lambda q: q[1])
        foot = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
        self.add(f'<polygon points="{foot}" fill="{P500}" fill-opacity="0.22" stroke="{P400}" stroke-width="1.5" stroke-dasharray="6 6"/>')
        sil = f"{ax:.1f},{ay:.1f} {left[0]:.1f},{left[1]:.1f} {lower[0]:.1f},{lower[1]:.1f} {right[0]:.1f},{right[1]:.1f}"
        self.add(f'<polygon points="{sil}" fill="url(#{gid})" stroke="none"/>')

    def glow_line(self, a, b, color=P400, sw=4):
        self.line(a, b, stroke=color, sw=sw * 3, opacity=0.35, extra='filter="url(#blur)"')
        self.line(a, b, stroke=color, sw=sw)

    def chevron(self, x, y, direction, color=P300, size=0.35):
        """A floor arrow: +1 walks in (towards -y), -1 walks out."""
        d = -direction
        pts = [(x - size, y - d * size * 0.2), (x, y + d * size), (x + size, y - d * size * 0.2)]
        (x1, y1), (x2, y2), (x3, y3) = (self.p(*q) for q in pts)
        self.add(f'<polyline points="{x1:.1f},{y1:.1f} {x2:.1f},{y2:.1f} {x3:.1f},{y3:.1f}" fill="none" '
                 f'stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>')

    def svg(self) -> str:
        return "\n".join(self.parts)


def document(body: str, title: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img">
<!-- {title} -->
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{N950}"/><stop offset="1" stop-color="{N900}"/>
  </linearGradient>
  <radialGradient id="halo" cx="0.5" cy="0.45" r="0.6">
    <stop offset="0" stop-color="{P700}" stop-opacity="0.28"/><stop offset="1" stop-color="{P700}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{P300}" stop-opacity="0.55"/><stop offset="1" stop-color="{P500}" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="coneGradRed" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{R300}" stop-opacity="0.5"/><stop offset="1" stop-color="{R500}" stop-opacity="0.06"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{P500}" stop-opacity="0.16"/><stop offset="1" stop-color="{R500}" stop-opacity="0.08"/>
  </linearGradient>
  <linearGradient id="pane" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{P600}" stop-opacity="0.35"/><stop offset="1" stop-color="{P700}" stop-opacity="0.12"/>
  </linearGradient>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#halo)"/>
{body}
</svg>
"""


# ---------------------------------------------------------------------------
# Retail · TECH-03 · anonymous visitor groups in a store
# ---------------------------------------------------------------------------

def retail_classification() -> str:
    s = Scene(scale=46)
    s.floor(0, 0, 16, 12)
    s.grid(0, 0, 16, 12, step=2)
    s.wall_y(0, 16, 0, 3.6, fill=N900)
    s.wall_x(0, 12, 0, 3.6, fill=N800, openings=[(8.5, 11.2, 0, 2.6, "url(#pane)")])
    # Fixtures: tables and a rail, as a store interior.
    for (x, y) in [(3, 2.5), (9, 2.5)]:
        s.box(x, y, 0, 3, 1.4, 0.9, top=N700)
    s.box(12.5, 0.4, 0, 3, 0.6, 1.6, top=N700)
    s.box(2.5, 7.5, 0, 2.2, 1.2, 0.9, top=N700)
    # Groups, drawn back to front.
    s.frame(s.bbox(7.2, 6.0, extra_x=0.9), color=R400)
    s.person(6.6, 5.8, tone=R300, head=N300)
    s.person(7.8, 6.2, tone=R300, head=N300, bag=True)
    s.frame(s.bbox(12.5, 6.5), color=P400)
    s.person(12.5, 6.5, tone=P300)
    s.frame(s.bbox(9.8, 9.6, extra_x=0.7), color=P500)
    s.person(9.4, 9.4, tone=P400)
    s.pram(10.4, 9.9, tone=P300)
    s.frame(s.bbox(4.8, 10.3, extra_x=1.3), color=P300)
    for (x, y) in [(3.9, 10.1), (4.9, 10.5), (5.8, 10.2)]:
        s.person(x, y, tone=P200, head=N300)
    s.focus((2.5, 3.5, 2.6), (14.5, 3.5, 2.6), (2.5, 11.5, 0), (14.5, 11.5, 0))
    return document(s.render(96, 64, W - 192, H - 128), "Anonymous visitor groups in a store")


# ---------------------------------------------------------------------------
# Shopping Centre · TECH-02 · counting at a threshold off the concourse
# ---------------------------------------------------------------------------

def shopping_centre_threshold() -> str:
    s = Scene()
    s.floor(0, 0, 15, 10)
    s.grid(0, 0, 15, 10, step=1.5)
    # A store front off the concourse, with its open entrance; blank fascia.
    s.wall_y(0, 15, 0, 5.0, fill=N900, openings=[
        (1.0, 4.8, 0.7, 3.0, "url(#pane)"),
        (5.6, 9.4, 0.0, 3.2, N950),
        (10.2, 14.0, 0.7, 3.0, "url(#pane)"),
    ])
    s.box(0, 0, 3.6, 15, 0.5, 0.3, top=N700)
    # The concourse's other side: a second store front, and the balustrade of
    # the void to the floor below — which is what makes it a centre, not a street.
    s.wall_x(0, 10, 0, 5.0, fill=N800, openings=[(1.5, 6.0, 0.7, 3.0, "url(#pane)")])
    s.line((6.0, 8.2, 1.0), (15.0, 8.2, 1.0), stroke=N600, sw=2)
    s.line((6.0, 8.2, 0), (6.0, 8.2, 1.0), stroke=N600, sw=2)
    for xx in range(7, 15, 2):
        s.line((xx, 8.2, 0), (xx, 8.2, 1.0), stroke=N700, sw=1.2)
    s.poly([(6.0, 8.2, 0), (15.0, 8.2, 0), (15.0, 10, 0), (6.0, 10, 0)], fill=N950, stroke=N800)
    # The sensor above the threshold, and its cone across the full width.
    s.sensor(7.5, 0.8, 3.45)
    s.cone((7.5, 0.8, 3.4), [(5.4, 0.3, 0), (9.6, 0.3, 0), (9.6, 2.6, 0), (5.4, 2.6, 0)])
    s.glow_line((5.4, 1.4, 0), (9.6, 1.4, 0), color=P400)
    # People crossing in both directions, and others passing along the concourse.
    s.person(6.5, 1.1, tone=P300)
    s.chevron(6.5, 2.2, +1)
    s.person(8.6, 1.9, tone=P300, bag=True)
    s.chevron(8.6, 3.0, -1)
    s.person(3.0, 4.8)
    s.person(11.2, 4.2)
    s.person(11.9, 4.6)
    s.person(4.5, 7.0)
    s.focus((1.5, 0, 4.6), (13.5, 0, 4.6), (1.5, 7.5, 0), (13.5, 7.5, 0))
    return document(s.render(96, 64, W - 192, H - 128), "Counting at a store threshold in a shopping centre")


# ---------------------------------------------------------------------------
# Retail Park · TECH-02 · counting at a unit entrance, car park behind
# ---------------------------------------------------------------------------

def retail_park_entrance() -> str:
    s = Scene()
    s.floor(0, 0, 20, 15, fill=N900)
    # The car park in front: bays and plain cars, no plates or marques.
    for i in range(7):
        x = 2 + i * 2.6
        s.line((x, 10.2), (x, 14.8), stroke=N700, sw=1.4)
    for x in (2.35, 7.55, 12.75):
        s.car(x, 10.4)
    # The pavement in front of the units.
    s.floor(0, 4, 20, 7.5, fill=N800, stroke=N700)
    # The measured unit, and part of its neighbour.
    s.box(0, 0, 0, 6.6, 4, 6.0, top=N800, left=N900, right=N800)
    s.wall_y(0, 6.6, 4, 6.0, fill=N900, openings=[(0.8, 5.8, 0.6, 4.0, "url(#pane)")])
    s.box(7.0, 0, 0, 13, 4, 6.5, top=N800, left=N900, right=N800)
    s.wall_y(7.0, 20, 4, 6.5, fill=N900, openings=[
        (8.0, 11.6, 0.6, 4.2, "url(#pane)"),
        (12.4, 15.4, 0.0, 3.4, N950),
        (16.2, 19.2, 0.6, 4.2, "url(#pane)"),
    ])
    s.box(11.9, 4, 3.6, 4.0, 1.2, 0.25, top=N700)  # canopy, blank
    s.sensor(13.9, 4.8, 3.55)
    s.cone((13.9, 4.8, 3.5), [(12.2, 4.1, 0), (15.6, 4.1, 0), (15.6, 6.6, 0), (12.2, 6.6, 0)])
    s.glow_line((12.2, 5.2, 0), (15.6, 5.2, 0), color=P400)
    s.person(13.2, 5.0, tone=P300)
    s.chevron(13.2, 6.3, +1)
    s.person(14.7, 5.9, tone=P300, bag=True)
    s.chevron(14.7, 7.1, -1)
    s.person(4.0, 6.0)
    s.person(18.5, 8.5)
    s.person(10.0, 9.0)
    s.focus((7.5, 4, 6.8), (20, 4, 6.8), (7.5, 11.5, 0), (20, 11.5, 0))
    return document(s.render(96, 64, W - 192, H - 128), "Counting at a retail-park unit entrance")


# ---------------------------------------------------------------------------
# Re-identification: two separate views, the same figure framed in both
# ---------------------------------------------------------------------------

def two_views(left: Scene, right: Scene, title: str, left_xy, right_xy) -> str:
    """Two glass panes with a gap between them — coverage is partial."""
    pane_w, pane_h, top, gap = 700, 740, 100, 96
    lx = (W - 2 * pane_w - gap) / 2
    rx = lx + pane_w + gap
    parts = []
    for i, (px, sc) in enumerate([(lx, left), (rx, right)]):
        parts.append(f'<clipPath id="pane{i}"><rect x="{px}" y="{top}" width="{pane_w}" height="{pane_h}" rx="28"/></clipPath>')
        parts.append(
            f'<g clip-path="url(#pane{i})"><rect x="{px}" y="{top}" width="{pane_w}" height="{pane_h}" fill="{N950}"/>'
            f'{sc.render(px + 36, top + 36, pane_w - 72, pane_h - 72)}</g>'
        )
        parts.append(f'<rect x="{px}" y="{top}" width="{pane_w}" height="{pane_h}" rx="28" fill="url(#glass)" stroke="{P400}" stroke-opacity="0.45" stroke-width="2"/>')
    # The link between the two matched observations, arcing over the gap.
    (ax, ay), (bx, by) = left.mapped(left_xy), right.mapped(right_xy)
    mx, my = (ax + bx) / 2, max(40, min(ay, by) - 220)
    parts.append(f'<path d="M{ax:.1f},{ay:.1f} Q{mx:.1f},{my:.1f} {bx:.1f},{by:.1f}" fill="none" stroke="{P300}" stroke-width="3.5" stroke-dasharray="4 11" stroke-linecap="round"/>')
    for (x, y) in ((ax, ay), (bx, by)):
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="{P300}"/>')
    return document("\n".join(parts), title)


def frame_top(sc: Scene, x, y):
    bx, by, bw, bh = sc.bbox(x, y)
    return bx + bw / 2, by


def retail_park_reid() -> str:
    # View 1: one unit's entrance, seen from the car park.
    a = Scene()
    a.floor(0, 0, 12, 8, fill=N900)
    a.box(0, -4, 0, 12, 4, 6, top=N800)
    a.wall_y(0, 12, 0, 6, fill=N900, openings=[(1, 4.5, 0.6, 4, "url(#pane)"), (5.2, 8.2, 0, 3.4, N950), (9, 11.5, 0.6, 4, "url(#pane)")])
    for i in range(4):
        a.line((1.5 + i * 2.6, 5.2), (1.5 + i * 2.6, 8), stroke=N700)
    a.car(1.85, 5.4)
    a.person(3.2, 3.0)
    a.frame(a.bbox(6.7, 2.2), color=P400)
    a.person(6.7, 2.2, tone=P300, bag=True)
    a.person(10.5, 3.6)
    a.focus((3, 0, 6.2), (12, 0, 6.2), (3, 5, 0), (12, 5, 0))
    # View 2: a different unit across the park — lower, glazed, with a canopy.
    b = Scene()
    b.floor(0, 0, 12, 8, fill=N900)
    b.floor(0, 0, 12, 2.4, fill=N800, stroke=N700)
    b.box(0, -4, 0, 12, 4, 4.5, top=N800)
    b.wall_y(0, 12, 0, 4.5, fill=N900, openings=[(0.8, 5.5, 0.5, 2.9, "url(#pane)"), (6.2, 8.8, 0, 2.9, N950), (9.4, 11.4, 0.5, 2.9, "url(#pane)")])
    b.box(0, 0, 3.1, 12, 1.4, 0.25, top=N700)
    for (x, y) in [(9.8, 5.0), (10.4, 5.0), (11.0, 5.0)]:
        b.box(x, y, 0, 0.5, 1.1, 0.9, top=N600, left=N800, right=N700, sw=1)  # trolley bay
    b.person(2.6, 4.2)
    b.frame(b.bbox(7.4, 2.4), color=P400)
    b.person(7.4, 2.4, tone=P300, bag=True)
    b.focus((2, 0, 4.8), (12, 0, 4.8), (2, 6, 0), (12, 6, 0))
    return two_views(a, b, "The same figure in two views at different units of a retail park",
                     frame_top(a, 6.7, 2.2), frame_top(b, 7.4, 2.4))


# ---------------------------------------------------------------------------
# Outlet Centre · shared village architecture
# ---------------------------------------------------------------------------

def village_unit(s: Scene, x, y, w, d, h, ridge, door=True):
    """A pitched-roof outlet unit with an awning and a blank fascia."""
    s.box(x, y, 0, w, d, h, top=N800, left=N900, right=N800)
    s.poly([(x, y + d, h), (x + w, y + d, h), (x + w, y + d / 2, h + ridge), (x, y + d / 2, h + ridge)], fill=N800, stroke=N700)
    s.poly([(x + w, y, h), (x + w, y + d, h), (x + w, y + d / 2, h + ridge)], fill=N700, stroke=N600)
    openings = [(x + 0.6, x + w * 0.45, 0.6, h * 0.62, "url(#pane)")]
    if door:
        openings.append((x + w * 0.55, x + w * 0.85, 0, h * 0.6, N950))
    s.wall_y(x, x + w, y + d, h, fill=N900, openings=openings)
    s.poly([(x + 0.3, y + d, h * 0.7), (x + w - 0.3, y + d, h * 0.7), (x + w - 0.3, y + d + 1.0, h * 0.58), (x + 0.3, y + d + 1.0, h * 0.58)],
           fill=N700, stroke=N600, sw=1)


def outlet_entrance() -> str:
    s = Scene(scale=30)
    s.floor(0, 0, 25, 19, fill=N900)
    # The village behind the gateway.
    village_unit(s, 1, 1, 7, 5, 4.5, 2.2)
    village_unit(s, 9, 1, 6, 5, 5.0, 2.4)
    village_unit(s, 17, 1, 7, 5, 4.5, 2.2)
    # Paving of the main street leading through the gateway.
    s.floor(10, 6, 20, 19, fill=N800, stroke=N700)
    for yy in range(8, 19, 2):
        s.line((10, yy), (20, yy), stroke=N700, sw=1, opacity=0.6)
    # The gateway: two pillars and a beam, blank.
    s.box(10.2, 13, 0, 1.2, 1.2, 5.5, top=N700)
    s.box(18.6, 13, 0, 1.2, 1.2, 5.5, top=N700)
    s.box(10.2, 13, 5.5, 9.6, 1.2, 0.9, top=N700, left=N800, right=N700)
    s.sensor(15.0, 13.6, 5.45)
    s.cone((15.0, 13.6, 5.4), [(11.4, 12.8, 0), (18.6, 12.8, 0), (18.6, 15.8, 0), (11.4, 15.8, 0)])
    s.glow_line((11.4, 14.2, 0), (18.6, 14.2, 0), color=P400)
    for (x, y, d) in [(12.6, 13.6, +1), (14.2, 15.0, +1), (16.6, 13.2, -1), (17.6, 14.8, +1)]:
        s.person(x, y, tone=P300, bag=(d < 0))
        s.chevron(x, y + 1.3, d)
    s.person(13.5, 17.0)
    s.person(16.0, 18.0)
    s.person(12.0, 9.0)
    s.person(17.5, 8.5)
    s.focus((8, 4, 6.5), (22, 4, 6.5), (8, 18.5, 0), (22, 18.5, 0))
    return document(s.render(96, 64, W - 192, H - 128), "Counting at the gateway of an outlet village")


def outlet_zone_lines() -> str:
    s = Scene()
    s.floor(0, 0, 44, 19, fill=N900)
    # The street in front of a row of village units, paved.
    s.floor(0, 9, 44, 17, fill=N800, stroke=N700)
    for xx in range(2, 44, 3):
        s.line((xx, 9), (xx, 17), stroke=N700, sw=1, opacity=0.45)
    for i in range(5):
        village_unit(s, 1 + i * 8.5, 1, 7, 5, 4.2 + (i % 2) * 0.6, 2.1)
    # Planters along the far kerb, so the street reads as open-air.
    for xx in range(3, 44, 6):
        s.box(xx, 17.4, 0, 1.6, 1.0, 0.6, top=N700, left=N800, right=N700, sw=1)
    # Counting lines where one zone meets the next — each inside a covered
    # view, with uncovered street between them. No point clouds, no scanning.
    for (x, color, gid) in [(12.5, P400, "coneGrad"), (23.0, P400, "coneGrad"), (33.5, R400, "coneGradRed")]:
        s.sensor(x, 6.6, 4.0)
        s.cone((x, 6.6, 3.9), [(x - 2.8, 9.2, 0), (x + 2.8, 9.2, 0), (x + 2.8, 16.8, 0), (x - 2.8, 16.8, 0)], gid=gid)
        s.glow_line((x, 9.2, 0), (x, 16.8, 0), color=color)
    people = [(11.6, 11.0, True), (13.4, 14.0, True), (22.2, 12.2, True), (23.9, 15.0, True), (32.8, 13.6, True),
              (8.5, 12.5, False), (17.5, 11.0, False), (18.4, 14.6, False), (28.0, 10.8, False), (29.0, 15.2, False)]
    for (x, y, lit) in sorted(people, key=lambda q: q[0] + q[1]):
        s.person(x, y, tone=P300 if lit else N400, bag=lit)
    s.focus((8, 3, 7.0), (37, 3, 7.0), (8, 17.5, 0), (37, 17.5, 0))
    return document(s.render(96, 64, W - 192, H - 128), "Counting lines between the streets and zones of an outlet village")


def outlet_reid() -> str:
    a = Scene(scale=34)
    a.floor(0, 0, 14, 8, fill=N900)
    a.floor(0, 5.5, 14, 8, fill=N800, stroke=N700)
    village_unit(a, 0.5, -4, 6, 4, 4.5, 2.2)
    village_unit(a, 7, -4, 6.5, 4, 5.0, 2.4)
    a.person(3.0, 4.0)
    a.frame(a.bbox(9.3, 2.6), color=P400)
    a.person(9.3, 2.6, tone=P300, bag=True)
    a.person(5.0, 6.8)
    a.focus((4, -1, 7.2), (14, -1, 7.2), (4, 6, 0), (14, 6, 0))
    b = Scene(scale=34)
    b.floor(0, 0, 14, 8, fill=N900)
    b.floor(0, 5.5, 14, 8, fill=N800, stroke=N700)
    b.box(0.5, -4, 0, 13, 4, 5.5, top=N800)
    b.wall_y(0.5, 13.5, 0, 5.5, fill=N900, openings=[(1.2, 6.5, 0.5, 3.6, "url(#pane)"), (7.4, 10.0, 0, 3.4, N950), (10.8, 13.0, 0.5, 3.6, "url(#pane)")])
    b.poly([(0.8, 0, 4.1), (13.2, 0, 4.1), (13.2, 1.3, 3.5), (0.8, 1.3, 3.5)], fill=N700, stroke=N600, sw=1)
    b.frame(b.bbox(8.6, 2.2), color=P400)
    b.person(8.6, 2.2, tone=P300, bag=True)
    b.person(3.2, 5.0)
    b.person(11.6, 6.4)
    b.person(12.4, 6.8)
    b.focus((3, 0, 5.8), (13.5, 0, 5.8), (3, 6.5, 0), (13.5, 6.5, 0))
    return two_views(a, b, "The same figure in two views at different stores of an outlet village",
                     frame_top(a, 9.3, 2.6), frame_top(b, 8.6, 2.2))


FILES = {
    "retail-anonymous-classification-explainer.svg": retail_classification,
    "shopping-centre-threshold-counting-explainer.svg": shopping_centre_threshold,
    "retail-park-unit-entrance-counting-explainer.svg": retail_park_entrance,
    "retail-park-anonymous-re-id-explainer.svg": retail_park_reid,
    "outlet-centre-entrance-counting-explainer.svg": outlet_entrance,
    "outlet-centre-zone-counting-lines-explainer.svg": outlet_zone_lines,
    "outlet-centre-anonymous-re-id-explainer.svg": outlet_reid,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, draw in FILES.items():
        (OUT / name).write_text(draw(), encoding="utf-8")
        print(f"wrote {name}")
