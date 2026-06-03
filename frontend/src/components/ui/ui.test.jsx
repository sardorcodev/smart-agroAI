import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import DemoBadge from './DemoBadge';
import LoadingState from './LoadingState';
import Notice from './Notice';

describe('shared UI helpers', () => {
  it('renders error notices as alerts', () => {
    const html = renderToStaticMarkup(<Notice variant="error">Xatolik</Notice>);

    expect(html).toContain('role="alert"');
    expect(html).toContain('aria-live="assertive"');
    expect(html).toContain('Xatolik');
  });

  it('renders non-error notices as polite status messages', () => {
    const html = renderToStaticMarkup(<Notice variant="warning">Demo ogohlantirish</Notice>);

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('Demo ogohlantirish');
  });

  it('renders demo badge text accessibly', () => {
    const html = renderToStaticMarkup(<DemoBadge label="Demo/MVP" />);

    expect(html).toContain('Demo/MVP');
  });

  it('renders loading state as readable status text', () => {
    const html = renderToStaticMarkup(<LoadingState message="Sessiya tekshirilmoqda..." />);

    expect(html).toContain('role="status"');
    expect(html).toContain('Sessiya tekshirilmoqda...');
  });
});
