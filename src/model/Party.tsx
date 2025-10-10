import { GeographicTaxonomyResource } from '../api/generated/b4f-dashboard/GeographicTaxonomyResource';
import { InstitutionResource } from '../api/generated/b4f-dashboard/InstitutionResource';
import { OnboardedProduct } from '../api/generated/b4f-dashboard/OnboardedProduct';
import { buildUrlLog } from '../utils/helper';

export type UserRole = 'ADMIN' | 'LIMITED';
export type PartyRole = 'DELEGATE' | 'MANAGER' | 'OPERATOR' | 'SUB_DELEGATE';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

export type Party = {
  partyId: string;
  products: any;
  externalId?: string;
  originId?: string;
  origin?: string;
  description: string;
  digitalAddress?: string;
  category?: string;
  categoryCode?: string;
  city?: string;
  country?: string;
  delegation?: boolean;
  urlLogo?: string;
  fiscalCode?: string;
  registeredOffice: string;
  zipCode: string;
  typology: string;
  institutionType?: string;
  recipientCode?: string;
  geographicTaxonomies: any;
  vatNumberGroup?: boolean;
  supportEmail?: string;
  vatNumber?: string;
  subunitCode?: string;
  subunitType?: string;
  aooParentCode?: string;
  parentDescription?: string;
  userRole?: UserRole;
  status?: UserStatus;
};

export const institutionResource2Party = (institutionResource: InstitutionResource): Party => {
  const urlLogo = institutionResource.id && buildUrlLog(institutionResource.id);
  return {
    partyId: institutionResource.id ?? '',
    externalId: institutionResource.externalId ?? '',
    originId: institutionResource?.originId,
    origin: institutionResource?.origin,
    description: institutionResource.name ?? '',
    digitalAddress: institutionResource.mailAddress,
    category: institutionResource.category,
    categoryCode: institutionResource.categoryCode,
    urlLogo,
    fiscalCode: institutionResource.fiscalCode,
    registeredOffice: institutionResource.address ?? '',
    zipCode: institutionResource.zipCode ?? '',
    city: institutionResource.city ?? '',
    country: institutionResource.country ?? '',
    typology: 'TODO', // it will represent the taxonomy of the party
    institutionType: institutionResource.institutionType as string,
    recipientCode: institutionResource.recipientCode,
    geographicTaxonomies:
      institutionResource.geographicTaxonomies as Array<GeographicTaxonomyResource>,
    delegation: institutionResource.delegation,
    vatNumberGroup: institutionResource.vatNumberGroup,
    supportEmail: institutionResource.supportContact?.supportEmail,
    vatNumber: institutionResource.vatNumber,
    subunitCode: institutionResource.subunitCode,
    subunitType: institutionResource.subunitType,
    aooParentCode: institutionResource.aooParentCode,
    parentDescription: institutionResource.parentDescription,
    products: institutionResource.products as Array<OnboardedProduct>,
  };
};
