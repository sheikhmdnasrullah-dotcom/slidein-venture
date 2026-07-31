import { defineConfig, devices } from '@playwright/test';

/**
 * Baseline visual + a11y harness (Stage 0).
 *
 * Screenshots are deterministic snapshots, not assertions — they are the
 * artefact we squint-test and diff between stages. Workers are pinned to 1 so
 * animation timing stays comparable run to run.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:3000',
  },
});
