import { expect, test } from '@playwright/test';
import { mockSession, restoreSession } from './helpers/apiMocks';

test('mobile authenticated navigation can switch core app areas without horizontal overflow', async ({ page }) => {
  await restoreSession(page);
  await mockSession(page);

  await page.goto('/');

  const mobileMenu = page.getByLabel(/Mobil menyu/i);
  await expect(mobileMenu).toBeVisible();
  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();

  await mobileMenu.selectOption('market');
  await expect(page.getByText(/Smart Agro Market/i)).toBeVisible();

  await mobileMenu.selectOption('support');
  await expect(page.getByRole('heading', { name: /Qanday yordam bera olamiz/i })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
