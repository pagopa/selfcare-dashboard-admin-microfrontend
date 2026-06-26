import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Switch, MemoryRouter } from 'react-router-dom';
import React from 'react';
import { buildRoutes } from '../dashboard-routes-utils';
import type { DashboardDecoratorsType } from '../dashboard-routes-utils';
import type { RoutesObject } from '../../routes';

// ── helpers ──────────────────────────────────────────────────────────────────
const identity = (C: React.ComponentType<any>) => C;

const baseDecorators: DashboardDecoratorsType = {
  withProductRolesMap: identity,
  withSelectedProduct: identity,
  withSelectedProductRoles: identity,
};

const SimplePage = () => <div data-testid="simple-page">Simple Page</div>;

/**
 * buildRoutes uses useMemo internally, so it must be called inside a component.
 * This wrapper renders routes inside a Switch so React hooks rules are satisfied.
 */
const RoutesWrapper = ({
  decorators,
  routes,
}: {
  decorators: DashboardDecoratorsType;
  routes: RoutesObject;
}) => <Switch>{buildRoutes(decorators, routes)}</Switch>;

// ── buildRoutes ──────────────────────────────────────────────────────────────
describe('buildRoutes', () => {
  it('renders the correct number of Route elements for each entry', () => {
    const routes: RoutesObject = {
      ROUTE_A: { path: '/a', exact: true, component: SimplePage },
      ROUTE_B: { path: '/b', exact: true, component: SimplePage },
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <RoutesWrapper decorators={baseDecorators} routes={routes} />
      </MemoryRouter>
    );

    // Only the matched route renders its component
    expect(screen.getAllByTestId('simple-page')).toHaveLength(1);
  });

  it('renders the component when the path matches', () => {
    const routes: RoutesObject = {
      ROUTE_A: { path: '/a', exact: true, component: SimplePage },
    };

    render(
      <MemoryRouter initialEntries={['/a']}>
        <RoutesWrapper decorators={baseDecorators} routes={routes} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('simple-page')).toBeInTheDocument();
  });

  it('does not render the component when the path does not match', () => {
    const routes: RoutesObject = {
      ROUTE_A: { path: '/a', exact: true, component: SimplePage },
    };

    render(
      <MemoryRouter initialEntries={['/other']}>
        <RoutesWrapper decorators={baseDecorators} routes={routes} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('simple-page')).not.toBeInTheDocument();
  });

  it('renders nothing inside the route when no component is provided', () => {
    const routes: RoutesObject = {
      ROUTE_EMPTY: { path: '/empty', exact: true },
    };

    render(
      <MemoryRouter initialEntries={['/empty']}>
        <RoutesWrapper decorators={baseDecorators} routes={routes} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('simple-page')).not.toBeInTheDocument();
  });

  it('applies withProductRolesMap decorator when the route opt-in flag is set', () => {
    const withProductRolesMap = vi.fn().mockImplementation(identity);
    const customDecorators: DashboardDecoratorsType = {
      withProductRolesMap,
      withSelectedProduct: identity,
      withSelectedProductRoles: identity,
    };

    const routes: RoutesObject = {
      ROUTE_DECORATED: {
        path: '/dec',
        exact: true,
        component: SimplePage,
        withProductRolesMap: true,
      } as any,
    };

    render(
      <MemoryRouter initialEntries={['/dec']}>
        <RoutesWrapper decorators={customDecorators} routes={routes} />
      </MemoryRouter>
    );

    expect(withProductRolesMap).toHaveBeenCalled();
  });
});
