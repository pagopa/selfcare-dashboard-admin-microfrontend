import { TFunction } from 'i18next';

export const getFiltersConfig = (t: TFunction): Array<FilterConfig> => [
  {
    type: 'text',
    key: 'search',
    label: t('institutionOnboardings.filters.search'),
    grow: 2,  // search takes double space
  },
  {
    type: 'select',
    key: 'productIds',
    label: t('institutionOnboardings.filters.products'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('institutionOnboardings.filters.productA'), value: '1' },
      { label: t('institutionOnboardings.filters.productB'), value: '2' },
      { label: t('institutionOnboardings.filters.productC'), value: '3' },
      { label: t('institutionOnboardings.filters.productD'), value: '4' },
    ],
  },
  {
    type: 'select',
    key: 'institutionTypeIds',
    label: t('institutionOnboardings.filters.institutionTypes'),
    multiple: true,
    grow: 1,
    options: [
      { label: t('institutionOnboardings.filters.bank'),    value: 'bank' },
      { label: t('institutionOnboardings.filters.fintech'), value: 'fintech' },
      { label: t('institutionOnboardings.filters.bintech'), value: 'bintech' },
      { label: t('institutionOnboardings.filters.cintech'), value: 'cintech' },
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