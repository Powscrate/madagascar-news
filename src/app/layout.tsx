import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Madagascar News – L'info en continu",
  description: "Toute l'actualité de Madagascar en continu. Politique, économie, culture, sport et technologie.",
  keywords: "Madagascar, actualité, news, information, politique, économie, culture",
  openGraph: {
    title: "Madagascar News",
    description: "Toute l'actualité malgache en continu",
    type: "website",
    locale: "fr_FR",
    siteName: "Madagascar News",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 font-sans">
        {children}
      </body>
    </html>
  );
}
