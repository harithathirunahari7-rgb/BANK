import {Page,Locator, expect} from '@playwright/test';

export class AccountPage {
  private readonly page: Page;
  private readonly accountsTable: Locator;
  private readonly checkingRow: Locator;
    private readonly savingsRow: Locator;
    constructor(page: Page) {
    this.page = page;
    this.accountsTable = page.getByRole('table', {name: 'Accounts'});
    this.checkingRow = this.accountsTable.getByRole('row').filter({ hasText: 'Checking' });
    this.savingsRow = this.accountsTable.getByRole('row').filter({ hasText: 'Savings' });
  } 
  toCents(balance: string): number {
	return Math.round(Number(balance.replace(/[$,]/g, '')) * 100);
}
  async gotoAccountsPage(): Promise<void> {
    await this.page.goto('/bank/accounts');
    await expect(this.page).toHaveURL(/\/bank\/accounts$/);
     
  }
  async getCheckingBalance(): Promise<number> {
    await expect(this.checkingRow).toHaveCount(1);
        await expect(this.savingsRow).toHaveCount(1);
         const checkingBalance = await this.checkingRow.getByRole('cell').nth(2).innerText();
        const savingsBalance = await this.savingsRow.getByRole('cell').nth(2).innerText();
       const balanceSum = this.toCents(checkingBalance) + this.toCents(savingsBalance); 
       
        return balanceSum;
}
}