import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8788',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: 'npx wrangler pages dev ../../dist/apps/web --port 8788',
    port: 8788,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
