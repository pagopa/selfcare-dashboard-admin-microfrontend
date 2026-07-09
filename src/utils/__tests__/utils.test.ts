import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isPnpgOrImprese, getAppArea } from '../utils';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  isPagoPaUser: vi.fn(),
}));

import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';

const mockIsPagoPaUser = isPagoPaUser as ReturnType<typeof vi.fn>;

const setHostname = (hostname: string) => {
  vi.stubGlobal('location', { hostname });
};

beforeEach(() => {
  vi.unstubAllGlobals();
  mockIsPagoPaUser.mockReturnValue(false);
});

describe('isPnpgOrImprese', () => {
  it('returns true for pnpg. hostname', () => {
    setHostname('pnpg.selfcare.pagopa.it');
    expect(isPnpgOrImprese()).toBe(true);
  });

  it('returns true for imprese. hostname', () => {
    setHostname('imprese.selfcare.pagopa.it');
    expect(isPnpgOrImprese()).toBe(true);
  });

  it('returns false for a generic hostname', () => {
    setHostname('selfcare.pagopa.it');
    expect(isPnpgOrImprese()).toBe(false);
  });
});

describe('getAppArea', () => {
  it('returns "imprese" when hostname starts with pnpg.', () => {
    setHostname('pnpg.selfcare.pagopa.it');
    expect(getAppArea()).toBe('imprese');
  });

  it('returns "imprese" when hostname starts with imprese.', () => {
    setHostname('imprese.selfcare.pagopa.it');
    expect(getAppArea()).toBe('imprese');
  });

  it('returns "ar_backstage" when isPagoPaUser is true and hostname is generic', () => {
    setHostname('selfcare.pagopa.it');
    mockIsPagoPaUser.mockReturnValue(true);
    expect(getAppArea()).toBe('ar_backstage');
  });

  it('returns "area_riservata" when not pnpg/imprese and not PagoPa user', () => {
    setHostname('selfcare.pagopa.it');
    mockIsPagoPaUser.mockReturnValue(false);
    expect(getAppArea()).toBe('area_riservata');
  });
});
