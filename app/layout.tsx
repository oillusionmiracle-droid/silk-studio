import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "@/app/globals.css";
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import MobileBottomNav from "@/components/MobileBottomNav";
import GeminiAssistant from "@/components/GeminiAssistant";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Silk Studio — Design, Print & Digital | Lagos",
  description:
    "One Brief. Fast & Smooth Delivery. Lagos-based design, print, and digital brand. Flyers, banners, logos, websites, event packages — fast turnaround.",
  keywords: "design studio Lagos, print Lagos, branding Nigeria, event package, web design Lagos",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Silk Studio",
  },
  openGraph: {
    title: "Silk Studio — Design, Print & Digital",
    description: "One Brief. Fast & Smooth Delivery.",
    url: "https://silkstudio.ng",
    siteName: "Silk Studio",
    locale: "en_NG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1D1D1F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap"
        />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
      </head>
      <body>
        <LoadingScreen />
        <Navbar />
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
        <Footer />
        <WhatsAppButton />
        <CustomCursor />
        <MobileBottomNav />
        <GeminiAssistant />

      </body>
    </html>
  );
}