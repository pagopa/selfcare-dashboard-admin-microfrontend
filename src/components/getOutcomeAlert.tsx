import { Grid, Alert } from '@mui/material';
import { Trans } from 'react-i18next';
import { fromISO2ITA } from '../utils/fromISO2Ita';

type AlertProps = {
  severity: 'error' | 'info' | 'warning';
  borderColor: string;
  message?: string;
  hasReason?: boolean;
  updatedAt?: string;
  reasonForReject?: string;
};

export function getOutcomeAlert({
  severity,
  borderColor,
  message,
  hasReason,
  updatedAt,
  reasonForReject,
}: AlertProps) {
  return (
    <Grid item xs={12} width="100%" mt={5}>
      <Alert
        severity={severity}
        sx={{
          fontSize: 'fontSize',
          height: hasReason ? '74px' : '53px',
          alignItems: 'center',
          color: 'colorTextPrimary',
          borderLeft: 'solid',
          borderLeftColor: borderColor,
          borderLeftWidth: '4px',
          width: '100%',
        }}
      >
        {hasReason ? (
          <Trans
            i18nKey={'onboardingRequestPage.checkPartyInfoAlert.checkPartyRejectReasonAlert'}
            components={{
              1: <strong style={{ fontWeight: '600' }} />,
              ...(reasonForReject ? { 3: <br /> } : {}),
            }}
          >
            {`<1>Hai rifiutato questa richiesta di adesione il ${fromISO2ITA(updatedAt)}. </1> ${
              reasonForReject ? `<3/>Motivo del rifiuto: “${reasonForReject}”` : ''
            }`}
          </Trans>
        ) : (
          message
        )}
      </Alert>
    </Grid>
  );
}
