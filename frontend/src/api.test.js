import { describe, expect, it } from 'vitest';

import { API_BASE_URL, api } from './api';

describe('api client', () => {
  it('uses a safe local default API base URL', () => {
    expect(API_BASE_URL).toBe('http://127.0.0.1:8000');
    expect(api.defaults.baseURL).toBe(API_BASE_URL);
  });
});
