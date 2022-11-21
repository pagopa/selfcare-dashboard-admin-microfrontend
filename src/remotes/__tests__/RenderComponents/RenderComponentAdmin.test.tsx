import { createMemoryHistory, History } from 'history';
import { Router, Route, Switch } from 'react-router';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DASHBOARD_ADMIN_ROUTES } from '../../../routes';
import { createStore } from '../../../redux/store';
import { DashboardMicrofrontendPageProps } from '../../../microcomponents/dashboard-routes-utils';
import { ENV } from '../../../utils/env';
import RoutingAdmin from '../../RoutingAdmin';
import App from '../../../microcomponents/mock_dashboard/App';
import React from 'react';

jest.mock('../../../services/dashboardRequestService');
jest.mock('@pagopa/selfcare-common-frontend/decorators/withLogin');

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
