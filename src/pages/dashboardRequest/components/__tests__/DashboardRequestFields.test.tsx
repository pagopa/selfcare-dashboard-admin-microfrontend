import { render, screen } from '@testing-library/react';
import DashboardRequestFields from '../DashboardRequestFields';
import React from 'react';
import { mockedOnboardingRequests } from '../../../../services/__mocks__/dashboardRequestService';

test('should render component with no data', async () => {
  render(<DashboardRequestFields onboardingRequestData={undefined} isPSP={false} />);
});

test('should render component with PSP and group PIVA should not be visible', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[0]} isPSP={true} />
  );

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();
  expect(screen.getByText('Dati del Legale Rappresentante')).toBeInTheDocument();
});

test('should render component with PSP and group vatNumberGroup should not be visible and vatNumberGroup === false', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[4]} isPSP={true} />
  );

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});

test('should render component with PT and legal rapresentation section should not be visible', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[1]} isPSP={false} />
  );

  expect(screen.queryByText('Dati del Legale Rappresentante')).not.toBeInTheDocument();
});
