import { DashboardApi } from "../api/DashboardApiClient";
import { OnboardingRequestResource } from "../model/OnboardingRequestResource";
import { fetchOnboardingPspResource as fetchOnboardingPspResourceMocked} from './__mocks__/dashboardRequestService';
export const fetchOnboardingPspResource = (
  tokenId: string,
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PARTY_GROUPS === 'true') {
    return fetchOnboardingPspResourceMocked(tokenId);
  } else {
    return DashboardApi.fetchOnboardingResource(tokenId);
  }
};