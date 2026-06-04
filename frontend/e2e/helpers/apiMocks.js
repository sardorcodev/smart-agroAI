export const TEST_USER = {
  id: 1,
  fullname: 'Test Fermer',
  email: 'test@smartagro.local',
  role: 'fermer',
};

export const TEST_TOKEN = 'mock-smart-agro-token';

export const ANALYZE_RESPONSE = {
  recommended_crop: 'Paxta',
  top_predictions: [
    { crop: 'Paxta', probability: 87 },
    { crop: 'Makkajoxori', probability: 9 },
    { crop: 'Bugdoy', probability: 4 },
  ],
  top_3_recommendations: [
    { crop: 'Paxta', probability: 87 },
    { crop: 'Makkajoxori', probability: 9 },
    { crop: 'Bugdoy', probability: 4 },
  ],
  irrigation: {
    water_needed_liters: 120,
    status: 'recommended',
  },
  weather_summary: {
    temp: 29,
    rain: 4,
    fallback_used: true,
  },
  weather: {
    temp: 29,
    rain: 4,
  },
  model_status: 'loaded',
  inference_mode: 'mocked-e2e',
  warnings: ['Weather data is mocked for browser QA.'],
};

export const mockAuthSuccess = async (page, user = TEST_USER) => {
  await page.route('**/api/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: TEST_TOKEN,
        token_type: 'bearer',
        user,
      }),
    });
  });
};

export const mockSession = async (page, { user = TEST_USER, status = 200 } = {}) => {
  await page.route('**/api/me', async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(
        status === 200
          ? { status: 'success', user }
          : { detail: 'Invalid or expired token' },
      ),
    });
  });
};

export const mockAnalyzeSuccess = async (page, response = ANALYZE_RESPONSE) => {
  await page.route('**/api/analyze', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
};

export const expectNoFatalConsoleErrors = (page) => {
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  return async () => {
    const fatalErrors = errors.filter((message) => (
      !message.includes('Failed to load resource') &&
      !message.includes('favicon')
    ));
    if (fatalErrors.length > 0) {
      throw new Error(`Unexpected console errors:\n${fatalErrors.join('\n')}`);
    }
  };
};

export const restoreSession = async (page, token = TEST_TOKEN) => {
  await page.addInitScript((storedToken) => {
    window.localStorage.setItem('smart_agro_access_token', storedToken);
  }, token);
};

export const denyBrowserGeolocation = async (page) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (_success, error) => {
          error?.({ code: 1, PERMISSION_DENIED: 1 });
        },
      },
    });
  });
};
