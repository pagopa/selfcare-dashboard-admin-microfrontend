export type OnboardingRequestResource = {
  tokenId: string;
  admins?: Array<UserInfo>;
  institutionInfo: InstitutionInfo;
  manager?: UserInfo;
  status: 'ACTIVE' | 'DELETED' | 'PENDING' | 'REJECTED' | 'SUSPENDED' | 'TOBEVALIDATED';
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
  id: string;
  institutionType: string;
  zipCode: string;
  mailAddress: string;
  name: string;
  pspData?: PspData;
  recipientCode?: string;
  vatNumber: string;
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
