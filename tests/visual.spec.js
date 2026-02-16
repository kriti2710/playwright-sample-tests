// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Visual Comparison – GitHub Username Change', () => {
 
  test.beforeEach(async ({ page }) => {
    await page.goto('https://github.com/login');

    // Disable animations &  caret
    await page.addStyleTag({
      content: `
        * {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `
    });

    await page.waitForLoadState('networkidle');
  });

  test('Visual Comparison ', {
    tag: '@chromium',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'Visual Comparison' },
      { type: 'testdino:link', description: 'https://jira.example.com/VISUAL-001' },
      { type: 'testdino:owner', description: 'qa-team' },
      { type: 'testdino:notify-slack', description: '#visual-alerts' },
      { type: 'testdino:context', description: 'Visual regression testing for GitHub login form changes' },
      { type: 'testdino:flaky-reason', description: 'Visual comparisons may fail due to rendering differences or timing issues' }
    ]
  }, async ({ page }) => {

    const usernameInput = page.getByRole('textbox', {
      name: 'Username or email address',
    });
    
    // Baseline – empty input
    await expect(usernameInput).toHaveScreenshot('username-input.png');
    
    // Modify UI
    await usernameInput.fill('test');
    
    // Same screenshot name → visual diff
    await expect(usernameInput).toHaveScreenshot('username-input.png');
    
    });
  });
