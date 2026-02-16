// @ts-check
import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 0 : 0,
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
      // token: "trx_staging_11de4fe3ed0f6e3b6486b861c7acbc08d501620b0bcfae856add6aa1df9f3983",
      // serverUrl: "https://staging-api.testdino.com",
      token: "trx_development_0d4ec381bc99e452d093409a1e523868f7878fc9b3b7f836b59b48a7c659faa4",
      serverUrl: "http://localhost:3001",
      debug: false,
      artifacts: false
    }]
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