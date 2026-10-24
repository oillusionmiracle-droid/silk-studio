import type { Metadata, Viewport } from "next";
import { SITE_URL, SERVICE_DESCRIPTION, studioStructuredData } from "@/lib/siteMetadata";
import localFont from "next/font/local";

import "@/app/globals.css";
import "@/app/studio.css";
import StudioChrome, { StudioLoading } from "@/components/StudioChrome";
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import { WishlistProvider } from '@/lib/WishlistContext';
import { OrderThemeProvider } from '@/lib/OrderThemeContext';
import Navbar from "@/components/Navbar";





import AuthSheet from "@/components/auth/AuthSheet";
import CookieBanner from '@/components/CookieBanner';
import WebsiteOfferBanner from '@/components/WebsiteOfferBanner';
import '@/app/studio-updates.css';
import '@/app/studio-review.css';

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
  title: "Silk Studio — Design, Apps, Ads & Print",
  description:
    SERVICE_DESCRIPTION,
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
    "app development Nigeria",
    "custom software Nigeria",
    "business automation",
    "UGC ads Nigeria",
    "AI video advertising",
    "product video production",
    "packaging design Nigeria",
    "Silk Studio",
    "silk studios Lagos",
  ],
  authors: [{ name: "Silk Studio", url: "https://www.silkstudios.com.ng" }],
  creator: "Silk Studio",
  publisher: "Silk Studio",
  category: "Creative Services",
  manifest: "/manifest.json",
  metadataBase: new URL(SITE_URL),
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
    title: "Silk Studio — Design, Apps, Ads & Print",
    description:
      SERVICE_DESCRIPTION,
    url: "https://www.silkstudios.com.ng",
    siteName: "Silk Studio",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Silk Studio — Design, Apps, Ads & Print",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silk Studio — Design, Apps, Ads & Print",
    description:
      SERVICE_DESCRIPTION,
    images: ["/og-home.jpg"],
    creator: "@silkstudiong",
  },
};

export const viewport: Viewport = {
  themeColor: "#1D1D1F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, 
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(studioStructuredData).replace(/</g, "\\u003c") }} />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderThemeProvider>
                <StudioLoading />
                <Navbar />
                <WebsiteOfferBanner />
                {children}
                <AuthSheet />
                <StudioChrome />
                <CookieBanner />
              </OrderThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
