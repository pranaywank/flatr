import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Using Inter for the clean, Notion-like aesthetic
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const GA_MEASUREMENT_ID = "G-XKRYDQY2K6";

export const metadata: Metadata = {
  title: "Flatr | Your next home, found by people like you",
  description: "Flatr connects working professionals across India looking for a place to stay or a flatmate to share with. No brokers. No spam. Just real people.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-white text-black selection:bg-black selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
