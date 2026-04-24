import { Route, Switch } from 'react-router-dom';
import * as H from 'history';
import { Store } from 'redux';
import { i18n } from 'i18next';
import { Theme } from '@mui/material';
import { useMemo } from 'react';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { RouteConfig, RoutesObject } from '../routes';

export type DashboardMicrofrontendPageProps = {
  decorators?: DashboardDecoratorsType;
} & DashboardMicrocomponentsProps;

export type DashboardMicrocomponentsProps = {
  history: H.History;
  theme: Theme;
  store: Store<any, any>;
  i18n: i18n;
  CONFIG: typeof CONFIG;
};

export type DashboardDecoratorsType = {
  withProductRolesMap: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProduct: (WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>;
  withSelectedProductRoles: (
    WrappedComponent: React.ComponentType<any>
  ) => React.ComponentType<any>;
};

const reduceDecorators = (
  decorators: DashboardDecoratorsType,
  route: RouteConfig
): ((WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>) =>
  ['withProductRolesMap', 'withSelectedProductRoles', 'withSelectedProduct'].reduce(
    (out, decorator) =>
      (route as any)[decorator]
        ? (WrappedComponent: React.ComponentType<any>) =>
            (decorators as any)[decorator](out(WrappedComponent))
        : out,
    (WrappedComponent: React.ComponentType<any>) => WrappedComponent
  );

export const buildRoutes = (decorators: DashboardDecoratorsType, rs: RoutesObject) =>
  Object.values(rs).map((route, i) => {
    const { path, exact, component: Component, subRoutes } = route;
    const safeDecorators = decorators ?? ({
      withProductRolesMap: (WrappedComponent) => WrappedComponent,
      withSelectedProduct: (WrappedComponent) => WrappedComponent,
      withSelectedProductRoles: (WrappedComponent) => WrappedComponent,
    } as DashboardDecoratorsType);
    const decoratorResult = useMemo(
      () => (Component ? reduceDecorators(safeDecorators, route) : undefined),
      [Component, route, safeDecorators]
    );
    const WrappedComponent = useMemo(
      () => (Component && decoratorResult ? decoratorResult(Component) : undefined),
      [Component, decoratorResult]
    );
    return (
      <Route path={path} exact={exact} key={i}>
        {WrappedComponent && <WrappedComponent />}
        {subRoutes && <Switch>{buildRoutes(decorators, subRoutes)}</Switch>}
      </Route>
    );
  });
