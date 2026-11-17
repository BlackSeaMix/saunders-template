import type { NextConfig } from "next";

// Not output: "export" — the "/" → "/nl" redirect needs a server, even
// though every page still prerenders as static content.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/nl",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
