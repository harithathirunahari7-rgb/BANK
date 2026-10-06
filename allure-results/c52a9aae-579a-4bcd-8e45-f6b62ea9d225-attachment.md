# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: annotations.spec.ts >> Flaky Action BUG-202 succeeds when clicked
- Location: tests\annotations.spec.ts:62:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('flaky-result')
Expected substring: "Succeeded"
Received string:    "✗ Failed this time (50% chance)."
Timeout: 5000ms

Call log:
  - Expect "toContainText" getByTestId('flaky-result') with timeout 5000ms
  - waiting for getByTestId('flaky-result')
    13 × locator resolved to <div role="alert" id="flaky-result" data-testid="flaky-result" class="annotations-module__kW9OmW__outputBox">✗ Failed this time (50% chance).</div>
       - unexpected value "✗ Failed this time (50% chance)."

```

```yaml
- alert: ✗ Failed this time (50% chance).
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | test('Feature Flag Toggle skips when Beta UI is off', async ({ page }) => {
  4   |   await page.goto('/practice/annotations');
  5   | 
  6   |   const betaToggle = page.getByTestId('toggle-beta-ui');
  7   |   await expect(betaToggle).toHaveAttribute('aria-checked', /^(true|false)$/);
  8   |   await betaToggle.click();//beta-UI is now ON
  9   | 
  10  |   const betaUiEnabled = (await betaToggle.getAttribute('aria-checked')) === 'true';
  11  |   test.skip(!betaUiEnabled, 'Beta UI is OFF');
  12  | 
  13  |   await expect(page.getByTestId('beta-panel')).toBeVisible();
  14  |   await page.screenshot({ path: './tests/screenshots_test/beta-ui-enabled.png', fullPage: true });
  15  | });
  16  | 
  17  | test('Slow Report Generation waits 5s for the report result', async ({ page }) => {
  18  |   test.slow();
  19  |   await page.goto('/practice/annotations');
  20  | 
  21  |   await page.getByTestId('btn-gen-report').click();
  22  |   const loadingIndicator = page.getByTestId('loading-indicator');
  23  |   await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  24  |   await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });//to increase the timeout for slow report generation, default is 5s
  25  |   await expect(page.getByTestId('report-result')).toBeVisible();//visible after report generation is complete 5s
  26  | });
  27  | 
  28  | test('Slow Dashboard report generations for 3s duration', async ({ page }) => {
  29  |   test.slow();
  30  |   await page.goto('/practice/annotations');
  31  |   await page.getByTestId('btn-load-data').click();
  32  |   const loadingIndicator = page.getByTestId('loading-indicator');
  33  |   await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  34  |   //await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  35  |   await expect(page.getByTestId('result-s02')).toBeVisible();
  36  | })
  37  | 
  38  | test('Slow export CSV report generations for 8s duration', async ({ page }) => {
  39  |   test.slow();
  40  |   await page.goto('/practice/annotations');
  41  |   await page.getByTestId('btn-export-csv').click();
  42  |   const loadingIndicator = page.getByTestId('loading-indicator');
  43  |   await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  44  |   //await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  45  |   await expect(page.getByTestId('result-s02')).toBeVisible();
  46  | })
  47  | 
  48  | test('Buggy Counter BUG-101 increments by 2 per click', async ({ page }) => {
  49  |   test.fixme(true, 'BUG-101: increments by 2');
  50  |   await page.goto('/practice/annotations');
  51  | 
  52  |   const incrementButton = page.getByTestId('btn-buggy-inc');
  53  |   await incrementButton.click();
  54  |   await incrementButton.click();
  55  |   await incrementButton.click();
  56  |   await expect(page.getByTestId('buggy-counter')).toHaveText('6');
  57  | 
  58  |   await page.getByTestId('btn-buggy-dec').click();
  59  |   await expect(page.getByTestId('buggy-counter')).toHaveText('5');
  60  | });
  61  | 
  62  | test('Flaky Action BUG-202 succeeds when clicked', async ({ page }) => {
  63  |   test.fail(true, 'BUG-202: flaky action succeeds only about 50% of runs');
  64  |   await page.goto('/practice/annotations');
  65  | 
  66  |   await page.getByTestId('btn-flaky').click();
> 67  |   await expect(page.getByTestId('flaky-result')).toContainText('Succeeded');
      |                                                  ^ Error: expect(locator).toContainText(expected) failed
  68  | });
  69  | 
  70  | test('Checkout Stepper completes all three steps and places an order', async ({ page }) => {
  71  |   await page.goto('/practice/annotations');
  72  | 
  73  |   await test.step('Cart: review items and continue to shipping', async () => {
  74  |     await expect(page.locator('[data-step="1"]')).toHaveAttribute('aria-selected', 'true');
  75  |     await expect(page.getByTestId('cart-total')).toHaveText('$229.97');
  76  |     await page.getByTestId('btn-to-shipping').click();
  77  |     await expect(page.locator('[data-step="2"]')).toHaveAttribute('aria-selected', 'true');
  78  |   });
  79  | 
  80  |   await test.step('Shipping: enter delivery details and continue to payment', async () => {
  81  |     await page.getByTestId('ship-name').fill('Alex Morgan');
  82  |     await page.getByTestId('ship-zip').fill('10001');
  83  |     await page.getByTestId('ship-address').fill('123 Main St');
  84  |     await page.getByTestId('btn-to-payment').click();
  85  |     await expect(page.locator('[data-step="3"]')).toHaveAttribute('aria-selected', 'true');
  86  |   });
  87  | 
  88  |   await test.step('Payment: enter card details and place the order', async () => {
  89  |     await page.getByTestId('pay-card').fill('4111111111111111');
  90  |     await page.getByTestId('pay-expiry').fill('12/27');
  91  |     await page.getByTestId('pay-cvv').fill('123');
  92  |     await page.getByTestId('btn-place-order').click();
  93  |     await expect(page.getByTestId('order-confirmation')).toBeVisible();
  94  |   });
  95  | });
  96  | const validLoginCases = [
  97  |   { role: 'Admin', email: 'admin@test.com', password: 'admin123', dashboard: 'dash-admin' },
  98  |   { role: 'Editor', email: 'editor@test.com', password: 'editor123', dashboard: 'dash-editor' },
  99  |   { role: 'Viewer', email: 'viewer@test.com', password: 'viewer123', dashboard: 'dash-viewer' },
  100 | ];
  101 | 
  102 | for (const { role, email, password, dashboard } of validLoginCases) {
  103 |   test(`Data-Driven Login: ${role} credentials show the expected dashboard`, async ({ page }) => {
  104 |     await page.goto('/practice/annotations');
  105 |     await page.getByTestId('login-email').fill(email);
  106 |     await page.getByTestId('login-password').fill(password);
  107 |     await page.getByTestId('btn-login').click();
  108 | 
  109 |     await expect(page.getByTestId('login-result')).toContainText(
  110 |       `Logged in as ${email} (role: ${role.toLowerCase()})`
  111 |     );
  112 |     await expect(page.getByTestId(dashboard)).toBeVisible();
  113 | 
  114 |     for (const otherDashboard of ['dash-admin', 'dash-editor', 'dash-viewer']) {
  115 |       if (otherDashboard !== dashboard) {
  116 |         await expect(page.getByTestId(otherDashboard)).toBeHidden();
  117 |       }
  118 |     }
  119 |   });
  120 | }
  121 | 
  122 | test('Data-Driven Login: invalid credentials show an error without a dashboard', async ({ page }) => {
  123 |   await page.goto('/practice/annotations');
  124 |   await page.getByTestId('login-email').fill('bad@test.com');
  125 |   await page.getByTestId('login-password').fill('wrong');
  126 |   await page.getByTestId('btn-login').click();
  127 | 
  128 |   await expect(page.getByTestId('login-result')).toContainText('Invalid credentials');
  129 |   for (const dashboard of ['dash-admin', 'dash-editor', 'dash-viewer']) {
  130 |     await expect(page.getByTestId(dashboard)).toBeHidden();
  131 |   }
  132 | });
```