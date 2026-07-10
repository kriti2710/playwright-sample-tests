// @ts-check

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__',  // :white_check_mark: Baseline image storage
  fullyParallel: true,
  // forbidOnly: isCI,
  retries: isCI ? 1 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 3 : 3,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  
  reporter: [
  [
    '@testdino/playwright',
    {
      serverUrl: 'https://stg-analytics.testdino.com',
      token: 'td_api_8bc45cf4a5982e20a592a028fa08f538bc21d48020858f9157b14e4fe8104282',
      debug: true,
      artifacts: true,
    },
  ],
  ['html', { outputFolder: './playwright-report', open: 'never' }],
  ['json', { outputFile: 'report.json' }],
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
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   grep: /@webkit/, // only run tests tagged @webkit
    // },
    {
      name: 'android',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'ios',
      use: { ...devices['iPhone 12'] },
    },

    {
      name: 'api',
      use: { ...devices['API'] },
    },
  ],
});