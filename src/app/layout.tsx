import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "YCOMBINATOR.FYI — The Unofficial YC Record",
  description:
    "What Y Combinator doesn't put on Demo Day slides. Fraud, copycats, grifts, and failures — all sourced, all public record.",
  openGraph: {
    title: "YCOMBINATOR.FYI — The Unofficial YC Record",
    description:
      "What Y Combinator doesn't put on Demo Day slides. Fraud, copycats, grifts, and failures.",
    siteName: "YCOMBINATOR.FYI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YCOMBINATOR.FYI — The Unofficial YC Record",
    description:
      "What Y Combinator doesn't put on Demo Day slides. Fraud, copycats, grifts, and failures.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
