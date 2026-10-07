import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHAOS — Make a Decision, Deal with the CHAOS",
  description: "High-stakes party card game of bluffing, voting, and shifting loyalties by SMISH Ventures.",
  icons: {
    icon: "/assets/founder-sim-icon.png",
    shortcut: "/assets/founder-sim-icon.png",
    apple: "/assets/founder-sim-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CHAOS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0314",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className="antialiased bg-[#06010D] text-white h-[100dvh] max-h-[100dvh] overflow-hidden select-none overscroll-none">
        {children}
      </body>
    </html>
  );
}
