import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { Redirect, useParams } from 'react-router';
import AdminPage from './pages/adminPage/AdminPage';
import AdminContractPage from './pages/adminContractPage/AdminContractPage';
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

const buildRedirectToBasePath = (basePath: string): RoutesObject => {
  const basePathWithoutParams = basePath.replace(/:.*/, '');
  return {
    SUBPATH_DEFAULT: {
      path: `${basePathWithoutParams}/*`,
      component: (): React.FunctionComponentElement<any> => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const pathVariables: { [key: string]: string } = useParams();
        const effectiveBasePath = resolvePathVariables(basePath, pathVariables);
        return <Redirect to={`${effectiveBasePath || basePath}`} />;
      },
    },
  };
};

export const DASHBOARD_ADMIN_ROUTES = {
  DASHBOARD_ADMIN: {
    path: ENV.ROUTES.ADMIN,
    exact: false,
    subRoutes: {
      MAIN: {
        // TODO SUBSTITUTE WITH THE ADMIN "HOMEPAGE"
        path: 'onboarding/:tokenId',
        exact: true,
        component: DashboardRequest,
      },
      DASHBOARD_ONBOARDING_REQUESTS: {
        path: 'onboarding/:tokenId',
        exact: true,
        component: DashboardRequest,
      },
      DASHBOARD_ADMIN_SEARCH: {
        path: 'search',
        exact: true,
        component: AdminPage,
      },
      ADMIN_CONTRACT: {
        path: 'contracts',
        exact: true,
        component: AdminContractPage,
      },
    },
    ...buildRedirectToBasePath(ENV.ROUTES.ADMIN),
  },
};
