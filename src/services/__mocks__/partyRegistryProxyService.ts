import { SearchServiceInstitution } from '../../api/generated/party-registry-proxy/SearchServiceInstitution';

export const mockedSearchInstitutions: Array<SearchServiceInstitution> = [
  {
    id: '3',
    description: 'Istituzione 1asdsad adsad asbdas sad adas dasdas das adasd asdasdsa , adsa dsad a,as,d asd asd asdas,a asdas sadasd asd asdas,das dad,asa,d sa asd asdsad asdsa dsadas dsadasd sad sadasdsad asdasdasdsa dsadasdasdasd sadasd asd sad sad asd asd nasdkjbasjkdfhsakjfdbakjsbdkjsabjkdj asd asd ,sa ,d asd ',
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
    products: ['prod-interop', 'PRODOTTO_2'],
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
  const selectedInstitution = mockedSearchInstitutions.filter(
    (inst) => inst.description?.includes(searchText)
  );
  if (selectedInstitution) {
    return Promise.resolve(selectedInstitution);
  } else {
    return Promise.reject(new Error('Institution not found!'));
  }
};
