import { test, expect } from '@playwright/test';

test.describe('Admin CMS & Decoupled Hero Engine', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin verification and hero API endpoints for robust testing
    await page.route('/api/admin/verify', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ authenticated: true }) });
    });
    await page.route('/api/hero', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            copy: {
              eyebrow: 'Protocol',
              headline_prefix: 'Live Beyond',
              headline_italic: 'the Prognosis.',
              subheadline: 'For high-achievers who have cleared active treatment and refuse to simply wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.',
              primary_cta_text: 'Request a Consultation',
              primary_cta_url: '/consultation'
            },
            slides: [
              {
                id: 1,
                image_url: 'https://example.com/hero1.webp',
                overlay_opacity: 60,
                display_duration_ms: 6000,
                transition_speed_ms: 1200,
                object_position: 'center 30%',
                active: 1
              }
            ]
          })
        });
      } else {
        await route.fulfill({ status: 405 });
      }
    });
    await page.route('/api/hero_copy', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.fulfill({ status: 405 });
      }
    });
    await page.route('/api/hero_slides', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              image_url: 'https://example.com/hero1.webp',
              overlay_opacity: 60,
              display_duration_ms: 6000,
              transition_speed_ms: 1200,
              object_position: 'center 30%',
              active: 1
            }
          ])
        });
      } else if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.fulfill({ status: 405 });
      }
    });
  });

  test('should load admin dashboard tabs and sub-components', async ({ page }) => {
    await page.goto('/admin');
    // Verify tabbed orchestrator structure specifically within admin container / buttons
    await expect(page.locator('button:has-text(\"Hero Engine\")')).toBeVisible();
    await expect(page.locator('button:has-text(\"Resources\")')).toBeVisible();
    await expect(page.locator('button:has-text(\"Blogs & Vlogs\")')).toBeVisible();
  });

  test('should adjust slide overlay opacity and retain state', async ({ page }) => {
    await page.goto('/admin');
    // Wait for the Hero Admin tab to be active and the HeroAdmin to load
    await expect(page.locator('text=Hero Carousel Images')).toBeVisible();
    const slider = page.locator('input[type=\"range\"]').first();
    await expect(slider).toBeVisible();
    await slider.fill('75');
    await expect(slider).toHaveValue('75');
  });
});