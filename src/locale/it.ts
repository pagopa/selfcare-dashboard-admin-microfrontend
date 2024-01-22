export default {
  onboardingRequestPage: {
    title: 'Richiesta di adesione',
    validationDataChip: 'In attesa',
    approvedDataChip: 'Approvata',
    rejectedDataChip: 'Rifiutata',
    checkPartyInfoAlert:
      'Controlla le informazioni inserite dall’ente e approva o rifiuta la richiesta.',
    summaryStepSection: {
      billingDataInfoSummarySection: {
        title: 'Dati dell’ente',
        billingDataInfoSummary: {
          institutionType: {
            title: 'Tipologia amministrazione',
            descriptions: {
              gsp: 'Gestore di Pubblico Servizio',
              pt: 'Partner tecnologico',
              scp: 'Società a Controllo Pubblico',
              psp: 'Prestatore Servizi di Pagamento',
              sa: 'Gestore privato di piattaforma e-procurement',
              as: 'Società di assicurazione',
              pg: 'Azienda',
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
      declineButton: 'Rifiuta',
      approveButton: 'Approva',
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
