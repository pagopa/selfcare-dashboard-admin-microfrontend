import { OnboardingIndexSearchResource } from '../api/generated/party-registry-proxy/OnboardingIndexSearchResource';
import { SearchServiceInstitution } from '../api/generated/party-registry-proxy/SearchServiceInstitution';
import { PartyRegisrtyApi } from '../api/PartyRegistryProxyApiClient';
import {
  mockedSearchInstitutionsService,
  mockedSearchOnboardingsService,
} from './__mocks__/partyRegistryProxyService';

export const searchInstitutionsService = async (
  searchText: string
): Promise<Array<SearchServiceInstitution>> => {
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return mockedSearchInstitutionsService(searchText);
  } else {
    return PartyRegisrtyApi.searchInstitutions(searchText);
  }
};

export const searchOnboardingsService = async (
  searchText: string,
  products: Array<string>,
  institutionTypes: Array<string>,
  statuses: Array<string>,
  page: number,
  pageSize: number
  // orderBy: string
): Promise<OnboardingIndexSearchResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return mockedSearchOnboardingsService(
      searchText,
      products,
      institutionTypes,
      statuses,
      page,
      pageSize
      // orderBy
    );
  } else {
    return PartyRegisrtyApi.searchOnboardings(
      searchText,
      products,
      institutionTypes,
      statuses,
      page,
      pageSize
      // orderBy
    );
  }
};
