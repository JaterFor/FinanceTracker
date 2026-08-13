import { expect, test } from '@playwright/test';
import { login } from './login';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('adds a transaction and deletes it', async ({ page }) => {
  const note = `E2E transaction ${Date.now()}`;

  await page.getByRole('link', { name: 'Добавить' }).click();
  await expect(page.getByRole('heading', { name: 'Новая транзакция' })).toBeVisible();

  await page.getByLabel('Сумма').fill('12.34');
  await page.locator('.category-badge').first().click();
  await page.getByLabel('Заметка').fill(note);
  await page.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByRole('heading', { name: 'Транзакции' })).toBeVisible();
  await expect(page.getByText('Транзакция добавлена')).toBeVisible();

  const row = page.locator('.transaction-row', { hasText: note });
  await expect(row).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await row.getByRole('button', { name: 'Удалить' }).click();

  await expect(row).not.toBeVisible();
  await expect(page.getByText('Транзакция удалена')).toBeVisible();
});
