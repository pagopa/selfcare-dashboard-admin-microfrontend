import { Button, Grid, Stack, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../../utils/constants';
import {
  approveOnboardingPspRequest,
  rejectOnboardingRequest,
} from '../../../services/onboardingRequestService';

type Props = {
  setShowRejectPage: Dispatch<SetStateAction<boolean | undefined>>;
  setShowConfirmPage: Dispatch<SetStateAction<boolean | undefined>>;
  isPendingRequest: boolean;
  retrieveTokenIdFromUrl?: string;
  partyName?: string;
  productTitle?: string;
};

export default function DashboardRequestActions({
  setShowRejectPage,
  setShowConfirmPage,
  isPendingRequest,
  retrieveTokenIdFromUrl,
  partyName,
  productTitle,
}: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);

  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const approveOnboarding = () => {
    setLoadingRetrieveOnboardingRequest(true);
    if (retrieveTokenIdFromUrl) {
      approveOnboardingPspRequest(retrieveTokenIdFromUrl)
        .then(() => setShowConfirmPage(true))
        .catch((reason: any) => {
          addError({
            id: `Onboarding request with tokenId: ${retrieveTokenIdFromUrl} not approved`,
            blocking: false,
            techDescription: reason,
            toNotify: false,
            error: new Error('INVALID_TOKEN_ID'),
          });
        })
        .finally(() => setLoadingRetrieveOnboardingRequest(false));
    }
  };

  const rejectOnboarding = () => {
    setLoadingRetrieveOnboardingRequest(true);
    if (retrieveTokenIdFromUrl) {
      rejectOnboardingRequest(retrieveTokenIdFromUrl, reason)
        .then(() => {
          setReason('');
          setShowRejectPage(true);
        })
        .catch((reason: any) => {
          addError({
            id: `Onboarding request with tokenId: ${retrieveTokenIdFromUrl} not rejected`,
            blocking: false,
            techDescription: reason,
            toNotify: false,
            error: new Error('INVALID_TOKEN_ID'),
          });
        })
        .finally(() => setLoadingRetrieveOnboardingRequest(false));
    }
  };

  return (
    <>
      {isPendingRequest && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={4}>
          <Stack>
            <Button
              variant="outlined"
              color="error"
              style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
              onClick={() => setOpenRejectModal(true)}
            >
              {t('onboardingRequestPage.actions.decline.button')}
            </Button>
          </Stack>

          <Stack>
            <Button variant="contained" sx={{ marginLeft: 3 }} onClick={approveOnboarding}>
              {t('onboardingRequestPage.actions.approveButton')}
            </Button>
          </Stack>
        </Stack>
      )}

      <SessionModal
        open={openRejectModal}
        title={t('onboardingRequestPage.actions.decline.modal.title')}
        message={
          <Grid container xs={12} spacing={2} mb={2}>
            <Grid item>
              <Trans
                i18nKey={'onboardingRequestPage.actions.decline.modal.message'}
                components={{ 1: <strong />, 3: <strong /> }}
                values={{ partyName, productTitle }}
              >
                {
                  'Spiega all’ente <1>{{partyName}}</1> perché hai respinto la richiesta di adesione per il prodotto <3>{{productTitle}}</3>. Fai in modo che la motivazione sia chiara e facile da capire, così da comunicare efficacemente la causa del rifiuto.'
                }
              </Trans>
            </Grid>
            <Grid item width="100%" height="100%">
              <TextField
                id="input-reason"
                fullWidth
                multiline
                rows={2}
                inputProps={{
                  maxLength: 500,
                }}
                sx={{
                  '.MuiInputLabel-root:not(.Mui-focused)': {
                    transform: 'translate(14px, 8px) scale(1)',
                  },
                }}
                label={t('onboardingRequestPage.actions.decline.modal.reason')}
                helperText={t('onboardingRequestPage.actions.decline.modal.maxCharactersAllowed')}
                onChange={(e) => setReason(e.target.value)}
              />
            </Grid>
          </Grid>
        }
        onConfirmLabel={t('onboardingRequestPage.actions.decline.modal.confirm')}
        onCloseLabel={t('onboardingRequestPage.actions.decline.modal.back')}
        onConfirm={rejectOnboarding}
        onConfirmEnabled={reason.length >= 1}
        handleClose={() => {
          setReason('');
          setOpenRejectModal(false);
        }}
      />
    </>
  );
}
