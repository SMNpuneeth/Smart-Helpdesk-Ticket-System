import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Standalone output keeps the runtime image small (only includes the files
  // needed to run `next start`, not the full node_modules).
  output: "standalone",

  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: `${BACKEND_URL}/api/:path*/`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
