import { OnboardingIndexSearchResource } from '../api/generated/party-registry-proxy/OnboardingIndexSearchResource';
import { PartyRegisrtyApi } from '../api/PartyRegistryProxyApiClient';
import { mockedSearchOnboardingsService } from './__mocks__/partyRegistryProxyService';

export const searchOnboardingsService = async (
  searchText: string,
  products: Array<string>,
  institutionTypes: Array<string>,
  statuses: Array<string>,
  page: number,
  pageSize: number,
  orderBy: string
): Promise<OnboardingIndexSearchResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_PARTIES === 'true') {
    return mockedSearchOnboardingsService(
      searchText,
      products,
      institutionTypes,
      statuses,
      page,
      pageSize,
      orderBy
    );
  } else {
    return PartyRegisrtyApi.searchOnboardings(
      searchText,
      products,
      institutionTypes,
      statuses,
      page,
      pageSize,
      orderBy
    );
  }
};
