// @ts-check
import { test, expect } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

async function login(
  username = process.env.USERNAME,
  password = process.env.PASSWORD
) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

/* =================================================
   LEVEL 1 — ROOT SUITE
================================================= */
test.describe('Application E2E Tests', () => {

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Cart Management', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Delete Product from Cart', () => {

      test('User can delete selected product from cart',{tag: '@ios'}, async () => {
        const productName = 'GoPro HERO10 Black';
        const startTime = Date.now();

        await login();
        await allPages.inventoryPage.clickOnShopNowButton();
        await allPages.inventoryPage.clickOnAllProductsLink();
        await allPages.inventoryPage.searchProduct(productName);
        await allPages.inventoryPage.clickOnAddToCartIcon();

        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.verifyCartItemVisible(productName);
        await allPages.cartPage.clickOnDeleteProductIcon();
        await allPages.cartPage.verifyEmptyCartMessage();

        const cartOperationTime = Date.now() - startTime;
        test.info().annotations.push({
          type: 'metric',
          description: JSON.stringify({
            name: 'cart-operation-time',
            value: cartOperationTime,
            threshold: 5000,
            unit: 'ms'
          })
        });
      });

    });

  });

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Registration to Order', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Single Order and Cancellation', () => {

      test('New user can place and cancel order @chromium', {tag: '@chromium'}, async () => {
        const email = `test+${Date.now()}@test.com`;
        const startTime = Date.now();
        let registrationTime, checkoutTime;

        await test.step('Register user', async () => {
          const regStart = Date.now();
          await allPages.loginPage.clickOnUserProfileIcon();
          await allPages.loginPage.clickOnSignupLink();
          await allPages.signupPage.signup(
            'Test',
            'User',
            email,
            process.env.PASSWORD
          );
          registrationTime = Date.now() - regStart;
        });

        await test.step('Login and place order', async () => {
          const checkoutStart = Date.now();
          await allPages.loginPage.login(email, process.env.PASSWORD);
          await expect(allPages.homePage.getHomeNav()).toBeVisible();

          await allPages.homePage.clickAllProductsNav();
          await allPages.allProductsPage.clickNthProduct(1);
          await allPages.productDetailsPage.clickAddToCartButton();
          await allPages.cartPage.clickOnCheckoutButton();
          await allPages.checkoutPage.selectCashOnDelivery();
          await allPages.checkoutPage.clickOnPlaceOrder();
          checkoutTime = Date.now() - checkoutStart;
        });

        await test.step('Cancel order', async () => {
          await allPages.orderPage.clickOnMyOrdersTab();
          await allPages.orderPage.clickCancelOrderButton();
          await allPages.orderPage.confirmCancellation();
        });

        const totalFlowTime = Date.now() - startTime;
        
        test.info().annotations.push(
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'registration-time',
              value: registrationTime,
              threshold: 3000,
              unit: 'ms'
            })
          },
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'checkout-time',
              value: checkoutTime,
              threshold: 5000,
              unit: 'ms'
            })
          },
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'order-cancellation-rate',
              value: 100,
              threshold: 20,
              unit: '%'
            })
          },
          {
            type: 'metric',
            description: JSON.stringify({
              name: 'end-to-end-flow-time',
              value: totalFlowTime,
              threshold: 15000,
              unit: 'ms'
            })
          }
        );
      });

    });

  });

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('User Profile', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Update Personal Information', () => {

      test('User can update personal info @firefox', {tag: '@firefox'}, async () => {
        const startTime = Date.now();
        await login();
        await allPages.userPage.clickOnUserProfileIcon();
        await allPages.userPage.updatePersonalInfo();
        await allPages.userPage.verifyPersonalInfoUpdated();
        const profileUpdateTime = Date.now() - startTime;

        test.info().annotations.push({
          type: 'metric',
          description: JSON.stringify({
            name: 'profile-update-time',
            value: profileUpdateTime,
            threshold: 4000,
            unit: 'ms'
          })
        });
      });

    });

  });

});

