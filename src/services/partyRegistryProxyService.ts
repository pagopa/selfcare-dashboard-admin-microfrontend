import { SearchServiceInstitution } from '../api/generated/party-registry-proxy/SearchServiceInstitution';
import { OnboardingApi } from '../api/PartyRegistryProxyApiClient';
import { mockedSearchInstitutionsService } from './__mocks__/partyRegistryProxyService';

export const searchInstitutionsService = async (
  searchText: string
): Promise<Array<SearchServiceInstitution>> => {
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return mockedSearchInstitutionsService(searchText);
  } else {
    return OnboardingApi.searchInstitutions(searchText).then((response) => response);
  }
};
