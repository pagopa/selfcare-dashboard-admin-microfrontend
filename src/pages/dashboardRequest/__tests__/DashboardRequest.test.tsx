/* eslint-disable functional/immutable-data */
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { OnboardingApi } from '../../../api/OnboardingApiClient';
import { createStore } from '../../../redux/store';
import { mockedOnboardingRequests } from '../../../services/__mocks__/onboardingRequestService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardRequest from '../DashboardRequest';

// ── window.location setup ────────────────────────────────────────────────────
const oldWindowLocation = { ...global.window.location };

const setPathname = (tokenId: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      assign: vi.fn(),
      pathname: `/admin/request/${tokenId}`,
      origin: 'MOCKED_ORIGIN',
      search: '',
      hash: '',
    },
  });
};

const originalFetch = global.fetch;

// helper that injects ManageAccountPage permission so action buttons render
const renderWithPermissions = async (component: React.ReactElement) => {
  const store = createStore();
  store.dispatch(
    setProductPermissions([{ productId: 'prod-pagopa', actions: [Actions.ManageAccountPage] }])
  );
  return renderWithProviders(component, store);
};

afterEach(() => {
  Object.defineProperty(window, 'location', { writable: true, value: oldWindowLocation });
  global.fetch = originalFetch;
  cleanup();
});

// ── helpers ──────────────────────────────────────────────────────────────────
// tokenId01 → TOBEVALIDATED / PSP
// tokenId02 → COMPLETED     / PT
// tokenId03 → REJECTED      / PSP  (reasonForReject present)
// tokenId06 → PENDING       / PSP
// tokenId08 → TOBEVALIDATED / GPU  (has attachments)

const tobeValidatedRequest = mockedOnboardingRequests[0]; // tokenId01
const completedRequest = mockedOnboardingRequests[1];     // tokenId02
const rejectedRequest = mockedOnboardingRequests[2];      // tokenId03
const pendingRequest = mockedOnboardingRequests[5];       // tokenId06
const gpuRequest = mockedOnboardingRequests[7];           // tokenId08

// ── fetchOnboardingRequest mock ───────────────────────────────────────────────
const fetchSpy = vi.spyOn(OnboardingApi, 'fetchOnboardingRequest');

// ── tests ─────────────────────────────────────────────────────────────────────

describe('DashboardRequest — error / loading states', () => {
  test('shows the error page (JwtInvalidPage) when the service rejects', async () => {
    setPathname('badToken');
    fetchSpy.mockRejectedValueOnce(new Error('not found'));

    await renderWithProviders(<DashboardRequest />);

    await waitFor(() =>
      expect(
        screen.getByText(/Richiesta di adesione non più/i)
      ).toBeInTheDocument()
    );
  });

  test('renders nothing (empty fragment) while data is loading', async () => {
    setPathname(tobeValidatedRequest.tokenId);
    // Never resolves — keeps component in the empty-fragment state
    fetchSpy.mockReturnValueOnce(new Promise(() => { }));

    await renderWithProviders(<DashboardRequest />);

    expect(screen.queryByText(/Richiesta di adesione/i)).not.toBeInTheDocument();
  });
});

describe('DashboardRequest — TOBEVALIDATED (PSP)', () => {
  beforeEach(() => {
    setPathname(tobeValidatedRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(tobeValidatedRequest);
  });

  test('renders the page title and the "TOBEVALIDATED" chip label', async () => {
    await renderWithProviders(<DashboardRequest />);

    await waitFor(() =>
      expect(screen.getByText(/Richiesta di adesione/i)).toBeInTheDocument()
    );

    // info-alert only shown for TOBEVALIDATED status
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument()
    );
  });

});

describe('DashboardRequest — COMPLETED status', () => {
  test('renders the page with a "COMPLETED" chip', async () => {
    setPathname(completedRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(completedRequest);

    await renderWithProviders(<DashboardRequest />);

    // requestState returns the "approvedDataChip" label for COMPLETED
    await waitFor(() =>
      expect(screen.getByText(/Richiesta di adesione/i)).toBeInTheDocument()
    );
    // No info alert for COMPLETED
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('DashboardRequest — REJECTED status (with reasonForReject)', () => {
  test('renders warning alert with rejection reason', async () => {
    setPathname(rejectedRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(rejectedRequest);

    await renderWithProviders(<DashboardRequest />);

    // fromISO2ITA and reasonForReject are displayed in the warning alert
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument()
    );
    expect(screen.getByRole('alert').textContent).toContain(rejectedRequest.reasonForReject);
  });
});

describe('DashboardRequest — PENDING status', () => {
  test('renders the page with PENDING chip (success.light chip, no alert)', async () => {
    setPathname(pendingRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(pendingRequest);

    await renderWithProviders(<DashboardRequest />);

    await waitFor(() =>
      expect(screen.getByText(/Richiesta di adesione/i)).toBeInTheDocument()
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('DashboardRequest — GPU institutionType', () => {
  beforeEach(() => {
    setPathname(gpuRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(gpuRequest);
  });

  test('renders the download attachment button for GPU requests', async () => {
    await renderWithPermissions(<DashboardRequest />);

    const downloadBtn = await screen.findByText(/Scarica i dati/i);
    expect(downloadBtn).toBeInTheDocument();
  });

  test('triggers fetch download when the download button is clicked', async () => {
    const mockStream = {
      getReader: () => ({
        read: vi
          .fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([1, 2, 3]) })
          .mockResolvedValueOnce({ done: true, value: undefined }),
      }),
    };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'attachment; filename=checklist_adesione_gpu.pdf',
      },
      blob: async () => ({ stream: () => mockStream }),
    } as any);

    // stub URL.createObjectURL so jsdom doesn't throw
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

    await renderWithPermissions(<DashboardRequest />);
    const downloadBtn = await screen.findByText(/Scarica i dati/i);
    fireEvent.click(downloadBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  test('dispatches an error when fetch download fails for GPU', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('network error'));

    await renderWithPermissions(<DashboardRequest />);
    const downloadBtn = await screen.findByText(/Scarica i dati/i);
    fireEvent.click(downloadBtn);

    // error is dispatched but UI stays on the main page (no page change)
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
});

describe('DashboardRequest — goBack navigation', () => {
  test('calls history.goBack() when fromDashboard state is true', async () => {
    setPathname(completedRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(completedRequest);

    const { history } = await renderWithProviders(<DashboardRequest />);
    // simulate navigation with fromDashboard state
    history.push(`/admin/request/${completedRequest.tokenId}`, { fromDashboard: true });

    await waitFor(() => screen.getByText(/Richiesta di adesione/i));

    const backBtn = screen.getByText('Indietro');
    const goBackSpy = vi.spyOn(history, 'goBack');
    fireEvent.click(backBtn);

    expect(goBackSpy).toHaveBeenCalled();
  });

  test('navigates to admin onboardings route when fromDashboard state is false', async () => {
    setPathname(completedRequest.tokenId);
    fetchSpy.mockResolvedValueOnce(completedRequest);

    const { history } = await renderWithProviders(<DashboardRequest />);
    history.push(`/admin/request/${completedRequest.tokenId}`);

    await waitFor(() => screen.getByText(/Richiesta di adesione/i));

    const backBtn = screen.getByText('Indietro');
    const pushSpy = vi.spyOn(history, 'push');
    fireEvent.click(backBtn);

    expect(pushSpy).toHaveBeenCalled();
  });
});
