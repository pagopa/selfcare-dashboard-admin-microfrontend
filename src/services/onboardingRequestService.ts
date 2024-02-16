import { OnboardingApi } from '../api/OnboardingApiClient';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import { mockedOnboardingRequests } from './__mocks__/dashboardRequestService';

export const fetchOnboardingPspRequest = (tokenId: string): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    return OnboardingApi.fetchOnboardingRequest(tokenId);
  }
};

export const rejectOnboardingPspRequest = (tokenId: string): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    return OnboardingApi.rejectOnboardingRequest(tokenId);
  }
};

export const approveOnboardingPspRequest = (
  tokenId: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    return OnboardingApi.approveOnboardingRequest(tokenId);
  }
};
