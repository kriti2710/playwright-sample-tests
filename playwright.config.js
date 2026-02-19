// @ts-check
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 0 : 2,
  workers: isCI ? 5 : 5,
  timeout: 60 * 1000,

  reporter: [
    ['html', {
      outputFolder: 'playwright-report',
      open: 'never'
    }],
    ['blob', { outputDir: 'blob-report' }], 
    ['json', { outputFile: './playwright-report/report.json' }],
    ['@testdino/playwright', {
      token: 'trx_staging_aa1799fcea170c56bc3ff82c53941c11939edb91cbab4493ea060e36424efd7f',
      serverUrl: 'https://staging-api.testdino.com',
      debug: false,
      artifacts: false
    }],
  ],

  use: {
    baseURL: 'https://storedemo.testdino.com/',
    headless: true,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      use: { ...devices['API'] },
      grep: /@api/, // only run tests tagged @api
    },
  ],
});