import { expect, test } from '@playwright/test';
import { login } from './login';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('creates a category and filters the picker by transaction type', async ({ page }) => {
  const categoryName = `E2E Income ${Date.now()}`;

  await page.getByRole('link', { name: 'Добавить' }).click();
  await expect(page.getByRole('heading', { name: 'Новая транзакция' })).toBeVisible();
  await page.getByRole('link', { name: 'Добавить' }).click();
  await expect(page.getByRole('heading', { name: 'Новая категория' })).toBeVisible();

  await page.getByLabel('Название').fill(categoryName);
  await page.getByLabel('Тип').selectOption('income');
  await page.locator('.icon-swatch').first().click();
  await page.locator('.color-swatch').nth(2).click();
  await page.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByText('Категория добавлена')).toBeVisible();

  // Back on /add: still on expense by default, the new income category must not show.
  await expect(page.getByText(categoryName)).not.toBeVisible();

  await page.getByLabel('Тип').selectOption('income');
  await expect(page.getByText(categoryName)).toBeVisible();
});
