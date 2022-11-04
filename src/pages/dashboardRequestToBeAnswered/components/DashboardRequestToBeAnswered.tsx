import { Chip, Grid, Typography, Alert, Stack, Paper, Divider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { NavigationBar } from '@pagopa/selfcare-common-frontend';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation, Trans } from 'react-i18next';

export default function DashboardRequestToBeAnswered() {
  const { t } = useTranslation();

  return (
    <Grid container ml={32} sx={{ width: '920px' }}>
      <Grid item xs={12} mt={5}>
        <NavigationBar
          paths={[
            {
              description: t('requestToBeAnsweredPage.navigationBar.parties'),
            },
            {
              description: 'selectedParty', // TODO SelectedParty
            },
            {
              description: t('requestToBeAnsweredPage.navigationBar.toValidateData'),
            },
          ]}
          showBackComponent={true}
          goBack={() => history.back()}
        />
      </Grid>
      <Grid item xs={12} mt={3} sx={{ display: 'flex' }}>
        <Grid xs={8}>
          <Typography variant="h4"> {t('requestToBeAnsweredPage.title')} </Typography>
        </Grid>
        <Grid xs={4}>
          <Chip
            sx={{ backgroundColor: '#FFD25E' }}
            label={t('requestToBeAnsweredPage.validationDataChip')}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} width="100%" mt={8}>
        <Alert
          severity="warning"
          sx={{
            fontSize: 'fontSize',
            alignItems: 'center',
            color: 'colorTextPrimary',
            backgroundColor: 'background.paper',
            borderLeft: 'solid',
            borderLeftColor: '#FFCB46',
            borderLeftWidth: '4px',
            width: '100%',
            height: '72px',
          }}
        >
          {t('requestToBeAnsweredPage.checkPartyInfoAlert')}
        </Alert>
      </Grid>
      <Stack spacing={3} mt={4} sx={{ width: '100%' }}>
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
          <Grid container sx={{ marginY: 4, marginX: 4 }}>
            <Typography sx={{ fontSize: '14px' }}>
              {t('requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.step')}
            </Typography>
            <Grid item xs={12}>
              <TitleBox
                title={t(
                  'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.title'
                )}
                subTitle={
                  (
                    <Trans
                      i18nKey={
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.description'
                      }
                    >
                      Conferma, modifica o inserisci i dati dell’ente, assicurandoti che siano
                      corretti. Verranno usati anche per richiedere <br />
                      l’adesione ad altri prodotti e in caso di fatturazione.,
                    </Trans>
                  ) as unknown as string
                }
                variantTitle={'h6'}
                variantSubTitle={'body1'}
                subTitleFontSize={'14px'}
                mtTitle={2}
                mbTitle={1}
                mbSubTitle={1}
              />
              <Divider />
            </Grid>
            <Grid item xs={12} mt={5}>
              <Grid container spacing={1}>
                {/* businessName */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.businessName'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'businessNameData'} {/* TODO businessName */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* registeredOffice */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registeredOffice'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'registeredOfficeData'} {/* TODO registeredOffice */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* mailPEC */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.mailPEC'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'mailPECData'} {/* TODO mailPEC */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* taxcode */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.taxCode'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'taxCodeData'} {/* TODO taxCodeData */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* vatNumber */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.vatNumber'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'vatNumberData'} {/* TODO vatNumber */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* recipientCode */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.recipientCode'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'recipientCodeData'} {/* TODO recipientCode */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* commercialRegisterNumber */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.commercialRegisterNumber'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'commercialRegisterNumberData'} {/* TODO commercialRegisterNumber */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* registrationInRegister */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registrationInRegister'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'registrationInRegisterData'} {/* TODO registrationInRegister */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* registerNumber */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registerNumber'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'registerNumberData'} {/* registerNumber */}
                    </Typography>
                  </Grid>
                </Grid>

                {/* abiCode */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.abiCode'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ color: 'colorTextPrimary' }}>
                      {'abiCodeData'} {/* abiCode */}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
          <Typography sx={{ fontSize: '14px' }}>
            {t('requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.step')}
          </Typography>
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.title'
              )}
              subTitle={t(
                'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.description'
              )}
              titleFontSize={'24px'}
              subTitleFontSize={'14px'}
              mbTitle={1}
            />
            <Divider />
          </Grid>
        </Paper>
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
          <Typography sx={{ fontSize: '14px' }}>
            {t('requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.step')}
          </Typography>
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.title'
              )}
              subTitle={t(
                'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.description'
              )}
              titleFontSize={'24px'}
              subTitleFontSize={'14px'}
              mbTitle={1}
            />
          </Grid>
          <Divider />
        </Paper>
      </Stack>
    </Grid>
  );
}
