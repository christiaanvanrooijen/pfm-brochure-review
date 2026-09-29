"use client";

import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { UnifiedIntro } from "../../components/UnifiedIntro/UnifiedIntro";
import { defaultLocale, type Locale } from "../../i18n/locales";

/** Isolated development preview. The production shell integration stays with its owner. */
export default function UnifiedIntroPreview() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <UnifiedIntro
      locale={locale}
      onLocaleChange={setLocale}
      onExplore={() => router.push(`/?locale=${locale}`)}
    />
  );
}
