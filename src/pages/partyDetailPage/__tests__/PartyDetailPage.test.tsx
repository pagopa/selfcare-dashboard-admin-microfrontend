import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import PartyDetailPage from '../PartyDetailPage';
import { fetchPartyDetailsService } from '../../../services/dashboardService';
import { mockedParties } from '../../../services/__mocks__/dashboardService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';

const { mockTrackEvent, mockAddError, mockHasPermission } = vi.hoisted(() => ({
  mockTrackEvent: vi.fn(),
  mockAddError: vi.fn(),
  mockHasPermission: vi.fn().mockReturnValue(true),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
  trackEvent: mockTrackEvent,
}));

vi.mock('@pagopa/selfcare-common-frontend', async () => {
  const actual = await vi.importActual('@pagopa/selfcare-common-frontend');
  return {
    ...actual,
    useErrorDispatcher: () => mockAddError,
    usePermissions: () => ({
      hasPermission: mockHasPermission,
    }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ partyId: '1' }),
  };
});

const mockProducts = [
  { id: 'prod-pagopa', title: 'Piattaforma pagoPA', status: 'ACTIVE' },
  { id: 'prod-pn', title: 'Piattaforma Notifiche', status: 'ACTIVE' },
];
vi.mock('../../../hooks/useFetchProducts', () => ({
  useFetchProducts: () => ({ products: mockProducts }),
}));

vi.mock('../../../services/dashboardService', () => ({
  fetchPartyDetailsService: vi.fn(),
}));

const mockedFetchPartyDetailsService = vi.mocked(fetchPartyDetailsService);

describe('PartyDetailPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render and load party details successfully', async () => {
    mockedFetchPartyDetailsService.mockResolvedValue(mockedParties[0]);
    mockHasPermission.mockReturnValue(true);

    await renderWithProviders(<PartyDetailPage />);

    // Wait for the party details to be fetched and rendered
    await waitFor(() => {
      expect(mockedFetchPartyDetailsService).toHaveBeenCalledWith('1');
    });

    expect(screen.getByText('Comune di Bari')).toBeInTheDocument();
    expect(screen.getByText('111111111111')).toBeInTheDocument();
    expect(screen.getByText('comune.bari@pec.it')).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText('Prodotto')).toBeInTheDocument();
    expect(screen.getByText('Data di adesione')).toBeInTheDocument();
    
    // Check products in the table
    expect(screen.getByText('Piattaforma pagoPA')).toBeInTheDocument();
    expect(screen.getByText('Piattaforma Notifiche')).toBeInTheDocument();
  });

  it('should dispatch an error if fetchPartyDetailsService fails', async () => {
    const apiError = new Error('Fetch details error');
    mockedFetchPartyDetailsService.mockRejectedValue(apiError);

    await renderWithProviders(<PartyDetailPage />);

    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith({
        id: 'fetchPartyDetails-undefined-api-error',
        blocking: false,
        techDescription: 'Fetch party details for institution id: undefined failed',
        toNotify: false,
        error: apiError,
      });
    });
  });

  it('should handle back-office click correctly', async () => {
    mockedFetchPartyDetailsService.mockResolvedValue(mockedParties[0]);
    mockHasPermission.mockReturnValue(true);

    await renderWithProviders(<PartyDetailPage />);

    // Wait for the buttons to be rendered
    const backofficeBtns = await screen.findAllByRole('button', { name: /Vedi Back-office/i });
    expect(backofficeBtns.length).toBeGreaterThan(0);

    // Click on the first back-office button
    fireEvent.click(backofficeBtns[0]);

    expect(mockTrackEvent).toHaveBeenCalledWith('BACKSTAGE_BACK_OFFICE_CLICK', {
      product_id: 'prod-pagopa',
    });
  });

  it('should show view account detail button and navigate when user has view account page permission and is not back-office admin', async () => {
    mockedFetchPartyDetailsService.mockResolvedValue(mockedParties[0]);
    mockHasPermission.mockImplementation((_productId: string, action: string) => {
      if (action === Actions.AccessProductBackofficeAdmin) {
        return false;
      }
      if (action === Actions.ViewAccountPage) {
        return true;
      }
      return false;
    });

    const { history } = await renderWithProviders(<PartyDetailPage />);

    // Wait for the buttons to be rendered
    const accountPageBtns = await screen.findAllByRole('button', { name: /Dettaglio adesione/i });
    expect(accountPageBtns.length).toBeGreaterThan(0);

    // Click on the first button
    fireEvent.click(accountPageBtns[0]);

    // Verify history push has correct path
    expect(history.location.pathname).toContain('/dashboard/admin/onboarding');
  });
});
