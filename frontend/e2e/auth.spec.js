import { expect, test } from '@playwright/test';
import { TEST_TOKEN, mockAuthSuccess, mockSession, restoreSession } from './helpers/apiMocks';

test('login flow reaches authenticated dashboard and logout returns to public state', async ({ page }) => {
  await mockAuthSuccess(page);

  await page.goto('/');
  await page.getByRole('button', { name: /Tizimga kirish/i }).click();

  await expect(page.getByRole('heading', { name: /Tizimga xush kelibsiz/i })).toBeVisible();
  await page.getByLabel(/Elektron pochta/i).fill('test@smartagro.local');
  await page.getByLabel(/Maxfiy Parol/i).fill('password123');
  await page.getByRole('button', { name: /Tizimga Kirish/i }).click();

  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();
  await expect(page.getByText('Test Fermer')).toBeVisible();
  await expect(page.getByText(/fermer/i).first()).toBeVisible();

  await page.getByRole('button', { name: /Tizimdan chiqish/i }).click();
  await expect(page.getByRole('button', { name: /Tizimga kirish/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeHidden();
});

test('stored token restores the authenticated session', async ({ page }) => {
  await restoreSession(page);
  await mockSession(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();
  await expect(page.getByText('Test Fermer')).toBeVisible();
});

test('stale stored token is cleared and shows a friendly auth notice', async ({ page }) => {
  await restoreSession(page, 'stale-token');
  await mockSession(page, { status: 401 });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Tizimga xush kelibsiz/i })).toBeVisible();
  await expect(page.getByRole('status')).toContainText(/Sessiya muddati tugagan/i);
  await expect(page.getByLabel(/Elektron pochta/i)).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem('smart_agro_access_token'))).resolves.toBeNull();
});

test('auth form exposes keyboard-reachable controls and alert errors', async ({ page }) => {
  await page.route('**/api/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ detail: "Email yoki parol noto'g'ri." }),
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: /Tizimga kirish/i }).focus();
  await expect(page.getByRole('button', { name: /Tizimga kirish/i })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByLabel(/Elektron pochta/i)).toBeVisible();
  await page.getByLabel(/Elektron pochta/i).fill('wrong@smartagro.local');
  await page.getByLabel(/Maxfiy Parol/i).fill('badpass123');
  await page.getByRole('button', { name: /Tizimga Kirish/i }).click();

  await expect(page.getByRole('alert')).toContainText(/Email yoki parol/i);
  await expect(page.getByLabel(/Elektron pochta/i)).toBeVisible();
  await expect(page.getByLabel(/Maxfiy Parol/i)).toBeVisible();
});

test('login stores the MVP access token', async ({ page }) => {
  await mockAuthSuccess(page);

  await page.goto('/');
  await page.getByRole('button', { name: /Tizimga kirish/i }).click();
  await page.getByLabel(/Elektron pochta/i).fill('test@smartagro.local');
  await page.getByLabel(/Maxfiy Parol/i).fill('password123');
  await page.getByRole('button', { name: /Tizimga Kirish/i }).click();

  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();
  await expect(page.evaluate(() => window.localStorage.getItem('smart_agro_access_token'))).resolves.toBe(TEST_TOKEN);
});
