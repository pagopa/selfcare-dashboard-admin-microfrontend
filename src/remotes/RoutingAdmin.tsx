import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { DashboardMicrocomponentsProps } from '../microcomponents/dashboard-routes-utils';
import DashboardRequestToBeAnswered from '../pages/dashboardRequestToBeAnswered/components/DashboardRequestToBeAnswered';
import { ENV } from '../utils/env';
import RemotePage from './RemotePage';

const RoutingAdmin = ({ history, store, i18n, theme, CONFIG }: DashboardMicrocomponentsProps) => (
  <RemotePage store={store} history={history} i18n={i18n} theme={theme} CONFIG={CONFIG}>
    <Switch>
      <Route path={ENV.ROUTES.ADMIN_PARTY_DETAIL} exact={true}>
        <DashboardRequestToBeAnswered />
      </Route>
      <Route path={'*'}>
        <h1> Elenco richieste </h1>
      </Route>
      {/* TODO Understand if need
      {buildRoutes(
        party,
        products,
        activeProducts,
        productsMap,
        decorators,
        DASHBOARD_ADMIN_ROUTES.DASHBOARD_ADMIN.subRoutes
      )} */}
    </Switch>
  </RemotePage>
);

export default RoutingAdmin;
