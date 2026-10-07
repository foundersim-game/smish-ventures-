import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "CHAOS — Make a Decision, Deal with the CHAOS",
  description: "High-stakes party card game of bluffing, voting, and shifting loyalties.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0314",
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
