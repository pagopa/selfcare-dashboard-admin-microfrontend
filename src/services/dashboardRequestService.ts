import { DashboardApi } from '../api/DashboardApiClient';
import { OnboardingApi } from '../api/OnboardingApiClient';
import { OnboardingRequestResource } from '../api/generated/onboarding/OnboardingRequestResource';
import { OnboardingRequestDashboardResource } from '../model/OnboardingRequestResource';
import { ENV } from '../utils/env';
import { mockedOnboardingRequests } from './__mocks__/dashboardRequestService';

export const fetchOnboardingPspRequest = (
  tokenId: string
): Promise<OnboardingRequestResource | OnboardingRequestDashboardResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    if (ENV.ENV === 'DEV') {
      return OnboardingApi.fetchOnboardingRequest(tokenId);
    } else {
      return DashboardApi.fetchOnboardingPspRequest(tokenId);
    }
  }
};

export const rejectOnboardingPspRequest = (
  tokenId: string
): Promise<OnboardingRequestResource | OnboardingRequestDashboardResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    if (ENV.ENV === 'DEV') {
      return OnboardingApi.rejectOnboardingRequest(tokenId);
    } else {
      return DashboardApi.rejectOnboardingPspRequest(tokenId);
    }
  }
};

export const approveOnboardingPspRequest = (
  tokenId: string
): Promise<OnboardingRequestResource | OnboardingRequestDashboardResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    if (ENV.ENV === 'DEV') {
      return OnboardingApi.approveOnboardingRequest(tokenId);
    } else {
      return DashboardApi.approveOnboardingPspRequest(tokenId);
    }
  }
};
