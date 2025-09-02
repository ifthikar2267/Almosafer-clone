import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {DestinationProvider} from "../context/DestinationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700","800"], // pick the weights you need
  display: "swap",
});

export const metadata: Metadata = {
  title: "Almosafer",
  description: "Middle East's leading travel brand",
  icons: {
    icon: "/almoLogo.jpeg",      // path to your logo/favicon
    apple: "/almoLogo.jpeg",     // optional for Apple devices
    shortcut: "/almoLogo.jpeg",  // optional shortcut icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <DestinationProvider>
          {children}
        </DestinationProvider>
      </body>
    </html>
  );
}

