import { execSync } from "node:child_process";

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

/* Baseline response headers for every route. A strict Content-Security-Policy is deliberately
   not set: Next injects inline scripts, and a policy that breaks hydration is worse than none. */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  turbopack: {
    root: __dirname,
  },
  env: {
    NEXT_PUBLIC_BUILD_SHA: BUILD_SHA,
  },
  async redirects() {
    /* /process repeated the homepage workflow step for step, so it is retired. Temporary (307) so it can come back. */
    const retired = [{ source: "/process", destination: "/#workflow", permanent: false }];
    /* /insights/[slug] is the canonical article location. The old direct
       article route lives on as a permanent redirect so external links and
       the article's previously shared URL keep working. */
    return [
      ...retired,
      {
        source: "/ai-pipeline-emas",
        destination: "/insights/ai-pipeline-emas",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
