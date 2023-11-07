import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ENV } from '../../../utils/env';
import RejectPage from '../RejectPage';

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

test('should render RejectPage and click on Torna alla home', () => {
  render(<RejectPage />);

  const bactToHomeBtn = screen.getByText('Torna alla home');

  expect(bactToHomeBtn).toBeInTheDocument();

  fireEvent.click(bactToHomeBtn);

  expect(window.location.assign).toHaveBeenCalledWith(ENV.URL_FE.LANDING);
});
