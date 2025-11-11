import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all HTTPS image domains
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.fly.dev"],
    },
  },
};

export default nextConfig;
