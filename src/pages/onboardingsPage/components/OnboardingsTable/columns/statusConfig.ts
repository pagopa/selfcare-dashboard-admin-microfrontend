export const STATUS_CHIP_CONFIG: Record<
    string,
    {
        label: string;
        tooltipText: string;
        color: 'success' | 'warning' | 'error' | 'info' | 'default';
    }
> = {
    TOBEVALIDATED: {
        label: 'Da validare',
        tooltipText: 'Richiesta di adesione in attesa di approvazione da parte di un utente PagoPA.',
        color: 'default',
    },
    PENDING: {
        label: 'In attesa',
        tooltipText:
            "L'ente deve caricare il contratto firmato per completare la richiesta di adesione.",
        color: 'warning',
    },
    COMPLETED: {
        label: 'Attivo',
        tooltipText: "L'ente è aderente al prodotto. La richiesta è stata completata con successo.",
        color: 'success',
    },
    REJECTED: {
        label: 'Rifiutato',
        tooltipText: 'Richiesta di adesione rifiutata da un utente PagoPA dopo le verifiche.',
        color: 'error',
    },
    DELETED: {
        label: 'Disattivo',
        tooltipText: "L'ente non risulta più aderente al prodotto.",
        color: 'error',
    },
    FAILED: {
        label: 'In errore',
        tooltipText: 'La richiesta di adesione non è andata a buon fine a causa di un errore tecnico.',
        color: 'error',
    },
    EXPIRED: {
        label: 'Scaduta',
        tooltipText: 'La richiesta non è stata completata entro i termini',
        color: 'error',
    },
};