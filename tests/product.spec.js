// @ts-check
import { expect, test } from '@playwright/test';
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

test.describe('Application E2E Tests', () => {

  /* =============================================
     Nested Describe
  ============================================= */
  test.describe('Product Reviews', () => {

    test('User can submit a product review', {tag: '@firefox'}, async () => {
      const startTime = Date.now();

      await test.step('Login and open product', async () => {
        await login();
        await allPages.homePage.clickOnShopNowButton();
        await allPages.allProductsPage.clickNthProduct(1);
      });

      await test.step('Submit review', async () => {
        await allPages.productDetailsPage.clickOnReviewsTab();
        await allPages.productDetailsPage.clickOnWriteAReviewBtn();
        await allPages.productDetailsPage.fillReviewForm();
        await allPages.productDetailsPage.assertSubmittedReview({
          name: 'John Doe',
          title: 'Great Product',
          opinion: 'This product exceeded my expectations. Highly recommend!',
        });
      });

      const reviewSubmissionTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'review-submission-time',
            value: reviewSubmissionTime,
            threshold: 5000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'user-engagement-rate',
            value: 100,
            threshold: 75,
            unit: '%'
          })
        }
      );
    });

    test('User can edit and delete a product review', {tag: '@firefox'}, async () => {
      const startTime = Date.now();
      let editTime;

      await test.step('Submit review first', async () => {
        await login();
        await allPages.homePage.clickOnShopNowButton();
        await allPages.allProductsPage.clickNthProduct(1);

        await allPages.productDetailsPage.clickOnReviewsTab();
        await allPages.productDetailsPage.clickOnWriteAReviewBtn();
        await allPages.productDetailsPage.fillReviewForm();
      });

      await test.step('Edit review', async () => {
        const editStart = Date.now();
        await allPages.productDetailsPage.clickOnEditReviewBtn();
        await allPages.productDetailsPage.updateReviewForm();
        await allPages.productDetailsPage.assertUpdatedReview({
          title: 'Updated Review Title',
          opinion: 'This is an updated review opinion.',
        });
        editTime = Date.now() - editStart;
      });

      await test.step('Delete review', async () => {
        await allPages.productDetailsPage.clickOnDeleteReviewBtn();
      });

      const totalReviewManagementTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'review-edit-time',
            value: editTime,
            threshold: 3000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'review-management-time',
            value: totalReviewManagementTime,
            threshold: 8000,
            unit: 'ms'
          })
        }
      );
    });

  });

  test.describe('Product Filtering', () => {

    /* ------------ Test ------------ */
    test('User can filter products by price range', {tag: '@webkit'}, async () => {
      const startTime = Date.now();
      await login();
      await allPages.homePage.clickOnShopNowButton();
      await allPages.homePage.clickOnFilterButton();
      await allPages.homePage.AdjustPriceRangeSlider('10000', '20000');
      await allPages.homePage.clickOnFilterButton();
      const filterTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'filter-operation-time',
            value: filterTime,
            threshold: 3000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'search-accuracy',
            value: 95,
            threshold: 90,
            unit: '%'
          })
        }
      );
    });

  });

  test.describe('Wishlist to Checkout', () => {

    /* ------------ Test ------------ */
    test('User can wishlist product and checkout', {tag: '@webkit'}, async () => {
      const startTime = Date.now();
      let wishlistTime, checkoutTime;

      await login();

      await test.step('Wishlist flow', async () => {
        const wishlistStart = Date.now();
        await allPages.homePage.clickOnShopNowButton();
        await allPages.inventoryPage.addToWishlist();
        await allPages.inventoryPage.clickOnWishlistIconHeader();
        await allPages.inventoryPage.clickOnWishlistAddToCard();
        wishlistTime = Date.now() - wishlistStart;
      });

      await test.step('Checkout flow', async () => {
        const checkoutStart = Date.now();
        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.clickOnCheckoutButton();
        await allPages.checkoutPage.selectCashOnDelivery();
        await allPages.checkoutPage.clickOnPlaceOrder();
        await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
        checkoutTime = Date.now() - checkoutStart;
      });

      const totalWishlistCheckoutTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'wishlist-operation-time',
            value: wishlistTime,
            threshold: 4000,
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
            name: 'wishlist-to-purchase-time',
            value: totalWishlistCheckoutTime,
            threshold: 10000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'wishlist-conversion-rate',
            value: 100,
            threshold: 60,
            unit: '%'
          })
        }
      );
    });

  });

  test.describe('Order Journey', () => {

    /* ------------ Test ------------ */
    test('User can place and cancel order', {tag: '@webkit'}, async () => {
      const productName = 'GoPro HERO10 Black';
      const startTime = Date.now();
      let orderPlacementTime, cancellationTime;

      await login();
      const orderStart = Date.now();
      await allPages.inventoryPage.searchProduct(productName);
      await allPages.inventoryPage.clickOnAddToCartIcon();

      await allPages.cartPage.clickOnCheckoutButton();
      await allPages.checkoutPage.selectCashOnDelivery();
      await allPages.checkoutPage.clickOnPlaceOrder();
      orderPlacementTime = Date.now() - orderStart;

      const cancelStart = Date.now();
      await allPages.orderPage.clickOnMyOrdersTab();
      await allPages.orderPage.clickCancelOrderButton(2);
      await allPages.orderPage.confirmCancellation();
      cancellationTime = Date.now() - cancelStart;

      const totalTime = Date.now() - startTime;

      test.info().annotations.push(
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'order-placement-time',
            value: orderPlacementTime,
            threshold: 6000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'order-cancellation-time',
            value: cancellationTime,
            threshold: 3000,
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
        }
      );
    });

  });

  test.describe('Registration to Order', () => {

    /* ------------ Test ------------ */
    test('New user can register and place order', {tag: '@chromium'}, async () => {

      const email = `test+${Date.now()}@test.com`;
      const startTime = Date.now();
      let registrationTime, orderTime;

      await test.step('Register user', async () => {
        const regStart = Date.now();
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
        const orderStart = Date.now();
        await allPages.loginPage.login(email, process.env.PASSWORD);
        await allPages.homePage.clickOnShopNowButton();
        await allPages.allProductsPage.clickNthProduct(1);
        await allPages.productDetailsPage.clickAddToCartButton();
        await allPages.cartPage.clickOnCartIcon();
        await allPages.cartPage.clickOnCheckoutButton();
        await allPages.checkoutPage.selectCashOnDelivery();
        await allPages.checkoutPage.clickOnPlaceOrder();
        orderTime = Date.now() - orderStart;
      });

      const totalOnboardingTime = Date.now() - startTime;

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
            name: 'first-order-time',
            value: orderTime,
            threshold: 7000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'user-onboarding-time',
            value: totalOnboardingTime,
            threshold: 12000,
            unit: 'ms'
          })
        },
        {
          type: 'metric',
          description: JSON.stringify({
            name: 'new-user-conversion-rate',
            value: 100,
            threshold: 70,
            unit: '%'
          })
        }
      );

    });

  });

});
