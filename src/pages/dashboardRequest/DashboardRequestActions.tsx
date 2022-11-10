import { Button, Stack } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setShowRejectPage: Dispatch<SetStateAction<boolean | undefined>>;
  setShowConfirmPage: Dispatch<SetStateAction<boolean | undefined>>;
  toValidateState: boolean;
};

export default function DashboardRequestActions({
  setShowRejectPage,
  setShowConfirmPage,
  toValidateState,
}: Props) {
  const { t } = useTranslation();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={6} mb={6}>
      {toValidateState ? (
        <>
          <Stack>
            <Button
              variant="outlined"
              color="error"
              style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
              onClick={() => setShowRejectPage(true)}
            >
              {/* TODO Add call for decline request */}
              {t('requestToBeAnsweredPage.actions.declineButton')}
            </Button>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              sx={{ marginLeft: 3 }}
              onClick={() => setShowConfirmPage(true)}
            >
              {/* TODO Add call for approve request */}
              {t('requestToBeAnsweredPage.actions.approveButton')}
            </Button>
          </Stack>
        </>
      ) : (
        <Stack>
          <Button
            variant="outlined"
            sx={{ marginLeft: 3 }}
            onClick={() => window.location.assign('https://www.pagopa.it/it/')}
          >
            {/* TODO Add call for approve request */}
            Chiudi
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
