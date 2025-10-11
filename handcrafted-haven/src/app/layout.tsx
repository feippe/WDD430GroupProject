// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const inter = Inter({ 
  subsets: ['latin'] 
});

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description: "A curated collection of handmade treasures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800 antialiased font-sans">
        <div id="app-wrapper" className="flex flex-col min-h-screen relative z-0">
            <Header /> 
            <main className="flex-grow relative z-10">
              {children}
            </main>
            <Footer />
        </div>
      </body>
    </html>
  );
}