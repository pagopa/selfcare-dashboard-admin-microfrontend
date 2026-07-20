import { fireEvent, render, screen } from '@testing-library/react';
import DashboardRequestFields from '../DashboardRequestFields';
import {
  mockedAvailableDocuments,
  mockedOnboardingRequests,
} from '../../../../services/__mocks__/onboardingRequestService';

const commonProps = {
  fromISO2ITA: (date?: string) => date ?? '',
  onDownloadDocument: () => undefined,
  showAvailableDocuments: false,
};

test('should render component with no data', async () => {
  render(
    <DashboardRequestFields onboardingRequestData={undefined} isPSP={false} {...commonProps} />
  );
});

test('should render component with PSP and group PIVA should not be visible', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[0]}
      isPSP={true}
      {...commonProps}
    />
  );

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();

  const expandManagerData = screen.getByTestId('arrow-icon-3');
  fireEvent.click(expandManagerData);

  expect(screen.getByText('Dati del Legale Rappresentante')).toBeInTheDocument();
});

test('should render component with PSP and group vatNumberGroup should not be visible and vatNumberGroup === false', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[4]}
      isPSP={true}
      {...commonProps}
    />
  );

  expect(screen.getByText('La partita IVA è di gruppo')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});

test('should render component with PT with empty manager object and legal rapresentation section should not be visible', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[1]}
      isPSP={false}
      {...commonProps}
    />
  );

  expect(screen.queryByText('Dati del Legale Rappresentante')).not.toBeInTheDocument();
});

test('should render component with GSP and render all the overview panels', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[6]}
      isPSP={false}
      {...commonProps}
    />
  );

  expect(screen.queryByText('Dati dell’ente')).toBeInTheDocument();
  expect(screen.queryByText('Informazioni aggiuntive')).toBeInTheDocument();
  expect(screen.queryByText('Dati del Legale Rappresentante')).toBeInTheDocument();
  expect(screen.queryByText('Dati dell’Amministratore')).toBeInTheDocument();
});

test('should not render the documents section when showAvailableDocuments is false', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[7]}
      availableDocuments={mockedAvailableDocuments}
      isPSP={false}
      {...commonProps}
      showAvailableDocuments={false}
    />
  );

  expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
  expect(screen.queryByText('dummy.pdf')).not.toBeInTheDocument();
});

test('should render the documents section with attachments and signed contract when showAvailableDocuments is true', async () => {
  const onDownloadDocument = vi.fn();

  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[7]}
      availableDocuments={mockedAvailableDocuments}
      isPSP={false}
      {...commonProps}
      showAvailableDocuments={true}
      onDownloadDocument={onDownloadDocument}
    />
  );

  expect(screen.getByText('Documenti')).toBeInTheDocument();

  const expandDocuments = screen.getByTestId('arrow-icon-5');
  fireEvent.click(expandDocuments);

  fireEvent.click(screen.getByText('dummy.pdf'));
  expect(onDownloadDocument).toHaveBeenCalledWith('dummy.pdf', 'ATTACHMENT');

  fireEvent.click(screen.getByText('contratto_adesione.pdf'));
  expect(onDownloadDocument).toHaveBeenCalledWith('contratto_adesione.pdf', 'CONTRACT_SIGNED');
});

test('should fallback on onboardingRequestData attachments when availableDocuments is undefined', async () => {
  render(
    <DashboardRequestFields
      onboardingRequestData={mockedOnboardingRequests[7]}
      isPSP={false}
      {...commonProps}
      showAvailableDocuments={true}
    />
  );

  expect(screen.getByText('Documenti')).toBeInTheDocument();
  expect(screen.queryByText('contratto_adesione.pdf')).not.toBeInTheDocument();
});
