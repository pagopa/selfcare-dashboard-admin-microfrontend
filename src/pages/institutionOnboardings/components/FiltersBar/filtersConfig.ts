import { TFunction } from 'i18next';
import { Product } from '../../../../model/Product';

export const getFiltersConfig = (t: TFunction, products: Array<Product>): Array<FilterConfig> => [
  {
    type: 'text',
    key: 'search',
    label: t('institutionOnboardings.filters.search'),
    grow: 2, // search takes double space
  },
  {
    type: 'select',
    key: 'productIds',
    label: t('institutionOnboardings.filters.products'),
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
    label: t('institutionOnboardings.filters.institutionTypes'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('common.institutionType.descriptions.pa'),   value: 'PA' },
      { label: t('common.institutionType.descriptions.gsp'),  value: 'GSP' },
      { label: t('common.institutionType.descriptions.pt'),   value: 'PT' },
      { label: t('common.institutionType.descriptions.scp'),  value: 'SCP' },
      { label: t('common.institutionType.descriptions.psp'),  value: 'PSP' },
      { label: t('common.institutionType.descriptions.sa'),   value: 'SA' },
      { label: t('common.institutionType.descriptions.as'),   value: 'AS' },
      { label: t('common.institutionType.descriptions.pg'),   value: 'PG' },
      { label: t('common.institutionType.descriptions.prv'),  value: 'PRV' },
      { label: t('common.institutionType.descriptions.gpu'),  value: 'GPU' },
      { label: t('common.institutionType.descriptions.scec'), value: 'SCEC' },
    ],
  },
  {
    type: 'select',
    key: 'stateIds',
    label: t('institutionOnboardings.filters.status'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('institutionOnboardings.filters.active'),   value: 'active' },
      { label: t('institutionOnboardings.filters.inactive'), value: 'inactive' },
      { label: t('institutionOnboardings.filters.pending'),  value: 'pending' },
      { label: t('institutionOnboardings.filters.rejected'), value: 'rejected' },
    ],
  },
];