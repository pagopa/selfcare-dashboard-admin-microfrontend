import { Button, Grid, Typography } from '@mui/material';
import { IllusCompleted } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { ENV } from '../../utils/env';

export default function RejectPage() {
  const { t } = useTranslation();
  return (
    <Grid
      item
      container
      xs={12}
      mt={13}
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <IllusCompleted size={60} />
      <Grid item mt={3}>
        <Typography variant="h4">{t('rejectPage.title')}</Typography>
      </Grid>
      <Grid item mt={1}>
        <Typography variant="body1" textAlign="center">
          <Trans i18nKey="rejectPage.description">
            L’adesione di {{ ente: 'nome ente' }} è stata rifiutata. Invieremo
            <br />
            all’indirizzo PEC indicato un’email con le istruzioni per <br />
            ripetere l’adesione.
          </Trans>
        </Typography>
      </Grid>
      <Button
        variant="contained"
        sx={{ alignSelf: 'center', mt: 4 }}
        onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
      >
        {t('rejectPage.backLabel')}
      </Button>
    </Grid>
  );
}
