import { Alert, Button, Grid, Typography } from '@mui/material';
import {
  NavigationBar,
  useErrorDispatcher,
  useLoading,
} from '@pagopa/selfcare-common-frontend/lib';
import { NavigationPath } from '@pagopa/selfcare-common-frontend/lib/components/NavigationBar';
import { AppError } from '@pagopa/selfcare-common-frontend/lib/model/AppError';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/lib/utils/productId2ProductTitle';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { AvailableDocumentsResource } from '../../api/generated/onboarding/AvailableDocumentsResource';
import { useGlobalPermissions } from '../../hooks/useGlobalPermissions';
import { OnboardingRequestResource } from '../../model/OnboardingRequestResource';
import {
  downloadOnboardingRequestAttachment,
  fetchOnboardingRequest,
  getAvailableDocuments,
} from '../../services/onboardingRequestService';
import { LOADING_RETRIEVE_ONBOARDING_REQUEST } from '../../utils/constants';
import { ENV } from '../../utils/env';
import ConfirmPage from '../confirmPage/ConfirmPage';
import RejectPage from '../rejectedPage/RejectPage';
import RetrieveTokenErrorPage from './JwtInvalidPage';
import DashboardRequestActions from './components/DashboardRequestActions';
import DashboardRequestFields from './components/DashboardRequestFields';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function DashboardRequest() {
  const { t } = useTranslation();
  const setLoadingRetrieveOnboardingRequest = useLoading(LOADING_RETRIEVE_ONBOARDING_REQUEST);
  const addError = useErrorDispatcher();
  const history = useHistory();
  const location = useLocation<{ fromDashboard?: boolean }>();
  useGlobalPermissions();

  const [onboardingRequestData, setOnboardingRequestData] = useState<OnboardingRequestResource>();
  const [availableDocuments, setAvailableDocuments] = useState<AvailableDocumentsResource>();
  const [showDocumentsSection, setShowDocumentsSection] = useState<boolean>(false);
  const [showRejectPage, setShowRejectPage] = useState<boolean>();
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>();
  const [error, setError] = useState<boolean>(false);

  // eslint-disable-next-line functional/immutable-data
  const retrieveTokenIdFromUrl = window.location.pathname.split('/').pop();

  const isPSP = onboardingRequestData?.institutionInfo.institutionType === 'PSP';
  const isGPU = onboardingRequestData?.institutionInfo.institutionType === 'GPU';
  const productTitle = productId2ProductTitle(onboardingRequestData?.productId ?? '');
  const primaryAttachmentName =
    availableDocuments?.attachments?.[0] ?? onboardingRequestData?.attachments?.[0] ?? '';

  useEffect(() => {
    if (retrieveTokenIdFromUrl) {
      retrieveOnboardingRequest(retrieveTokenIdFromUrl);
    }
  }, [retrieveTokenIdFromUrl]);

  const retrieveOnboardingRequest = (retrieveTokenIdFromUrl: string) => {
    setLoadingRetrieveOnboardingRequest(true);
    fetchOnboardingRequest(retrieveTokenIdFromUrl)
      .then((response) => {
        setOnboardingRequestData(response);
        return getAvailableDocuments(retrieveTokenIdFromUrl)
          .then((documents) => {
            setAvailableDocuments(documents);
            setShowDocumentsSection(true);
          })
          .catch(() => {
            setAvailableDocuments(undefined);
            setShowDocumentsSection(false);
          });
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoadingRetrieveOnboardingRequest(false));
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

  const parseFilename = (header: string | null): string | undefined => {
    if (!header) {
      return undefined;
    }
    const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header);

    if (utf8?.[1]) {
      return decodeURIComponent(utf8[1]);
    }
    const plain = /filename="?([^";]+)"?/i.exec(header);
    return plain?.[1]?.trim();
  };

  const downloadAttachment = (
    setLoadingRetrieveOnboardingRequest: (loading: boolean) => void,
    addError: (error: AppError) => void,
    reason?: string,
    retrieveTokenIdFromUrl?: string,
    attatchmentName?: string,
    documentType: string = 'ATTACHMENT'
  ) => {
    if (retrieveTokenIdFromUrl) {
      downloadOnboardingRequestAttachment(
        retrieveTokenIdFromUrl,
        documentType,
        attatchmentName ?? ''
      )
        .then((response) => {
          const fileName =
            parseFilename(response.headers.get('content-disposition')) ??
            'documento_di_adesione.pdf';
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

  const goBack = () => {
    if (location.state?.fromDashboard) {
      history.goBack();
    } else {
      history.push(ENV.ROUTES.ADMIN_ONBOARDINGS);
    }
  };

  const innerPaths: Array<NavigationPath> = [];

  return showRejectPage ? (
    <RejectPage onboardingRequestData={onboardingRequestData} />
  ) : showConfirmPage ? (
    <ConfirmPage onboardingRequestData={onboardingRequestData} />
  ) : error ? (
    <RetrieveTokenErrorPage />
  ) : onboardingRequestData ? (
    <Grid container justifyContent="center">
      <Grid container sx={{ width: '920px' }}>
        <Grid xs={12} mt={4}>
          <NavigationBar
            paths={innerPaths}
            showBackComponent={true}
            goBack={goBack}
            backLabel={'Indietro'}
            color="black"
          />
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            mt={2}
          >
            <Grid item xs>
              <Typography variant="h4">{t('onboardingRequestPage.detailTitle')}</Typography>
              <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                {t('onboardingRequestPage.detailSubtitle')}
              </Typography>
            </Grid>
            <Grid item textAlign={'right'}>
              {isGPU && (
                <Button
                  variant="contained"
                  onClick={() =>
                    downloadAttachment(
                      setLoadingRetrieveOnboardingRequest,
                      addError,
                      undefined,
                      retrieveTokenIdFromUrl,
                      primaryAttachmentName
                    )
                  }
                >
                  {t('onboardingRequestPage.actions.downloadDataButton')}
                </Button>
              )}
              <DashboardRequestActions
                variant="top"
                retrieveTokenIdFromUrl={retrieveTokenIdFromUrl}
                partyName={onboardingRequestData?.institutionInfo.name}
                productTitle={productTitle}
                setShowRejectPage={setShowRejectPage}
                setShowConfirmPage={setShowConfirmPage}
                isToBeValidatedRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
                attatchmentName={primaryAttachmentName}
                downloadAttachment={downloadAttachment}
                isGPU={isGPU}
              />
            </Grid>
          </Grid>
          {onboardingRequestData?.status === 'REJECTED' && (
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
                    )}. </1> <3/>Motivo del rifiuto: â€œ${onboardingRequestData?.reasonForReject}â€œ`}
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
          )}
          <DashboardRequestFields
            onboardingRequestData={onboardingRequestData}
            availableDocuments={availableDocuments}
            showAvailableDocuments={showDocumentsSection}
            isPSP={isPSP}
            fromISO2ITA={fromISO2ITA}
            onDownloadDocument={(attachmentName, documentType) =>
              downloadAttachment(
                setLoadingRetrieveOnboardingRequest,
                addError,
                undefined,
                retrieveTokenIdFromUrl,
                attachmentName,
                documentType
              )
            }
          />
          <DashboardRequestActions
            retrieveTokenIdFromUrl={retrieveTokenIdFromUrl}
            partyName={onboardingRequestData?.institutionInfo.name}
            productTitle={productTitle}
            setShowRejectPage={setShowRejectPage}
            setShowConfirmPage={setShowConfirmPage}
            isToBeValidatedRequest={onboardingRequestData?.status === 'TOBEVALIDATED'}
            attatchmentName={primaryAttachmentName}
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
