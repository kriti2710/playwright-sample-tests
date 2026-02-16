// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

test.describe('Visual', () => {
  test.describe('Screenshot Tests', () => {
    test('test', {tag: '@chromium'}, async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://github.com/login');
      await expect(page).toHaveScreenshot('github-login-initial.png');
      
      const interactionStart = Date.now();
      await page.getByRole('textbox', { name: 'Username or email address' }).click();
      await page.getByRole('textbox', { name: 'Username or email address' }).fill('test');
      await expect(page).toHaveScreenshot('github-login-filled.png');
      const interactionTime = Date.now() - interactionStart;

      const totalVisualTestTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'page-load-time',
            value: totalVisualTestTime,
            threshold: 5000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'visual-regression-time',
            value: interactionTime,
            threshold: 3000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'screenshot-count',
            value: 2,
            threshold: 10,
            unit: 'count'
          })
        }
      );
    });
  });
});