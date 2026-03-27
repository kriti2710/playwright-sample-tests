// @ts-check
/**
 * Demo suite: intentional mix of pass / fail / skip / flaky outcomes (149 tests).
 * Together with tests/login.spec.js → 150 total @chromium tests.
 *
 * Long scenario: set BEHAVIOR_LONG_TEST_MINUTES=1..15 (execution capped at 15 min).
 */
import { expect, test } from '@playwright/test';

/** @returns {number | null} minutes 1–15, or null when the long test should be skipped */
function longTestMinutesFromEnv() {
  const raw = process.env.BEHAVIOR_LONG_TEST_MINUTES;
  if (raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.min(15, Math.max(1, Math.floor(n)));
}

test.describe('Matrix — long duration (optional, up to 15 min)', () => {
  test.describe.configure({ timeout: 16 * 60 * 1000 });

  test('LONG-001 staged wait with minute steps (max 15 min wall clock)', { tag: '@chromium' }, async ({ page }) => {
    const minutes = longTestMinutesFromEnv();
    test.skip(
      minutes === null,
      'Set BEHAVIOR_LONG_TEST_MINUTES=1..15 to run (e.g. 10 for a ~10 min execution)'
    );
    if (minutes === null) return;

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    const totalMs = minutes * 60 * 1000;
    const chunkMs = 60 * 1000;
    let elapsed = 0;

    while (elapsed < totalMs) {
      const remaining = totalMs - elapsed;
      const stepMs = Math.min(chunkMs, remaining);
      const stepIndex = Math.floor(elapsed / chunkMs) + 1;
      await test.step(`Wait segment ${stepIndex} / ${minutes} min (${Math.ceil(stepMs / 1000)}s)`, async () => {
        await new Promise((resolve) => setTimeout(resolve, stepMs));
      });
      elapsed += stepMs;
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

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
