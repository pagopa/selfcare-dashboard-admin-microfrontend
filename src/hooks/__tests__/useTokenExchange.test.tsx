import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateUrlBO, useTokenExchange } from '../useTokenExchange';

// ── mock heavy deps ──────────────────────────────────────────────────────────
const addErrorMock = vi.fn();
const setLoadingMock = vi.fn();
const getTokenExchangeAdminServiceMock = vi.fn();
const trackEventMock = vi.fn();

vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => ({
  default: () => addErrorMock,
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  default: () => setLoadingMock,
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
  trackEvent: (...args: any[]) => trackEventMock(...args),
}));

vi.mock('../../services/dashboardService', () => ({
  getTokenExchangeAdminService: (...args: any[]) =>
    getTokenExchangeAdminServiceMock(...args),
}));

vi.mock('../../utils/utils', () => ({
  getAppArea: () => 'admin',
}));

// ── helpers ──────────────────────────────────────────────────────────────────
const mockProduct = (overrides: any = {}) => ({
  id: 'prod-io',
  urlBO: 'https://backoffice.example.com/path',
  backOfficeEnvironmentConfigurations: undefined as any,
  ...overrides,
});

const mockParty = () => ({ partyId: 'party-123' });

// ── validateUrlBO ─────────────────────────────────────────────────────────────
describe('validateUrlBO', () => {
  it('returns the hostname for a valid https URL', () => {
    expect(validateUrlBO('https://backoffice.example.com/some/path')).toBe(
      'backoffice.example.com'
    );
  });

  it('returns the hostname for a valid http URL', () => {
    expect(validateUrlBO('http://api.test.it')).toBe('api.test.it');
  });

  it('returns an Error when the URL has no http/https scheme', () => {
    const result = validateUrlBO('not-a-url');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain('Cannot extract hostname from URL');
  });

  it('returns an Error for an empty string', () => {
    expect(validateUrlBO('')).toBeInstanceOf(Error);
  });
});

// ── useTokenExchange ─────────────────────────────────────────────────────────
describe('useTokenExchange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTokenExchangeAdminServiceMock.mockResolvedValue('https://redirected.example.com');
    // invoke the redirect callback immediately so window.location.assign is called
    trackEventMock.mockImplementation((_name: string, _props: any, cb?: () => void) => cb?.());
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: vi.fn() },
    });
  });

  it('adds a validation error and skips service call when urlBO is invalid', async () => {
    const { result } = renderHook(() => useTokenExchange());
    const product = mockProduct({ urlBO: 'not-a-url' });

    await act(async () => {
      await result.current.invokeProductBo(product, mockParty() as any);
    });

    expect(addErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: `ValidationUrlError-${product.id}` })
    );
    expect(getTokenExchangeAdminServiceMock).not.toHaveBeenCalled();
  });

  it('calls service without environment when none is provided', async () => {
    const { result } = renderHook(() => useTokenExchange());

    await act(async () => {
      await result.current.invokeProductBo(mockProduct(), mockParty() as any);
    });

    expect(setLoadingMock).toHaveBeenCalledWith(true);
    expect(getTokenExchangeAdminServiceMock).toHaveBeenCalledWith(
      'party-123', 'prod-io', undefined, undefined
    );
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it('calls service with selectedEnvironment and lang when provided', async () => {
    const { result } = renderHook(() => useTokenExchange());
    const product = mockProduct({
      backOfficeEnvironmentConfigurations: [
        { environment: 'coll', url: 'https://coll.example.com' },
      ],
    });

    await act(async () => {
      await result.current.invokeProductBo(product, mockParty() as any, 'coll', 'it');
    });

    expect(getTokenExchangeAdminServiceMock).toHaveBeenCalledWith(
      'party-123', 'prod-io', 'coll', 'it'
    );
  });

  it('dispatches a TokenExchangeError and resets loading when service rejects (no environment)', async () => {
    getTokenExchangeAdminServiceMock.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useTokenExchange());

    await act(async () => {
      await result.current.invokeProductBo(mockProduct(), mockParty() as any);
    });

    expect(addErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: `TokenExchangeError-prod-io` })
    );
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it('dispatches a TokenExchangeError and resets loading when service rejects (with environment)', async () => {
    getTokenExchangeAdminServiceMock.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useTokenExchange());
    const product = mockProduct({
      backOfficeEnvironmentConfigurations: [
        { environment: 'coll', url: 'https://coll.example.com' },
      ],
    });

    await act(async () => {
      await result.current.invokeProductBo(product, mockParty() as any, 'coll');
    });

    expect(addErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: `TokenExchangeError-prod-io` })
    );
    expect(setLoadingMock).toHaveBeenCalledWith(false);
  });

  it('uses institutionId when selectedParty has onboardingId shape', async () => {
    const { result } = renderHook(() => useTokenExchange());
    const party = { onboardingId: 'onb-1', institutionId: 'inst-456' };

    await act(async () => {
      await result.current.invokeProductBo(mockProduct(), party as any);
    });

    expect(getTokenExchangeAdminServiceMock).toHaveBeenCalledWith(
      'inst-456', 'prod-io', undefined, undefined
    );
  });

  it('uses empty string as partyId when selectedParty is null', async () => {
    const { result } = renderHook(() => useTokenExchange());

    await act(async () => {
      await result.current.invokeProductBo(mockProduct(), null);
    });

    expect(getTokenExchangeAdminServiceMock).toHaveBeenCalledWith(
      '', 'prod-io', undefined, undefined
    );
  });
});
