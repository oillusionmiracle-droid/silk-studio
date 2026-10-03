import type { Metadata } from "next";
import "./moremi.css";

export const metadata: Metadata = {
  title: "Moremi — Stop Scrolling. Start Building.",
  description:
    "Moremi is a Nigeria-first AI playground where kids aged 8–12 build real apps, games and stories with AI — no coding needed. Join the waitlist.",
  keywords: [
    "Moremi",
    "kids coding Nigeria",
    "AI for kids",
    "kids app builder",
    "STEM kids Nigeria",
    "Silk Studio",
  ],
  alternates: {
    canonical: "/moremi",
  },
  openGraph: {
    title: "Moremi — Stop Scrolling. Start Building.",
    description:
      "A Nigeria-first AI playground where kids aged 8–12 build real apps, games and stories with AI. Join the waitlist.",
    url: "https://silkstudios.com.ng/moremi",
    siteName: "Silk Studio",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/moremi/field.jpg",
        width: 1200,
        height: 630,
        alt: "Moremi — Stop Scrolling. Start Building.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moremi — Stop Scrolling. Start Building.",
    description:
      "A Nigeria-first AI playground where kids aged 8–12 build real apps, games and stories with AI. Join the waitlist.",
    images: ["/moremi/field.jpg"],
    creator: "@silkstudiong",
  },
};

export default function MoremiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
