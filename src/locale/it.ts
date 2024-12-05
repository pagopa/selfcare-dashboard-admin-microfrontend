export default {
  onboardingRequestPage: {
    title: 'Richiesta di adesione',
    validationDataChip: 'Da validare',
    approvedDataChip: 'Approvata',
    rejectedDataChip: 'Rifiutata',
    expired: {
      chip: 'Scaduta',
      reason: 'La richiesta di adesione è scaduta perché sono trascorsi più di 30 giorni.',
    },
    checkPartyInfoAlert:
      'Controlla le informazioni inserite dall’ente e approva o rifiuta la richiesta.',
    checkPartyRejectReasonAlert:
      '<1>Hai rifiutato questa richiesta di adesione il {{data}}. </1> <3/>Motivo del rifiuto: “{{reason}}“',
    checkPartyRejectAlert: '<1>Hai rifiutato questa richiesta di adesione il {{data}}.</1>',
    summaryStepSection: {
      billingDataInfoSummarySection: {
        title: 'Dati dell’ente',
        billingDataInfoSummary: {
          product: 'Prodotto',
          institutionType: {
            title: 'Tipologia amministrazione',
            descriptions: {
              pa: 'Pubblica amministrazione',
              gsp: 'Gestore di Pubblico Servizio',
              pt: 'Partner tecnologico',
              scp: 'Società a Controllo Pubblico',
              psp: 'Prestatore Servizi di Pagamento',
              sa: 'Gestore privato di piattaforma e-procurement',
              as: 'Società di assicurazione',
              pg: 'Azienda',
              prv: 'Privato',
              gpu: 'Gestore di pubblica utilità e/o di interesse generale'
            },
          },
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
      additionalInfoSummarySection: {
        title: 'Informazioni aggiuntive',
        additionalInfoSummary: {
          establishedByRegulatoryProvision:
            'L’ente è una società costituita ex lege da un provvedimento normativo',
          establishedByRegulatoryProvisionNote: 'Nota',
          belongRegulatedMarket:
            'L’ente appartiene ad un mercato regolamentato (es. energia, gas, acqua, trasporti, servizi postali ecc…)',
          belongRegulatedMarketNote: 'Nota',
          ipa: 'L’ente è censito su IPA',
          ipaCode: 'Codice IPA',
          agentOfPublicService: 'L’ente è una concessionaria di un pubblico servizio',
          agentOfPublicServiceNote: 'Nota',
          other: 'Altro',
          otherNote: 'Nota',
          possibleChoice: {
            yes: 'Sì',
            no: 'No',
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
      decline: {
        button: 'Rifiuta',
        modal: {
          title: 'Stai rifiutando una richiesta di adesione',
          message:
            'Spiega all’ente <1>{{partyName}}</1> perché hai respinto la richiesta di adesione per il prodotto <3>{{productTitle}}</3>. Fai in modo che la motivazione sia chiara e facile da capire, così da comunicare efficacemente la causa del rifiuto.',
          reason: 'Scrivi il motivo del rifiuto',
          maxCharactersAllowed: 'Max 500 caratteri',
          back: 'Indietro',
          confirm: 'Rifiuta',
        },
      },
      approveButton: 'Approva',
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
