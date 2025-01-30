import { Inter } from "next/font/google";
import "./globals.css";

import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import EgoisticNavbar from "@/components/utils/EgosticNavbar";
import EgoisticFooter from "@/components/utils/EgosticFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CleanVeda | Natural Health & Beauty Solutions",
  description: "Unlock optimal wellness at CleanVeda.com with premium natural health supplements, herbal personal care products, and rejuvenating skin and hair care solutions. Discover plant-based formulations crafted for holistic health and beauty.",
  keywords: "CleanVeda, natural supplements, herbal products, skin care, hair care, organic beauty, wellness products, holistic health, cruelty-free",
  author: "CleanVeda Team",
  robots: "index, follow",
  openGraph: {
    title: "CleanVeda - Natural Health & Herbal Solutions",
    type: "website",
    url: "https://www.cleanveda.com",
    description: "Discover effective, plant-based formulations crafted for holistic health and beauty at CleanVeda. Elevate your wellness with our natural supplements and personal care products.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content={metadata.robots} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:description" content={metadata.openGraph.description} />
      </head>
      <body className={inter.className}>
        <EgoisticNavbar />
        {children}
        <EgoisticFooter />
        <Toaster />
      </body>
    </html>
  );
}
