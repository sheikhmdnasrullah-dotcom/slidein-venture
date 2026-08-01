import { execSync } from "node:child_process";
import { withNextVideo } from "next-video/process";
import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

/* Run `ANALYZE=true npm run build` to inspect bundle cost. Off by default so
   normal builds are unaffected. */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/* The build's real commit, stamped once at build time.
   The corner label that reads "SIV · <sha>" is the only piece of chrome on the
   page that claims to be system metadata, so it has to actually BE system
   metadata. A hardcoded fake version number is chrome that costs credibility
   instead of adding it — same failure mode as a grid label that lies about the
   grid. If git is unavailable (CI without history, tarball build), this stays
   empty and the label does not render at all. Never invent a fallback. */
const BUILD_SHA = (() => {
  if (process.env.NEXT_PUBLIC_BUILD_SHA) return process.env.NEXT_PUBLIC_BUILD_SHA;
  try {
    return execSync("git rev-parse --short=7 HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_BUILD_SHA: BUILD_SHA,
  },
};

export default withBundleAnalyzer(withNextVideo(nextConfig, { folder: 'videos' }));
