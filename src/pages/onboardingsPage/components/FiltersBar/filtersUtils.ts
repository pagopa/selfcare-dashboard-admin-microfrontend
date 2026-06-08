import { Filters } from './types';

export const toApiDateTime = (date: string, endOfDay = false): string | undefined => {
  if (!date) {
    return undefined;
  }
  return endOfDay ? `${date}T23:59:59Z` : `${date}T00:00:00Z`;
};

export const parseFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);

  return {
    search: params.get('search') || '',
    productIds: params.get('productIds')?.split(',') || [],
    createdFromDate: params.get('createdFromDate') || '',
    createdToDate: params.get('createdToDate') || '',
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
  if (filters.createdFromDate) {
    params.set('createdFromDate', filters.createdFromDate);
  }
  if (filters.createdToDate) {
    params.set('createdToDate', filters.createdToDate);
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