/**
 * The QSR Core journey, isolated under /preview/redesign/qsr-journey.
 *
 * `?scene=<id>` opens a Core scene, `?locale=`, `?focus=`, `?point=open` and
 * `?depth=<section>` address a state so a capture can be reproduced exactly.
 *
 * Nothing here is reachable from the approved shell, and nothing here renders
 * an approved component.
 */

import type { Metadata } from "next";
import { QsrJourney } from "./journey";
import { defaultLocale, isLocale } from "../../../i18n/locales";
import { qsrCoreRoute } from "../../../i18n/qsr-journey";

export const metadata: Metadata = {
  title: "QSR Core journey — redesign preview",
  robots: { index: false, follow: false },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const rawScene = first(params.scene);
  const scene = rawScene && qsrCoreRoute.includes(rawScene) ? rawScene : qsrCoreRoute[0];

  const rawLocale = first(params.locale);
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <QsrJourney
      key={`${scene}-${locale}`}
      initialLocale={locale}
      initialSceneId={scene}
      initialFocusId={first(params.focus) ?? null}
      initialPointOpen={first(params.point) === "open"}
      initialDepthSection={first(params.depth) ?? null}
    />
  );
}
