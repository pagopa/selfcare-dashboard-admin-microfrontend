import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../utils/test-utils';
import DashboardRequestActions from '../DashboardRequestActions';
import { mockedOnboardingRequests } from '../../../../services/__mocks__/onboardingRequestService';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/utils/productId2ProductTitle';

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: '',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

test('Test: Landing in an APPROVED onboarding request and click the close button', async () => {
  await renderWithProviders(
    <DashboardRequestActions
      retrieveTokenIdFromUrl={mockedOnboardingRequests[1].tokenId}
      partyName={mockedOnboardingRequests[1].institutionInfo.name}
      productTitle={productId2ProductTitle(mockedOnboardingRequests[1].productId)}
      setShowConfirmPage={() => {}}
      setShowRejectPage={() => {}}
      isToBeValidatedRequest={mockedOnboardingRequests[1].status === 'TOBEVALIDATED'}
    />
  );

  const approveBtn = screen.queryByText('Approva');
  const declineBtn = screen.queryByText('Rifiuta');

  expect(approveBtn).not.toBeInTheDocument();
  expect(declineBtn).not.toBeInTheDocument();
});

test('Test: Landing in an onboarding request with status TOBEVALIDATED and APPROVE it', async () => {
  const setShowConfirmPage = jest.fn();

  await renderWithProviders(
    <DashboardRequestActions
      retrieveTokenIdFromUrl={mockedOnboardingRequests[0].tokenId}
      partyName={mockedOnboardingRequests[0].institutionInfo.name}
      productTitle={productId2ProductTitle(mockedOnboardingRequests[0].productId)}
      setShowConfirmPage={setShowConfirmPage}
      setShowRejectPage={() => {}}
      isToBeValidatedRequest={mockedOnboardingRequests[0].status === 'TOBEVALIDATED'}
    />
  );

  const approveBtn = screen.getByText('Approva');
  const declineBtn = screen.getByText('Rifiuta');
  const closeBtn = screen.queryByText('Chiudi');

  expect(approveBtn).toBeInTheDocument();
  expect(declineBtn).toBeInTheDocument();

  fireEvent.click(approveBtn);

  // await waitFor(() => expect(setShowConfirmPage).toHaveBeenCalled());
});

test('Test: Landing in an onboarding request with status TOBEVALIDATED and REJECT it', async () => {
  const setShowRejectPage = jest.fn();

  await renderWithProviders(
    <DashboardRequestActions
      retrieveTokenIdFromUrl={mockedOnboardingRequests[0].tokenId}
      partyName={mockedOnboardingRequests[0].institutionInfo.name}
      productTitle={productId2ProductTitle(mockedOnboardingRequests[0].productId)}
      setShowConfirmPage={() => {}}
      setShowRejectPage={setShowRejectPage}
      isToBeValidatedRequest={mockedOnboardingRequests[0].status === 'TOBEVALIDATED'}
    />
  );

  const approveBtn = screen.getByText('Approva');
  const declineBtn = screen.getByText('Rifiuta');

  expect(approveBtn).toBeInTheDocument();
  expect(declineBtn).toBeInTheDocument();

  fireEvent.click(declineBtn);

  await waitFor(() => screen.getByText('Stai rifiutando una richiesta di adesione'));

  const rejectModalBtn = screen.getAllByText('Rifiuta')[1];
  const backModalBtn = screen.getByText('Indietro');

  expect(backModalBtn).toBeEnabled();
  expect(rejectModalBtn).toBeDisabled();

  const textArea = document.getElementById('input-reason') as HTMLInputElement;

  fireEvent.change(textArea, { target: { value: 'Reason' } });
  expect(rejectModalBtn).toBeEnabled();

  fireEvent.click(backModalBtn);
  fireEvent.click(declineBtn);

  expect(rejectModalBtn).toBeDisabled();

  fireEvent.change(textArea, { target: { value: 'New reason' } });
  expect(rejectModalBtn).toBeEnabled();

  fireEvent.click(rejectModalBtn);

  // await waitFor(() => expect(setShowRejectPage).toHaveBeenCalled());
});

test('Test: Onboarding request with not found token scenario', async () => {
  await renderWithProviders(
    <DashboardRequestActions
      retrieveTokenIdFromUrl={'wrongTokenId'}
      setShowConfirmPage={() => {}}
      setShowRejectPage={() => {}}
      isToBeValidatedRequest={false}
    />
  );

  const approveBtn = screen.queryByText('Approva');
  const declineBtn = screen.queryByText('Rifiuta');

  expect(approveBtn).not.toBeInTheDocument();
  expect(declineBtn).not.toBeInTheDocument();
});
