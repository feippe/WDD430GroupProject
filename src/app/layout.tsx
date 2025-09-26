import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Handcrafted Haven",
  description: "Marketplace for artisans",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
          {/* Header aquí */}
          <main id="main" className="min-h-screen">{children}</main>
          {/* Footer aquí */}
        </ThemeProvider>
      </body>
    </html>
  );
}
