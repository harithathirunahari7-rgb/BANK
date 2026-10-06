import {test,expect } from '../fixtures/base.fixture';
import testData from '../testdata/loginCredentils.json';
import { DashboardPage } from '../pages/dashboard.page';
import {AccountPage} from '../pages/account.page';
import { RecentTransactionsPage } from '../pages/recent-transactions.page';

const standardUser = testData.find((data) => data.username === 'standard_user');
    if (!standardUser) {
      throw new Error('standard_user credentials are missing from test data');
    }   

test.describe('Dashboard', () => {
   
test('checking and savings balances add up to total net worth', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.signIn(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(/\/bank\/dashboard$/);

        let dp = new DashboardPage(page);
        let ap = new AccountPage(page);
        await dp.gotoDashboardPage();
        const totalBalance = await dp.getTotalBalance();
        await ap.gotoAccountsPage();
        const checkingBalance = await ap.getCheckingBalance();
        console.log(`checkingBalance: ${checkingBalance}, totalBalance: ${totalBalance}`);   
        await expect(Number(checkingBalance)).toBe(Number(totalBalance) );
      });

test('recent transactions are limited to five and sorted by date descending', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.signIn(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(/\/bank\/dashboard$/);

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.gotoDashboardPage();

        const recentTransactionsPage = new RecentTransactionsPage(page);
        await recentTransactionsPage.expectAtMostFiveTransactions();
        await recentTransactionsPage.expectSortedByDateDescending();
      });

test('Transfer quick action navigates to the transfer page', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.signIn(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(/\/bank\/dashboard$/);

        await page.getByTestId('quick-action-transfer').click();
        await expect(page).toHaveURL(/\/bank\/transfer$/);
      });

test('Pay a Bill quick action navigates to the bill payment page', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.signIn(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(/\/bank\/dashboard$/);

        await page.getByRole('region', { name: 'Quick actions' })
          .getByRole('link', { name: /Pay a Bill/ })
          .click();
        await expect(page).toHaveURL(/\/bank\/bill-pay$/);
      });

test('theme toggle adds or removes the dark class from the HTML element', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.signIn(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(/\/bank\/dashboard$/);

        const html = page.locator('html');
        const wasDark = await html.evaluate(element => element.classList.contains('dark'));//browserjavascript returns boolean
       // await expect(page.locator('html')).toHaveClass(/dark/);//playwright assertion checks for class name in the list of classes on the element
        await page.getByRole('button', { name: /Switch to (dark|light) mode/ }).click();
        await expect.poll(() => html.evaluate(element => element.classList.contains('dark')))
          .toBe(!wasDark);
      });
    });