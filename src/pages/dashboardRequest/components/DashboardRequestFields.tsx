import {
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { theme } from '@pagopa/mui-italia';
import { useRef, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/utils/productId2ProductTitle';
import { OnboardingRequestResource } from '../../../model/OnboardingRequestResource';

type Props = {
  onboardingRequestData: OnboardingRequestResource | undefined;
  isPSP: boolean;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export default function DashboardRequestFields({ onboardingRequestData, isPSP }: Props) {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<{ [index: string]: boolean }>({ ['1']: true });
  const expandedIndexRef = useRef<string>('1');

  const isTechPartner = onboardingRequestData?.institutionInfo.institutionType === 'PT';

  const handleExpandClick = (index: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [expandedIndexRef.current]: !!prevExpanded[index],
      [index]: !prevExpanded[index],
    }));

    // eslint-disable-next-line functional/immutable-data
    expandedIndexRef.current = index;
  };

  const getInstitutionTypeDescription = (institutionType: string) =>
    ({
      institutionType: t(
        `onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.institutionType.descriptions.${institutionType.toLowerCase()}`
      ),
    }.institutionType);

  const boolean2response = (value?: boolean) =>
    t(
      value
        ? 'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.possibleChoice.yes'
        : 'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.possibleChoice.no'
    );

  return (
    <Stack spacing={4} mt={4} sx={{ width: '100%' }}>
      <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
        <Grid
          item
          xs={12}
          ml={4}
          my={3}
          mr={2}
          display="flex"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            {t('onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.title')}
          </Typography>
          <IconButton
            onClick={(e) => handleExpandClick(e.currentTarget.value)}
            sx={{
              '&:hover': {
                background: 'none',
              },
            }}
            value={'1'}
            data-testid={'arrow-icon-1'}
          >
            {expanded['1'] ? (
              <KeyboardArrowUpIcon color="primary" />
            ) : (
              <KeyboardArrowDownIcon color="primary" />
            )}
          </IconButton>
        </Grid>
        <Collapse in={expanded['1']} timeout="auto" unmountOnExit>
          <Divider sx={{ mx: 4 }} />
          <Grid container spacing={2} mt={2} mb={4} mx={2}>
            {/* productTitle */}
            <Grid container item alignItems={'center'}>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 'fontSize' }}>
                  {t(
                    'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.product'
                  )}
                </Typography>
              </Grid>
              {onboardingRequestData?.productId && (
                <Grid item xs={9} display="flex" alignItems={'center'}>
                  <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                    {productId2ProductTitle(onboardingRequestData?.productId)}
                  </Typography>
                </Grid>
              )}
            </Grid>

            {/* institutionType */}
            <Grid container item alignItems={'center'}>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 'fontSize' }}>
                  {t(
                    'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.institutionType.title'
                  )}
                </Typography>
              </Grid>
              <Grid item xs={9} display="flex" alignItems={'center'}>
                <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                  {getInstitutionTypeDescription(
                    onboardingRequestData?.institutionInfo.institutionType ?? ''
                  )}
                </Typography>
              </Grid>
            </Grid>

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
                      {onboardingRequestData?.institutionInfo.pspData?.vatNumberGroup
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
                      {onboardingRequestData?.institutionInfo.pspData?.businessRegisterNumber}
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
                      {onboardingRequestData?.institutionInfo.pspData?.legalRegisterName}
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
                      {onboardingRequestData?.institutionInfo.pspData?.legalRegisterNumber}
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
                      {onboardingRequestData?.institutionInfo.pspData?.abiCode}
                    </Typography>
                  </Grid>
                </Grid>{' '}
              </>
            )}
            {/* recipientCode */}
            {!isTechPartner && (
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
            )}
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
                      {onboardingRequestData?.institutionInfo.dpoData?.address}
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
                      {onboardingRequestData?.institutionInfo.dpoData?.pec.toLocaleLowerCase()}
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
                      {onboardingRequestData?.institutionInfo.dpoData?.email.toLocaleLowerCase()}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Collapse>
      </Paper>

      {onboardingRequestData?.institutionInfo.institutionType === 'GSP' &&
        onboardingRequestData.productId === 'prod-pagopa' && (
          <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
            <Grid
              item
              xs={12}
              ml={4}
              my={3}
              mr={2}
              display="flex"
              alignItems="center"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="h6">
                {t('onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.title')}
              </Typography>
              <IconButton
                onClick={(e) => handleExpandClick(e.currentTarget.value)}
                sx={{
                  '&:hover': {
                    background: 'none',
                  },
                }}
                value={'2'}
                data-testid={'arrow-icon-2'}
              >
                {expanded['2'] ? (
                  <KeyboardArrowUpIcon color="primary" />
                ) : (
                  <KeyboardArrowDownIcon color="primary" />
                )}
              </IconButton>
            </Grid>
            <Collapse in={expanded['2']} timeout="auto" unmountOnExit>
              <Divider sx={{ mx: 4 }} />
              <Grid container spacing={2} mt={2} mb={4} mx={2}>
                {/* establishedByRegulatoryProvision */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3} display="flex" alignItems="center">
                    <Tooltip
                      title={t(
                        'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.establishedByRegulatoryProvision'
                      )}
                      placement="top"
                      arrow={true}
                    >
                      <Typography
                        sx={{
                          fontSize: 'fontSize',
                          display: 'inline-block',
                          maxWidth: '21ch',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.establishedByRegulatoryProvision'
                        )}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {boolean2response(
                        onboardingRequestData?.institutionInfo.additionalInformations
                          ?.establishedByRegulatoryProvision
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* establishedByRegulatoryProvisionNote */}
                {onboardingRequestData.institutionInfo.additionalInformations
                  ?.establishedByRegulatoryProvisionNote && (
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3} display="flex" alignItems="center">
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.establishedByRegulatoryProvisionNote'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {
                          onboardingRequestData?.institutionInfo.additionalInformations
                            ?.establishedByRegulatoryProvisionNote
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {/* belongRegulatedMarket */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3} display="flex" alignItems="center">
                    <Tooltip
                      title={t(
                        'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.belongRegulatedMarket'
                      )}
                      placement="top"
                      arrow={true}
                    >
                      <Typography
                        sx={{
                          fontSize: 'fontSize',
                          display: 'inline-block',
                          maxWidth: '19ch',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.belongRegulatedMarket'
                        )}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {boolean2response(
                        onboardingRequestData?.institutionInfo.additionalInformations
                          ?.belongRegulatedMarket
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {onboardingRequestData.institutionInfo.additionalInformations
                  ?.regulatedMarketNote && (
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3} display="flex" alignItems="center">
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.belongRegulatedMarketNote'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {
                          onboardingRequestData?.institutionInfo.additionalInformations
                            ?.regulatedMarketNote
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {/* ipa */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3} display="flex" alignItems="center">
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.ipa'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {boolean2response(
                        onboardingRequestData?.institutionInfo.additionalInformations?.ipa
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* ipaCode */}
                {onboardingRequestData.institutionInfo.additionalInformations?.ipaCode && (
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3} display="flex" alignItems="center">
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.ipaCode'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.additionalInformations?.ipaCode}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {/* agentOfPublicService */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3} display="flex" alignItems="center">
                    <Tooltip
                      title={t(
                        'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.agentOfPublicService'
                      )}
                      placement="top"
                      arrow={true}
                    >
                      <Typography
                        sx={{
                          fontSize: 'fontSize',
                          display: 'inline-block',
                          maxWidth: '22ch',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.agentOfPublicService'
                        )}
                      </Typography>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {boolean2response(
                        onboardingRequestData?.institutionInfo.additionalInformations
                          ?.agentOfPublicService
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* agentOfPublicServiceNote */}
                {onboardingRequestData.institutionInfo.additionalInformations
                  ?.agentOfPublicServiceNote && (
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3} display="flex" alignItems="center">
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.agentOfPublicServiceNote'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {
                          onboardingRequestData?.institutionInfo.additionalInformations
                            ?.agentOfPublicServiceNote
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {/* other */}
                <Grid container item alignItems={'center'}>
                  <Grid item xs={3} display="flex" alignItems="center">
                    <Typography sx={{ fontSize: 'fontSize' }}>
                      {t(
                        'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.other'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={9} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                      {boolean2response(
                        !!onboardingRequestData?.institutionInfo.additionalInformations?.otherNote
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* otherNote */}
                {onboardingRequestData.institutionInfo.additionalInformations?.otherNote && (
                  <Grid container item alignItems={'center'}>
                    <Grid item xs={3} display="flex" alignItems="center">
                      <Typography sx={{ fontSize: 'fontSize' }}>
                        {t(
                          'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.otherNote'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={9} display="flex" alignItems={'center'}>
                      <Typography sx={{ fontSize: 'fontSize', fontWeight: 'fontWeightMedium' }}>
                        {onboardingRequestData?.institutionInfo.additionalInformations?.otherNote}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Collapse>
          </Paper>
        )}

      {!isTechPartner && onboardingRequestData?.manager && (
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
          <Grid
            item
            xs={12}
            ml={4}
            my={3}
            mr={2}
            display="flex"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {t('onboardingRequestPage.summaryStepSection.managerInfoSummarySection.title')}
            </Typography>
            <IconButton
              onClick={(e) => handleExpandClick(e.currentTarget.value)}
              sx={{
                '&:hover': {
                  background: 'none',
                },
              }}
              value={'3'}
              data-testid={'arrow-icon-3'}
            >
              {expanded['3'] ? (
                <KeyboardArrowUpIcon color="primary" />
              ) : (
                <KeyboardArrowDownIcon color="primary" />
              )}
            </IconButton>
          </Grid>
          <Collapse in={expanded['3']} timeout="auto" unmountOnExit>
            <Divider sx={{ mx: 4 }} />
            <Grid container spacing={2} mt={2} mb={4} mx={2}>
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
                    {onboardingRequestData.manager.name}
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
                    {onboardingRequestData.manager.surname}
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
                    {onboardingRequestData.manager.fiscalCode}
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
                    {onboardingRequestData.manager.email.toLocaleLowerCase()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
        </Paper>
      )}

      {onboardingRequestData?.admins && onboardingRequestData?.admins?.length > 0 && (
        <Paper elevation={8} sx={{ borderRadius: theme.spacing(2) }}>
          <Grid
            item
            xs={12}
            ml={4}
            my={3}
            mr={2}
            display="flex"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {t('onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.title')}
            </Typography>
            <IconButton
              onClick={(e) => handleExpandClick(e.currentTarget.value)}
              sx={{
                '&:hover': {
                  background: 'none',
                },
              }}
              value={'4'}
              data-testid={'arrow-icon-4'}
            >
              {expanded['4'] ? (
                <KeyboardArrowUpIcon color="primary" />
              ) : (
                <KeyboardArrowDownIcon color="primary" />
              )}
            </IconButton>
          </Grid>
          <Collapse in={expanded['4']} timeout="auto" unmountOnExit>
            <Divider sx={{ mx: 4 }} />
            {onboardingRequestData?.admins.map((admin, index) => (
              <Grid container spacing={2} key={index} m={2} mb={4}>
                {onboardingRequestData?.admins &&
                  onboardingRequestData?.admins.length > 1 &&
                  index + 1 !== 1 && (
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
          </Collapse>
        </Paper>
      )}
    </Stack>
  );
}
