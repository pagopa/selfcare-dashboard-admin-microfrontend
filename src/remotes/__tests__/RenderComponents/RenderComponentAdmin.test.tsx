import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { DashboardMicrofrontendPageProps } from '../../../microcomponents/dashboard-routes-utils';
import App from '../../../microcomponents/mock_dashboard/App';
import { createStore } from '../../../redux/store';
import { DASHBOARD_ADMIN_ROUTES } from '../../../routes';
import { ENV } from '../../../utils/env';
import RoutingAdmin from '../../RoutingAdmin';

vi.mock('../../../services/onboardingRequestService');
vi.mock('@pagopa/selfcare-common-frontend/lib/decorators/withLogin');

// eslint-disable-next-line functional/immutable-data
(window as any).appRoutes = DASHBOARD_ADMIN_ROUTES;

export const renderComponent = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  const appRouting = (props: DashboardMicrofrontendPageProps) => [
    <Route key="RoutingAdmin" path={ENV.ROUTES.ADMIN} exact={false}>
      <RoutingAdmin {...props} />
    </Route>,
  ];

  render(
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route path={ENV.ROUTES.ADMIN} exact={false}>
            <App AppRouting={appRouting} store={store} />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );
  return { store, history };
};

test('render test', async () => {
  await renderComponent();
});
