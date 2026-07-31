import { withNextVideo } from "next-video/process";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

/* Run `ANALYZE=true npm run build` to inspect bundle cost. Off by default so
   normal builds are unaffected. */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

export default withBundleAnalyzer(withNextVideo(nextConfig, { folder: 'videos' }));
