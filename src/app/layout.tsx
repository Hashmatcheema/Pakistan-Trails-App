//src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Lora, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Pakistan Trails - Your Travel & Hiking Companion for Pakistan",
    template: "%s | Pakistan Trails",
  },
  description: "Your travel & hiking companion for Pakistan — detailed guides, trail maps, itineraries & adventure stories. Explore Hunza, Skardu, Swat, and more.",
  keywords: [
    "Pakistan hiking",
    "Pakistan travel",
    "Hunza Valley",
    "Skardu",
    "Swat Valley",
    "trail maps",
    "hiking guides",
    "Pakistan tourism",
    "Northern Pakistan",
    "trekking Pakistan",
  ],
  authors: [{ name: "Pakistan Trails" }],
  creator: "Pakistan Trails",
  publisher: "Pakistan Trails",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pakistantrails.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pakistantrails.com",
    title: "Pakistan Trails - Your Travel & Hiking Companion for Pakistan",
    description: "Your travel & hiking companion for Pakistan — detailed guides, trail maps, itineraries & adventure stories.",
    siteName: "Pakistan Trails",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Trails - Your Travel & Hiking Companion for Pakistan",
    description: "Your travel & hiking companion for Pakistan — detailed guides, trail maps, itineraries & adventure stories.",
    creator: "@pakistantrails",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${poppins.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}