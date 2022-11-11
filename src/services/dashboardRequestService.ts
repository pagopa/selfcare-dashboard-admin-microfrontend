type PspStatus  = 'APPROVED' | 'REJECTED' | 'PENDING';


 export type OnboardingDataDto = {
    status: PspStatus;
    billingData: BillingDataDto;
    institutionType: string;
    origin: string;
    pricingPlan: string;
    pspData: PspDataDto;
users: [
    {
        email: string;
        name: string;
        role: string;
        surname: string;
        taxCode: string;
    }
  ];
};



 type BillingDataDto = {
    // Ragione sociale
    businessName: string;
    // Indirizzo PEC
    digitalAddress: string;
    // servizi pubblici
    publicServices?: boolean;
    // Codice destinatario
    recipientCode: string;
    // Sede legale
    registeredOffice: string;
    // Codice fiscale
    taxCode: string;
    // Partita iva
    vatNumber: string;
    // Codice di avviamento postale
    zipCode: string;  };
  
   type PspDataDto = {
    // codice ABI
    abiCode: string;
    // n. iscrizione al Registro delle Imprese
    businessRegisterNumber: string;
    // dati del Responsabile protezione dati (DPO)
    dpoData: DpoData;
    // numero iscrizione albo
    legalRegisterNumber: string;
    // iscrizione all'Albo
    legalRegisterName: string;
    // La partita IVA è di gruppo
    vatNumberGroup: boolean;
  };
  
   type DpoData = {
    // Indirizzo DPO
    address: string;
    // Indirizzo PEC DPO
    pec: string;
    // Indirizzo Email DPO
    email: string;
  };

  
export const formData: Array<OnboardingDataDto> = [{
    status:'APPROVED',
    billingData:{
    businessName: 'businessNameInput',
    registeredOffice: 'registeredOfficeInput',
    digitalAddress: 'a@a.it',
    zipCode: '09010',
    taxCode: '11111111111',
    vatNumber: 'AAAAAA44D55F456K',
    recipientCode: 'recipientCode',
    publicServices: false,},
    pspData: {
        abiCode: 'abiCode',
        businessRegisterNumber:'12345567890',
        dpoData: {
          address:  'Via Roma 1',
          pec: 'test@pec.it',
          email: 'test@mail.it',
        },
        legalRegisterNumber: '12345',
        legalRegisterName:  'Albo dei gruppi bancari',
        vatNumberGroup: false,
    },
    institutionType: 'PSP',
    origin: '',
    pricingPlan: '',
    users: [
        {
            email: 'b@b.bb',
            name: 'NAME',
            role: 'MANAGER',
            surname: 'SURNAME',
            taxCode: 'SRNNMA00B00B000B',
        }
      ],
    
},
    {
    status:'PENDING',
    billingData:{
    businessName: 'businessNameInput',
    registeredOffice: 'registeredOfficeInput',
    digitalAddress: 'a@a.it',
    zipCode: '09010',
    taxCode: '22222222222',
    vatNumber: 'AAAAAA44D55F456K',
    recipientCode: 'recipientCode',
    publicServices: false,},
    pspData: {
        abiCode: 'abiCode',
        businessRegisterNumber:'12345567890',
        dpoData: {
          address:  'Via Roma 1',
          pec: 'test@pec.it',
          email: 'test@mail.it',
        },
        legalRegisterNumber: '12345',
        legalRegisterName:  'Albo dei gruppi bancari',
        vatNumberGroup: false,
    },
    institutionType: 'PSP',
    origin: '',
    pricingPlan: '',
    users: [
        {
            email: 'b@b.bb',
            name: 'NAME',
            role: 'MANAGER',
            surname: 'SURNAME',
            taxCode: 'SRNNMA00B00B000B',
        }
      ],
    
    }, {
      status:'REJECTED',
    billingData:{
    businessName: 'businessNameInput',
    registeredOffice: 'registeredOfficeInput',
    digitalAddress: 'a@a.it',
    zipCode: '09010',
    taxCode: '33333333333',
    vatNumber: 'AAAAAA44D55F456K',
    recipientCode: 'recipientCode',
    publicServices: false,},
    pspData: {
        abiCode: 'abiCode',
        businessRegisterNumber:'12345567890',
        dpoData: {
          address:  'Via Roma 1',
          pec: 'test@pec.it',
          email: 'test@mail.it',
        },
        legalRegisterNumber: '12345',
        legalRegisterName:  'Albo dei gruppi bancari',
        vatNumberGroup: false,
    },
    institutionType: 'PSP',
    origin: '',
    pricingPlan: '',
    users: [
        {
            email: 'b@b.bb',
            name: 'NAME',
            role: 'MANAGER',
            surname: 'SURNAME',
            taxCode: 'SRNNMA00B00B000B',
        }
      ],
    
  }];
// export const mockedFetchPspDataRequest = (partyId: string): Promise<PspBillingDataDto> =>  new Promise((resolve) => resolve(formData));