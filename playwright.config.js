// // // @ts-check
// // import { defineConfig, devices } from '@playwright/test';
// // import * as dotenv from 'dotenv';

// // dotenv.config({ quiet: true });
// // const isCI = !!process.env.CI;

// // export default defineConfig({
// //   testDir: './tests',
// //   fullyParallel: true,
// //   forbidOnly: isCI,
// //   retries: isCI ? 1 : 0,
// //   workers: isCI ? 1 : 1,
  

// //   timeout: 30 * 1000,
// //   reporter: [
// //     ['html', {
// //       outputFolder: 'playwright-report',
// //       open: 'never'
// //     }],
// //     ['blob', { outputDir: 'blob-report' }], // Blob reporter for merging
// //     ['json', { outputFile: './playwright-report/report.json' }],
// //   ],

// //   use: {
// //     baseURL: 'storedemo.testdino.com',
// //     headless: true,
// //     trace: 'on-first-retry',
// //     screenshot: 'only-on-failure',
// //     video: 'retain-on-failure',
// //   },

// //   projects: [
// //     {
// //       name: 'chromium',
// //       use: { ...devices['Desktop Chrome'] },
// //       grep: /@chromium/, // only run tests tagged @chromium
// //     },
// //     {
// //       name: 'firefox',
// //       use: { ...devices['Desktop Firefox'] },
// //       grep: /@firefox/, // only run tests tagged @firefox
// //     },
// //     {
// //       name: 'webkit',
// //       use: { ...devices['Desktop Safari'] },
// //       grep: /@webkit/, // only run tests tagged @webkit
// //     },
// //     {
// //       name: 'android',
// //       use: { ...devices['Pixel 5'] },
// //       grep: /@android/, // only run tests tagged @android
// //     },
// //     {
// //       name: 'ios',
// //       use: { ...devices['iPhone 12'] },
// //       grep: /@ios/, // only run tests tagged @ios
// //     },
// //   ],
// // });


// // @ts-check
// import { defineConfig, devices } from '@playwright/test';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const isCI = !!process.env.CI;

// // Use the GitHub Actions run identifier in CI so all shards share one run,
// // and fall back to a date-based id for local runs.
// const ciRunId = isCI
//   ? `ci-run-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || 1}`
//   : `local-run-${new Date().toISOString().split('T')[0]}`;

// export default defineConfig({
//   testDir: './tests',
//   snapshotDir: './__screenshots__',  // ✅ Baseline image storage
//   fullyParallel: true,
//   forbidOnly: isCI,
//   retries: isCI ? 0 : 2, // Enable retries for flaky test behavior
//   workers: isCI ? 5 : 5,

//   timeout: 30 * 1000,
//   expect: {
//     timeout: 10 * 1000,
//   },
  
//   reporter: [
//     ['@testdino/playwright', {
//       serverUrl: 'https://stg-analytics.testdino.com',
//       token: 'td_api_57b9a51546f5b6207b47a469716d5bec8910c0830e3649cdb120887fb415baf7',
//       // ciRunId,
//       debug: false,
//       artifacts: false
//     }]
//   ],

//   use: {
//     baseURL: 'https://storedemo.testdino.com/products',
//     headless: true,
//     trace: 'retain-on-failure',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     actionTimeout: 15 * 1000,
//     navigationTimeout: 30 * 1000,
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },
//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },
//     {
//       name: 'android',
//       use: { ...devices['Pixel 5'] },
//     },
//     {
//       name: 'ios',
//       use: { ...devices['iPhone 14'] },
//     },
//     {
//       name: 'api',
//       use: { ...devices['API'] },
//     },
//   ],
// });

// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  snapshotDir: './__screenshots__',  // ✅ Baseline image storage
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 1, // Enable retries for flaky test behavior
  workers: isCI ? 5 : 5,

  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },

  // reporter: [
  //   ['html', {
  //     outputFolder: 'playwright-report',
  //     open: 'never'
  //   }],
  //   ['blob', { outputDir: 'blob-report' }], // Blob reporter for merging
  //   ['json', { outputFile: './playwright-report/report.json' }],
  //   // ['@testdino/playwright', { token: process.env.TESTDINO_TOKEN }],
  // ],

    // Add this in playwright.config.js|ts|mjs
  // reporter: [
  //   ['html', { outputDir: './playwright-report' }],
  //   ['json', { outputFile: './playwright-report/report.json' }],
  // ],

  reporter: [
    ['@testdino/playwright', {
      serverUrl: 'https://stg-analytics.testdino.com',
      // ciRunId,
      debug: false,
      artifacts: true
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
    },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },
//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     //   grep: /@webkit/, // only run tests tagged @webkit
//     // },
//     {
//       name: 'android',
//       use: { ...devices['Pixel 5'] },
//     },
//     {
//       name: 'ios',
//       use: { ...devices['iPhone 12'] },
//     },

//     {
//       name: 'api',
//       use: { ...devices['API'] },
//     },
  ],
});
