import { beforeEach, describe, expect, it, vi } from 'vitest';

// ── Mock API clients ──────────────────────────────────────────────────────────
vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getAllInstituionById: vi.fn(),
    getInstitution: vi.fn(),
    tokenExchangeAdmin: vi.fn(),
    getProducts: vi.fn(),
  },
}));
vi.mock('../../api/OnboardingApiClient', () => ({
  OnboardingApi: {
    fetchOnboardingRequest: vi.fn(),
    rejectOnboardingRequest: vi.fn(),
    approveOnboardingRequest: vi.fn(),
  },
}));
vi.mock('../../api/PartyRegistryProxyApiClient', () => ({
  PartyRegisrtyApi: {
    searchInstitutions: vi.fn(),
    searchOnboardings: vi.fn(),
  },
}));
vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  isPagoPaUser: vi.fn(),
}));

import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { DashboardApi } from '../../api/DashboardApiClient';
import { OnboardingApi } from '../../api/OnboardingApiClient';
import { PartyRegisrtyApi } from '../../api/PartyRegistryProxyApiClient';
import {
  fetchPartyDetailsService,
  getTokenExchangeAdminService
} from '../dashboardService';
import {
  approveOnboardingPspRequest,
  fetchOnboardingRequest,
  rejectOnboardingRequest,
} from '../onboardingRequestService';
import { searchInstitutionsService, searchOnboardingsService } from '../partyRegistryProxyService';
import { fetchProducts } from '../productService';

const mockIsPagoPaUser = isPagoPaUser as ReturnType<typeof vi.fn>;
const mockGetInstitution = DashboardApi.getInstitution as ReturnType<typeof vi.fn>;
const mockGetAllInstituionById = DashboardApi.getAllInstituionById as ReturnType<typeof vi.fn>;
const mockTokenExchangeAdmin = DashboardApi.tokenExchangeAdmin as ReturnType<typeof vi.fn>;
const mockGetProducts = DashboardApi.getProducts as ReturnType<typeof vi.fn>;
const mockFetchOnboarding = OnboardingApi.fetchOnboardingRequest as ReturnType<typeof vi.fn>;
const mockRejectOnboarding = OnboardingApi.rejectOnboardingRequest as ReturnType<typeof vi.fn>;
const mockApproveOnboarding = OnboardingApi.approveOnboardingRequest as ReturnType<typeof vi.fn>;
const mockSearchInstitutions = PartyRegisrtyApi.searchInstitutions as ReturnType<typeof vi.fn>;
const mockSearchOnboardings = PartyRegisrtyApi.searchOnboardings as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  // Default: not mock mode
  vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
  vi.stubEnv('VITE_API_MOCK_PRODUCTS', 'false');
  mockIsPagoPaUser.mockReturnValue(false);
});

// ── dashboardService ──────────────────────────────────────────────────────────
describe('dashboardService', () => {
  describe('fetchPartyDetailsService', () => {
    it('calls getInstitution and maps result when not PagoPa user and not mock mode', async () => {
      const mockInstitution = { id: 'inst-1', description: 'Test Inst' };
      mockGetInstitution.mockResolvedValue(mockInstitution);

      const result = await fetchPartyDetailsService('party-1');

      expect(mockGetInstitution).toHaveBeenCalledWith('party-1');
      expect(result).toBeDefined();
    });

    it('calls getAllInstituionById when isPagoPaUser is true', async () => {
      mockIsPagoPaUser.mockReturnValue(true);
      mockGetAllInstituionById.mockResolvedValue(null);

      const result = await fetchPartyDetailsService('party-2');

      expect(mockGetAllInstituionById).toHaveBeenCalledWith('party-2');
      expect(result).toBeNull();
    });

    it('returns mock party in mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'true');

      const result = await fetchPartyDetailsService('any-id');

      expect(mockGetInstitution).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getTokenExchangeAdminService', () => {
    it('delegates to DashboardApi.tokenExchangeAdmin in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      mockTokenExchangeAdmin.mockResolvedValue('https://bo.example.com');

      const result = await getTokenExchangeAdminService('inst-1', 'prod-1', 'test', 'it');

      expect(mockTokenExchangeAdmin).toHaveBeenCalledWith('inst-1', 'prod-1', 'test', 'it');
      expect(result).toBe('https://bo.example.com');
    });

    it('returns mocked token in mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'true');

      const result = await getTokenExchangeAdminService('inst-1', 'prod-1');

      expect(mockTokenExchangeAdmin).not.toHaveBeenCalled();
      expect(result).toBe('mocked-token');
    });
  });
});

