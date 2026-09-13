import type { NextConfig } from "next";

const GOOGLE_VERIFY = "googleafa510eae3a8a436.html";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `/ja/${GOOGLE_VERIFY}`,
        destination: `/${GOOGLE_VERIFY}`,
      },
    ];
  },
};

export default nextConfig;
