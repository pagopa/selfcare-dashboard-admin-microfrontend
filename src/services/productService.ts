import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { DashboardApi } from '../api/DashboardApiClient';
import { ProductRolePermissionsList } from '../api/generated/b4f-dashboard/ProductRolePermissionsList';
import { mockedPartyProducts } from '../microcomponents/mock_dashboard/data/product';
import { Product, productResource2Product } from '../model/Product';

export const COMMON_ADMIN_ACTIONS = [
  Actions.AccessProductBackoffice,
  Actions.AccessProductBackofficeAdmin,
  Actions.CreateProductUsers,
  Actions.UpdateProductUsers,
  Actions.DeleteProductUsers,
  Actions.ListProductUsers,
  Actions.ListProductGroups,
  Actions.ListAllProductUsers,
  Actions.ListAllProductGroups,
  Actions.ManageProductGroups,
  Actions.ViewDelegations,
  Actions.ViewBilling,
  Actions.ListActiveProducts,
  Actions.ListAvailableProducts,
  Actions.CreateDelegation,
  Actions.ViewContract,
  Actions.UpdateGeoTaxonomy,
];

export const fetchProducts = (): Promise<Array<Product>> => {
  if (process.env.VITE_API_MOCK_PRODUCTS === 'true') {
    return Promise.resolve(mockedPartyProducts);
  } else {
    return DashboardApi.getProducts().then((productResources) =>
      productResources ? productResources.map(productResource2Product) : []
    );
  }
};

export const getPermissionsListService = (): Promise<ProductRolePermissionsList> => {
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve({
      permissions: [
        {
          productId: 'ALL',
          role: 'mocked-role',
          permissions: COMMON_ADMIN_ACTIONS,
        },
      ],
    });
  } else {
    return DashboardApi.permissionsList();
  }
};
