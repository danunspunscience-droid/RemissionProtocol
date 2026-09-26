# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pwa_and_documents.spec.js >> Client Portal PWA Offline Telemetry & Private Document Management >> authenticates session and toggles between Telemetry and Documents tabs
- Location: apps/web/e2e/pwa_and_documents.spec.js:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Encrypted Client Portal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Encrypted Client Portal') with timeout 5000ms
  - waiting for getByText('Encrypted Client Portal')

```

```yaml
- banner:
  - link "Remission Protocol home":
    - /url: /
    - text: Remission Protocol
  - navigation "Primary":
    - link "About":
      - /url: /about
    - link "The Method":
      - /url: /#method
    - link "Resources":
      - /url: /resources
    - link "Content Library":
      - /url: /library
    - link "Member Access":
      - /url: /members
    - link "Apply":
      - /url: /apply
    - link "Member Login":
      - /url: /login
    - link "Request a Consultation":
      - /url: /consultation
      - text: Request a Consultation
      - img
- main:
  - img
  - heading "Client Portal Access" [level=2]
  - paragraph: Unexpected token '<', "<!doctype "... is not valid JSON
- contentinfo:
  - text: Remission Protocol
  - paragraph: A concierge health coaching service for cancer survivors — physician-guided, coach-delivered, and measured in biomarkers, not promises. For people who refuse to simply manage disease.
  - heading "Explore" [level=3]
  - list:
    - listitem:
      - link "About":
        - /url: /about
    - listitem:
      - link "The Method":
        - /url: /#method
    - listitem:
      - link "Resources":
        - /url: /resources
    - listitem:
      - link "Content Library":
        - /url: /library
    - listitem:
      - link "Member Access":
        - /url: /members
    - listitem:
      - link "Apply for Membership":
        - /url: /apply
    - listitem:
      - link "Request a Consultation":
        - /url: /consultation
    - listitem:
      - link "Member Login":
        - /url: /login
  - heading "Contact" [level=3]
  - list:
    - listitem:
      - img
      - text: Westlake Hills, Austin, Texas
    - listitem:
      - link "hello@metxbootcamp.com":
        - /url: mailto:hello@metxbootcamp.com
        - img
        - text: hello@metxbootcamp.com
    - listitem:
      - link "Begin the conversation":
        - /url: /consultation
        - text: Begin the conversation
        - img
  - paragraph: © 2026 Remission Protocol. All rights reserved.
  - paragraph: Educational content is not a substitute for personalized medical advice.
- region "Notifications (F8)":
  - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Client Portal PWA Offline Telemetry & Private Document Management', () => {
  4  |   test('authenticates session and toggles between Telemetry and Documents tabs', async ({ page }) => {
  5  |     await page.addInitScript(() => {
  6  |       localStorage.setItem('rp_client_token', 'test_client_token_12345');
  7  |     });
  8  | 
  9  |     await page.goto('/portal');
> 10 |     await expect(page.getByText('Encrypted Client Portal')).toBeVisible();
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  11 | 
  12 |     // Verify Telemetry tab defaults
  13 |     await expect(page.getByRole('button', { name: /Telemetry/i })).toBeVisible();
  14 |     await expect(page.getByRole('button', { name: /Documents & Labs/i })).toBeVisible();
  15 | 
  16 |     // Switch to Private Documents tab
  17 |     await page.getByRole('button', { name: /Documents & Labs/i }).click();
  18 |     await expect(page.getByText('Private Clinical Documents & Labs')).toBeVisible();
  19 |     await expect(page.getByText('Upload Medical File')).toBeVisible();
  20 |   });
  21 | });
  22 | 
```