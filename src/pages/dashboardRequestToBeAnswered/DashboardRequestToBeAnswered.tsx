import {
  Chip,
  Grid,
  Typography,
  Alert,
  Stack,
  Paper,
  Divider,
  styled,
  Button,
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { NavigationBar } from '@pagopa/selfcare-common-frontend';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation, Trans } from 'react-i18next';

const CustomAlert = styled(Alert)({
  '& .MuiAlert-icon': {
    color: '#FFCB46',
  },
});

export default function DashboardRequestToBeAnswered() {
  const { t } = useTranslation();

  return (
    <Grid container ml={32} sx={{ width: '920px' }}>
      <Grid item xs={12}>
        <Grid mt={5}>
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
            goBack={() => history.back()} // TODO Set the correct one
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          sx={{ display: 'flex' }}
        >
          <Grid item>
            <Typography variant="h4"> {t('requestToBeAnsweredPage.title')} </Typography>
          </Grid>
          <Grid item>
            <Chip
              sx={{ backgroundColor: 'warning.main', height: '30px' }}
              label={t('requestToBeAnsweredPage.validationDataChip')}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} width="100%" mt={5}>
          <CustomAlert
            severity="warning"
            sx={{
              fontSize: 'fontSize',
              backgroundColor: 'background.paper',
              height: '80px',
              alignItems: 'center',
              color: 'colorTextPrimary',
              borderLeft: 'solid',
              borderLeftColor: 'warning.main',
              borderLeftWidth: '4px',
              width: '100%',
            }}
          >
            {t('requestToBeAnsweredPage.checkPartyInfoAlert')}
          </CustomAlert>
        </Grid>
        <Stack spacing={4} mt={4} sx={{ width: '100%' }}>
          <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
            <Grid container sx={{ marginY: 4, marginX: 4 }}>
              <Typography variant="subtitle2" sx={{ fontSize: '14px' }}>
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
                  mbSubTitle={2}
                />
                <Divider />
              </Grid>
              <Grid item xs={12} mt={4}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
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
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'abiCodeData'} {/* abiCode */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
            <Grid container sx={{ marginY: 4, marginX: 4 }}>
              <Typography variant="subtitle2" sx={{ fontSize: '14px' }}>
                {t('requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.step')}
              </Typography>
              <Grid item xs={12}>
                <TitleBox
                  title={t(
                    'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.title'
                  )}
                  subTitle={
                    (
                      <Trans
                        i18nKey={
                          'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.description'
                        }
                      >
                        Inserisci i dati del Legale Rappresentante. <br />
                        La persona che indicherai sarà firmataria del contratto per [productTitle].
                      </Trans>
                    ) as unknown as string
                  }
                  variantTitle={'h6'}
                  variantSubTitle={'body1'}
                  subTitleFontSize={'14px'}
                  mtTitle={2}
                  mbTitle={1}
                  mbSubTitle={2}
                />
                <Divider />
              </Grid>
              <Grid item xs={12} mt={4}>
                <Grid container spacing={1}>
                  {/* name */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.name'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'nameData'} {/* TODO name */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* surname */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.surname'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'surnameData'} {/* TODO surname */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* taxCode */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.taxCode'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'taxCodeData'} {/* TODO taxCode */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* mailPEC */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.mailPEC'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'mailPECData'} {/* TODO mailPEC */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
            <Grid container sx={{ marginY: 4, marginX: 4 }}>
              <Typography variant="subtitle2" sx={{ fontSize: '14px' }}>
                {t('requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.step')}
              </Typography>
              <Grid item xs={12}>
                <TitleBox
                  title={t(
                    'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.title'
                  )}
                  subTitle={
                    (
                      <Trans
                        i18nKey={
                          'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.description'
                        }
                      >
                        Inserisci i dati dell’Amministratore o di un suo delegato. <br />
                        La persona che indicherai sarà responsabile della gestione di
                        [productTitle].
                      </Trans>
                    ) as unknown as string
                  }
                  variantTitle={'h6'}
                  variantSubTitle={'body1'}
                  subTitleFontSize={'14px'}
                  mtTitle={2}
                  mbTitle={1}
                  mbSubTitle={2}
                />
                <Divider />
              </Grid>
              <Grid item xs={12} mt={4}>
                <Grid container spacing={1}>
                  {/* name */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.name'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'nameData'} {/* TODO name */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* surname */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.surname'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'surnameData'} {/* TODO surname */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* taxCode */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.taxCode'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'taxCodeData'} {/* TODO taxCode */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* mailPEC */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.mailPEC'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontWeight: 'fontWeightMedium' }}>
                        {'mailPECData'} {/* TODO mailPEC */}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" my={5}>
          <Stack>
            <Button variant="outlined" onClick={() => history.back()}>
              {/* TODO Check if correct and if not add correct back actions else remove this TODO */}
              {t('requestToBeAnsweredPage.actions.backButton')}
            </Button>
          </Stack>
          <Stack display="inline-block">
            <Button
              variant="outlined"
              color="error"
              style={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
              onClick={() => ''}
            >
              {/* TODO Add call for decline request */}
              {t('requestToBeAnsweredPage.actions.declineButton')}
            </Button>
            <Button variant="contained" sx={{ marginLeft: 3 }} onClick={() => ''}>
              {/* TODO Add call for approve request */}
              {t('requestToBeAnsweredPage.actions.approveButton')}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
