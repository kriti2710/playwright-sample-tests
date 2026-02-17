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
      token: 'trx_development_50d877833cf3db2139533be785d194b58c443875239dfe5800bc9aa4077fc8bb',
      serverUrl: 'http://localhost:3001',
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