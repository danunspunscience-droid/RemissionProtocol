import { test, expect } from '@playwright/test';

test.describe('Public Decoupled Routes & Portal Verification', () => {
  test('HomePage (/) renders correctly without PocketBase', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Remission Protocol/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('AboutPage (/about) renders leadership section', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText(/Remission Protocol/i);
  });

  test('MembersPage (/members) redirects to login or renders vault', async ({ page }) => {
    await page.goto('/members');
    const h1Text = await page.locator('h1').textContent();
    // It might redirect to login if not authenticated
    expect(h1Text).toMatch(/Resources|Login/i);
  });

  test('ConsultationPage (/consultation) renders request form', async ({ page }) => {
    await page.goto('/consultation');
    await expect(page.locator('h1')).toContainText(/Consultation/i);
  });

  test('ApplyPage (/apply) renders application form', async ({ page }) => {
    await page.goto('/apply');
    await expect(page.locator('h1')).toContainText(/Membership/i);
  });

  test('ClientPortalPage (/portal) renders portal view', async ({ page }) => {
    await page.goto('/portal');
    await expect(page.locator('body')).toContainText(/Portal|Encrypted|Client/i);
  });
});
