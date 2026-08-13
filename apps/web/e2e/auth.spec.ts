import { expect, test } from '@playwright/test';

const USERNAME = process.env.E2E_USERNAME ?? 'admin';
const PASSWORD = process.env.E2E_PASSWORD ?? 'admin';

test('logs in with valid credentials and lands on the transactions page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();

  await page.getByLabel('Логин').fill(USERNAME);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(page.getByRole('heading', { name: 'Транзакции' })).toBeVisible();
});

test('shows an error on invalid credentials', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Логин').fill(USERNAME);
  await page.getByLabel('Пароль').fill('definitely-wrong-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
});
