/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  async rewrites() {
    return [
      { source: "/privacy", destination: "/privacy.html" },
      { source: "/terms", destination: "/terms.html" },
      { source: "/support", destination: "/support.html" },
      { source: "/eula", destination: "/terms.html" },
    ];
  },
};

export default nextConfig;
