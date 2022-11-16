import { Switch } from 'react-router';
import { DASHBOARD_ADMIN_ROUTES } from '../routes';
import {
  buildRoutes,
  DashboardMicrofrontendPageProps,
} from '../microcomponents/dashboard-routes-utils';
import RemotePage from './RemotePage';

const RoutingAdmin = ({
  history,
  store,
  i18n,
  theme,
  onboardingRequests,
  onboardingRequest,
  products,
  activeProducts,
  productsMap,
  decorators,
  CONFIG,
}: DashboardMicrofrontendPageProps) => (
  <RemotePage store={store} history={history} i18n={i18n} theme={theme} CONFIG={CONFIG}>
    <Switch>
      {buildRoutes(
        products,
        activeProducts,
        onboardingRequests,
        onboardingRequest,
        productsMap,
        decorators,
        DASHBOARD_ADMIN_ROUTES.DASHBOARD_ADMIN.subRoutes
      )}
    </Switch>
  </RemotePage>
);

export default RoutingAdmin;
