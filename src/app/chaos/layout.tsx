import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "CHAOS — Make a Decision, Deal with the CHAOS",
  description: "A high-energy multiplayer party game for phones. Vote secretly, argue passionately, and face unexpected group consequences.",
  openGraph: {
    title: "CHAOS — Make a Decision, Deal with the CHAOS",
    description: "The viral party game that tests friendships. Tap to join a room instantly!",
    url: "https://www.smishventures.com/chaos",
    siteName: "CHAOS Party Game",
    images: [
      {
        url: "https://www.smishventures.com/chaos/og-chaos.png",
        width: 1200,
        height: 630,
        alt: "CHAOS Party Game Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHAOS — Make a Decision, Deal with the CHAOS",
    description: "A high-energy multiplayer party game for phones. Vote secretly, argue passionately, face the chaos.",
    images: ["https://www.smishventures.com/chaos/og-chaos.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#090310",
};

export default function ChaosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-screen overflow-hidden select-none bg-[#090310] overscroll-none">
      {children}
    </div>
  );
}
