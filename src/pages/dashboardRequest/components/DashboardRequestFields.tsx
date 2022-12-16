import { Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { theme } from '@pagopa/mui-italia';
import { OnboardingRequestResource } from '../../../model/OnboardingRequestResource';

type Props = {
  onboardingRequestData: OnboardingRequestResource | undefined;
  isPSP: boolean;
};

export default function DashboardRequestFields({ onboardingRequestData, isPSP }: Props) {
  const { t } = useTranslation();

  return (
    <Stack spacing={4} mt={4} sx={{ width: '100%' }}>
      <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
        <Grid container sx={{ marginY: 4, marginX: 4 }}>
          <Grid item xs={12}>
            <TitleBox
              title={t(
                'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.title'
              )}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
            />
            <Divider />
          </Grid>
          <Grid item xs={12} mt={4}>
            <Grid container spacing={2}>
              {/* businessName */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.businessName'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.name}
                  </Typography>
                </Grid>
              </Grid>

              {/* registeredOffice */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registeredOffice'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.address}
                  </Typography>
                </Grid>
              </Grid>

              {/* zipCode */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.zipCode'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.zipCode}
                  </Typography>
                </Grid>
              </Grid>

              {/* mailPEC */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.mailPEC'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.mailAddress.toLocaleLowerCase()}
                  </Typography>
                </Grid>
              </Grid>

              {/* taxcode */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.taxCode'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.fiscalCode}
                  </Typography>
                </Grid>
              </Grid>

              {/* vatNumber */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.vatNumber'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.vatNumber}
                  </Typography>
                </Grid>
              </Grid>

              {/* fields visible only for PSP */}
              {isPSP && (
                <>
                  {/* isGroupPIVA */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.isGroupPIVA.title'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.pspData.vatNumberGroup
                          ? t(
                              'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.isGroupPIVA.yes'
                            )
                          : t(
                              'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.isGroupPIVA.no'
                            )}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* commercialRegisterNumber */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.commercialRegisterNumber'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.pspData.businessRegisterNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* registrationInRegister */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registrationInRegister'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.pspData.legalRegisterName}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* registerNumber */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.registerNumber'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.pspData.legalRegisterNumber}
                      </Typography>
                    </Grid>
                  </Grid>
                  {/* abiCode */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.abiCode'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.pspData.abiCode}
                      </Typography>
                    </Grid>
                  </Grid>{' '}
                </>
              )}

              {/* recipientCode */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.recipientCode'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.institutionInfo.recipientCode}
                  </Typography>
                </Grid>
              </Grid>

              {/* fields visible only for PSP */}
              {isPSP && (
                <>
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
                      'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.title'
                    )}
                  </Typography>

                  {/* protectionOfficerAddress */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.address'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.dpoData.address}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* protectionOfficerMailPEC */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.mailPEC'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.dpoData.pec.toLocaleLowerCase()}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* protectionOfficerMail */}
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3}>
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.protectionOfficerDetailData.mail'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.dpoData.email.toLocaleLowerCase()}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
        <Grid container sx={{ marginY: 4, marginX: 4 }}>
          <Grid item xs={12}>
            <TitleBox
              title={t('onboardingRequestPage.summaryStepSection.managerInfoSummarySection.title')}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
            />
            <Divider />
          </Grid>
          <Grid item xs={12} mt={4}>
            <Grid container spacing={2}>
              {/* name */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.name'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.manager.name}
                  </Typography>
                </Grid>
              </Grid>

              {/* surname */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.surname'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.manager.surname}
                  </Typography>
                </Grid>
              </Grid>

              {/* taxCode */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.taxCode'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.manager.fiscalCode}
                  </Typography>
                </Grid>
              </Grid>

              {/* mailPEC */}
              <Grid container item alignItems={'center'}>
                <Grid item xs={3}>
                  <Typography sx={{ fontSize: 'fontSize' }}>
                    {t(
                      'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.mailPEC'
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {onboardingRequestData?.manager.email.toLocaleLowerCase()}
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
                'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.title'
              )}
              variantTitle={'h6'}
              mtTitle={1}
              mbTitle={5}
            />
            <Divider />
          </Grid>

          <Grid item xs={12} mt={4}>
            {onboardingRequestData?.admins.map((admin, index) => (
              <Grid container spacing={2} key={index}>
                {onboardingRequestData.admins.length > 1 && index + 1 !== 1 && (
                  <Grid item>
                    <Typography variant="body1" sx={{ fontWeight: 'fontWeightMedium' }} mt={3}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.moreOfOneAdmin'
                      )}
                      {`${index + 1}`}
                    </Typography>
                  </Grid>
                )}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.name'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {admin.name}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.surname'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {admin.surname}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.taxCode'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {admin.fiscalCode}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3}>
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.mailPEC'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {admin.email.toLocaleLowerCase()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
