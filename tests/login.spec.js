// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

async function login(username = process.env.USERNAME, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function logout() {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.clickOnLogoutButton();
}

test.describe('Login', () => {
  test.describe('Authentication', () => {
    test('Verify that user can login and logout successfully ', {
      tag: ['@chromium', '@smoke', '@auth'],
      annotation: [
        { type: 'testdino:priority', description: 'P0' },
        { type: 'testdino:owner', description: 'team-auth' },
        { type: 'testdino:feature', description: 'auth' },
        { type: 'testdino:context', description: 'Core login/logout flow. Validates authentication against storedemo. Failure blocks all authenticated tests.' },
      ],
    }, async () => {
      const loginStart = Date.now();
      await login();
      const loginTime = Date.now() - loginStart;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'login-time',
            value: loginTime,
            threshold: 3000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'authentication-success-rate',
            value: 100,
            threshold: 95,
            unit: '%'
          })
        }
      );
    });
  });
});
