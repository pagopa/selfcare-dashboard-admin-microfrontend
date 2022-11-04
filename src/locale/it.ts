export default {
  requestToBeAnsweredPage: {
    navigationBar: {
      parties: 'Enti',
      toValidateData: 'Dati da validare',
    },
    title: 'Richiesta di adesione',
    validationDataChip: 'Dati da validare',
    checkPartyInfoAlert:
      'Controlla le informazioni inserite dall’ente e approva o rifiuta la richiesta.',
    summaryStepSection: {
      billingDataInfoSummarySection: {
        step: 'Step 1',
        title: 'Indica i dati del tuo ente',
        description:
          'Conferma, modifica o inserisci i dati dell’ente, assicurandoti che siano corretti. Verranno usati anche per richiedere <1 />l’adesione ad altri prodotti e in caso di fatturazione.',
        billingDataInfoSummary: {
          businessName: 'Ragione sociale',
          registeredOffice: 'Sede legale',
          mailPEC: 'Indirizzo PEC',
          taxCode: 'Codice fiscale',
          vatNumber: 'Partita IVA',
          recipientCode: 'Codice destinatario',
          commercialRegisterNumber: 'n. Iscrizione al Registro delle Imprese',
          registrationInRegister: 'Iscrizione all’Albo',
          registerNumber: 'Al numero',
          abiCode: 'Codice ABI',
        },
      },
      managerInfoSummarySection: {
        step: 'Step 2',
        title: 'Indica il Legale Rappresentante',
        description:
          'Inserisci i dati del Legale Rappresentante. <1 />La persona che indicherai sarà firmataria del contratto per {{productTitle}}.',
      },
      delegatesInfoSummarySection: {
        step: 'Step 3',
        title: 'Indica l’Amministratore',
        description:
          'Inserisci i dati dell’Amministratore o di un suo delegato. <1 /> La persona che indicherai sarà responsabile della gestione di {{productTitle}}.',
      },
    },
  },
};
