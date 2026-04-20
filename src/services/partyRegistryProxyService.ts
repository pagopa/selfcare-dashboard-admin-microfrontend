import { SearchServiceInstitution } from '../api/generated/party-registry-proxy/SearchServiceInstitution';
import { PartyRegisrtyApi } from '../api/PartyRegistryProxyApiClient';
import { mockedSearchInstitutionsService } from './__mocks__/partyRegistryProxyService';

export const searchInstitutionsService = async (
  searchText: string
): Promise<Array<SearchServiceInstitution>> => {
  if (process.env.VITE_API_MOCK_PARTIES === 'true') {
    return mockedSearchInstitutionsService(searchText);
  } else {
    return PartyRegisrtyApi.searchInstitutions(searchText);
  }
};
