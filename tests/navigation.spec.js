// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

let allPages;

/* -------------------- Hooks -------------------- */
test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

/* -------------------- Helpers -------------------- */
async function login(
  username = process.env.USERNAME,
  password = process.env.PASSWORD
) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function logout() {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.clickOnLogoutButton();
}

/* =================================================
   LEVEL 1 — ROOT SUITE
================================================= */
test.describe('Navigation', () => {

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Navbar Navigation', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Verify Navbar Links', () => {

      test('Verify that all the navbar links work correctly', {tag: '@firefox'}, async () => {
        const startTime = Date.now();
        let navigationCount = 0;

        await test.step('Login as existing user', async () => {
          await login();
        });

        await test.step('Verify navigation links', async () => {
          await allPages.homePage.clickBackToHomeButton();
          navigationCount++;

          await allPages.homePage.clickAllProductsNav();
          await allPages.allProductsPage.assertAllProductsTitle();
          navigationCount++;

          await allPages.homePage.clickOnContactUsLink();
          await allPages.contactUsPage.assertContactUsTitle();
          navigationCount++;

          await allPages.homePage.clickAboutUsNav();
          await allPages.homePage.assertAboutUsTitle();
          navigationCount++;
        });

        const totalNavigationTime = Date.now() - startTime;
        const avgNavigationTime = totalNavigationTime / navigationCount;

        test.info().annotations.push(
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'page-load-time',
              value: avgNavigationTime,
              threshold: 2000,
              unit: 'ms'
            })
          },
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'navigation-count',
              value: navigationCount,
              threshold: 10,
              unit: 'count'
            })
          }
        );
      });

    });

  });

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Contact Us Page', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Submit Contact Us Form', () => {

      test('Verify that user can submit Contact Us form successfully', {tag: '@firefox'}, async () => {
        const startTime = Date.now();
        await login();

        await allPages.homePage.clickOnContactUsLink();
        await allPages.contactUsPage.assertContactUsTitle();

        await allPages.contactUsPage.fillContactUsForm();
        await allPages.contactUsPage.verifySuccessContactUsFormSubmission();

        const formSubmissionTime = Date.now() - startTime;

        test.info().annotations.push(
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'form-submission-time',
              value: formSubmissionTime,
              threshold: 4000,
              unit: 'ms'
            })
          },
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'form-success-rate',
              value: 100,
              threshold: 98,
              unit: '%'
            })
          }
        );
      });

    });

  });

});
