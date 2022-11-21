import { screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import '../../locale';
import { renderComponent } from './RenderComponents/RenderComponentAdmin.test';

jest.mock('@pagopa/selfcare-common-frontend/decorators/withLogin');
jest.mock('../../services/dashboardRequestService');

jest.setTimeout(100000);

const renderApp = async () => {
  const history = createMemoryHistory();
  history.push(`/dashboard/admin`);
  const output = renderComponent(undefined, history);
  return output;
};

const toVerifyPath = async (path: string, title: string, history: History) => {
  expect(screen.queryByPlaceholderText(title)).toBeNull();
  history.push(path);
  await waitFor(() => screen.queryByPlaceholderText(title));
};

test('test routing to dashboard request page', async () => {
  const { history } = await renderApp();
  await toVerifyPath('/dashboard/admin/onboarding/tokenId01', 'Richiesta di adesione', history);
});
