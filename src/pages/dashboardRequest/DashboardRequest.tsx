import { Alert, Button, Chip, Grid, Typography } from '@mui/material';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/lib/utils/productId2ProductTitle';
import { AppError } from '@pagopa/selfcare-common-frontend/lib/model/AppError';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import {
  fetchOnboardingRequest,
} from '../../services/onboardingRequestService';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../utils/constants';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import { ENV } from '../../utils/env';
import RetrieveTokenErrorPage from './JwtInvalidPage';
import DashboardRequestActions from './components/DashboardRequestActions';
import DashboardRequestFields from './components/DashboardRequestFields';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function DashboardRequest() {
  const { t } = useTranslation();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);
  const addError = useErrorDispatcher();
  const [onboardingRequestData, setOnboardingRequestData] = useState<OnboardingRequestResource>();
  const [showRejectPage, setShowRejectPage] = useState<boolean>();
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  // eslint-disable-next-line functional/immutable-data
  const retrieveTokenIdFromUrl = window.location.pathname.split('/').pop();

  const isPSP = onboardingRequestData?.institutionInfo.institutionType === 'PSP';
  const isGPU = onboardingRequestData?.institutionInfo.institutionType === 'GPU';
  const productTitle = productId2ProductTitle(onboardingRequestData?.productId ?? '');

  useEffect(() => {
    if (retrieveTokenIdFromUrl) {
      retrieveOnboardingRequest(retrieveTokenIdFromUrl);
    }
  }, [retrieveTokenIdFromUrl]);

  const retrieveOnboardingRequest = (retrieveTokenIdFromUrl: string) => {
    setLoadingRetrieveOnboardingRequest(true);
    fetchOnboardingRequest(retrieveTokenIdFromUrl)
      .then((r) => {
        setOnboardingRequestData(r);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoadingRetrieveOnboardingRequest(false));
  };

  const requestState = (
    requestStatus: string | undefined,
    isChipLabelState: boolean,
    isBgColorChipState: boolean
  ) => {
    if (isChipLabelState) {
      switch (requestStatus) {
        case 'COMPLETED':
          return t('onboardingRequestPage.approvedDataChip');
        case 'PENDING':
          return t('onboardingRequestPage.approvedDataChip');
        case 'REJECTED':
          return t('onboardingRequestPage.rejectedDataChip');
        default:
          return t('onboardingRequestPage.validationDataChip');
      }
    }
    if (isBgColorChipState) {
      switch (requestStatus) {
        case 'COMPLETED':
          return 'success.light';
        case 'PENDING':
          return 'success.light';
        case 'REJECTED':
          return 'warning.main';
        default:
          return 'info.main';
      }
    }
    return undefined;
  };

  const fromISO2ITA = (date?: string) => {
    const dateFormat = new Date(date as string);
    const day = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();

    return `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
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

  const downloadAttachment = (
    setLoadingRetrieveOnboardingRequest: (loading: boolean) => void,
    addError: (error: AppError) => void,
    reason?: string,
    retrieveTokenIdFromUrl?: string,
    attatchmentName?: string
  ) => {
    const sessionToken = storageTokenOps.read();
    const nameParam = new URLSearchParams({
      name: attatchmentName ?? '',
    });
    const url = `${ENV.URL_API.API_ONBOARDING_V2}/v2/tokens/${retrieveTokenIdFromUrl}/attachment?${nameParam.toString()}`;
    if (retrieveTokenIdFromUrl) {
      fetch(url, {
        headers: {
          accept: '*/*',
          'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          authorization: `Bearer ${sessionToken}`,
          'content-type': 'application/octet-stream',
        },
        method: 'GET',
      })
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
            techDescription: reason ?? '',
            toNotify: false,
            error: new Error('INVALID_TOKEN_ID'),
          });
        })
        .finally(() => setLoadingRetrieveOnboardingRequest(false));
    }
  };

  const isExpiredRequest =
    onboardingRequestData?.status !== 'COMPLETED' &&
    onboardingRequestData?.status !== 'REJECTED' &&
    onboardingRequestData?.expiringDate
      ? new Date(onboardingRequestData?.expiringDate) <= new Date()
      : false;

  return showRejectPage ? (
    <RejectPage onboardingRequestData={onboardingRequestData} />
  ) : showConfirmPage ? (
    <ConfirmPage onboardingRequestData={onboardingRequestData} />
  ) : error ? (
    <RetrieveTokenErrorPage />
  ) : onboardingRequestData ? (
    <Grid container justifyContent="center">
      <Grid container sx={{ width: '920px' }}>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent={isGPU ? undefined : 'space-between'}
            alignItems="center"
            mt={6}
          >
            <Grid item xs={isGPU ? 4 : undefined}>
              <Typography variant="h4"> {t('onboardingRequestPage.title')} </Typography>
            </Grid>
            <Grid xs={isGPU ? 2 : undefined}>
              <Chip
                sx={{
                  backgroundColor: isExpiredRequest
                    ? 'error.main'
                    : requestState(onboardingRequestData?.status, false, true),
                  height: '30px',
                }}
                label={
                  isExpiredRequest
                    ? t('onboardingRequestPage.expired.chip')
                    : requestState(onboardingRequestData?.status, true, false)
                }
              />
            </Grid>
            {isGPU && (
              <Grid item xs={6} textAlign={'right'}>
                <Button
                  variant="contained"
                  onClick={() =>
                    downloadAttachment(
                      setLoadingRetrieveOnboardingRequest,
                      addError,
                      retrieveTokenIdFromUrl,
                      onboardingRequestData?.attachments?.[0] ?? '',
                    )
                  }
                >
                  {t('onboardingRequestPage.actions.downloadDataButton')}
                </Button>
              </Grid>
            )}
          </Grid>
          {isExpiredRequest ? (
            <Grid item xs={12} width="100%" mt={5}>
              <Alert
                severity="error"
                sx={{
                  fontSize: 'fontSize',
                  height: '53px',
                  alignItems: 'center',
                  color: 'colorTextPrimary',
                  borderLeft: 'solid',
                  borderLeftColor: 'error.main',
                  borderLeftWidth: '4px',
                  width: '100%',
                }}
              >
                {t('onboardingRequestPage.expired.reason')}
              </Alert>
            </Grid>
          ) : onboardingRequestData?.status === 'TOBEVALIDATED' ? (
            <Grid item xs={12} width="100%" mt={5}>
              <Alert
                severity="info"
                sx={{
                  fontSize: 'fontSize',
                  height: '53px',
                  alignItems: 'center',
                  color: 'colorTextPrimary',
                  borderLeft: 'solid',
                  borderLeftColor: 'info.main',
                  borderLeftWidth: '4px',
                  width: '100%',
                }}
              >
                {t('onboardingRequestPage.checkPartyInfoAlert')}
              </Alert>
            </Grid>
          ) : (
            onboardingRequestData?.status === 'REJECTED' && (
              <Grid item xs={12} width="100%" mt={5}>
                <Alert
                  severity="warning"
                  sx={{
                    fontSize: 'fontSize',
                    height: '74px',
                    alignItems: 'center',
                    color: 'colorTextPrimary',
                    borderLeft: 'solid',
                    borderLeftColor: 'warning.main',
                    borderLeftWidth: '4px',
                    width: '100%',
                  }}
                >
                  {onboardingRequestData?.reasonForReject ? (
                    <Trans
                      i18nKey={
                        'onboardingRequestPage.checkPartyInfoAlert.checkPartyRejectReasonAlert'
                      }
                      components={{
                        1: <strong style={{ fontWeight: '600' }} />,
                        3: <br />,
                      }}
                    >
                      {`<1>Hai rifiutato questa richiesta di adesione il ${fromISO2ITA(
                        onboardingRequestData?.updatedAt
                      )}. </1> <3/>Motivo del rifiuto: “${onboardingRequestData?.reasonForReject}“`}
                    </Trans>
                  ) : (
                    <Trans
                      i18nKey={
                        'onboardingRequestPage.checkPartyInfoAlert.checkPartyRejectReasonAlert'
                      }
                      components={{
                        1: <strong style={{ fontWeight: '600' }} />,
                      }}
                    >{`<1>Hai rifiutato questa richiesta di adesione il ${fromISO2ITA(
                      onboardingRequestData?.updatedAt
                    )}. </1>`}</Trans>
                  )}
                </Alert>
              </Grid>
            )
          )}
          <DashboardRequestFields onboardingRequestData={onboardingRequestData} isPSP={isPSP} />
          <DashboardRequestActions
            retrieveTokenIdFromUrl={retrieveTokenIdFromUrl}
            partyName={onboardingRequestData?.institutionInfo.name}
            productTitle={productTitle}
            setShowRejectPage={setShowRejectPage}
            setShowConfirmPage={setShowConfirmPage}
            isToBeValidatedRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
            attatchmentName={onboardingRequestData?.attachments?.[0] ?? ''}
            downloadAttachment={downloadAttachment}
            isGPU={isGPU}
          />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}
