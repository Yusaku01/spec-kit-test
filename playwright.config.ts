import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Tauri E2E testing
 * @see https://playwright.dev/docs/test-configuration
 * @see https://tauri.app/v2/guides/testing/
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshot only when test fails */
    screenshot: 'only-on-failure',
    /* Record video only when test fails */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'tauri-app',
      use: {
        /* Base URL for Tauri application */
        baseURL: 'tauri://localhost',
        /* Use webkit engine for better Tauri compatibility */
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run tauri dev',
    url: 'http://localhost:1420',
    reuseExistingServer: !process.env.CI,
    /* Give Tauri more time to start up */
    timeout: 30000,
  },
});