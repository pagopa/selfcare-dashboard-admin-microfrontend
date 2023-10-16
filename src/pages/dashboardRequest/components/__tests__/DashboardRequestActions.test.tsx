import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../../utils/test-utils';
import DashboardRequestActions from '../DashboardRequestActions';

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

test('should render component with not a pending request and click on close', async () => {

  renderWithProviders(
    <DashboardRequestActions
      setShowRejectPage={function (value: React.SetStateAction<boolean | undefined>): void {
        throw new Error('Function not implemented.');
      }}
      setShowConfirmPage={function (value: React.SetStateAction<boolean | undefined>): void {
        throw new Error('Function not implemented.');
      }}
      isPendingRequest={false}
    />
  );
  const closeBtn = screen.getByText('Chiudi');
  fireEvent.click(closeBtn);

  expect(window.location.assign).toHaveBeenCalledWith('https://www.pagopa.it/it/');
});

test('should render component and approve pending request', async () => {
  const setShowConfirmPage = jest.fn();
  renderWithProviders(
    <DashboardRequestActions
      setShowRejectPage={jest.fn()}
      setShowConfirmPage={setShowConfirmPage}
      isPendingRequest={true}
      retrieveTokenIdFromUrl={'tokenId02'}
    />
  );

  const approveBtn = screen.getByText('Approva');

  fireEvent.click(approveBtn);

  await waitFor(() => expect(setShowConfirmPage).toHaveBeenCalled());
});

test('should render component and approve pending request and fail the api call with not found token', async () => {
  const setShowConfirmPage = jest.fn();
  renderWithProviders(
    <DashboardRequestActions
      setShowRejectPage={jest.fn()}
      setShowConfirmPage={setShowConfirmPage}
      isPendingRequest={true}
      retrieveTokenIdFromUrl={'tokenIdFake'}
    />
  );

  const approveBtn = screen.getByText('Approva');

  fireEvent.click(approveBtn);

  await waitFor(() => expect(setShowConfirmPage).not.toHaveBeenCalled());
});

test('should render component and reject pending request', async () => {
  const setShowRejectPage = jest.fn();
  renderWithProviders(
    <DashboardRequestActions
      setShowRejectPage={setShowRejectPage}
      setShowConfirmPage={jest.fn()}
      isPendingRequest={true}
      retrieveTokenIdFromUrl={'tokenId03'}
    />
  );

  const declineBtn = screen.getByText('Rifiuta');

  fireEvent.click(declineBtn);

  await waitFor(() => expect(setShowRejectPage).toHaveBeenCalled());
});

test('should render component and reject pending request and fail the api call with not found token', async () => {
  const setShowRejectPage = jest.fn();
  renderWithProviders(
    <DashboardRequestActions
      setShowRejectPage={setShowRejectPage}
      setShowConfirmPage={jest.fn()}
      isPendingRequest={true}
      retrieveTokenIdFromUrl={'tokenIdFake'}
    />
  );

  const declineBtn = screen.getByText('Rifiuta');

  fireEvent.click(declineBtn);

  await waitFor(() => expect(setShowRejectPage).not.toHaveBeenCalled());
});