// ── onboardingRequestService ──────────────────────────────────────────────────
describe('onboardingRequestService', () => {
  describe('fetchOnboardingRequest', () => {
    it('calls OnboardingApi in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      const mockResp = { tokenId: 'tok-1' };
      mockFetchOnboarding.mockResolvedValue(mockResp);

      const result = await fetchOnboardingRequest('tok-1');

      expect(mockFetchOnboarding).toHaveBeenCalledWith('tok-1');
      expect(result).toEqual(mockResp);
    });
  });

  describe('rejectOnboardingRequest', () => {
    it('calls OnboardingApi in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      const mockResp = { tokenId: 'tok-1' };
      mockRejectOnboarding.mockResolvedValue(mockResp);

      const result = await rejectOnboardingRequest('tok-1', 'reason');

      expect(mockRejectOnboarding).toHaveBeenCalledWith('tok-1');
      expect(result).toEqual(mockResp);
    });
  });

  describe('approveOnboardingPspRequest', () => {
    it('calls OnboardingApi in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      const mockResp = { tokenId: 'tok-2' };
      mockApproveOnboarding.mockResolvedValue(mockResp);

      const result = await approveOnboardingPspRequest('tok-2');

      expect(mockApproveOnboarding).toHaveBeenCalledWith('tok-2');
      expect(result).toEqual(mockResp);
    });
  });
});

// ── partyRegistryProxyService ─────────────────────────────────────────────────
describe('partyRegistryProxyService', () => {
  describe('searchInstitutionsService', () => {
    it('delegates to PartyRegisrtyApi in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      const mockResp = [{ id: 'inst-1' }];
      mockSearchInstitutions.mockResolvedValue(mockResp);

      const result = await searchInstitutionsService('test-query');

      expect(mockSearchInstitutions).toHaveBeenCalledWith('test-query');
      expect(result).toEqual(mockResp);
    });

    it('returns mock data in mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'true');

      const result = await searchInstitutionsService('anything');

      expect(mockSearchInstitutions).not.toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('searchOnboardingsService', () => {
    it('delegates to PartyRegisrtyApi in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_REQUEST_DATA', 'false');
      const mockResp = { items: [], total: 0 };
      mockSearchOnboardings.mockResolvedValue(mockResp);

      const result = await searchOnboardingsService('q', ['prod-1'], ['PA'], ['ACTIVE'], 0, 10);

      expect(mockSearchOnboardings).toHaveBeenCalledWith(
        'q',
        ['prod-1'],
        ['PA'],
        ['ACTIVE'],
        0,
        10,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toEqual(mockResp);
    });
  });
});

// ── productService ────────────────────────────────────────────────────────────
describe('productService', () => {
  describe('fetchProducts', () => {
    it('calls DashboardApi.getProducts and maps result in non-mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_PRODUCTS', 'false');
      mockGetProducts.mockResolvedValue([
        {
          id: 'prod-1',
          description: 'Product 1',
          logo: '',
          status: 'ACTIVE',
          title: 'P1',
          urlBO: 'https://bo.example.com',
          imageUrl: '',
          delegable: false,
          invoiceable: false,
        },
      ]);

      const result = await fetchProducts();

      expect(mockGetProducts).toHaveBeenCalled();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('prod-1');
    });

    it('returns empty array when API returns null', async () => {
      vi.stubEnv('VITE_API_MOCK_PRODUCTS', 'false');
      mockGetProducts.mockResolvedValue(null);

      const result = await fetchProducts();

      expect(result).toEqual([]);
    });

    it('returns mocked products in mock mode', async () => {
      vi.stubEnv('VITE_API_MOCK_PRODUCTS', 'true');

      const result = await fetchProducts();

      expect(mockGetProducts).not.toHaveBeenCalled();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
