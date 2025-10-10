import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { Redirect, useParams } from 'react-router';
import AdminPage from './pages/adminPage/testPage';
import DashboardRequest from './pages/dashboardRequest/DashboardRequest';
import { ENV } from './utils/env';

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
        path: `${ENV.ROUTES.ADMIN_PARTY_DETAIL}`,
        exact: true,
        component: DashboardRequest,
      },
      DASHBOARD_ONBOARDING_REQUESTS: {
        path: `${ENV.ROUTES.ADMIN_PARTY_DETAIL}`,
        exact: true,
        component: DashboardRequest,
      },
      DASHBOARD_ADMIN_SEARCH: {
        path: `${ENV.ROUTES.ADMIN_SEARCH}`,
        exact: true,
        component: AdminPage,
      },
    },
    ...buildRedirectToBasePath(ENV.ROUTES.ADMIN),
  },
};
