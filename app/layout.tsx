import type { Metadata, Viewport } from "next";
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
import Script from "next/script";
import { SpeedInsights } from '@vercel/speed-insights/next';

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
    "Silk Studio connects brands, websites, apps, AI ads, and print. An independent creative studio led by Miracle in Lagos, working worldwide.",
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
    title: "Silk Studio — Design, Apps, Ads & Print",
    description:
      "Brands, websites, apps, AI ads, and print. Designed and built in Lagos, working worldwide.",
    url: "https://silkstudios.com.ng",
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
      "Brands, websites, apps, AI ads, and print. Designed and built in Lagos, working worldwide.",
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
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5X732MF6');`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5X732MF6"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderThemeProvider>
                <StudioLoading />
                <Navbar />
                {children}
                <AuthSheet />
                <StudioChrome />
                <SpeedInsights />
              </OrderThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}