import { test, expect } from '@playwright/test';

test.describe('Admin CMS & Decoupled Hero Engine', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin verification and hero API endpoints for robust testing
    await page.route('/api/admin/verify', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ authenticated: true }) });
    });
    await page.route('/api/admin/hero', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            copy: { eyebrow: 'Protocol', headline_prefix: 'Live Beyond', headline_italic: 'the Prognosis.' },
            asset: { asset_url: '', poster_url: 'https://example.com/cover.jpg', media_type: 'video', overlay_opacity: 60 }
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });
  });

  test('should load admin dashboard tabs and sub-components', async ({ page }) => {
    await page.goto('/admin');
    // Verify tabbed orchestrator structure specifically within admin container / buttons
    await expect(page.locator('button:has-text("Hero Engine")')).toBeVisible();
    await expect(page.locator('button:has-text("Resources")')).toBeVisible();
    await expect(page.locator('button:has-text("Blogs & Vlogs")')).toBeVisible();
  });

  test('should adjust vignette overlay slider and retain state with poster override', async ({ page }) => {
    await page.goto('/admin');
    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible();
    await slider.fill('75');
    
    const posterInput = page.locator('input[placeholder*="Poster"]');
    await posterInput.fill('https://example.com/vimeo-cover.jpg');

    await page.click('button:has-text("Save Hero Settings")');
    await expect(page.locator('text=Hero settings updated successfully.')).toBeVisible();
    await expect(page.locator('text=Vignette Overlay Opacity (75%)')).toBeVisible();
  });
});
