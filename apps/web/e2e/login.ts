import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

const USERNAME = process.env.E2E_USERNAME ?? 'admin';
const PASSWORD = process.env.E2E_PASSWORD ?? 'admin';

export async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByLabel('Логин').fill(USERNAME);
  await page.getByLabel('Пароль').fill(PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByRole('heading', { name: 'Транзакции' })).toBeVisible();
}
