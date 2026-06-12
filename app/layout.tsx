import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "./components/AuthGate";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { PosthogProvider } from "./components/PosthogProvider";
import { GeolocationProvider } from "./components/GeolocationProvider";
import { LayoutFooter } from "./components/LayoutFooter";
import { LanguageProvider } from "./context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "10minCUET — CUET Prep in 10 Minutes a Day",
    template: "%s | 10minCUET",
  },
  description:
    "Crack CUET UG in 10 minutes a day — starting from Class 6 with the free Foundation track. Languages, Domain subjects, General Test. Pick your 5 subjects, track Bloom level per subconcept. One exam, 280+ central universities.",
  keywords: [
    "CUET UG preparation", "CUET 2025", "CUET 2026",
    "CUET English", "CUET General Test", "CUET Mathematics",
    "DU admission", "JNU admission", "BHU admission", "Jamia admission",
    "central university entrance", "Bloom taxonomy CUET", "10 minute study",
    "free CUET practice questions", "CUET mock test", "CUET previous year papers",
    "CUET rank predictor", "central university college predictor",
    "Class 12 arts CUET", "Class 12 commerce CUET", "Class 12 science CUET",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "10minCUET",
    title: "10minCUET — CUET Prep in 10 Minutes a Day",
    description:
      "In India you get food, cabs, groceries in 10 minutes. Now CUET prep too. Pick your 5 subjects, Bloom-level tracking, central university predictor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "10minCUET — CUET Prep in 10 Minutes a Day",
    description:
      "Master CUET UG in 10 minutes a day. Pick your 5 of 27 domain subjects. Bloom-level tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": `${BASE_URL}/#founder`,
              "name": "Amit Tyagi",
              "jobTitle": "Founder",
              "worksFor": {
                "@type": "Organization",
                "name": "EAZEALLIANCE SERVICES PRIVATE LIMITED",
              },
              "url": BASE_URL,
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Indian School of Business",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <PosthogProvider>
          <LanguageProvider>
            <GeolocationProvider>
              <AuthGate>{children}</AuthGate>
            </GeolocationProvider>
          </LanguageProvider>
        </PosthogProvider>
        <LayoutFooter />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
