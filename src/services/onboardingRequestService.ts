import { AvailableDocumentsResource } from '../api/generated/onboarding/AvailableDocumentsResource';
import { OnboardingApi } from '../api/OnboardingApiClient';
import { OnboardingRequestResource } from '../model/OnboardingRequestResource';
import {
  mockedAvailableDocuments,
  mockedOnboardingRequests,
} from './__mocks__/onboardingRequestService';

export const fetchOnboardingRequest = (tokenId: string): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
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

export const rejectOnboardingRequest = (
  tokenId: string,
  reason?: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      return new Promise((resolve) => resolve(selectedOnboardingRequest));
    } else {
      console.log("reason", reason);
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    return OnboardingApi.rejectOnboardingRequest(tokenId);
  }
};

export const downloadOnboardingRequestAttachment = (
  tokenId: string,
  type: string,
  name?: string
): Promise<Response> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    const fileName = name ?? `${type.toLowerCase()}.pdf`;
    return Promise.resolve(
      new Response(new Blob([`mocked ${type} content for ${tokenId}`]), {
        headers: { 'content-disposition': `attachment; filename=${fileName}` },
      })
    );
  } else {
    return OnboardingApi.downloadOnboardingAttachments(tokenId, type, name);
  }
};

export const getAvailableDocuments = (tokenId: string): Promise<AvailableDocumentsResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
    if (selectedOnboardingRequest) {
      const isCompleted = selectedOnboardingRequest.status === 'COMPLETED';
      return Promise.resolve({
        attachments: selectedOnboardingRequest.attachments ?? mockedAvailableDocuments.attachments,
        contractFilename: isCompleted ? mockedAvailableDocuments.contractFilename : undefined,
      });
    } else {
      return Promise.reject('Onboarding request not found!');
    }
  } else {
    return OnboardingApi.getAvailableDocuments(tokenId);
  }
};

export const approveOnboardingPspRequest = (
  tokenId: string
): Promise<OnboardingRequestResource> => {
  /* istanbul ignore if */
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
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
