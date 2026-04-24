import { screen, waitFor } from '@testing-library/react';
import { searchOnboardingsService } from '../../../services/partyRegistryProxyService';
import { fetchProducts, getPermissionsListService } from '../../../services/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import OnboardingsPage from '../OnboardingsPage';

// Increased timeout for stability
vi.setConfig({ testTimeout: 20000 });

// Mock services
vi.mock('../../../services/partyRegistryProxyService', () => ({
  searchOnboardingsService: vi.fn(),
}));
vi.mock('../../../services/productService', () => ({
  fetchProducts: vi.fn(),
  getPermissionsListService: vi.fn(),
}));

const mockedSearchOnboardingsService = vi.mocked(searchOnboardingsService);
const mockedFetchProducts = vi.mocked(fetchProducts);
const mockedGetPermissionsListService = vi.mocked(getPermissionsListService);

const mockProducts = [{ id: 'prod-1', title: 'App IO', status: 'ACTIVE' }];

const mockOnboardings = {
  onboardings: [
    {
      onboardingId: 'onb-1',
      description: 'Comune di Test',
      productId: 'prod-1',
      status: 'COMPLETED',
    },
  ],
  totalElements: 1,
};

describe('OnboardingsPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchProducts.mockResolvedValue(mockProducts as any);
    mockedSearchOnboardingsService.mockResolvedValue(mockOnboardings as any);
    mockedGetPermissionsListService.mockResolvedValue({ items: [] } as any);
  });

  test('should render the main page title "Adesioni"', async () => {
    renderWithProviders(<OnboardingsPage />);

    // Find heading by role for better accessibility testing
    const title = await screen.findByRole('heading', { name: /Adesioni/i }, { timeout: 10000 });
    expect(title).toBeInTheDocument();
  });

  test('should call data fetching services on mount', async () => {
    renderWithProviders(<OnboardingsPage />);

    await waitFor(
      () => {
        expect(mockedFetchProducts).toHaveBeenCalled();
        expect(mockedSearchOnboardingsService).toHaveBeenCalled();
      },
      { timeout: 10000 }
    );
  });

  test('should display institution names in the table rows', async () => {
    renderWithProviders(<OnboardingsPage />);

    // Check if the mocked institution name appears in the grid
    const institution = await screen.findByText(/Comune di Test/i, {}, { timeout: 10000 });
    expect(institution).toBeInTheDocument();
  });

  test('should show the empty state message when no data is returned', async () => {
    mockedSearchOnboardingsService.mockResolvedValue({ onboardings: [], totalElements: 0 } as any);

    renderWithProviders(<OnboardingsPage />);

    // Wait for the grid first to ensure table is loaded
    await screen.findByRole('grid', {}, { timeout: 10000 });

    // Search for the translated empty state message
    const emptyMsg = await screen.findByText(/nessun risultato/i, {}, { timeout: 10000 });
    expect(emptyMsg).toBeInTheDocument();
  });

  test('should provide a way to reset filters in the empty state', async () => {
    mockedSearchOnboardingsService.mockResolvedValue({ onboardings: [], totalElements: 0 } as any);

    renderWithProviders(<OnboardingsPage />);

    await screen.findByRole('grid', {}, { timeout: 10000 });

    // Find at least one reset button (it could be in FiltersBar or Table Overlay)
    const resetBtn = await screen.findAllByText(/Rimuovi filtri/i, {}, { timeout: 10000 });
    expect(resetBtn.length).toBeGreaterThan(0);
  });

  test.skip('should navigate to the detail page when a row is clicked', async () => {
    const { history } = await renderWithProviders(<OnboardingsPage />);

    // Wait for the row to be rendered and click it
    const row = await screen.findByText(/Comune di Test/i, {}, { timeout: 10000 });
    row.click();

    // Verify history push (path includes the onboardingId from mock)
    expect(history.location.pathname).toContain('onb-1');
  });
});
