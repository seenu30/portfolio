import type { Metadata, Viewport } from "next";
import { Geist, Lora } from "next/font/google";
import { content } from "@/lib/content";
import Preloader from "@/components/Preloader";
import CustomCursor from "@/components/CustomCursor";
import SiteCorners from "@/components/SiteCorners";
import "./globals.css";

// Base UI/body face.
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

// Serif display face — used for the mobile-menu links.
const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const base = content;

export const metadata: Metadata = {
  title: `${base.brand} — Product Designer`,
  description: base.hero.intro,
  openGraph: {
    title: `${base.brand} — Product Designer`,
    description: base.hero.intro,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7eae0",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${lora.variable}`}>
      <body>
        <Preloader />
        <CustomCursor />
        {children}
        <SiteCorners />
      </body>
    </html>
  );
}
