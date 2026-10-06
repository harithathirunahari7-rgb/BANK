import {Page, Locator, expect} from '@playwright/test';


export class DashboardPage    {
    private readonly page: Page;
  private readonly netWorthCard: Locator;
  
  constructor(page: Page) {
    
    this.page = page;
    this.netWorthCard = page.locator('div.rounded-xl.border').filter({
      has: page.getByText('Total Net Worth', {exact: true})
    });
   
}
toCents(balance: string): number {
	return Math.round(Number(balance.replace(/[$,]/g, '')) * 100);
}
async gotoDashboardPage( ){ 
    
    await this.page.goto('/bank/dashboard');
    await expect(this.page).toHaveURL(/\/bank\/dashboard$/);    
}
async getTotalBalance(): Promise<number> {
    const totalBalance = await this.netWorthCard.getByText(/^\$[\d,]+\.\d{2}$/).innerText();
    const totalNetWorth =  this.toCents(totalBalance);
    return totalNetWorth;
}
}