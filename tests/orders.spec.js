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
test.describe('Orders', () => {

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Address Management', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Existing User Address CRUD', () => {

      test(
        'Verify that user can add, edit, and delete addresses after login', {
          tag: ['@ios', '@regression', '@address'],
          annotation: [
            { type: 'testdino:priority', description: 'P1' },
            { type: 'testdino:owner', description: 'team-commerce' },
            { type: 'testdino:feature', description: 'address' },
            { type: 'testdino:context', description: 'Full address CRUD cycle — add, edit, delete. Tests address management for existing authenticated users.' },
          ],
        }, async () => {
          const startTime = Date.now();
          let addTime, editTime, deleteTime;

          await login();

          await test.step('Add address', async () => {
            const addStart = Date.now();
            await allPages.userPage.clickOnUserProfileIcon();
            await allPages.userPage.clickOnAddressTab();
            await allPages.userPage.clickOnAddAddressButton();
            await allPages.userPage.fillAddressForm();
            await allPages.userPage.verifytheAddressIsAdded();
            addTime = Date.now() - addStart;
          });

          await test.step('Edit address', async () => {
            const editStart = Date.now();
            await allPages.userPage.clickOnEditAddressButton();
            await allPages.userPage.updateAddressForm();
            await allPages.userPage.verifytheUpdatedAddressIsAdded();
            editTime = Date.now() - editStart;
          });

          await test.step('Delete address', async () => {
            const deleteStart = Date.now();
            await allPages.userPage.clickOnDeleteAddressButton();
            deleteTime = Date.now() - deleteStart;
          });

          const totalCrudTime = Date.now() - startTime;

          test.info().annotations.push(
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'address-add-time',
                value: addTime,
                threshold: 3000,
                unit: 'ms'
              })
            },
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'address-edit-time',
                value: editTime,
                threshold: 2500,
                unit: 'ms'
              })
            },
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'address-delete-time',
                value: deleteTime,
                threshold: 1500,
                unit: 'ms'
              })
            },
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'crud-operation-time',
                value: totalCrudTime,
                threshold: 10000,
                unit: 'ms'
              })
            }
          );
        }
      );

    });

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('New User Address Creation', () => {

      test(
        'Verify that new user can add address from Address section', {
          tag: ['@android', '@regression', '@address'],
          annotation: [
            { type: 'testdino:priority', description: 'P2' },
            { type: 'testdino:owner', description: 'team-commerce' },
            { type: 'testdino:feature', description: 'address' },
            { type: 'testdino:context', description: 'New user address creation from the Address section. Validates the add-new-address menu and form.' },
          ],
        }, async () => {
          const startTime = Date.now();
          await login();

          await test.step('Add address for new user', async () => {
            await allPages.userPage.clickOnUserProfileIcon();
            await allPages.userPage.clickOnAddressTab();
            await allPages.userPage.clickOnAddAddressButton();
            await allPages.userPage.checkAddNewAddressMenu();
            await allPages.userPage.fillAddressForm();
          });

          const addressCreationTime = Date.now() - startTime;

          test.info().annotations.push({
            type: 'metric',
            description: JSON.stringify({
              name: 'new-user-address-creation-time',
              value: addressCreationTime,
              threshold: 4000,
              unit: 'ms'
            })
          });
        }
      );

    });

  });

  /* =============================================
     LEVEL 2 — FEATURE
  ============================================= */
  test.describe('Order Placement', () => {

    /* =========================================
       LEVEL 3 — SCENARIO
    ========================================= */
    test.describe('Multiple Quantity Purchase', () => {

      test(
        'Verify that user can purchase multiple quantities in a single order', {
          tag: ['@android', '@smoke', '@orders'],
          annotation: [
            { type: 'testdino:priority', description: 'P0' },
            { type: 'testdino:owner', description: 'team-commerce' },
            { type: 'testdino:feature', description: 'orders' },
            { type: 'testdino:context', description: 'Multi-quantity order placement. Searches product, increases cart quantity to 3, completes Cash on Delivery checkout.' },
          ],
        }, async () => {
          const productName = 'GoPro HERO10 Black';
          const startTime = Date.now();
          const quantity = 3;

          await login();
          await allPages.inventoryPage.clickOnShopNowButton();
          await allPages.inventoryPage.clickOnAllProductsLink();
          await allPages.inventoryPage.searchProduct(productName);
          await allPages.inventoryPage.verifyProductTitleVisible(productName);
          await allPages.inventoryPage.clickOnAddToCartIcon();

          await allPages.cartPage.clickOnCartIcon();
          await allPages.cartPage.verifyCartItemVisible(productName);
          await allPages.cartPage.clickIncreaseQuantityButton();
          await allPages.cartPage.verifyIncreasedQuantity('3');
          await allPages.cartPage.clickOnCheckoutButton();

          await allPages.checkoutPage.verifyCheckoutTitle();
          await allPages.checkoutPage.verifyProductInCheckout(productName);
          await allPages.checkoutPage.selectCashOnDelivery();
          await allPages.checkoutPage.verifyCashOnDeliverySelected();
          await allPages.checkoutPage.clickOnPlaceOrder();
          await allPages.checkoutPage.verifyOrderPlacedSuccessfully();

          const orderPlacementTime = Date.now() - startTime;

          test.info().annotations.push(
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'order-placement-time',
                value: orderPlacementTime,
                threshold: 8000,
                unit: 'ms'
              })
            },
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'order-quantity',
                value: quantity,
                threshold: 10,
                unit: 'count'
              })
            },
            {
              type: 'metric',
              description: JSON.stringify({
                name: 'conversion-rate',
                value: 100,
                threshold: 85,
                unit: '%'
              })
            }
          );
        }
      );

    });

  });

});
