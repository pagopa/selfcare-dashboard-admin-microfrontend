import { Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { theme } from '@pagopa/mui-italia';

export default function DashboardRequestFields() {
  const { t } = useTranslation();
  return (
    <Stack spacing={4} mt={4} sx={{ width: '100%' }}>
      <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
        <Grid container sx={{ marginY: 4, marginX: 4 }}>
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.title'
              )}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'registeredOfficeData'} {/* TODO registeredOffice */}
                  </Typography>
                </Grid>
              </Grid>

              {/* zipCode */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.zipCode'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'zipCodeData'} {/* TODO zipCode */}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'vatNumberData'} {/* TODO vatNumber */}
                  </Typography>
                </Grid>
              </Grid>

              {/* isGroupPIVA */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.isGroupPIVA'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'isGroupPIVAData'} {/* TODO isGroupPIVA */}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'registerNumberData'} {/* TODO registerNumber */}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'abiCodeData'} {/* TODO abiCode */}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'recipientCodeData'} {/* TODO recipientCode */}
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'fontWeightMedium',
                  marginTop: 4,
                  marginBottom: 2,
                }}
                ml={1}
              >
                {t(
                  'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.title'
                )}
              </Typography>

              {/* protectionOfficerAddress */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.address'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'protectionOfficerAddressData'} {/* TODO protectionOfficerAddress */}
                  </Typography>
                </Grid>
              </Grid>

              {/* protectionOfficerMailPEC */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.mailPEC'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'protectionOfficerMailPEC'} {/* TODO protectionOfficerMailPECData */}
                  </Typography>
                </Grid>
              </Grid>

              {/* protectionOfficerMail */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'requestToBeAnsweredPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.mail'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'protectionOfficerMailData'} {/* TODO protectionOfficerMail */}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
        <Grid container sx={{ marginY: 4, marginX: 4 }}>
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'requestToBeAnsweredPage.summaryStepSection.managerInfoSummarySection.title'
              )}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.title'
              )}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
            />
            <Divider />
          </Grid>
          <Grid item xs={12} mt={4}>
            {/* TODO Add logic for show if present other delegates (using transcoded 
                "requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.secondAdmin"
                OR
                "requestToBeAnsweredPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.thirdAdmin" */}
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
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
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {'mailPECData'} {/* TODO mailPEC */}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
