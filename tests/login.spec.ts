import { expect, test } from '../fixtures/base.fixture';
import testData from '../testdata/loginCredentils.json';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.expectLoaded();
  });
  test.skip('login page exposes the expected controls', async ({ loginPage }) => {
    await loginPage.expectLoaded();
  });


  for (const data of testData) {
   
    test(`${data.username} can sign in (${data.description})`, async ({ page, loginPage }) => {
     // await loginPage.open();
      await loginPage.signIn(data.username, data.password);
       if(data.description === 'Locked account') 
      await expect(page).toHaveURL(/\/bank\/login$/)
    
    else{
      await expect(page).toHaveURL(/\/bank\/dashboard$/);
    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
  }
 });
  }
});