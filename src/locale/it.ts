export default {
  onboardingRequestPage: {
    title: 'Richiesta di adesione',
    validationDataChip: 'Da validare',
    approvedDataChip: 'Approvata',
    rejectedDataChip: 'Rifiutata',
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
          isGroupPIVA: {
            title: 'La partita IVA è di gruppo',
            yes: 'Si',
            no: 'No',
          },
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
        title: `Dati dell’Amministratore`,
        delegatesInfoSummary: {
          name: 'Nome',
          surname: 'Cognome',
          taxCode: 'Codice fiscale',
          mailPEC: 'Email istituzionale',
          moreOfOneAdmin: 'Amministratore #',
        },
      },
    },
    actions: {
      declineButton: 'Rifiuta',
      approveButton: 'Conferma',
      closeButton: 'Chiudi',
    },
  },
  jwtNotValid: {
    title: 'Richiesta di adesione non più <1 /> valida',
    subtitle: 'Questa richiesta è stata accolta, annullata o è scaduta.',
    backActionLabel: 'Torna alla home',
  },
  confirmPage: {
    title: 'Adesione approvata',
    description: `L’adesione di <1>{{ente}}</1> è stata approvata. Invieremo all’indirizzo PEC indicato un’email con le istruzioni per completare l'adesione.`,
    backLabel: 'Torna alla home',
  },
  rejectPage: {
    title: 'Adesione rifiutata',
    description: `L’adesione di <1>{{ente}}</1> non è andata a buon fine. Invieremo un’email all’indirizzo PEC indicato. Al suo interno, ci sono le istruzioni per completare l'adesione.`,
    backLabel: 'Torna alla home',
  },
};
