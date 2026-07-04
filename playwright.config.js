// @ts-check
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Use the GitHub Actions run identifier in CI so all shards share one run,
// and fall back to a date-based id for local runs.
const ciRunId = isCI
  ? `ci-run-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || 1}`
  : `local-run-${new Date().toISOString().split('T')[0]}`;

const serverUrl = isCI ? 'https://stg-analytics.testdino.com' : 'http://localhost:3005';

const artifacts = isCI;

const token = isCI
  ? // Microservices - staging - ayush user
    'td_api_3df9699a53690a05241359b97bf982af90b71e05365bcf56d36ff053ee99a34b'
  : // Local  - Sample Project - savan user
    'td_api_f4c6888e4b937229ca7bedf71d28689c622d06bd03229d348e956da32172f358';

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__', // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 5 : 5,

  timeout: 10 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    [
      '@testdino/playwright',
      {
        serverUrl,
        token,
        ciRunId: 'sample-run-1',
        debug: false,
        artifacts,
      },
    ],
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
