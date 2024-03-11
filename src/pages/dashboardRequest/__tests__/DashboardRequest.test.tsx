/* eslint-disable functional/immutable-data */
import { cleanup, screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardRequest from '../DashboardRequest';

const oldWindowLocation = { ...global.window.location };
const mockedLocation = {
  assign: jest.fn(),
  pathname: '/some/path/tokenId02',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

afterEach(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
  cleanup();
});

test('should render with tokenId in path and active status', async () => {
  Object.defineProperty(window, 'location', { value: mockedLocation });

  renderWithProviders(<DashboardRequest />);
});

test('should render with not found tokenId in path and rejected status', async () => {
  Object.defineProperty(global.window.location, 'pathname', {
    value: '/some/other/path/tokenId03',
  });

  renderWithProviders(<DashboardRequest />);
});

test('should render with not found tokenId in path', async () => {
  Object.defineProperty(global.window.location, 'pathname', {
    value: '/some/other/path/tokenFake1',
  });

  renderWithProviders(<DashboardRequest />);

  const errorMessage = await screen.findByText(
    'Questa richiesta è stata accolta, annullata o è scaduta.'
  );
  expect(errorMessage).toBeInTheDocument();
});

test('should render with not found tokenId in path and pending status', async () => {
  Object.defineProperty(global.window.location, 'pathname', {
    value: '/some/other/path/tokenId06',
  });

  renderWithProviders(<DashboardRequest />);
});
