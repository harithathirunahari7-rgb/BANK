import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.getByPlaceholder('Enter username');
  private readonly passwordInput = this.page.getByPlaceholder('Enter password');
  private readonly signInButton = this.page.getByRole('button', { name: 'Sign in to SecureBank' });

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/bank/login');
    await this.waitForPage();
    await expect(this.page).toHaveURL(/\/bank\/login$/);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.click(this.signInButton);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }
}