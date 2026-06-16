import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import AdminPage from '../AdminPage';

vi.mock('../../../services/partyRegistryProxyService', () => ({
    searchInstitutionsService: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService', () => ({
    trackEvent: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/routes-utils', () => ({
    resolvePathVariables: (route: string, params: Record<string, string>) =>
        route.replace(':partyId', params.partyId),
}));

vi.mock('../../../utils/env', () => ({
    ENV: {
        ROUTES: {
            ADMIN_SEARCH_DETAIL: '/dashboard/admin/search/:partyId',
        },
        URL_INSTITUTION_LOGO: {
            PREFIX: 'https://test/',
            SUFFIX: '.png',
        },
    },
}));

import { searchInstitutionsService } from '../../../services/partyRegistryProxyService';

const mockInstitution = {
    id: 'inst-00001',
    description: 'Comune di Roma',
    taxCode: '00000000000',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
};

describe('AdminPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the dashboard title and the institution search section', () => {
        renderWithProviders(<AdminPage />);

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('VISUALIZZA ENTE')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale')
        ).toBeInTheDocument();
    });

    it('performs a search after typing 3 characters and shows options', async () => {
        (searchInstitutionsService as Mock).mockResolvedValue([mockInstitution]);

        renderWithProviders(<AdminPage />);
        const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');
        const user = userEvent.setup({ delay: null });

        await user.type(input, 'Com');

        await waitFor(
            () => {
                expect(searchInstitutionsService).toHaveBeenCalledWith('Com');
            },
            { timeout: 3000 }
        );

        expect(await screen.findByText('Comune di Roma', {}, { timeout: 3000 })).toBeInTheDocument();
    });

    it('navigates to the selected institution details when an option is selected', async () => {
        (searchInstitutionsService as Mock).mockResolvedValue([mockInstitution]);

        const { history } = await renderWithProviders(<AdminPage />);
        const input = screen.getByPlaceholderText('Cerca ente per Ragione sociale o Codice Fiscale');
        const user = userEvent.setup({ delay: null });

        await user.type(input, 'Com');

        await waitFor(
            () => {
                expect(searchInstitutionsService).toHaveBeenCalledWith('Com');
            },
            { timeout: 3000 }
        );

        const option = await screen.findByText('Comune di Roma', {}, { timeout: 3000 });
        await user.click(option);

        await waitFor(
            () => {
                expect(history.location.pathname).toBe('/dashboard/admin/search/inst-00001');
            },
            { timeout: 3000 }
        );
    });
});
