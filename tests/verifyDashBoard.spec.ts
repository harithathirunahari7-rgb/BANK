import { expect, test } from '../fixtures/base.fixture';
import testData from '../testdata/loginCredentils.json';

const standardUser = testData.find((data) => data.username === 'standard_user');

if (!standardUser) {
	throw new Error('standard_user credentials are missing from test data');
}

function toCents(balance: string): number {
	return Math.round(Number(balance.replace(/[$,]/g, '')) * 100);
}

test.describe('Dashboard', () => {
	test('checking and savings balances add up to total net worth', async ({ page, loginPage }) => {
		await loginPage.open();
		await loginPage.signIn(standardUser.username, standardUser.password);
		await expect(page).toHaveURL(/\/bank\/dashboard$/);

		await page.goto('/bank/accounts');
		const accountsTable = page.getByRole('table', { name: 'Accounts' });
		const checkingRow = accountsTable.getByRole('row').filter({ hasText: 'Checking' });
		const savingsRow = accountsTable.getByRole('row').filter({ hasText: 'Savings' });

		await expect(checkingRow).toHaveCount(1);
		await expect(savingsRow).toHaveCount(1);

		const checkingBalance = await checkingRow.getByRole('cell').nth(2).innerText();
		const savingsBalance = await savingsRow.getByRole('cell').nth(2).innerText();

		await page.goto('/bank/dashboard');
		const netWorthCard = page.locator('div.rounded-xl.border').filter({
			has: page.getByText('Total Net Worth', { exact: true })
		});
		const totalBalance = await netWorthCard.getByText(/^\$[\d,]+\.\d{2}$/).innerText();
		expect(toCents(checkingBalance) + toCents(savingsBalance)).toBe(toCents(totalBalance));
	});

	test('quick action transfer navigates to the transfer page', async ({ page, loginPage }) => {
		await loginPage.open();
		await loginPage.signIn(standardUser.username, standardUser.password);
		await expect(page).toHaveURL(/\/bank\/dashboard$/);

		await page.getByTestId('quick-action-transfer').click();
		await expect(page).toHaveURL(/\/bank\/transfer$/);
	});
});
