import { Button, Grid, Typography } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { ENV } from '../../utils/env';

type Props = {
  variant: 'forbidden' | 'generic';
  onRetry?: () => void;
};

export default function RequestErrorPage({ variant, onRetry }: Readonly<Props>) {
  const { t } = useTranslation();
  const isGeneric = variant === 'generic';

  return (
    <Grid
      container
      direction="column"
      style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}
    >
      <Grid container item justifyContent="center" mb={2}>
        <IllusError size={60} />
      </Grid>
      <Grid container item justifyContent="center" mt={3}>
        <Grid item xs={4}>
          <Typography variant="h4">{t(`requestErrorPage.${variant}.title`)}</Typography>
        </Grid>
      </Grid>
      <Grid container item justifyContent="center" mb={4} mt={1}>
        <Grid item xs={6}>
          <Typography variant="body1">{t(`requestErrorPage.${variant}.subtitle`)}</Typography>
        </Grid>
      </Grid>
      <Grid container item justifyContent="center">
        <Grid item xs={4}>
          <Button
            variant="contained"
            sx={{ alignSelf: 'center' }}
            onClick={() =>
              isGeneric && onRetry ? onRetry() : window.location.assign(ENV.URL_FE.LANDING)
            }
          >
            {t(isGeneric && onRetry ? 'requestErrorPage.retryLabel' : 'requestErrorPage.backLabel')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
