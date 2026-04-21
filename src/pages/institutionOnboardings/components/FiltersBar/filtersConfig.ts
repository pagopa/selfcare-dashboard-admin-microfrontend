import { TFunction } from 'i18next';
import { Product } from '../../../../model/Product';

export const getFiltersConfig = (t: TFunction, products: Array<Product>): Array<FilterConfig> => [
  {
    type: 'text',
    key: 'search',
    label: t('onboardingsPage.filters.search'),
    grow: 2, // search takes double space
  },
  {
    type: 'select',
    key: 'productIds',
    label: t('onboardingsPage.filters.products'),
    multiple: true,
    grow: 1,
    options: products.map((p) => ({
      label: p.title,
      value: p.id,
    })),
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
      { label: t('common.institutionType.descriptions.gpu'), value: 'GPU' },
      { label: t('common.institutionType.descriptions.scec'), value: 'SCEC' },
    ],
  },
  {
    type: 'select',
    key: 'stateIds',
    label: t('onboardingsPage.filters.status'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('onboardingsPage.filters.statusOptions.request'), value: 'REQUEST' },
      { label: t('onboardingsPage.filters.statusOptions.toBeValidated'), value: 'TO_BE_VALIDATED' },
      { label: t('onboardingsPage.filters.statusOptions.pending'), value: 'PENDING' },
      { label: t('onboardingsPage.filters.statusOptions.completed'), value: 'COMPLETED' },
      { label: t('onboardingsPage.filters.statusOptions.failed'), value: 'FAILED' },
      { label: t('onboardingsPage.filters.statusOptions.rejected'), value: 'REJECTED' },
      { label: t('onboardingsPage.filters.statusOptions.deleted'), value: 'DELETED' },
    ],
  },
];
