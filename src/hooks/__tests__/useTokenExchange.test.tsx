import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import { validateUrlBO, useTokenExchange } from '../useTokenExchange';

// ── Mock external dependencies ──────────────────────────────────────────────
const mockAddError = vi.fn();
const mockSetLoading = vi.fn();
const mockTrackEvent = vi.fn((_event: any, _props: any, callback?: () => void) => callback?.());

vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => ({
  default: () => mockAddError,
}));
vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useLoading', () => ({
  default: () => mockSetLoading,
}));
vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
  trackEvent: (event: any, props: any, callback?: () => void) => mockTrackEvent(event, props, callback),
}));
vi.mock('../../services/dashboardService', () => ({
  getTokenExchangeAdminService: vi.fn(),
}));
vi.mock('../../utils/utils', () => ({
  getAppArea: () => 'area_riservata',
}));

import { getTokenExchangeAdminService } from '../../services/dashboardService';
const mockGetTokenExchange = getTokenExchangeAdminService as ReturnType<typeof vi.fn>;

// ── Hook wrapper — v12 compatible substitute for renderHook ──────────────────
type HookRef = ReturnType<typeof useTokenExchange>;

const HookWrapper = React.forwardRef<HookRef>((_props, ref) => {
  const hook = useTokenExchange();
  React.useImperativeHandle(ref, () => hook, [hook]);
  return null;
});
HookWrapper.displayName = 'HookWrapper';

const renderUseTokenExchange = (): React.RefObject<HookRef> => {
  const ref = React.createRef<HookRef>();
  render(<HookWrapper ref={ref} />);
  return ref;
};

// ── Shared fixtures ──────────────────────────────────────────────────────────
const baseProduct = {
  id: 'prod-test',
  urlBO: 'https://backoffice.example.com/path',
  description: '',
  logo: '',
  title: '',
  status: 'ACTIVE' as any,
  imageUrl: '',
  delegable: false,
  invoiceable: false,
};

const baseParty = { partyId: 'party-123' } as any;

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('location', { assign: vi.fn(), hostname: 'selfcare.pagopa.it' });
});

// ── validateUrlBO (pure function) ────────────────────────────────────────────
describe('validateUrlBO', () => {
  it('returns the hostname for a valid http URL', () => {
    expect(validateUrlBO('http://example.com/path')).toBe('example.com');
  });

  it('returns the hostname for a valid https URL', () => {
    expect(validateUrlBO('https://backoffice.selfcare.it/test')).toBe('backoffice.selfcare.it');
  });

  it('returns an Error for an invalid URL without scheme', () => {
    const result = validateUrlBO('not-a-url');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toContain('Cannot extract hostname from URL');
  });

  it('returns an Error for an empty string', () => {
    const result = validateUrlBO('');
    expect(result).toBeInstanceOf(Error);
  });
});

// ── useTokenExchange hook ────────────────────────────────────────────────────
describe('useTokenExchange — invokeProductBo', () => {
  it('calls addError and returns early when urlBO is invalid', async () => {
    const product = { ...baseProduct, urlBO: 'bad-url' };
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(product, baseParty);
    });

    expect(mockAddError).toHaveBeenCalledWith(
      expect.objectContaining({ id: `ValidationUrlError-${product.id}` })
    );
    expect(mockGetTokenExchange).not.toHaveBeenCalled();
  });

  it('calls getTokenExchangeAdminService without environment and tracks event on success', async () => {
    mockGetTokenExchange.mockResolvedValue('https://product-bo.example.com');
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(baseProduct, baseParty);
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockGetTokenExchange).toHaveBeenCalledWith('party-123', 'prod-test', undefined, undefined);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'DASHBOARD_OPEN_PRODUCT',
      expect.objectContaining({ product_id: 'prod-test', target: 'prod' }),
      expect.any(Function)
    );
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('calls getTokenExchangeAdminService with selectedEnvironment when provided', async () => {
    mockGetTokenExchange.mockResolvedValue('https://product-bo.example.com');
    const product = {
      ...baseProduct,
      backOfficeEnvironmentConfigurations: [
        { environment: 'test', url: 'https://test-bo.example.com' },
      ],
    };
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(product, baseParty, 'test', 'it');
    });

    expect(mockGetTokenExchange).toHaveBeenCalledWith('party-123', 'prod-test', 'test', 'it');
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'DASHBOARD_OPEN_PRODUCT',
      expect.objectContaining({ target: 'test' }),
      expect.any(Function)
    );
  });

  it('calls addError when getTokenExchangeAdminService rejects', async () => {
    mockGetTokenExchange.mockRejectedValue(new Error('network error'));
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(baseProduct, baseParty);
    });

    expect(mockAddError).toHaveBeenCalledWith(
      expect.objectContaining({ id: `TokenExchangeError-${baseProduct.id}` })
    );
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('derives partyId from institutionId when party has onboardingId', async () => {
    mockGetTokenExchange.mockResolvedValue('https://product-bo.example.com');
    const onboardingParty = { onboardingId: 'onb-1', institutionId: 'inst-456' } as any;
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(baseProduct, onboardingParty);
    });

    expect(mockGetTokenExchange).toHaveBeenCalledWith('inst-456', 'prod-test', undefined, undefined);
  });

  it('uses empty string as partyId when selectedParty is null', async () => {
    mockGetTokenExchange.mockResolvedValue('https://product-bo.example.com');
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(baseProduct, null);
    });

    expect(mockGetTokenExchange).toHaveBeenCalledWith('', 'prod-test', undefined, undefined);
  });

  it('uses selectedEnvironmentUrl from backOfficeEnvironmentConfigurations when available', async () => {
    // If the env URL is invalid the error path fires — proving that branch was used
    const product = {
      ...baseProduct,
      urlBO: 'https://valid-bo.example.com',
      backOfficeEnvironmentConfigurations: [
        { environment: 'staging', url: 'bad-url' },
      ],
    };
    const hook = renderUseTokenExchange();

    await act(async () => {
      await hook.current!.invokeProductBo(product, baseParty, 'staging');
    });

    expect(mockAddError).toHaveBeenCalledWith(
      expect.objectContaining({ id: `ValidationUrlError-${product.id}` })
    );
  });
});
