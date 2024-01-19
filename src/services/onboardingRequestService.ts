import { OnboardingApi } from '../api/OnboardingApiClient';
import { OnboardingRequestResource } from '../api/generated/onboarding/OnboardingRequestResource';

export const fetchOnboardingRequest = (
  onboardingId: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    return Promise.reject('Onboarding request not found!');
  } else {
    return OnboardingApi.fetchOnboardingRequest(onboardingId);
  }
};

export const rejectOnboardingRequest = (
  onboardingId: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    return Promise.reject('Onboarding request not found!');
  } else {
    return OnboardingApi.rejectOnboardingRequest(onboardingId);
  }
};

export const approveOnboardingRequest = (
  onboardingId: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PSP_REQUEST_DATA === 'true') {
    return Promise.reject('Onboarding request not found!');
  } else {
    return OnboardingApi.approveOnboardingRequest(onboardingId);
  }
};
