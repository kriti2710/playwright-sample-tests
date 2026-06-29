// @ts-check
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Use the GitHub Actions run identifier in CI so all shards share one run,
// and fall back to a date-based id for local runs.
const ciRunId = isCI
  ? `ci-run-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || 1}`
  : `local-run-${new Date().toISOString().split('T')[0]}`;

const serverUrl = isCI
  ? 'https://stg-analytics.testdino.com'
  : 'http://localhost:3005';

const artifacts = isCI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__',  // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 0 : 2, // Enable retries for flaky test behavior
  workers: isCI ? 5 : 5,

  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  reporter: [
    ['@testdino/playwright', {
      serverUrl,
      token: 'td_api_55863cafc784a92a8f2ae8a59be44c8970af9236978c9e484efc04fc2b27490b',
      ciRunId,
      debug: false,
      artifacts
    }]
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/products',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@chromium/, // only run tests tagged @chromium
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@firefox/, // only run tests tagged @firefox
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      grep: /@webkit/, // only run tests tagged @webkit
    },
    {
      name: 'android',
      use: { ...devices['Pixel 5'] },
      grep: /@android/, // only run tests tagged @android
    },
    {
      name: 'ios',
      use: { ...devices['iPhone 14'] },
      grep: /@ios/, // only run tests tagged @ios
    },
    {
      name: 'api',
      use: { ...devices['API'] },
      grep: /@api/, // only run tests tagged @api
    },
  ],
});
