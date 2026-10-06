import { expect, test } from '@playwright/test';

test('Feature Flag Toggle skips when Beta UI is off', async ({ page }) => {
  await page.goto('/practice/annotations');

  const betaToggle = page.getByTestId('toggle-beta-ui');
  await expect(betaToggle).toHaveAttribute('aria-checked', /^(true|false)$/);
  await betaToggle.click();//beta-UI is now ON

  const betaUiEnabled = (await betaToggle.getAttribute('aria-checked')) === 'true';
  test.skip(!betaUiEnabled, 'Beta UI is OFF');

  await expect(page.getByTestId('beta-panel')).toBeVisible();
  await page.screenshot({ path: './tests/screenshots_test/beta-ui-enabled.png', fullPage: true });
});

test('Slow Report Generation waits 5s for the report result', async ({ page }) => {
  test.slow();
  await page.goto('/practice/annotations');

  await page.getByTestId('btn-gen-report').click();
  const loadingIndicator = page.getByTestId('loading-indicator');
  await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });//to increase the timeout for slow report generation, default is 5s
  await expect(page.getByTestId('report-result')).toBeVisible();//visible after report generation is complete 5s
});

test('Slow Dashboard report generations for 3s duration', async ({ page }) => {
  test.slow();
  await page.goto('/practice/annotations');
  await page.getByTestId('btn-load-data').click();
  const loadingIndicator = page.getByTestId('loading-indicator');
  await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  //await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  await expect(page.getByTestId('result-s02')).toBeVisible();
})

test('Slow export CSV report generations for 8s duration', async ({ page }) => {
  test.slow();
  await page.goto('/practice/annotations');
  await page.getByTestId('btn-export-csv').click();
  const loadingIndicator = page.getByTestId('loading-indicator');
  await expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
  //await expect(loadingIndicator).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 });
  await expect(page.getByTestId('result-s02')).toBeVisible();
})

test('Buggy Counter BUG-101 increments by 2 per click', async ({ page }) => {
  test.fixme(true, 'BUG-101: increments by 2');
  await page.goto('/practice/annotations');

  const incrementButton = page.getByTestId('btn-buggy-inc');
  await incrementButton.click();
  await incrementButton.click();
  await incrementButton.click();
  await expect(page.getByTestId('buggy-counter')).toHaveText('6');

  await page.getByTestId('btn-buggy-dec').click();
  await expect(page.getByTestId('buggy-counter')).toHaveText('5');
});

test('Flaky Action BUG-202 succeeds when clicked', async ({ page }) => {
  test.fail(true, 'BUG-202: flaky action succeeds only about 50% of runs');
  await page.goto('/practice/annotations');

  await page.getByTestId('btn-flaky').click();
  await expect(page.getByTestId('flaky-result')).toContainText('Succeeded');
});

test('Checkout Stepper completes all three steps and places an order', async ({ page }) => {
  await page.goto('/practice/annotations');

  await test.step('Cart: review items and continue to shipping', async () => {
    await expect(page.locator('[data-step="1"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('cart-total')).toHaveText('$229.97');
    await page.getByTestId('btn-to-shipping').click();
    await expect(page.locator('[data-step="2"]')).toHaveAttribute('aria-selected', 'true');
  });

  await test.step('Shipping: enter delivery details and continue to payment', async () => {
    await page.getByTestId('ship-name').fill('Alex Morgan');
    await page.getByTestId('ship-zip').fill('10001');
    await page.getByTestId('ship-address').fill('123 Main St');
    await page.getByTestId('btn-to-payment').click();
    await expect(page.locator('[data-step="3"]')).toHaveAttribute('aria-selected', 'true');
  });

  await test.step('Payment: enter card details and place the order', async () => {
    await page.getByTestId('pay-card').fill('4111111111111111');
    await page.getByTestId('pay-expiry').fill('12/27');
    await page.getByTestId('pay-cvv').fill('123');
    await page.getByTestId('btn-place-order').click();
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
  });
});
const validLoginCases = [
  { role: 'Admin', email: 'admin@test.com', password: 'admin123', dashboard: 'dash-admin' },
  { role: 'Editor', email: 'editor@test.com', password: 'editor123', dashboard: 'dash-editor' },
  { role: 'Viewer', email: 'viewer@test.com', password: 'viewer123', dashboard: 'dash-viewer' },
];

for (const { role, email, password, dashboard } of validLoginCases) {
  test(`Data-Driven Login: ${role} credentials show the expected dashboard`, async ({ page }) => {
    await page.goto('/practice/annotations');
    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('btn-login').click();

    await expect(page.getByTestId('login-result')).toContainText(
      `Logged in as ${email} (role: ${role.toLowerCase()})`
    );
    await expect(page.getByTestId(dashboard)).toBeVisible();

    for (const otherDashboard of ['dash-admin', 'dash-editor', 'dash-viewer']) {
      if (otherDashboard !== dashboard) {
        await expect(page.getByTestId(otherDashboard)).toBeHidden();
      }
    }
  });
}

test('Data-Driven Login: invalid credentials show an error without a dashboard', async ({ page }) => {
  await page.goto('/practice/annotations');
  await page.getByTestId('login-email').fill('bad@test.com');
  await page.getByTestId('login-password').fill('wrong');
  await page.getByTestId('btn-login').click();

  await expect(page.getByTestId('login-result')).toContainText('Invalid credentials');
  for (const dashboard of ['dash-admin', 'dash-editor', 'dash-viewer']) {
    await expect(page.getByTestId(dashboard)).toBeHidden();
  }
});