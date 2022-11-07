import { Redirect, useParams } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { ENV } from './utils/env';
import DashboardRequestToBeAnswered from './pages/dashboardRequestToBeAnswered/DashboardRequestToBeAnswered';

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
        component: DashboardRequestToBeAnswered,
      },
      DASHBOARD_ONBOARDING_TO_BE_ANSWERED: {
        path: `${ENV.ROUTES.ADMIN}/:partyId`,
        exact: true,
        component: DashboardRequestToBeAnswered,
      },
    },
    ...buildRedirectToBasePath(ENV.ROUTES.ADMIN),
  },
};
