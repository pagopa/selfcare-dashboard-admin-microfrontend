import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../../utils/env', () => ({
  ENV: { ALLOWED_PREFIXES: 'prod-,other-' },
}));

import { isProductAllowed } from '../utils';

describe('adminPage utils', () => {
  it('isProductAllowed matches allowed prefixes', () => {
    expect(isProductAllowed('prod-interop')).toBe(true);
    expect(isProductAllowed('other-service')).toBe(true);
    expect(isProductAllowed('unknown')).toBe(false);
  });
});
