import { mockedProductRoles } from '../../microcomponents/mock_dashboard/data/product';
import {
    ProductRolesLists,
    buildEmptyProductRolesLists,
    productRoles2ProductRolesList,
    transcodeProductRole2Description,
    transcodeProductRole2Title,
} from '../ProductRole';

describe('Product Roles Module', () => {
  describe('buildEmptyProductRolesLists', () => {
    test('should return an empty ProductRolesLists object', () => {
      const result = buildEmptyProductRolesLists();
      expect(result.list).toEqual([]);
      expect(result.groupByPartyRole).toMatchObject({
        MANAGER: [],
        DELEGATE: [],
        SUB_DELEGATE: [],
        OPERATOR: [],
      });
      expect(result.groupBySelcRole).toMatchObject({
        ADMIN: [],
        LIMITED: [],
      });
      expect(result.groupByProductRole).toMatchObject({});
    });
  });

  describe('productRoles2ProductRolesList', () => {
    test('should convert a list of ProductRoles to ProductRolesLists', () => {
      const result = productRoles2ProductRolesList(mockedProductRoles);
      expect(result.list).toEqual(mockedProductRoles);
    });
  });

  describe('transcodeProductRole2Title', () => {
    test('should transcode a ProductRole to its title', () => {
      const sampleProductRolesList: ProductRolesLists = {
        list: mockedProductRoles,
        groupByPartyRole: {
          DELEGATE: [],
          MANAGER: [],
          OPERATOR: [],
          SUB_DELEGATE: [],
        },
        groupBySelcRole: {
          ADMIN: [],
          LIMITED: [],
        },
        groupByProductRole: {
          productRole1: {
            title: 'Title 1',
            description: 'Description 1',
            productId: '',
            partyRole: 'DELEGATE',
            selcRole: 'ADMIN',
            multiroleAllowed: false,
            productRole: '',
          },
        },
      };

      const result = transcodeProductRole2Title('productRole1', sampleProductRolesList);
      expect(result).toBe('Title 1');
    });

    test('should return the productRole as title if no mapping exists', () => {
      const sampleProductRolesList: ProductRolesLists = {
        list: mockedProductRoles,
        groupByPartyRole: {
          DELEGATE: [],
          MANAGER: [],
          OPERATOR: [],
          SUB_DELEGATE: [],
        },
        groupBySelcRole: {
          ADMIN: [],
          LIMITED: [],
        },
        groupByProductRole: {},
      };

      const result = transcodeProductRole2Title('unknownRole', sampleProductRolesList);
      expect(result).toBe('unknownRole');
    });
  });

  describe('transcodeProductRole2Description', () => {
    test('should transcode a ProductRole to its description', () => {
      const sampleProductRolesList: ProductRolesLists = {
        list: mockedProductRoles,
        groupByPartyRole: {
          DELEGATE: [],
          MANAGER: [],
          OPERATOR: [],
          SUB_DELEGATE: [],
        },
        groupBySelcRole: {
          ADMIN: [],
          LIMITED: [],
        },
        groupByProductRole: {
          productRole1: {
            title: 'Title 1',
            description: 'Description 1',
            productId: '',
            partyRole: 'DELEGATE',
            selcRole: 'ADMIN',
            multiroleAllowed: false,
            productRole: '',
          },
        },
      };

      const result = transcodeProductRole2Description('productRole1', sampleProductRolesList);
      expect(result).toBe('Description 1');
    });

    test('should return the productRole as description if no mapping exists', () => {
      const sampleProductRolesList: ProductRolesLists = {
        list: mockedProductRoles,
        groupByPartyRole: {
          DELEGATE: [],
          MANAGER: [],
          OPERATOR: [],
          SUB_DELEGATE: [],
        },
        groupBySelcRole: {
          ADMIN: [],
          LIMITED: [],
        },
        groupByProductRole: {},
      };

      const result = transcodeProductRole2Description('unknownRole', sampleProductRolesList);
      expect(result).toBe('unknownRole');
    });
  });
});
