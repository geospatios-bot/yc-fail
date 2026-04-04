import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "YC.FAIL — The Museum of Failure",
  description:
    "A curated exhibition of Y Combinator's most spectacular failures, frauds, and flameouts. $30B+ in capital. Gone.",
  openGraph: {
    title: "YC.FAIL — The Museum of Failure",
    description:
      "A curated exhibition of Y Combinator's most spectacular failures, frauds, and flameouts.",
    siteName: "YC.FAIL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YC.FAIL — The Museum of Failure",
    description:
      "A curated exhibition of Y Combinator's most spectacular failures, frauds, and flameouts.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-mono)]">
        {children}
      </body>
    </html>
  );
}
