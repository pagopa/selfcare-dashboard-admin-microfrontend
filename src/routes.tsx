import { Redirect, useParams } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { ENV } from './utils/env';
import DashboardRequest from './pages/dashboardRequest/DashboardRequest';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  path: string;
  exact?: boolean;
  subRoutes?: RoutesObject;
  component?: React.ComponentType<any>;
};

const buildRedirectToBasePath = (basePath: string): RoutesObject => ({
  SUBPATH_DEFAULT: {
    path: `${basePath}/*`,
    component: (): React.FunctionComponentElement<any> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathVariables: { [key: string]: string } = useParams();
      const effectiveBasePath = resolvePathVariables(basePath, pathVariables);
      return <Redirect to={`${effectiveBasePath || basePath}`} />;
    },
  },
});

export const DASHBOARD_ADMIN_ROUTES = {
  DASHBOARD_ADMIN: {
    path: ENV.ROUTES.ADMIN,
    exact: false,
    subRoutes: {
      MAIN: {
        // TODO SUBSTITUTE WITH THE ADMIN "HOMEPAGE"
        path: `${ENV.ROUTES.ADMIN}`,
        exact: true,
        component: DashboardRequest,
      },
      DASHBOARD_ONBOARDING_REQUESTS: {
        path: `${ENV.ROUTES.ADMIN}/:tokenId`,
        exact: true,
        component: DashboardRequest,
      },
    },
    ...buildRedirectToBasePath(ENV.ROUTES.ADMIN),
  },
};
