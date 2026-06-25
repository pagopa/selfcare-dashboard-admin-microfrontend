import { OnboardingIndexResource } from '../../api/generated/party-registry-proxy/OnboardingIndexResource';
import { OnboardingIndexSearchResource } from '../../api/generated/party-registry-proxy/OnboardingIndexSearchResource';
import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';

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

const MOCK_SEARCH_DELAY_MS = 500;

export const mockedSearchInstitutions: Array<SearchServiceInstitution> = INSTITUTION_NAMES.map(
  (name, i) => ({
    id: `inst-${String(i + 1).padStart(5, '0')}`,
    description: name,
    taxCode: `${80000000000 + i}`,
    parentDescription: PARENT_NAMES[i % PARENT_NAMES.length],
    lastModified: new Date(2025, i % 12, 1 + (i % 28)),
  })
);

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

const matchesInstitutionSearch = (
  institution: SearchServiceInstitution,
  searchText: string
): boolean => {
  const lower = searchText.toLowerCase();
  return [institution.description, institution.parentDescription, institution.taxCode, institution.id]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(lower));
};

export const mockedSearchInstitutionsService = (
  searchText: string
): Promise<Array<SearchServiceInstitution>> => {
  const results = mockedSearchInstitutions.filter((institution) =>
    matchesInstitutionSearch(institution, searchText)
  );

  return new Promise((resolve) => {
    setTimeout(() => resolve(results), MOCK_SEARCH_DELAY_MS);
  });
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
    isTest: i % 2 === 0,
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
  statuses: Array<string>,
  createdFromDate?: string,
  createdToDate?: string,
  _includeTest?: boolean
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
  if (createdFromDate) {
    const from = new Date(createdFromDate);
    filtered = filtered.filter((o) => o.createdAt && new Date(o.createdAt) >= from);
  }
  if (createdToDate) {
    const to = new Date(createdToDate);
    filtered = filtered.filter((o) => o.createdAt && new Date(o.createdAt) <= to);
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
  orderBy?: Array<string>,
  createdFromDate?: string,
  createdToDate?: string,
  includeTest?: boolean
): Promise<OnboardingIndexSearchResource> => {
  const filtered = applyFilters(
    mockedOnboardings,
    searchText,
    products,
    institutionTypes,
    statuses,
    createdFromDate,
    createdToDate,
    includeTest,
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
