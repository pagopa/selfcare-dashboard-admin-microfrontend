import { fireEvent, render, screen } from '@testing-library/react';
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

  const expandPartyData = screen.getByTestId('arrow-icon-1');
  fireEvent.click(expandPartyData);

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();

  const expandManagerData = screen.getByTestId('arrow-icon-3');
  fireEvent.click(expandManagerData);

  expect(screen.getByText('Dati del Legale Rappresentante')).toBeInTheDocument();
});

test('should render component with PSP and group vatNumberGroup should not be visible and vatNumberGroup === false', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[4]} isPSP={true} />
  );

  const expandPartyData = screen.getByTestId('arrow-icon-1');
  fireEvent.click(expandPartyData);

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});

test('should render component with PT with empty manager object and legal rapresentation section should not be visible', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[1]} isPSP={false} />
  );

  expect(screen.queryByText('Dati del Legale Rappresentante')).not.toBeInTheDocument();
});

test('should render component with GSP and render all the overview panels', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={mockedOnboardingRequests[6]} isPSP={false} />
  );

  expect(screen.queryByText('Dati dell’ente')).toBeInTheDocument();
  expect(screen.queryByText('Informazioni aggiuntive')).toBeInTheDocument();
  expect(screen.queryByText('Dati del Legale Rappresentante')).toBeInTheDocument();
  expect(screen.queryByText('Dati dell’Amministratore')).toBeInTheDocument();
});
