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
import { BottomNav } from "./components/BottomNav";
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
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "hi-IN": `${BASE_URL}/hi`,
      "x-default": BASE_URL,
    },
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
              "worksFor": { "@type": "Organization", "name": "EAZEALLIANCE SERVICES PRIVATE LIMITED" },
              "url": BASE_URL,
              "alumniOf": { "@type": "CollegeOrUniversity", "name": "Indian School of Business" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "10minCUET",
              "description": "CUET UG preparation in 10 minutes a day — 500+ original questions across Languages, 27 Domain subjects, and General Test. Pick your 5 subjects for 280+ central universities.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "url": BASE_URL,
              "inLanguage": ["en-IN", "hi-IN"],
              "audience": { "@type": "EducationalAudience", "educationalRole": "student" },
              "offers": [
                { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Free tier — diagnostic test, topic practice" },
                { "@type": "Offer", "price": "199", "priceCurrency": "INR", "description": "Premium — unlimited mocks, Bloom tracking, all subjects" },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Which universities accept CUET UG scores?",
                  "acceptedAnswer": { "@type": "Answer", "text": "280+ central universities accept CUET UG scores, including Delhi University (DU), Jawaharlal Nehru University (JNU), Banaras Hindu University (BHU), Jamia Millia Islamia, Aligarh Muslim University (AMU), and many more." },
                },
                {
                  "@type": "Question",
                  "name": "How many CUET subjects can I choose?",
                  "acceptedAnswer": { "@type": "Answer", "text": "CUET UG allows you to appear for up to 6 subjects: 2 Languages + up to 4 Domain subjects + General Test. 10minCUET covers all 27 domain subjects across Science, Commerce, and Humanities streams." },
                },
                {
                  "@type": "Question",
                  "name": "Is 10minCUET free?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes. 10minCUET has a free tier with the diagnostic test and topic practice. Premium plans start at ₹199/month for unlimited mock tests, Bloom-level tracking, and spaced-repetition revision across your chosen subjects." },
                },
                {
                  "@type": "Question",
                  "name": "How is 10minCUET different from CUET coaching?",
                  "acceptedAnswer": { "@type": "Answer", "text": "10minCUET uses Bloom's Taxonomy to track which sub-concepts you've mastered vs. not, so each 10-minute session targets your weakest gaps per subject. Practice only your chosen 5–6 CUET subjects — not 30 others." },
                },
                {
                  "@type": "Question",
                  "name": "Does 10minCUET cover General Test for CUET UG?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes. 10minCUET covers the CUET General Test with questions on General Knowledge, Current Affairs, Logical Reasoning, Quantitative Aptitude, and English Language — all mapped to the NTA syllabus." },
                },
              ],
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
        <BottomNav />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
