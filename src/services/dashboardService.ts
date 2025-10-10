import { DashboardApi } from '../api/DashboardApiClient';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/dashboardService';

export const fetchPartyDetails = (partyId: string): Promise<Party | null> => {
  if (process.env.REACT_APP_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedParties.find((p) => p.partyId === partyId) ?? null);
  } else {
    return DashboardApi.getInstitution(partyId).then((institutionResource) =>
      institutionResource ? institutionResource2Party(institutionResource) : null
    );
  }
};
