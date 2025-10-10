import { InstitutionResource } from '../generated/b4f-dashboard/InstitutionResource';

export const mockedInstitutionResources: Array<InstitutionResource> = [
  {
    name: 'Comune di Bari',
    id: '1',
    externalId: 'externalId1',
    originId: 'originId1',
    origin: 'IPA',
    category: 'Ente locale',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    institutionType: 'PA',
    delegation: false,
    address: 'Piazza della Scala, 2',
    zipCode: '20121',
    geographicTaxonomies: undefined,
    recipientCode: '4GBCSDA1',
  },
  {
    name: 'Comune di Milano',
    id: '2',
    externalId: 'externalId2',
    originId: 'originId2',
    origin: 'IPA',
    mailAddress: 'address',
    fiscalCode: 'fiscalCode',
    category: '',
    institutionType: 'PA',
    delegation: true,
    address: 'Piazza della Scala, 2',
    zipCode: '20121',
    geographicTaxonomies: [],
    recipientCode: '4GBCSDA1',
  },
];

export const DashboardApi = {
  getInstitution: async (_partyId: string): Promise<InstitutionResource> =>
    Promise.resolve(mockedInstitutionResources[0]),
};
