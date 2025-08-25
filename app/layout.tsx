import type { Metadata } from "next";
import { Cairo } from "next/font/google";  // 👈 import Cairo
import "./globals.css";

// ✅ Load Cairo font
const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700", "800", "900"], // choose weights you need
});

export const metadata: Metadata = {
  title: "Almosafer",
  description: "Middle East's leading travel brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
