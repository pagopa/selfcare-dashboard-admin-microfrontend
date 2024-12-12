import { Button, Grid, Stack, TextField } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import { SessionModal, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../../utils/constants';
import {
  approveOnboardingPspRequest,
  rejectOnboardingRequest,
} from '../../../services/onboardingRequestService';
import { ENV } from '../../../utils/env';

type Props = {
  setShowRejectPage: Dispatch<SetStateAction<boolean | undefined>>;
  setShowConfirmPage: Dispatch<SetStateAction<boolean | undefined>>;
  isToBeValidatedRequest: boolean;
  isGPU: boolean;
  retrieveTokenIdFromUrl?: string;
  partyName?: string;
  productTitle?: string;
  attatchmentName?: string;
};

export default function DashboardRequestActions({
  setShowRejectPage,
  setShowConfirmPage,
  isToBeValidatedRequest,
  isGPU,
  retrieveTokenIdFromUrl,
  partyName,
  productTitle,
  attatchmentName,
}: Props) {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);

  const [_openRejectModal, setOpenRejectModal] = useState<boolean>(false);
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

  const fileFromReader = async (
    reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  ): Promise<string> => {
    const stream = new ReadableStream({
      start(controller) {
        return pump();
        function pump(): Promise<any> | undefined {
          return reader?.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }
      },
    });
    const response = new Response(stream);

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const rejectOnboarding = () => {
    setLoadingRetrieveOnboardingRequest(true);
    if (retrieveTokenIdFromUrl) {
      rejectOnboardingRequest(retrieveTokenIdFromUrl)
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

  const downloadAttachment = () => {
    setLoadingRetrieveOnboardingRequest(true);
    const sessionToken = storageTokenOps.read();
    if (retrieveTokenIdFromUrl) {
      void fetch(
        ENV.URL_API.API_ONBOARDING_V2 +
          `/v2/tokens/${retrieveTokenIdFromUrl}/attachment?=name${attatchmentName}`,
        {
          headers: {
            accept: '*/*',
            'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
            authorization: `Bearer ${sessionToken}`,
            'content-type': 'application/octet-stream',
          },
          method: 'GET',
        }
      )
        .then((response) => {
          const contentDisposition = response.headers.get('content-disposition');
          const matchedIndex = contentDisposition?.indexOf('=') as number;
          const fileName =
            contentDisposition?.substring(matchedIndex + 1) ?? 'checklist_adesione_gpu.pdf';
          return response.blob().then((blob) => {
            const reader = blob.stream().getReader();
            void fileFromReader(reader).then((url) => {
              const link = document.createElement('a');
              // eslint-disable-next-line functional/immutable-data
              link.href = url;
              // eslint-disable-next-line functional/immutable-data
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
            });
          });
        })
        // eslint-disable-next-line sonarjs/no-identical-functions
        .catch(() => {
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

  return (
    <>
      {isToBeValidatedRequest && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" py={4}>
          <Stack>
            <Button
              variant="outlined"
              color="error"
              style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
              onClick={rejectOnboarding}
            >
              {t('onboardingRequestPage.actions.decline.button')}
            </Button>
          </Stack>

          {isGPU ? (
            <Stack direction={'row'}>
              <Button
                variant="naked"
                sx={{ marginLeft: 3 }}
                startIcon={<FileDownloadIcon />}
                onClick={downloadAttachment}
              >
                {t('onboardingRequestPage.actions.downloadButton')}
              </Button>
              <Button variant="contained" sx={{ marginLeft: 3 }} onClick={approveOnboarding}>
                {t('onboardingRequestPage.actions.approveButton')}
              </Button>
            </Stack>
          ) : (
            <Stack>
              <Button variant="contained" sx={{ marginLeft: 3 }} onClick={approveOnboarding}>
                {t('onboardingRequestPage.actions.approveButton')}
              </Button>
            </Stack>
          )}
        </Stack>
      )}

      <SessionModal
        open={false}
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
