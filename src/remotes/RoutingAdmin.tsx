import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { DashboardMicrocomponentsProps } from '../microcomponents/dashboard-routes-utils';
import RemotePage from './RemotePage';

const RoutingAdmin = ({ history, store, i18n, theme, CONFIG }: DashboardMicrocomponentsProps) => (
  <RemotePage store={store} history={history} i18n={i18n} theme={theme} CONFIG={CONFIG}>
    <Switch>
      <Route path={'*'}>
        <h1> Non funziona</h1>
      </Route>
      {/*
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
