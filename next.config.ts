import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize package imports for faster compilation
  // This reduces bundle size and compilation time by tree-shaking unused exports
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-avatar",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip",
      "recharts",
      "date-fns",
    ],
  },

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
};

export default nextConfig;
