import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { DashboardApi } from '../api/DashboardApiClient';
import { ProductRolePermissionsList } from '../api/generated/b4f-dashboard/ProductRolePermissionsList';
import { institutionResource2Party, Party } from '../model/Party';
import { mockedParties } from './__mocks__/dashboardService';

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


export const fetchPartyDetailsService = (partyId: string): Promise<Party | null> => {
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve(mockedParties[2] ?? null);
  } else {
    const apiToCall = isPagoPaUser()
      ? DashboardApi.getAllInstituionById
      : DashboardApi.getInstitution;

    return apiToCall(partyId).then((institutionResource) =>
      institutionResource ? institutionResource2Party(institutionResource) : null
    );
  }
};

export const getTokenExchangeAdminService = (
  institutionId: string,
  productId: string,
  environment?: string,
  lang?: string
): Promise<string> => {
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve('mocked-token');
  } else {
    return DashboardApi.tokenExchangeAdmin(institutionId, productId, environment, lang);
  }
};



export const getPermissionsListService = (): Promise<ProductRolePermissionsList> => {
  if (process.env.VITE_API_MOCK_REQUEST_DATA === 'true') {
    return Promise.resolve({
      items: [
        {
          productId: 'ALL',
          role: 'mocked-role',
          permissions: COMMON_ADMIN_ACTIONS,
        },
        {
          productId: 'prod-pn',
          role: 'mocked-role',
          permissions: COMMON_ADMIN_ACTIONS,
        },
        {
          productId: 'prod-io',
          role: 'mocked-role',
          permissions: COMMON_ADMIN_ACTIONS,
        },
      ],
    } as ProductRolePermissionsList);
  } else {
    return DashboardApi.permissionsList();
  }
};
