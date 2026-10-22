import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";
import { QuickView } from "@/components/QuickView";
import { SearchOverlay } from "@/components/SearchOverlay";
import { SmoothScroll } from "@/components/SmoothScroll";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blkanvl.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "BLK ANVL — Performance Essentials", template: "%s — BLK ANVL" },
  description: "Premium training apparel and lifestyle essentials. Tonal, considered, and built to be worn on repeat.",
  openGraph: { type: "website", siteName: "BLK ANVL", images: ["/og.jpg"] },
  twitter: { card: "summary_large_image" },
  
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] bg-bone px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <BagDrawer />
        <QuickView />
        <SearchOverlay />
      </body>
    </html>
  );
}
