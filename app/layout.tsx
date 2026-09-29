import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "PFM Commercial Experience",
    description:
      "A guided Retail location-intelligence experience from context to action.",
    openGraph: {
      title: "See the whole location.",
      description: "PFM Commercial Experience · Retail go-demo",
      type: "website",
      images: [{ url: imageUrl, width: 1734, height: 907, alt: "PFM Commercial Experience layered retail location visual" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "See the whole location.",
      description: "PFM Commercial Experience · Retail go-demo",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
