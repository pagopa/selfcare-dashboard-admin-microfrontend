import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { DashboardApi } from '../api/DashboardApiClient';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/dashboardService';

export const fetchPartyDetailsService = (partyId: string): Promise<Party | null> => {
  if (import.meta.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve(mockedParties[2] ?? null);
  } else {
    const apiToCall = isPagoPaUser()
      ? DashboardApi.getAllInstituionById
      : DashboardApi.getInstitution;

    return apiToCall(partyId).then((institutionResource) =>
      institutionResource ? institutionResource2Party(institutionResource) : null
    );
  }
};

export const getTokenExchangeAdminService = (
  institutionId: string,
  productId: string,
  environment?: string,
  lang?: string
): Promise<string> => {
  if (import.meta.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve('mocked-token');
  } else {
    return DashboardApi.tokenExchangeAdmin(institutionId, productId, environment, lang);
  }
};
