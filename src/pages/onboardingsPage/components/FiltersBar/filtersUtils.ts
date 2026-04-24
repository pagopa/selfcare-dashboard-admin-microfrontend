import { Filters } from './types';

export const parseFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);

  return {
    search: params.get('search') || '',
    productIds: params.get('productIds')?.split(',') || [],
    institutionTypeIds: params.get('institutionTypeIds')?.split(',') || [],
    stateIds: params.get('stateIds')?.split(',') || [],
    page: Number(params.get('page')) || 0,
    size: Number(params.get('size')) || 10,
  };
};

export const serializeFilters = (filters: Filters): string => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.productIds.length) {
    params.set('productIds', filters.productIds.join(','));
  }
  if (filters.institutionTypeIds.length) {
    params.set('institutionTypeIds', filters.institutionTypeIds.join(','));
  }
  if (filters.stateIds.length) {
    params.set('stateIds', filters.stateIds.join(','));
  }

  params.set('page', filters.page.toString());
  params.set('size', filters.size.toString());

  return params.toString();
};