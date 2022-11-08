export default {
  requestToBeAnsweredPage: {
    title: 'Richiesta di adesione',
    validationDataChip: 'Da validare',
    checkPartyInfoAlert:
      'Controlla le informazioni inserite dall’ente e approva o rifiuta la richiesta.',
    summaryStepSection: {
      billingDataInfoSummarySection: {
        title: 'Dati dell’ente',
        billingDataInfoSummary: {
          businessName: 'Ragione sociale',
          registeredOffice: 'Sede legale',
          zipCode: 'CAP',
          mailPEC: 'Indirizzo PEC',
          taxCode: 'Codice fiscale',
          vatNumber: 'Partita IVA',
          isGroupPIVA: 'La partita IVA è di gruppo',
          commercialRegisterNumber: 'n. Iscrizione al Registro delle Imprese',
          registrationInRegister: 'Iscrizione all’Albo',
          registerNumber: 'Al numero',
          abiCode: 'Codice ABI',
          recipientCode: 'Codice destinatario',
          protectionOfficerDetailData: {
            title: 'Contatti del responsabile della protezione dei dati',
            address: 'Indirizzo',
            mailPEC: 'Indirizzo PEC',
            mail: 'Indirizzo email',
          },
        },
      },
      managerInfoSummarySection: {
        title: 'Dati del Legale Rappresentante',
        managerInfoSummary: {
          name: 'Nome',
          surname: 'Cognome',
          taxCode: 'Codice fiscale',
          mailPEC: 'Email istituzionale',
        },
      },
      delegatesInfoSummarySection: {
        title: 'Dati Amministratore',
        delegatesInfoSummary: {
          name: 'Nome',
          surname: 'Cognome',
          taxCode: 'Codice fiscale',
          mailPEC: 'Email istituzionale',
          secondAdmin: 'Amministratore #2',
          thirdAdmin: 'Amministratore #3',
        },
      },
    },
    actions: {
      declineButton: 'Rifiuta',
      approveButton: 'Conferma',
    },
  },
};
