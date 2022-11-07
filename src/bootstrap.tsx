import { Route } from 'react-router-dom';
import { DASHBOARD_ADMIN_ROUTES } from './routes';
import RoutingAdmin from './remotes/RoutingAdmin';
import { ENV } from './utils/env';
import { DashboardMicrofrontendPageProps } from './microcomponents/dashboard-routes-utils';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line functional/immutable-data
  (window as any).AppRouting = (props: DashboardMicrofrontendPageProps) => [
    <Route key="RoutingAdmin" path={ENV.ROUTES.ADMIN} exact={false}>
      <RoutingAdmin {...props} />
    </Route>,
  ];
  // eslint-disable-next-line functional/immutable-data
  (window as any).appRoutes = DASHBOARD_ADMIN_ROUTES;
  require('./microcomponents/mock_dashboard/indexMicrofrontend');
}
