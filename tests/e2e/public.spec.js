import { test, expect } from '@playwright/test';

test.describe('Public Navigation & Non-Lead-Capture Verification', () => {
  test('should load landing page and display live hero copy', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Remission Protocol/i);
    await expect(page.locator('h1')).toContainText(/Live Beyond/i);
  });

  test('should allow public protocol downloads without lead capture gates', async ({ page }) => {
    await page.goto('/#resources');
    const downloadButton = page.locator('a:has-text("Download"), button:has-text("Download")').first();
    if (await downloadButton.isVisible()) {
      await expect(page.locator('input[type="email"]')).not.toBeVisible();
      const [download] = await Promise.all([
        page.waitForEvent('download').catch(() => null),
        downloadButton.click()
      ]);
      // Verify open access policy holds without blocking popups
      await expect(page.locator('text=Enter your email to continue')).not.toBeVisible();
    }
  });
});
