import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TOKEN_STORAGE_KEY = 'smart_agro_access_token';

const createLocalStorageMock = () => {
  const store = new Map();
  return {
    getItem: vi.fn((key) => store.get(key) ?? null),
    setItem: vi.fn((key, value) => store.set(key, value)),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  };
};

describe('api client', () => {
  beforeEach(() => {
    vi.resetModules();
    globalThis.localStorage = createLocalStorageMock();
  });

  afterEach(() => {
    delete globalThis.localStorage;
    vi.restoreAllMocks();
  });

  it('uses a safe local default API base URL', async () => {
    const { API_BASE_URL, api } = await import('./api');

    expect(API_BASE_URL).toBe('http://127.0.0.1:8000');
    expect(api.defaults.baseURL).toBe(API_BASE_URL);
  });

  it('can set, read, and clear the bearer token', async () => {
    const { api, clearAuthToken, getStoredToken, setAuthToken } = await import('./api');

    setAuthToken('test-token');
    expect(getStoredToken()).toBe('test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(TOKEN_STORAGE_KEY, 'test-token');
    expect(api.defaults.headers.common.Authorization).toBe('Bearer test-token');

    clearAuthToken();
    expect(getStoredToken()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith(TOKEN_STORAGE_KEY);
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });

  it('restores the bearer header from local storage on module load', async () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'stored-token');

    const { api } = await import('./api');

    expect(api.defaults.headers.common.Authorization).toBe('Bearer stored-token');
  });

  it('fetches the current user through /api/me', async () => {
    const { api, fetchCurrentUser } = await import('./api');
    const expectedUser = { id: 1, fullname: 'Test User', email: 'test@example.com', role: 'fermer' };

    api.defaults.adapter = async (config) => {
      expect(config.url).toBe('/api/me');
      expect(config.skipAuthFailureHandler).toBe(true);
      return {
        data: { status: 'success', user: expectedUser },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    await expect(fetchCurrentUser()).resolves.toEqual(expectedUser);
  });

  it('formats backend validation errors as bounded user messages', async () => {
    const { formatApiError } = await import('./api');

    const message = formatApiError({
      response: {
        data: {
          detail: [{ loc: ['body', 'ph'], msg: 'Input should be less than or equal to 14' }],
        },
      },
    });

    expect(message).toBe('Kiritilgan "ph" qiymatini tekshiring.');
  });

  it('does not expose oversized backend details in API error messages', async () => {
    const { formatApiError } = await import('./api');
    const longDetail = 'x'.repeat(300);

    expect(formatApiError({ response: { data: { detail: longDetail } } }, 'Safe fallback')).toBe('Safe fallback');
  });

  it('clears stale auth state on normal 401 responses', async () => {
    const { api, getStoredToken, setAuthFailureHandler, setAuthToken } = await import('./api');
    const onAuthFailure = vi.fn();

    setAuthToken('expired-token');
    setAuthFailureHandler(onAuthFailure);
    api.defaults.adapter = async (config) => Promise.reject({
      response: { status: 401 },
      config,
    });

    await expect(api.get('/api/analyze')).rejects.toMatchObject({ response: { status: 401 } });
    expect(getStoredToken()).toBeNull();
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
    expect(onAuthFailure).toHaveBeenCalledOnce();
  });
});
