import { defineConfig, devices } from '@playwright/test';

/**
 * Geometry suite: the workflow rail/panel layout in Chromium and WebKit.
 *   npx playwright test -c playwright.geometry.config.ts
 * Point GEO_BASE_URL at a running dev or production server (default :3000).
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /workflow-geometry\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: process.env.GEO_BASE_URL || 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
