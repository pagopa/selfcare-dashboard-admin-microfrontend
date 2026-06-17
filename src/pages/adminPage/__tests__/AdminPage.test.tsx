import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import AdminPage from '../AdminPage';
import { searchInstitutionsService } from '../../../services/partyRegistryProxyService';

const { mockTrackEvent, mockAddError } = vi.hoisted(() => ({
  mockTrackEvent: vi.fn(),
  mockAddError: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
  trackEvent: mockTrackEvent,
}));

vi.mock('@pagopa/selfcare-common-frontend/lib', async () => {
  const actual = await vi.importActual('@pagopa/selfcare-common-frontend/lib');
  return {
    ...actual,
    useErrorDispatcher: () => mockAddError,
  };
});


vi.mock('../../../services/partyRegistryProxyService', () => ({
  searchInstitutionsService: vi.fn(),
}));

const mockedSearchInstitutionsService = vi.mocked(searchInstitutionsService);

describe('AdminPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the AdminPage component correctly and track mount event', async () => {
    await renderWithProviders(<AdminPage />);

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/Visualizza e gestisci gli enti/i)).toBeInTheDocument();
    expect(screen.getByText('VISUALIZZA ENTE')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe('');

    expect(mockTrackEvent).toHaveBeenCalledWith('BACKSTAGE_DASHBOARD');
  });

  it('should not search if search term length is less than 3', async () => {
    await renderWithProviders(<AdminPage />);
    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');

    fireEvent.change(input, { target: { value: 'Ab' } });
    
    // Advance timers to trigger debounce
    vi.advanceTimersByTime(400);

    expect(mockedSearchInstitutionsService).not.toHaveBeenCalled();
  });

  it('should trigger search searchInstitutionsService when query is at least 3 characters', async () => {
    mockedSearchInstitutionsService.mockResolvedValue([]);
    await renderWithProviders(<AdminPage />);
    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');

    fireEvent.change(input, { target: { value: 'Roma' } });

    // Verify debounce did not fire immediately
    expect(mockedSearchInstitutionsService).not.toHaveBeenCalled();

    // Advance time to run the debounce function
    vi.advanceTimersByTime(400);

    expect(mockedSearchInstitutionsService).toHaveBeenCalledWith('Roma');
  });

  it('should display search options when query is typed and results are returned', async () => {
    const mockResults = [
      {
        id: 'inst-1',
        description: 'Comune di Roma',
        parentDescription: 'Ente di appartenenza 1',
        taxCode: '80000000000',
      },
    ];
    mockedSearchInstitutionsService.mockResolvedValue(mockResults);

    await renderWithProviders(<AdminPage />);
    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');

    fireEvent.change(input, { target: { value: 'Roma' } });
    
    // Trigger debounce
    vi.advanceTimersByTime(400);
    
    // Restore real timers for async resolution and rendering
    vi.useRealTimers();

    // Wait for the state transitions (setOpen false/true) to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Wait for option to be visible
    const option = await screen.findByText('Comune di Roma');
    expect(option).toBeInTheDocument();
  });

  it('should track selection and redirect when an institution is selected', async () => {
    const mockResults = [
      {
        id: 'inst-1',
        description: 'Comune di Roma',
        parentDescription: 'Ente di appartenenza 1',
        taxCode: '80000000000',
      },
    ];
    mockedSearchInstitutionsService.mockResolvedValue(mockResults);

    const { history } = await renderWithProviders(<AdminPage />);
    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');

    fireEvent.change(input, { target: { value: 'Roma' } });
    vi.advanceTimersByTime(400);
    
    // Restore real timers
    vi.useRealTimers();

    // Wait for the state transitions (setOpen false/true) to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find the option element
    const option = await screen.findByRole('option');
    fireEvent.click(option);

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('BACKSTAGE_PARTY_SELECTION', {
        party_id: 'inst-1',
      });
      expect(history.location.pathname).toBe('/dashboard/admin/search/inst-1');
    });
  });

  it('should dispatch error when search API fails', async () => {
    const apiError = new Error('API Error');
    mockedSearchInstitutionsService.mockRejectedValue(apiError);

    await renderWithProviders(<AdminPage />);
    const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');

    fireEvent.change(input, { target: { value: 'Roma' } });
    vi.advanceTimersByTime(400);

    // Restore real timers
    vi.useRealTimers();

    await waitFor(() => {
      expect(mockAddError).toHaveBeenCalledWith({
        id: 'searchInstitutions-Roma-api-error',
        blocking: false,
        techDescription: 'Search institutions with text: Roma not found',
        toNotify: false,
        error: apiError,
      });
    });
  });
});


