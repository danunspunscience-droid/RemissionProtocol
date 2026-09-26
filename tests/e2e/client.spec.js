import { test, expect, request } from '@playwright/test';

test.describe('Client Portal Security & Data Isolation', () => {
  test('should reject unauthenticated API calls to client metrics', async ({ request }) => {
    const response = await request.get('/api/client/metrics');
    expect([401, 403, 302]).toContain(response.status());
  });

  test('should reject unauthenticated access to isolated client vault files', async ({ request }) => {
    const response = await request.get('/api/client/files/test-document.pdf');
    expect([401, 403, 404]).toContain(response.status());
  });

  test('should render client login form on portal view', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('input[type="email"], input[name="username"]')).toBeVisible();
  });
});
