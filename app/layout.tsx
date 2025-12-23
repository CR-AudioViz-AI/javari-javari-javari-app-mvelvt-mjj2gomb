import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "javari-javari-app-mvelvt",
  description: "Built by Javari AI - CR AudioViz AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
