// @ts-check
/**
 * Demo suite: intentional mix of pass / fail / skip / flaky outcomes (149 tests).
 * Together with tests/login.spec.js → 150 total @chromium tests.
 */
import { expect, test } from '@playwright/test';

test.describe('Matrix — passing checks', () => {
  for (let i = 1; i <= 59; i++) {
    test(`PASS-${String(i).padStart(3, '0')} synthetic assertion passes`, { tag: '@chromium' }, async () => {
      expect.soft({ ok: true }).toEqual({ ok: true });
      expect(i).toBeGreaterThan(0);
    });
  }

  for (let i = 1; i <= 30; i++) {
    test(`PASS-${String(59 + i).padStart(3, '0')} home loads`, { tag: '@chromium' }, async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
    });
  }
});

test.describe('Matrix — intentional failures', () => {
  for (let i = 1; i <= 25; i++) {
    test(`FAIL-${String(i).padStart(3, '0')} expected assertion failure`, { tag: '@chromium' }, async () => {
      expect(1, 'demo failure').toBe(2);
    });
  }
});

test.describe('Matrix — intentional skips', () => {
  for (let i = 1; i <= 20; i++) {
    test(`SKIP-${String(i).padStart(3, '0')} not executed (demo)`, { tag: '@chromium' }, async () => {
      test.skip(true, 'Intentional demo skip — not implemented in main branch');
    });
  }
});

test.describe('Matrix — flaky (passes after retry)', () => {
  test.describe.configure({ retries: 2 });

  for (let i = 1; i <= 15; i++) {
    test(`FLK-${String(i).padStart(3, '0')} fails first run, passes on retry`, { tag: '@chromium' }, async () => {
      if (test.info().retry === 0) {
        throw new Error('Intentional flake: fails on first attempt only');
      }
      expect(1).toBe(1);
    });
  }
});