import { DashboardApi } from '../api/DashboardApiClient';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/dashboardService';

export const fetchPartyDetailsService = (partyId: string): Promise<Party | null> => {
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedParties[0] ?? null);
  } else {
    return DashboardApi.getInstitution(partyId).then((institutionResource) =>
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
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve('mocked-token');
  } else {
    return DashboardApi.tokenExchangeAdmin(institutionId, productId, environment, lang);
  }
};
