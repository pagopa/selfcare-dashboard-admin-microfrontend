import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useParams, Route, Switch, useHistory } from 'react-router';
import { isEmpty } from 'lodash';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
import { Box, Grid, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { CONFIG } from '@pagopa/selfcare-common-frontend/config/env';
import { Product } from '../../model/Product';
import { productRoles2ProductRolesList, ProductsRolesMap } from '../../model/ProductRole';
import { createStore } from '../../redux/store';
import {
  DashboardDecoratorsType,
  DashboardMicrofrontendPageProps,
} from '../dashboard-routes-utils';
import { mockedOnboardingRequests } from '../../services/__mocks__/dashboardRequestService';
import { mockedPartyProducts } from './data/product';
import { mockedProductRoles } from './data/product';
import Layout from './Layout';

type UrlParams = {
  tokenId: string;
  partyId: string;
  productId: string;
};

type RoutesObject = { [key: string]: RouteConfig };

type RouteConfig = {
  path: string;
  exact?: boolean;
  subRoutes?: RoutesObject;
  component?: React.ComponentType<any>;
  withProductRolesMap?: boolean;
  withSelectedProduct?: boolean;
  withSelectedProductRoles?: boolean;
};

const reduceRouteConfig = (key: string, routes: RoutesObject): any =>
  Object.entries(routes).map(([innerkey, route]) =>
    innerkey === 'SUBPATH_DEFAULT'
      ? undefined
      : route.subRoutes && !isEmpty(route.subRoutes)
      ? reduceRouteConfig(`${key}${innerkey}.`, route.subRoutes)
      : { [`${key}${innerkey}`]: route.path }
  );

const App = ({
  AppRouting,
  store,
}: {
  AppRouting: (props: DashboardMicrofrontendPageProps) => Array<React.ReactNode>;
  store: ReturnType<typeof createStore>;
}) => {
  const { tokenId } = useParams<UrlParams>();
  const history = useHistory();
  const theme = useTheme();
  const { i18n } = useTranslation();

  const onboardingRequests = mockedOnboardingRequests;
  const onboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
  const products = onboardingRequest ? mockedPartyProducts : undefined;
  const productsRolesMap = onboardingRequest
    ? products?.reduce((acc: ProductsRolesMap, p: Product) => {
        // eslint-disable-next-line functional/immutable-data
        acc[p.id] = productRoles2ProductRolesList(
          mockedProductRoles.map((r) => ({ ...r, productId: p.id }))
        );
        return acc;
      }, {} as ProductsRolesMap)
    : undefined;

  const availableTokenIds = mockedOnboardingRequests.map((r) => r.tokenId).join(', ');
  const availableProducts = mockedPartyProducts.map((p) => p.id).join(', ');

  const availableRoutesBody = Object.keys(
    Array.from(
      JSON.stringify((window as any).appRoutes).match(/"path":"[^"]+/g) as Array<string>,
      (m) => m.substring(8)
    )
      .filter((url) => !url.endsWith('/*'))
      .reduce((acc, u) => {
        // eslint-disable-next-line functional/immutable-data
        acc[u] = u;
        return acc;
      }, {} as any)
  ).map((url) => (
    <Fragment key={url}>
      <Link to={url} title={url}>
        {url}
      </Link>
      <br />
    </Fragment>
  ));

  const decorators: DashboardDecoratorsType = {
    withProductRolesMap:
      (
        WrappedComponent: React.ComponentType<{
          decorators: DashboardDecoratorsType;
        }>
      ) =>
      (props: any) =>
        <WrappedComponent productsRolesMap={productsRolesMap} {...props} />,

    withSelectedProductRoles: (WrappedComponent: React.ComponentType<any>) => (props: any) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { productId } = useParams<UrlParams>();
      const productRolesList = productId ? productsRolesMap?.[productId] : undefined;
      return <WrappedComponent productRolesList={productRolesList} {...props} />;
    },

    withSelectedProduct: (WrappedComponent: React.ComponentType<any>) => (props: any) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { productId } = useParams<UrlParams>();
      const selectedProduct = productId
        ? mockedPartyProducts.find((p) => p.id === productId)
        : undefined;
      return selectedProduct ? (
        <WrappedComponent selectedProduct={selectedProduct} {...props} />
      ) : (
        <>
          Product not available! Use one of: <br />
          {availableProducts}
        </>
      );
    },
  };

  return tokenId && onboardingRequest && onboardingRequests ? (
    <ErrorBoundary>
      <Layout>
        <LoadingOverlay />
        <UserNotifyHandle />
        <UnloadEventHandler />

        <Grid container item justifyContent="center" xs={12}>
          <Grid item xs={12} display="flex" pb={16}>
            <Switch>
              {AppRouting({
                history,
                store,
                theme,
                i18n,
                decorators,
                CONFIG,
              })}
              <Route path="*">
                <Box>
                  DASHBOARD
                  <br />
                  <Box>{availableRoutesBody}</Box>
                </Box>
              </Route>
            </Switch>
          </Grid>
        </Grid>
      </Layout>
    </ErrorBoundary>
  ) : (
    <>
      Token not available! Use one of: <br />
      {availableTokenIds}
    </>
  );
};

export default withLogin(App);
