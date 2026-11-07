import type { Metadata, Viewport } from "next";
import { Noto_Sans_Malayalam, Poppins } from "next/font/google";
import { env } from "@/shared/config/env";
import { SITE_CONFIG } from "@/shared/config/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  subsets: ["malayalam", "latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  alternates: { canonical: "/" },
  icons: { icon: "/images/landing/flarize-logo.png" },
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: "/",
    images: [{ url: "/images/landing/hero-rooftop.jpg", width: 1024, height: 1024, alt: "Rooftop solar installation in Kerala" }],
  },
  twitter: { card: "summary_large_image", title: SITE_CONFIG.title, description: SITE_CONFIG.description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${notoSansMalayalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
