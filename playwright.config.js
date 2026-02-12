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
    ['list'],  // Keep default reporter for console output
    ['@testdino/playwright', {
      token: process.env.TESTDINO_TOKEN,
      serverUrl: 'https://staging-api.testdino.com',  // Staging server
      // Coverage configuration
      coverage: {
        enabled: true,                    // Enable coverage collection
        // Optional: Only collect from specific browser project
        // Use this when running tests across multiple browsers (chromium, firefox, webkit)
        // Since all browsers test the same code, you only need coverage from one
        // This prevents inflated/duplicate coverage numbers
        projects: ['chromium'],
        // Optional: Generate local HTML report
        localReport: true,
        localReportDir: './coverage-report',
      },
      // Optional: Enable debug logging
      debug: true,
    }],
  ],
  // Define browser projects
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
      use: { ...devices['iPhone 12'] },
      grep: /@ios/, // only run tests tagged @ios
    },
    {
      name: 'api',
      use: { ...devices['API'] },
      grep: /@api/, // only run tests tagged @api
    },
  ],
  // Your other config...
  use: {
    baseURL: 'http://localhost:5173/',  // Your instrumented app
  },
});

  // reporter: [
  //   ['html', {
  //     outputFolder: 'playwright-report',
  //     open: 'never'
  //   }],
  //   ['blob', { outputDir: 'blob-report' }], 
  //   ['json', { outputFile: './playwright-report/report.json' }],
  //   ['@testdino/playwright', {
  //     token: process.env.TESTDINO_TOKEN,
  //     debug: true,
  //     serverUrl: 'https://staging-api.testdino.com',
  //     coverage: {
  //       enabled: true,
  //       projects: ['chromium'],
  //       localReport: true,
  //       localReportDir: './coverage-report',
  //     },
  //   }],
  // ],

  // use: {
  //   baseURL: 'https://storedemo.testdino.com/',
  //   headless: true,
  //   trace: 'on',
  //   screenshot: 'only-on-failure',
  //   video: 'retain-on-failure',
  // },

  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //     grep: /@chromium/, // only run tests tagged @chromium
  //   },
  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //     grep: /@firefox/, // only run tests tagged @firefox
  //   },
  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //     grep: /@webkit/, // only run tests tagged @webkit
  //   },
  //   {
  //     name: 'android',
  //     use: { ...devices['Pixel 5'] },
  //     grep: /@android/, // only run tests tagged @android
  //   },
  //   {
  //     name: 'ios',
  //     use: { ...devices['iPhone 12'] },
  //     grep: /@ios/, // only run tests tagged @ios
  //   },
  //   {
  //     name: 'api',
  //     use: { ...devices['API'] },
  //     grep: /@api/, // only run tests tagged @api
  //   },
  // ],
