export type OnboardingRequestResource = {
  tokenId: string;
  productId: string;
  admins?: Array<UserInfo>;
  attachments?: Array<string>;
  institutionInfo: InstitutionInfo;
  manager?: UserInfo;
  status: 'COMPLETED' | 'DELETED' | 'PENDING' | 'REJECTED' | 'SUSPENDED' | 'TOBEVALIDATED';
  updatedAt?: string;
  expiringDate?: string;
  reasonForReject?: string;
};

type AdditionalInformations = {
  agentOfPublicService: boolean;
  agentOfPublicServiceNote: string;
  belongRegulatedMarket: boolean;
  regulatedMarketNote: string;
  establishedByRegulatoryProvision: boolean;
  establishedByRegulatoryProvisionNote: string;
  ipa: boolean;
  ipaCode: string;
  otherNote: string;
};

type UserInfo = {
  email: string;
  id: string;
  name: string;
  surname: string;
  fiscalCode: string;
};

type InstitutionInfo = {
  address: string;
  dpoData?: DpoData;
  fiscalCode: string;
  city?: string;
  country?: string;
  county?: string;
  id?: string;
  institutionType: string;
  zipCode: string;
  mailAddress: string;
  name: string;
  pspData?: PspData;
  recipientCode?: string;
  vatNumber?: string;
  additionalInformations?: AdditionalInformations;
  attachments?: Array<string>;
};

type PspData = {
  abiCode: string;
  businessRegisterNumber: string;
  legalRegisterName: string;
  legalRegisterNumber: string;
  vatNumberGroup: boolean;
};

type DpoData = {
  address: string;
  email: string;
  pec: string;
};
