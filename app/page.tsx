/**
 * The front door.
 *
 * This used to render the account-led sales shell directly, which made the
 * shell the only thing the product had — the five segment starts existed but
 * were reachable only by typing a query string. The choice between segments now
 * comes first, and the shell keeps its own address at `/shell`.
 *
 * `?locale=` opens the page in a language, so a capture can be reproduced.
 *
 * Since 2026-09-28 the overview sits behind the Unified PFM Intro, the
 * brochure's shared cover. The gateway is root-only: `/preview/demo` and every
 * other route still render what they rendered. See `RootGateway`.
 */

import { RootGateway } from "./components/RootGateway";
import { defaultLocale, isLocale } from "./i18n/locales";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawLocale = first(params.locale);

  return <RootGateway initialLocale={isLocale(rawLocale) ? rawLocale : defaultLocale} />;
}
