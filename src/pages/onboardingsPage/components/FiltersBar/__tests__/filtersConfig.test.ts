import { TFunction } from 'i18next';
import { describe, expect, it, vi } from 'vitest';
import { StatusEnum } from '../../../../../api/generated/b4f-dashboard/ProductsResource';
import { Product } from '../../../../../model/Product';
import { getFiltersConfig } from '../filtersConfig';

const mockProduct1: Product = {
  id: 'prod1',
  title: 'Product 1',
  status: StatusEnum.ACTIVE,
  subProducts: [],
  description: '',
  logo: '',
  urlBO: '',
  imageUrl: '',
  delegable: false,
  invoiceable: false
};

const mockProduct2: Product = {
  id: 'prod2',
  title: 'Product 2',
  status: StatusEnum.ACTIVE,
  subProducts: [
    { id: 'subprod1', title: 'Sub Product 1', status: StatusEnum.ACTIVE },
    { id: 'subprod2', title: 'Sub Product 2', status: StatusEnum.INACTIVE }, // Should be excluded
  ],
  description: '',
  logo: '',
  urlBO: '',
  imageUrl: '',
  delegable: false,
  invoiceable: false
};

const mockProduct3: Product = {
  id: 'prod3',
  title: 'Testing Product',
  status: StatusEnum.TESTING,
  subProducts: [],
  description: '',
  logo: '',
  urlBO: '',
  imageUrl: '',
  delegable: false,
  invoiceable: false
};

const mockProduct4: Product = {
  id: 'prod4',
  title: 'Inactive Product',
  status: StatusEnum.INACTIVE,
  subProducts: [],
  description: '',
  logo: '',
  urlBO: '',
  imageUrl: '',
  delegable: false,
  invoiceable: false
};

const mockT = vi.fn((key: string) => key) as unknown as TFunction<'translation', undefined>;

describe('filtersConfig', () => {
  describe('getFiltersConfig', () => {
    it('should return filter config with text, select, and date filters', () => {
      const config = getFiltersConfig(mockT, []);

      const textFilters = config.filter((f) => f.type === 'text');
      const selectFilters = config.filter((f) => f.type === 'select');
      const dateFilters = config.filter((f) => f.type === 'date');

      expect(textFilters.length).toBeGreaterThan(0);
      expect(selectFilters.length).toBeGreaterThan(0);
      expect(dateFilters.length).toBeGreaterThan(0);
    });

    it('should include search text filter', () => {
      const config = getFiltersConfig(mockT, []);
      const searchFilter = config.find((f) => f.type === 'text' && f.key === 'search');

      expect(searchFilter).toBeDefined();
      expect(searchFilter?.label).toBe('onboardingsPage.filters.search');
    });

    it('should include product select filter with active and testing products', () => {
      const products = [mockProduct1, mockProduct3, mockProduct4];
      const config = getFiltersConfig(mockT, products);
      const productFilter = config.find((f) => f.type === 'select' && f.key === 'productIds');

      expect(productFilter).toBeDefined();
      expect(productFilter?.type).toBe('select');
      // Should have 2 active/testing products
      if (productFilter?.type === 'select') {
        expect(productFilter.options?.map((o) => o.value)).toContain('prod1');
        expect(productFilter.options?.map((o) => o.value)).toContain('prod3');
        expect(productFilter.options?.map((o) => o.value)).not.toContain('prod4');
      }
    });

    it('should include subproducts with ACTIVE status only', () => {
      const products = [mockProduct2];
      const config = getFiltersConfig(mockT, products);
      const productFilter = config.find((f) => f.type === 'select' && f.key === 'productIds');

      if (productFilter?.type === 'select') {
        const values = productFilter.options?.map((o) => o.value) || [];
        expect(values).toContain('subprod1');
        expect(values).not.toContain('subprod2');
      }
    });

    it('should include date range filters', () => {
      const config = getFiltersConfig(mockT, []);
      const dateFilters = config.filter((f) => f.type === 'date');

      expect(dateFilters).toHaveLength(4);
      expect(dateFilters[0].key).toBe('createdFromDate');
      expect(dateFilters[1].key).toBe('createdToDate');
      expect(dateFilters[2].key).toBe('updatedFromDate');
      expect(dateFilters[3].key).toBe('updatedToDate');
    });

    it('should include institution type select filter with all options', () => {
      const config = getFiltersConfig(mockT, []);
      const instTypeFilter = config.find((f) => f.type === 'select' && f.key === 'institutionTypeIds');

      expect(instTypeFilter).toBeDefined();
      if (instTypeFilter?.type === 'select') {
        expect(instTypeFilter.options?.length).toBeGreaterThan(0);
        expect(instTypeFilter.options?.map((o) => o.value)).toContain('PA');
        expect(instTypeFilter.options?.map((o) => o.value)).toContain('GSP');
      }
    });

    it('should include state/status select filter', () => {
      const config = getFiltersConfig(mockT, []);
      const stateFilter = config.find((f) => f.type === 'select' && f.key === 'stateIds');

      expect(stateFilter).toBeDefined();
      expect(stateFilter?.label).toBe('onboardingsPage.filters.status');
      if (stateFilter?.type === 'select') {
        expect(stateFilter.options?.length).toBeGreaterThan(0);
      }
    });
  });
});
