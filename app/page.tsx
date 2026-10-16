import Hero from '@/components/Hero/Hero';

/**
 * HOME — a blank canvas
 * ---------------------------------------------------------------------------
 * The homepage currently renders only the hero: the founder's tagline with
 * the rotating second line. Everything that was here — the problem, the
 * workflow, the platform, the capabilities, the two ways to work with it,
 * the honest-limits list, the use cases, and the closing band — is
 * UNMOUNTED, not deleted. The section components in components/Product/
 * and their copy in content/product.ts stay in the codebase untouched so
 * any of them can be brought back by restoring one line here, but the
 * page itself is fresh ground to design forward from.
 */
export default function Home() {
  return <Hero />;
}
