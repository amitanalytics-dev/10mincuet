import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '10minCUET – CUET Prep in 10-Minute Sessions',
  description:
    'Master CUET with daily 10-minute sessions. Covers Languages, Domain Subjects, and General Test. Get into DU, JNU, BHU, and top Central Universities.',
  keywords: 'CUET, CUET preparation, DU, JNU, BHU, Central University, CUET mock test, General Test, Domain Subject',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
