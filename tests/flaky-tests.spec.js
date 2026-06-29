// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Flaky Test Suite
 * 
 * These tests demonstrate various types of flaky behavior that can occur in real-world scenarios.
 * Flaky tests are tests that sometimes pass and sometimes fail without any code changes.
 * 
 * Common causes of flakiness:
 * 1. Timing issues (race conditions)
 * 2. Network instability
 * 3. Asynchronous operations
 * 4. Random data or behavior
 * 5. External dependencies
 * 6. Animation/transition timing
 */

test.describe('Flaky Test Suite', { tag: '@chromium' }, () => {

    test('Flaky: race condition on link click', async ({ page }) => {
        await test.step('Navigate to Playwright homepage', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Click link without proper wait', async () => {
            // This is flaky because it doesn't wait for the element to be ready
            // Sometimes the element is clickable, sometimes it's not
            const randomDelay = Math.random() * 1000; // 0-1 second delay
            await page.waitForTimeout(randomDelay);

            try {
                // Might fail if element isn't ready
                await page.getByRole('link', { name: 'Get started' }).click({ timeout: 100 });
                console.log('✅ Click succeeded');
            } catch (error) {
                console.log('❌ Click failed due to timing');
                throw error;
            }
        });
    });

    test('Flaky: network instability simulation', async ({ page }) => {
        await test.step('Simulate slow network', async () => {
            // Randomly decide if network will be slow
            const isNetworkSlow = Math.random() < 0.5;

            if (isNetworkSlow) {
                console.log('🐌 Simulating slow network');
                // Emulate slow 3G network
                await page.route('**/*', async (route) => {
                    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
                    await route.continue();
                });
            }
        });

        await test.step('Navigate with potential timeout', async () => {
            // This might timeout if network is slow
            await page.goto('https://playwright.dev/', { timeout: 5000 });
        });

        await test.step('Verify page loaded', async () => {
            await expect(page).toHaveTitle(/Playwright/);
        });
    });

    test('Flaky: element visibility race', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Check element visibility with race condition', async () => {
            // Simulate checking an element that might not be immediately visible
            const randomWait = Math.random() * 500;
            await page.waitForTimeout(randomWait);

            // This could fail if the element hasn't loaded yet
            const element = page.locator('nav').first();
            const isVisible = await element.isVisible({ timeout: 100 });

            if (!isVisible) {
                console.log('❌ Element not visible in time');
                throw new Error('Element not visible');
            } else {
                console.log('✅ Element visible');
            }
        });
    });

    test('Flaky: async operation timing', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://example.com');
        });

        await test.step('Simulate async operation with variable timing', async () => {
            // Simulate an async operation that takes variable time
            const operationTime = Math.random() * 3000; // 0-3 seconds
            const timeout = 2000; // 2 second timeout

            const asyncOperation = new Promise((resolve) => {
                setTimeout(resolve, operationTime);
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Operation timed out')), timeout);
            });

            try {
                await Promise.race([asyncOperation, timeoutPromise]);
                console.log('✅ Async operation completed in time');
            } catch (error) {
                console.log('❌ Async operation timed out');
                throw error;
            }
        });
    });

    test('Flaky: animation/transition timing', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Interact with animated element', async () => {
            // Try to click an element that might be animating
            const link = page.getByRole('link', { name: 'Get started' }).first();

            // Randomly wait for different amounts of time
            const waitTime = Math.random() * 500;
            await page.waitForTimeout(waitTime);

            try {
                // Might fail if element is still animating
                await link.click({ timeout: 100, force: false });
                console.log('✅ Click on animated element succeeded');
            } catch (error) {
                console.log('❌ Click failed - element might be animating');
                throw error;
            }
        });
    });

    test('Flaky: DOM mutation race', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Access element during potential DOM mutation', async () => {
            // Simulate checking an element that might be modified by JavaScript
            const randomCheck = Math.random() < 0.5;

            if (randomCheck) {
                // Wait a bit to let JavaScript potentially modify DOM
                await page.waitForTimeout(Math.random() * 1000);
            }

            const heading = page.getByRole('heading').first();
            const text = await heading.textContent({ timeout: 100 });

            if (!text) {
                console.log('❌ Element text not available');
                throw new Error('Element text not found');
            } else {
                console.log('✅ Element text retrieved:', text);
            }
        });
    });

    test('Flaky: resource loading race', async ({ page }) => {
        await test.step('Navigate and check resource loading', async () => {
            // Start navigation
            const navigationPromise = page.goto('https://playwright.dev/');

            // Randomly decide when to check for loaded resources
            const checkDelay = Math.random() * 2000;
            await page.waitForTimeout(checkDelay);

            // This might fail if resources haven't loaded yet
            try {
                await expect(page.locator('img').first()).toBeVisible({ timeout: 100 });
                console.log('✅ Image loaded in time');
            } catch (error) {
                console.log('❌ Image not loaded yet');
                throw error;
            }

            await navigationPromise;
        });
    });

    test('Flaky: state-dependent behavior', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://example.com');
        });

        await test.step('Check state-dependent condition', async () => {
            // Simulate a condition that depends on external state
            const currentSecond = new Date().getSeconds();

            // This will fail half the time based on whether second is even/odd
            if (currentSecond % 2 === 0) {
                console.log('✅ Test passed (even second)');
                expect(true).toBe(true);
            } else {
                console.log('❌ Test failed (odd second)');
                expect(false).toBe(true);
            }
        });
    });

    test('Flaky: scroll position race', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Scroll and interact with element', async () => {
            // Scroll to bottom
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

            // Randomly wait before checking element visibility
            await page.waitForTimeout(Math.random() * 500);

            try {
                // This might fail if scroll hasn't completed
                const footer = page.locator('footer').first();
                await expect(footer).toBeInViewport({ timeout: 100 });
                console.log('✅ Footer in viewport');
            } catch (error) {
                console.log('❌ Footer not in viewport yet');
                throw error;
            }
        });
    });

    test('Flaky: multiple async operations', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Perform multiple async operations', async () => {
            // Simulate multiple async operations that might interfere with each other
            const operations = [
                page.locator('nav').first().isVisible(),
                page.locator('main').first().isVisible(),
                page.locator('footer').first().isVisible(),
            ];

            // Randomly decide how long to wait
            const waitTime = Math.random() * 1000;
            await page.waitForTimeout(waitTime);

            try {
                const results = await Promise.all(operations.map(op =>
                    Promise.race([
                        op,
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Timeout')), 100)
                        )
                    ])
                ));

                if (results.every(r => r === true)) {
                    console.log('✅ All elements visible');
                } else {
                    throw new Error('Not all elements visible');
                }
            } catch (error) {
                console.log('❌ Some operations timed out');
                throw error;
            }
        });
    });

    test('Flaky: browser cache dependency', async ({ page }) => {
        await test.step('Navigate with cache dependency', async () => {
            // This test might behave differently based on cache state
            const randomCacheBust = Math.random() > 0.5 ? `?v=${Date.now()}` : '';
            await page.goto(`https://example.com${randomCacheBust}`);
        });

        await test.step('Check load timing', async () => {
            // Performance might vary based on cache
            const performanceTiming = await page.evaluate(() => {
                const timing = performance.timing;
                return timing.loadEventEnd - timing.navigationStart;
            });

            console.log(`Page load time: ${performanceTiming}ms`);

            // This assertion might be flaky due to cache variations
            if (performanceTiming > 3000) {
                console.log('❌ Page loaded too slowly');
                throw new Error('Slow page load');
            } else {
                console.log('✅ Page loaded quickly');
            }
        });
    });

    test('Flaky: hover state race', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Interact with hover-dependent element', async () => {
            const link = page.getByRole('link', { name: 'Get started' }).first();

            // Hover over element
            await link.hover();

            // Randomly wait before checking hover state
            await page.waitForTimeout(Math.random() * 300);

            try {
                // This might fail if hover state hasn't been applied yet
                await expect(link).toHaveCSS('text-decoration', /underline/, { timeout: 100 });
                console.log('✅ Hover state detected');
            } catch (error) {
                console.log('❌ Hover state not detected in time');
                // Don't throw - hover styles might not be present
            }
        });
    });

    test('Flaky: focus state race', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Check focus state', async () => {
            const searchButton = page.getByRole('button', { name: /search/i }).first();

            if (await searchButton.isVisible().catch(() => false)) {
                await searchButton.focus();

                // Randomly wait before checking focus
                await page.waitForTimeout(Math.random() * 200);

                try {
                    const isFocused = await searchButton.evaluate(el => el === document.activeElement);
                    if (!isFocused) {
                        console.log('❌ Element lost focus');
                        throw new Error('Focus lost');
                    } else {
                        console.log('✅ Element has focus');
                    }
                } catch (error) {
                    console.log('❌ Focus check failed');
                    throw error;
                }
            }
        });
    });

    test('Flaky: third-party script loading', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Check for third-party scripts', async () => {
            // Randomly wait before checking
            await page.waitForTimeout(Math.random() * 2000);

            try {
                // Check if analytics or other third-party scripts loaded
                const hasAnalytics = await page.evaluate(() => {
                    const win = /** @type {any} */ (window);
                    return typeof win.gtag !== 'undefined' ||
                        typeof win.ga !== 'undefined' ||
                        typeof win.analytics !== 'undefined';
                }, { timeout: 100 });

                console.log(hasAnalytics ? '✅ Third-party scripts loaded' : '⚠️ No third-party scripts detected');
            } catch (error) {
                console.log('❌ Script check timed out');
                throw error;
            }
        });
    });
});

