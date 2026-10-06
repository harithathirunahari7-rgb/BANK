import { expect, type Locator, type Page } from '@playwright/test';

export class RecentTransactionsPage {
  private readonly widget: Locator;
  private readonly table: Locator;
  private readonly transactionRows: Locator;

  constructor(page: Page) {
    this.widget = page.getByRole('region', { name: 'Recent transactions' });
    this.table = this.widget.getByRole('table', { name: 'Recent transactions' });
    this.transactionRows = this.table.locator('tbody tr');
  }

  async expectAtMostFiveTransactions(): Promise<void> {
    await expect(this.widget).toBeVisible();
    await expect(this.table).toBeVisible();
    expect(await this.transactionRows.count()).toBeLessThanOrEqual(5);
  }

  async expectSortedByDateDescending(): Promise<void> {
    const rowCount = await this.transactionRows.count();
    const timestamps = await Promise.all(
      Array.from({ length: rowCount }, async (_, index) => {
        const dateText = await this.transactionRows.nth(index).getByRole('cell').first().innerText();
        const timestamp = Date.parse(dateText);
        expect(Number.isNaN(timestamp), `Unparseable transaction date: ${dateText}`).toBe(false);
        return timestamp;
      })
    );

    expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first));
  }
}