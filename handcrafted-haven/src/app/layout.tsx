import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from '@/components/ThemeRegistry';
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
      <body
        className={`${inter.className}`}
      >
        <ThemeRegistry>
          <Header />
          {children}
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}
