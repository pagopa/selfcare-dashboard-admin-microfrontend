
export type OnboardingRequestResource = {
    admins: UserInfo;
    institutionInfo: InstitutionInfo;
    manager: UserInfo;
    status: string;
    
};
type UserInfo = {
    email: string;
    id: string;
    name: string;
    surname: string;
};
type InstitutionInfo = {
    address: string;
    dpoData: DpoData;
    fiscalCode: string;
    id: string;
    institutionType: string;
    mailAddress: string;
    name: string;
    pspData: PspData;
    recipientCode: string;
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
    address: 'string';
    email: 'string';
    pec: 'string';
};
           
             
            