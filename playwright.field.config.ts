import { defineConfig, devices } from '@playwright/test';

/**
 * HERO FIELD — geometry harness.
 *
 * Separate from the baseline config because this suite asserts LAYOUT at
 * seven widths in two engines, and it needs its own project matrix. Chromium
 * and WebKit both run: the field is pure CSS transforms and SVG geometry, so
 * any divergence between engines is a real rounding/measurement bug.
 *
 * Workers pinned to 1: several assertions sample the animation clock, and
 * parallel workers would interleave them.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: 'hero-field.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: process.env.HERO_BASE_URL || 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});