/**
 * Flaky Test Suite - Advanced Scenarios
 * 
 * More complex flaky test patterns
 */
test.describe('Advanced Flaky Test Scenarios', { tag: '@chromium' }, () => {

    test('Flaky: WebSocket connection timing', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://example.com');
        });

        await test.step('Simulate WebSocket connection race', async () => {
            // Simulate checking WebSocket connection that might not be established
            const connectionTime = Math.random() * 2000;
            const checkTime = Math.random() * 1500;

            await page.waitForTimeout(checkTime);

            if (checkTime < connectionTime) {
                console.log('❌ Checked before WebSocket connected');
                throw new Error('WebSocket not connected');
            } else {
                console.log('✅ WebSocket connection established');
            }
        });
    });

    test('Flaky: localStorage race condition', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://example.com');
        });

        await test.step('Check localStorage with race condition', async () => {
            // Set localStorage value
            await page.evaluate(() => {
                setTimeout(() => {
                    localStorage.setItem('testKey', 'testValue');
                }, Math.random() * 1000);
            });

            // Try to read it immediately
            await page.waitForTimeout(Math.random() * 800);

            const value = await page.evaluate(() => localStorage.getItem('testKey'));

            if (!value) {
                console.log('❌ localStorage value not set yet');
                throw new Error('localStorage race condition');
            } else {
                console.log('✅ localStorage value retrieved');
            }
        });
    });

    test('Flaky: API response timing', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Simulate API call with variable response time', async () => {
            // Intercept API calls and add random delay
            await page.route('**/api/**', async (route) => {
                const delay = Math.random() * 3000;
                await new Promise(resolve => setTimeout(resolve, delay));
                await route.continue();
            });

            // Make an API call (simulated)
            const apiTimeout = 2000;
            try {
                await page.waitForResponse(
                    response => response.url().includes('/api/'),
                    { timeout: apiTimeout }
                );
                console.log('✅ API response received in time');
            } catch (error) {
                console.log('❌ API response timed out');
                // This is expected flaky behavior
            }
        });
    });

    test('Flaky: concurrent user actions', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Simulate concurrent actions', async () => {
            // Simulate multiple user actions happening at once
            const actions = [
                page.mouse.move(100, 100),
                page.keyboard.press('Tab'),
                page.evaluate(() => window.scrollBy(0, 100)),
            ];

            // Randomly execute actions
            if (Math.random() < 0.5) {
                // Execute sequentially
                for (const action of actions) {
                    await action;
                }
                console.log('✅ Sequential execution succeeded');
            } else {
                // Execute concurrently (might cause issues)
                try {
                    await Promise.all(actions);
                    console.log('✅ Concurrent execution succeeded');
                } catch (error) {
                    console.log('❌ Concurrent execution failed');
                    throw error;
                }
            }
        });
    });

    test('Flaky: memory/performance dependent', async ({ page }) => {
        await test.step('Navigate to page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Check performance-dependent condition', async () => {
            // Measure page performance
            const metrics = await page.evaluate(() => {
                const perf = /** @type {any} */ (performance);
                const memory = perf.memory;
                return {
                    usedJSHeapSize: memory?.usedJSHeapSize || 0,
                    totalJSHeapSize: memory?.totalJSHeapSize || 0,
                };
            });

            console.log('Memory metrics:', metrics);

            // This might fail on slower machines or under load
            const memoryUsagePercent = (metrics.usedJSHeapSize / metrics.totalJSHeapSize) * 100;

            if (memoryUsagePercent > 80) {
                console.log('❌ High memory usage detected');
                throw new Error('High memory usage');
            } else {
                console.log('✅ Memory usage acceptable');
            }
        });
    });
});
