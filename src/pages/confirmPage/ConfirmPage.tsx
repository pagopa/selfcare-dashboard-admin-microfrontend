import { Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IllusCompleted } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { ENV } from '../../utils/env';

export default function ConfirmPage() {
  const { t } = useTranslation();
  return (
    <Box display={'flex'} alignItems="center">
      <Grid item container xs={12} display="flex" justifyContent={'center'}>
        <IllusCompleted size={60} />
        <Grid item xs={12} display="flex" justifyContent="center" mt={4}>
          <Typography variant="h3">{t('confirmPage.title')}</Typography>
        </Grid>
        <Grid item xs={18} display="flex" justifyContent="center" mt={1}>
          <Typography variant="body1" align="center">
            <Trans i18nKey="confirmPage.description">
              L’adesione di <strong>{{ nomeEnte: 'Nome Ente' }}</strong> è stata approvata.
              Invieremo
              <br />
              all’indirizzo PEC indicato un’email con le istruzioni per
              <br />
              completare l’adesione.
            </Trans>
          </Typography>
        </Grid>
        <Button
          variant="contained"
          sx={{ alignSelf: 'center', mt: 4 }}
          onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
        >
          {t('confirmPage.backLabel')}
        </Button>
      </Grid>
    </Box>
  );
}
