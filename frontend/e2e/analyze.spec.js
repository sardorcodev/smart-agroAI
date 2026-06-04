import { expect, test } from '@playwright/test';
import { denyBrowserGeolocation, mockAnalyzeSuccess, mockSession, restoreSession } from './helpers/apiMocks';

test('authenticated user can run analysis with mocked backend results', async ({ page }) => {
  await restoreSession(page);
  await denyBrowserGeolocation(page);
  await mockSession(page);
  await mockAnalyzeSuccess(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();
  await page.getByLabel(/^Azot/i).fill('22');
  await page.getByLabel(/^Fosfor/i).fill('70');
  await page.getByLabel(/^Kaliy/i).fill('65');
  await page.getByLabel(/^pH darajasi/i).fill('6.7');
  await page.getByLabel(/^Latitude/i).fill('38.861');
  await page.getByLabel(/^Longitude/i).fill('67.93');

  const analyzeRequest = page.waitForRequest('**/api/analyze');
  await page.getByRole('button', { name: /AI Tahlilni Boshlash/i }).click();
  const request = await analyzeRequest;
  expect(request.postDataJSON()).toMatchObject({
    n: 22,
    p: 70,
    k: 65,
    ph: 6.7,
    lat: 38.861,
    lon: 67.93,
  });

  await expect(page.getByText(/AI Tavsiya Ekin/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Paxta/i })).toBeVisible();
  await expect(page.getByText(/AI Ehtimollik Tahlili/i)).toBeVisible();
  await expect(page.getByText(/Makkajoxori/i)).toBeVisible();
  await expect(page.getByText(/Weather data is mocked/i)).toBeVisible();
});

test('manual/demo location fallback enables analysis without browser geolocation', async ({ page }) => {
  await restoreSession(page);
  await denyBrowserGeolocation(page);
  await mockSession(page);
  await mockAnalyzeSuccess(page);

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Dala Boshqaruv Paneli/i })).toBeVisible();
  await page.getByLabel(/^Latitude/i).fill('');
  await page.getByLabel(/^Longitude/i).fill('');
  await expect(page.getByRole('button', { name: /Joylashuv kiriting/i })).toBeDisabled();
  await page.getByRole('button', { name: /Demo koordinatalardan foydalanish/i }).click();
  await expect(page.getByLabel(/^Latitude/i)).toHaveValue('38.861');
  await expect(page.getByLabel(/^Longitude/i)).toHaveValue('67.93');
  await expect(page.getByRole('button', { name: /AI Tahlilni Boshlash/i })).toBeEnabled();
});
