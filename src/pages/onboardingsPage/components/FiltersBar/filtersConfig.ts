import { TFunction } from 'i18next';
import { Product } from '../../../../model/Product';
import { FilterConfig } from './types';

const getProductOptions = (products: Array<Product>): Array<{ label: string; value: string }> => {
  const activeProducts = products.filter((p) => p.status === 'ACTIVE' || p.status === 'TESTING');

  return activeProducts.flatMap((p) => {
    const productOption = { label: p.title, value: p.id };

    const subProductOptions = (p.subProducts ?? [])
      .filter((sp) => sp.status === 'ACTIVE' && sp.id && sp.title)
      .map((sp) => ({ label: sp.title as string, value: sp.id as string }));

    return [productOption, ...subProductOptions];
  });
};

export const getFiltersConfig = (t: TFunction, products: Array<Product>): Array<FilterConfig> => [
  {
    type: 'text',
    key: 'search',
    label: t('onboardingsPage.filters.search'),
    grow: 2,
  },
  {
    type: 'select',
    key: 'productIds',
    label: t('onboardingsPage.filters.products'),
    multiple: true,
    grow: 1,
    options: getProductOptions(products),
  },
  {
    type: 'select',
    key: 'institutionTypeIds',
    label: t('onboardingsPage.filters.institutionTypes'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('common.institutionType.descriptions.pa'), value: 'PA' },
      { label: t('common.institutionType.descriptions.gsp'), value: 'GSP' },
      { label: t('common.institutionType.descriptions.pt'), value: 'PT' },
      { label: t('common.institutionType.descriptions.scp'), value: 'SCP' },
      { label: t('common.institutionType.descriptions.psp'), value: 'PSP' },
      { label: t('common.institutionType.descriptions.sa'), value: 'SA' },
      { label: t('common.institutionType.descriptions.as'), value: 'AS' },
      { label: t('common.institutionType.descriptions.pg'), value: 'PG' },
      { label: t('common.institutionType.descriptions.prv'), value: 'PRV' },
      { label: t('common.institutionType.descriptions.prv_pf'), value: 'PRV_PF' },
      { label: t('common.institutionType.descriptions.gpu'), value: 'GPU' },
      { label: t('common.institutionType.descriptions.scec'), value: 'SCEC' },
      { label: t('common.institutionType.descriptions.rec'), value: 'REC' },
      { label: t('common.institutionType.descriptions.con'), value: 'CON' },
    ],
  },
  {
    type: 'select',
    key: 'stateIds',
    label: t('onboardingsPage.filters.status'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('onboardingsPage.filters.statusOptions.toBeValidated'), value: 'TOBEVALIDATED' },
      { label: t('onboardingsPage.filters.statusOptions.pending'), value: 'PENDING' },
      { label: t('onboardingsPage.filters.statusOptions.completed'), value: 'COMPLETED' },
      { label: t('onboardingsPage.filters.statusOptions.failed'), value: 'FAILED' },
      { label: t('onboardingsPage.filters.statusOptions.rejected'), value: 'REJECTED' },
      { label: t('onboardingsPage.filters.statusOptions.deleted'), value: 'DELETED' },
    ],
  },
];
