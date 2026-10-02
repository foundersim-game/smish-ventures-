import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMISH Ventures — Deep Simulation & Social Party Games",
  description: "SMISH Ventures creates deep simulations and high-energy multiplayer experiences. Creators of CHAOS: The Party Game, Founder Sim, and Movie Mogul.",
  icons: {
    icon: "/assets/founder-sim-icon.png",
    shortcut: "/assets/founder-sim-icon.png",
    apple: "/assets/founder-sim-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SMISH Ventures",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04060A",
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
      <body className="antialiased bg-[#04060A] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
