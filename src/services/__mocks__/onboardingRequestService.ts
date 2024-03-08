import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';

export const mockedOnboardingRequests: Array<OnboardingRequestResource> = [
  // Use case of request with TOBEVALIDATED status
  {
    tokenId: 'tokenId01',
    productId: 'prod-pagopa',
    status: 'TOBEVALIDATED',
    institutionInfo: {
      id: 'institutionId1',
      name: 'Agenzia per le Erogazioni in Agricoltura - AGEA',
      address: 'Via Palestro, 81',
      zipCode: '00185',
      mailAddress: 'agenzia.erogazioni.agricoltura@PeCEmAiL.com', // use case for toLowerCase email
      fiscalCode: '97181460581',
      vatNumber: '11122233345',
      pspData: {
        vatNumberGroup: true,
        businessRegisterNumber: '11111111111',
        legalRegisterName: 'DummySubscribe01',
        legalRegisterNumber: '40',
        abiCode: '11223',
      },
      recipientCode: 'DummyRecipientCode01',
      dpoData: {
        address: 'Via Autonomia, 5',
        pec: 'dpo01@pecdpo.com',
        email: 'dpo01@dpo.com',
      },
      institutionType: 'PSP',
    },
    manager: {
      id: 'Manager01',
      name: 'Manager01',
      surname: 'Manager01',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager01@manager.com',
    },
    admins: [
      {
        id: '1',
        name: 'Fabio',
        surname: 'Diaz',
        fiscalCode: 'MNGMGR11D22B345K',
        email: 'fabio@comunedi.it',
      },
    ],
  },

  // Use case of request with ACTIVE status
  {
    tokenId: 'tokenId02',
    productId: 'prod-pagopa',
    status: 'ACTIVE',
    institutionInfo: {
      id: 'institutionId2',
      name: 'Comune di Milano',
      address: 'Via Lombardia, 59',
      zipCode: '45321',
      mailAddress: 'comune.milano@pecemail.com',
      fiscalCode: '76765454321',
      vatNumber: '22233344456',
      institutionType: 'PT',
    },
    admins: [
      // Use case with 3 admins
      {
        id: '2',
        name: 'Admin01',
        surname: 'Admin01',
        fiscalCode: '11111111111',
        email: 'admin01@comunedi.it',
      },
      {
        id: '3',
        name: 'Admin02',
        surname: 'Admin02',
        fiscalCode: '22222222222',
        email: 'admin02@comunedi.it',
      },
      {
        id: '4',
        name: 'Admin03',
        surname: 'Admin03',
        fiscalCode: '33333333333',
        email: 'AdMiN03@comunedi.it', // Use case for test the lowercase of email
      },
    ],
  },

  // Use case of request with REJECTED status
  {
    tokenId: 'tokenId03',
    productId: 'prod-pagopa',
    status: 'REJECTED',
    institutionInfo: {
      id: 'institutionId3',
      name: 'Comune di Roma',
      address: 'Via Totti, 44',
      zipCode: '44235',
      mailAddress: 'comune.roma@pecemail.com',
      fiscalCode: '87695432678',
      vatNumber: '93945678123',
      pspData: {
        vatNumberGroup: true,
        businessRegisterNumber: '33333333333',
        legalRegisterName: 'DummySubscribe03',
        legalRegisterNumber: '45',
        abiCode: '77665',
      },
      recipientCode: 'DummyRecipientCode03',
      dpoData: {
        address: 'Via Autonomia, 546',
        pec: 'dpo03@pecdpo.com',
        email: 'dpo03@dpo.com',
      },
      institutionType: 'PSP',
    },
    manager: {
      id: 'Manager03',
      name: 'Manager03',
      surname: 'Manager03',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager03@manager.com',
    },
    admins: [
      // Use case with 2 admins
      {
        id: '7',
        name: 'Admin07',
        surname: 'Admin07',
        fiscalCode: '77777777777',
        email: 'admin07@comunedi.it',
      },
      {
        id: '8',
        name: 'Admin08',
        surname: 'Admin08',
        fiscalCode: '88888888888',
        email: 'admin08@comunedi.it',
      },
    ],
    updatedAt: '2024-02-07T11:40:57.393',
    expiringDate: '2024-03-08T17:31:27.31',
    reasonForReject: 'Wrong institutionType',
  },

  // Use case for institutionType !== PSP
  {
    tokenId: 'tokenId04',
    productId: 'prod-pagopa',
    status: 'REJECTED',
    institutionInfo: {
      id: 'institutionId3',
      name: 'Comune di Roma',
      address: 'Via Totti, 44',
      zipCode: '44235',
      mailAddress: 'comune.roma@pecemail.com',
      fiscalCode: '87695432678',
      vatNumber: '93945678123',
      additionalInformations: {
        agentOfPublicService: true,
        agentOfPublicServiceNote: 'agentOfPublicServiceNote',
        belongRegulatedMarket: true,
        regulatedMarketNote: 'regulatedMarketNote',
        establishedByRegulatoryProvision: true,
        establishedByRegulatoryProvisionNote: '',
        ipa: false,
        ipaCode: '',
        otherNote: '',
      },
      pspData: {
        vatNumberGroup: true,
        businessRegisterNumber: '33333333333',
        legalRegisterName: 'DummySubscribe03',
        legalRegisterNumber: '45',
        abiCode: '77665',
      },
      recipientCode: 'DummyRecipientCode03',
      dpoData: {
        address: 'Via Autonomia, 546',
        pec: 'dpo03@pecdpo.com',
        email: 'dpo03@dpo.com',
      },
      institutionType: 'GSP',
    },
    manager: {
      id: 'Manager03',
      name: 'Manager03',
      surname: 'Manager03',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager03@manager.com',
    },
    admins: [
      // Use case with 2 admins
      {
        id: '7',
        name: 'Admin07',
        surname: 'Admin07',
        fiscalCode: '77777777777',
        email: 'admin07@comunedi.it',
      },
      {
        id: '8',
        name: 'Admin08',
        surname: 'Admin08',
        fiscalCode: '88888888888',
        email: 'admin08@comunedi.it',
      },
    ],
    updatedAt: '2024-03-07T11:40:57.393',
    expiringDate: '2024-05-06T11:40:27.31',
    reasonForReject: 'Wrong data',
  },
  // Use case for pspData.vatNumberGroup === false
  {
    tokenId: 'tokenId05',
    productId: 'prod-pagopa',
    status: 'TOBEVALIDATED',
    institutionInfo: {
      id: 'institutionId1',
      name: 'Agenzia per le Erogazioni in Agricoltura - AGEA',
      address: 'Via Palestro, 81',
      zipCode: '00185',
      mailAddress: 'agenzia.erogazioni.agricoltura@PeCEmAiL.com', // use case for toLowerCase email
      fiscalCode: '97181460581',
      vatNumber: '11122233345',
      pspData: {
        vatNumberGroup: false,
        businessRegisterNumber: '11111111111',
        legalRegisterName: 'DummySubscribe01',
        legalRegisterNumber: '40',
        abiCode: '11223',
      },
      recipientCode: 'DummyRecipientCode01',
      dpoData: {
        address: 'Via Autonomia, 5',
        pec: 'dpo01@pecdpo.com',
        email: 'dpo01@dpo.com',
      },
      institutionType: 'PSP',
    },
    manager: {
      id: 'Manager01',
      name: 'Manager01',
      surname: 'Manager01',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager01@manager.com',
    },
    admins: [
      {
        id: '1',
        name: 'Fabio',
        surname: 'Diaz',
        fiscalCode: 'MNGMGR11D22B345K',
        email: 'fabio@comunedi.it',
      },
    ],
  },
  // Use case for PENDING
  {
    tokenId: 'tokenId06',
    productId: 'prod-pagopa',
    status: 'PENDING',
    institutionInfo: {
      id: 'institutionId1',
      name: 'Agenzia per le Erogazioni in Agricoltura - AGEA',
      address: 'Via Palestro, 81',
      zipCode: '00185',
      mailAddress: 'agenzia.erogazioni.agricoltura@PeCEmAiL.com', // use case for toLowerCase email
      fiscalCode: '97181460581',
      vatNumber: '11122233345',
      pspData: {
        vatNumberGroup: false,
        businessRegisterNumber: '11111111111',
        legalRegisterName: 'DummySubscribe01',
        legalRegisterNumber: '40',
        abiCode: '11223',
      },
      recipientCode: 'DummyRecipientCode01',
      dpoData: {
        address: 'Via Autonomia, 5',
        pec: 'dpo01@pecdpo.com',
        email: 'dpo01@dpo.com',
      },
      institutionType: 'PSP',
    },
    manager: {
      id: 'Manager01',
      name: 'Manager01',
      surname: 'Manager01',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager01@manager.com',
    },
    admins: [
      {
        id: '1',
        name: 'Fabio',
        surname: 'Diaz',
        fiscalCode: 'MNGMGR11D22B345K',
        email: 'fabio@comunedi.it',
      },
    ],
  },
  // TOBEVALIDATED on prod-pagopa
  {
    tokenId: 'tokenId07',
    productId: 'prod-pagopa',
    status: 'TOBEVALIDATED',
    institutionInfo: {
      id: 'institutionId3',
      name: 'Comune di Torino',
      address: 'Via Del Piero, 10',
      zipCode: '22335',
      mailAddress: 'comune.torino@pecemail.com',
      fiscalCode: '87693452678',
      vatNumber: '93947658123',
      additionalInformations: {
        agentOfPublicService: true,
        agentOfPublicServiceNote: 'agentOfPublicServiceNote',
        belongRegulatedMarket: true,
        regulatedMarketNote: 'regulatedMarketNote',
        establishedByRegulatoryProvision: true,
        establishedByRegulatoryProvisionNote: 'establishedByRegulatoryProvisionNote',
        ipa: false,
        ipaCode: '',
        otherNote: 'OtherNote',
      },
      pspData: {
        vatNumberGroup: true,
        businessRegisterNumber: '33333333333',
        legalRegisterName: 'DummySubscribe03',
        legalRegisterNumber: '45',
        abiCode: '77665',
      },
      recipientCode: 'DummyRecipientCode03',
      dpoData: {
        address: 'Via Autonomia, 546',
        pec: 'dpo03@pecdpo.com',
        email: 'dpo03@dpo.com',
      },
      institutionType: 'GSP',
    },
    manager: {
      id: 'Manager03',
      name: 'Manager03',
      surname: 'Manager03',
      fiscalCode: 'MNGMGR11D22B345K',
      email: 'manager03@manager.com',
    },
    admins: [
      // Use case with 2 admins
      {
        id: '7',
        name: 'Admin07',
        surname: 'Admin07',
        fiscalCode: '77777777777',
        email: 'admin07@comunedi.it',
      },
      {
        id: '8',
        name: 'Admin08',
        surname: 'Admin08',
        fiscalCode: '88888888888',
        email: 'admin08@comunedi.it',
      },
    ],
  },
];

export const fetchOnboardingPspRequest = (tokenId: string): Promise<OnboardingRequestResource> => {
  const selectedOnboardingRequest = mockedOnboardingRequests.find((r) => r.tokenId === tokenId);
  if (selectedOnboardingRequest) {
    return new Promise((resolve) => resolve(selectedOnboardingRequest));
  } else {
    return Promise.reject('Onboarding request not found!');
  }
};
