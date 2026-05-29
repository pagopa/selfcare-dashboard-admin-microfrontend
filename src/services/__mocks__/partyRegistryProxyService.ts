import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { OnboardingIndexSearchResource } from '../../api/generated/party-registry-proxy/OnboardingIndexSearchResource';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';

export const mockedSearchInstitutions: Array<SearchServiceInstitution> = [
  {
    id: '3',
    description:
      'Istituzione 1asdsad adsad asbdas sad adas dasdas das adasd asdasdsa , adsa dsad a,as,d asd asd asdas,a asdas sadasd asd asdas,das dad,asa,d sa asd asdsad asdsa dsadas dsadasd sad sadasdsad asdasdasdsa dsadasdasdasd sadasd asd sad sad asd asd nasdkjbasjkdfhsakjfdbakjsbdkjsabjkdj asd asd ,sa ,d asd ',
    institutionTypes: ['PA'],
    products: ['prod-io', 'prod-pagopa'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654321',
    description: 'Istituzione 2',
    institutionTypes: ['PA'],
    products: ['prod-interop', 'prod-interop-atst'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654322',
    description: 'Istituzione 3',
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654322',
    description: 'Istituzione 3',
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654322',
    description: 'Istituzione 4',
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654322',
    description: 'Istituzione 5',
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
  {
    id: '10987654322',
    description: 'Istituzione 6',
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: '12345678901',
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  },
];

export const mockedEmptySearchInstitutions: Array<SearchServiceInstitution> = [];

export const mockedLongSearchInstitutions: Array<SearchServiceInstitution> = Array.from(
  { length: 100 },
  (_, i) => ({
    id: `1234567890${i}`,
    description: `Istituzione ${i}`,
    institutionTypes: ['PA'],
    products: ['PRODOTTO_1', 'PRODOTTO_2'],
    taxCode: `1234567890${i}`,
    parentDescription: 'Ente di appartenenza',
    lastModified: new Date(),
  })
);

export const mockedSearchInstitutionsService = (
  searchText: string
): Promise<Array<SearchServiceInstitution>> => {
  const selectedInstitution = mockedSearchInstitutions.filter((inst) =>
    inst.description?.includes(searchText)
  );
  if (selectedInstitution) {
    return Promise.resolve(selectedInstitution);
  } else {
    return Promise.reject(new Error('Institution not found!'));
  }
};

const DATES = [
  new Date(2025, 0, 10),
  new Date(2025, 1, 15),
  new Date(2025, 2, 20),
  new Date(2025, 3, 25),
  new Date(2025, 4, 30),
];
const STATUSES = [
  'PENDING',
  'TOBEVALIDATED',
  'COMPLETED',
  'SUSPENDED',
  'REJECTED',
  'DELETED',
  'FAILED',
] as const;
const PRODUCTS = ['prod-io', 'prod-pagopa', 'prod-interop', 'prod-pn', 'prod-cgn'] as const;
const INSTITUTION_TYPES = ['PA', 'GSP', 'PSP', 'PT', 'SCP', 'SA'] as const;
const INSTITUTION_NAMES = [
  'Comune di Roma',
  'Comune di Milano',
  'Comune di Napoli',
  'Comune di Torino',
  'Comune di Palermo',
  'Regione Lazio',
  'Regione Lombardia',
  'Regione Campania',
  'Provincia di Bolzano',
  'ASL Roma 1',
  'Agenzia delle Entrate',
  'INPS - Istituto Nazionale Previdenza Sociale',
  'Ministero della Salute',
  'Autorità Portuale di Genova',
  'Università La Sapienza',
  'Politecnico di Milano',
  'Camera di Commercio di Firenze',
  'Comune di Bologna',
  'Comune di Venezia',
  'Comune di Bari',
  'Comune di Catania',
  'Comune di Verona',
  'Comune di Messina',
  'Comune di Padova',
  'Comune di Trieste',
] as const;
const PARENT_NAMES = ['Ente di appartenenza 1', 'Ente di appartenenza 2'] as const;

export const mockedOnboardings: Array<OnboardingIndexResource> = Array.from(
  { length: 25 },
  (_, i) => ({
    onboardingId: `onb-${String(i + 1).padStart(3, '0')}`,
    description: INSTITUTION_NAMES[i % INSTITUTION_NAMES.length],
    parentDescription: PARENT_NAMES[i % PARENT_NAMES.length],
    productId: PRODUCTS[i % PRODUCTS.length],
    institutionType: INSTITUTION_TYPES[i % INSTITUTION_TYPES.length],
    createdAt: DATES[i % DATES.length],
    status: STATUSES[i % STATUSES.length],
    institutionId: `inst-${String(i + 1).padStart(5, '0')}`,
    taxCode: `${80000000000 + i}`,
    updatedAt: new Date(2025, 1 + (i % 11), 5 + (i % 15)),
  })
);

const applyFilters = (
  onboardings: Array<OnboardingIndexResource>,
  searchText: string,
  products: Array<string>,
  institutionTypes: Array<string>,
  statuses: Array<string>
): Array<OnboardingIndexResource> => {
  // eslint-disable-next-line functional/no-let
  let filtered = [...onboardings];

  if (searchText) {
    const lower = searchText.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.description?.toLowerCase().includes(lower) || o.taxCode?.toLowerCase().includes(lower)
    );
  }
  if (products.length > 0) {
    filtered = filtered.filter((o) => o.productId && products.includes(o.productId));
  }
  if (institutionTypes.length > 0) {
    filtered = filtered.filter(
      (o) => o.institutionType && institutionTypes.includes(o.institutionType)
    );
  }
  if (statuses.length > 0) {
    filtered = filtered.filter((o) => o.status && statuses.includes(o.status));
  }

  return filtered;
};

const applySort = (
  onboardings: Array<OnboardingIndexResource>,
  orderBy?: Array<string>
  // eslint-disable-next-line sonarjs/cognitive-complexity
): Array<OnboardingIndexResource> => {
  if (!orderBy?.length) {
    return onboardings;
  }

  return [...onboardings].sort((a, b) => {
    for (const clause of orderBy) {
      const [field, direction] = clause.split(' ');
      const dir = direction === 'desc' ? -1 : 1;
      const aVal = a[field as keyof typeof a];
      const bVal = b[field as keyof typeof b];
      if (aVal == null && bVal == null) {
        continue;
      }
      if (aVal == null) {
        return 1;
      }
      if (bVal == null) {
        return -1;
      }
      if (aVal < bVal) {
        return -1 * dir;
      }
      if (aVal > bVal) {
        return 1 * dir;
      }
    }
    return 0;
  });
};

const applyPagination = (
  onboardings: Array<OnboardingIndexResource>,
  page: number,
  pageSize: number
) => {
  const start = page * pageSize;
  return onboardings.slice(start, start + pageSize);
};

export const mockedSearchOnboardingsService = (
  searchText: string,
  products: Array<string>,
  institutionTypes: Array<string>,
  statuses: Array<string>,
  page: number,
  pageSize: number,
  orderBy?: Array<string>
): Promise<OnboardingIndexSearchResource> => {
  console.log('Mocked search onboardings with', {
    searchText,
    products,
    orderBy,
  });
  const filtered = applyFilters(
    mockedOnboardings,
    searchText,
    products,
    institutionTypes,
    statuses
  );
  const sorted = applySort(filtered, orderBy);
  const paged = applyPagination(sorted, page, pageSize);

  return Promise.resolve({
    onboardings: paged,
    page,
    pageSize,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize),
  } as OnboardingIndexSearchResource);
};
