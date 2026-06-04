import { expect, test } from '@playwright/test';
import { expectNoFatalConsoleErrors } from './helpers/apiMocks';

test('public landing renders core branding and content', async ({ page }) => {
  const assertNoFatalConsoleErrors = expectNoFatalConsoleErrors(page);

  await page.goto('/');

  await expect(page.getByText(/SMART AGRO/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Tizimga kirish/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Nega aynan Smart Agro/i })).toBeVisible();
  await expect(page.getByText(/Ekin Tavsiyasi/i)).toBeVisible();

  await assertNoFatalConsoleErrors();
});
