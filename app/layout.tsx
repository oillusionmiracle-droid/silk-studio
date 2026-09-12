import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import "@/app/globals.css";
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import MobileBottomNav from "@/components/MobileBottomNav";
import AuthSheet from "@/components/auth/AuthSheet";
import { SpeedInsights } from '@vercel/speed-insights/next';

const GeminiAssistant = dynamic(() => import('@/components/GeminiAssistant'), {
  ssr: false,
  loading: () => null,
});

const jakarta = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-jakarta",
  display: "swap",
});

const dmMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Silk Studio — Lagos Design, Print & Digital Studio",
  description:
    "Silk Studio is Lagos' go-to creative studio for fast, premium design, printing, and digital services. Flyers, banners, logos, custom apparel, websites, and event packages — delivered in 24–48 hrs.",
  keywords: [
    "design studio Lagos",
    "print shop Lagos",
    "branding agency Nigeria",
    "graphic design Lagos",
    "flyer printing Lagos",
    "banner printing Nigeria",
    "custom t-shirt printing Lagos",
    "logo design Nigeria",
    "web design Lagos",
    "event packages Lagos",
    "Silk Studio",
    "silk studios Lagos",
  ],
  authors: [{ name: "Silk Studio", url: "https://silkstudios.com.ng" }],
  creator: "Silk Studio",
  publisher: "Silk Studio",
  category: "Creative Services",
  manifest: "/manifest.json",
  metadataBase: new URL("https://silkstudios.com.ng"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Silk Studio",
  },
  openGraph: {
    title: "Silk Studio — Lagos Design, Print & Digital Studio",
    description:
      "Fast, premium creative services from Lagos. One brief. Flyers, banners, logos, custom apparel, websites — delivered in 24–48 hrs.",
    url: "https://silkstudios.com.ng",
    siteName: "Silk Studio",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Silk Studio — Lagos Design, Print & Digital Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silk Studio — Lagos Design, Print & Digital Studio",
    description:
      "Fast, premium creative services from Lagos. Flyers, banners, logos, custom apparel, websites — delivered in 24–48 hrs.",
    images: ["/og-home.jpg"],
    creator: "@silkstudiong",
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
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <LoadingScreen />
              <Navbar />
              {children}
              <AuthSheet />
              <Footer />
              <WhatsAppButton />
              <CustomCursor />
              <MobileBottomNav />
              <GeminiAssistant />
              <SpeedInsights />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}