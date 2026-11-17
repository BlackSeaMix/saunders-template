import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { SHOP_NAME, TAGLINE } from "./content";
import ScrollProgress from "../components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: SHOP_NAME,
  description: TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} antialiased`}
      >
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
