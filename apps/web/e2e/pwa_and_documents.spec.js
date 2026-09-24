import { test, expect } from '@playwright/test';

test.describe('Client Portal PWA Offline Telemetry & Private Document Management', () => {
  test('authenticates session and toggles between Telemetry and Documents tabs', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('rp_client_token', 'test_client_token_12345');
    });

    await page.goto('/portal');
    await expect(page.getByText('Encrypted Client Portal')).toBeVisible();

    // Verify Telemetry tab defaults
    await expect(page.getByRole('button', { name: /Telemetry/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Documents & Labs/i })).toBeVisible();

    // Switch to Private Documents tab
    await page.getByRole('button', { name: /Documents & Labs/i }).click();
    await expect(page.getByText('Private Clinical Documents & Labs')).toBeVisible();
    await expect(page.getByText('Upload Medical File')).toBeVisible();
  });
});
