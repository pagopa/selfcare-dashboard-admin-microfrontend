import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { productId2ProductTitle } from '@pagopa/selfcare-common-frontend/lib/utils/productId2ProductTitle';
import { ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableDocumentsResource } from '../../../api/generated/onboarding/AvailableDocumentsResource';
import { OnboardingRequestResource } from '../../../model/OnboardingRequestResource';
import { buildUrlLog } from '../../../utils/helper';
import { STATUS_CHIP_CONFIG } from '../../../utils/statusChipConfig';

type Props = {
  onboardingRequestData: OnboardingRequestResource | undefined;
  availableDocuments?: AvailableDocumentsResource;
  isPSP: boolean;
  fromISO2ITA: (date?: string) => string;
  onDownloadDocument: (attachmentName: string, documentType: string) => void;
};

const DetailField = ({
  label,
  value,
  avatar,
}: {
  label: string;
  value?: ReactNode;
  avatar?: ReactNode;
}) => (
  <Grid item xs={12} className="detail-field" sx={{ py: 1.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {avatar}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }} variant="caption">
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 'fontWeightMedium',
            mt: 0.5,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  </Grid>
);

const SectionSubHeading = ({ label }: { label: string }) => (
  <Grid item xs={12} sx={{ mt: 3 }}>
    <Typography
      sx={{
        fontSize: '14px',
        fontWeight: 'fontWeightBold',
        color: '#555C70',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {label}
    </Typography>
  </Grid>
);

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
export default function DashboardRequestFields({
  onboardingRequestData,
  availableDocuments,
  isPSP,
  fromISO2ITA,
  onDownloadDocument,
}: Props) {
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
      institutionType: t(`common.institutionType.descriptions.${institutionType.toLowerCase()}`),
    }).institutionType;

  const boolean2response = (value?: boolean) =>
    t(
      value
        ? 'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.possibleChoice.yes'
        : 'onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.possibleChoice.no'
    );

  const CollapsibleSection = ({
    index,
    icon,
    title,
    children,
  }: {
    index: string;
    icon?: ReactNode;
    title: string;
    children: ReactNode;
  }) => (
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
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton
          onClick={() => handleExpandClick(index)}
          sx={{
            '&:hover': {
              background: 'none',
            },
          }}
          value={index}
          data-testid={`arrow-icon-${index}`}
        >
          {expanded[index] ? (
            <KeyboardArrowUpIcon color="primary" />
          ) : (
            <KeyboardArrowDownIcon color="primary" />
          )}
        </IconButton>
      </Grid>
      <Collapse in={expanded[index]} timeout="auto" unmountOnExit>
        <Grid
          container
          mt={1}
          mb={4}
          sx={{
            px: 4,
            '& .detail-field + .detail-field': {
              borderTop: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {children}
        </Grid>
      </Collapse>
    </Paper>
  );

  const billingLabel = (field: string) =>
    t(
      `onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.billingDataInfoSummary.${field}`
    );
  const additionalLabel = (field: string) =>
    t(
      `onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.additionalInfoSummary.${field}`
    );

  const attachments = availableDocuments?.attachments ?? onboardingRequestData?.attachments ?? [];
  const signedContractFilename = availableDocuments?.contractFilename;

  const statusConfig = onboardingRequestData?.status
    ? STATUS_CHIP_CONFIG[onboardingRequestData.status]
    : undefined;

  return (
    <Stack spacing={4} mt={4} mb={5} sx={{ width: '100%' }}>
      {/* header card: product + status, institution type, request date */}
      <Paper elevation={4} sx={{ borderRadius: theme.spacing(1) }}>
        <Grid
          container
          xs={12}
          sx={{ px: 4, py: 3 }}
          display="flex"
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Grid item xs={1}>
            <Avatar variant="rounded" sx={{ backgroundColor: '#F5F5F5', width: 48, height: 48 }}>
              <AccountBalanceOutlinedIcon color="primary" />
            </Avatar>
          </Grid>
          <Grid item xs={4}>
            {onboardingRequestData?.productId && (
              <Typography sx={{ fontSize: '18px', fontWeight: 'fontWeightBold' }}>
                {productId2ProductTitle(onboardingRequestData.productId)}
              </Typography>
            )}
            {statusConfig && (
              <Box mt={1}>
                <Chip label={statusConfig.label} color={statusConfig.color} size="small" />
              </Box>
            )}
          </Grid>

          <Grid item xs={4}>
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              {t('onboardingRequestPage.headerInfo.institutionType')}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 'fontWeightMedium', mt: 0.5 }}>
              {getInstitutionTypeDescription(
                onboardingRequestData?.institutionInfo.institutionType ?? ''
              )}
            </Typography>
          </Grid>

          <Grid item xs={3}>
            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
              {t('onboardingRequestPage.headerInfo.requestDate')}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 'fontWeightMedium', mt: 0.5 }}>
              {onboardingRequestData?.updatedAt ? fromISO2ITA(onboardingRequestData.updatedAt) : ''}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Dati dell'ente */}
      <CollapsibleSection
        index="1"
        icon={<AccountBalanceOutlinedIcon color="disabled" />}
        title={t('onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.title')}
      >
        <SectionSubHeading
          label={t(
            'onboardingRequestPage.summaryStepSection.billingDataInfoSummarySection.descriptionSubtitle'
          )}
        />
        <DetailField
          label={billingLabel('businessName')}
          value={onboardingRequestData?.institutionInfo.name}
          avatar={
            onboardingRequestData?.institutionInfo.name ? (
              <Avatar
                variant="rounded"
                src={
                  onboardingRequestData?.institutionInfo.id
                    ? buildUrlLog(onboardingRequestData.institutionInfo.id)
                    : undefined
                }
                sx={{ backgroundColor: '#F5F5F5', width: 40, height: 40 }}
              >
                <AccountBalanceOutlinedIcon color="primary" />
              </Avatar>
            ) : undefined
          }
        />
        <DetailField
          label={billingLabel('registeredOffice')}
          value={onboardingRequestData?.institutionInfo.address}
        />
        <DetailField
          label={billingLabel('zipCode')}
          value={onboardingRequestData?.institutionInfo.zipCode}
        />
        <DetailField
          label={billingLabel('mailPEC')}
          value={onboardingRequestData?.institutionInfo.mailAddress.toLocaleLowerCase()}
        />
        <DetailField
          label={billingLabel('taxCode')}
          value={onboardingRequestData?.institutionInfo.fiscalCode}
        />
        {onboardingRequestData?.institutionInfo?.vatNumber && (
          <DetailField
            label={billingLabel('vatNumber')}
            value={onboardingRequestData?.institutionInfo?.vatNumber}
          />
        )}

        {isPSP && (
          <>
            <DetailField
              label={billingLabel('isGroupPIVA.title')}
              value={
                onboardingRequestData?.institutionInfo.pspData?.vatNumberGroup
                  ? billingLabel('isGroupPIVA.yes')
                  : billingLabel('isGroupPIVA.no')
              }
            />
            <DetailField
              label={billingLabel('commercialRegisterNumber')}
              value={onboardingRequestData?.institutionInfo.pspData?.businessRegisterNumber}
            />
            <DetailField
              label={billingLabel('registrationInRegister')}
              value={onboardingRequestData?.institutionInfo.pspData?.legalRegisterName}
            />
            <DetailField
              label={billingLabel('registerNumber')}
              value={onboardingRequestData?.institutionInfo.pspData?.legalRegisterNumber}
            />
            <DetailField
              label={billingLabel('abiCode')}
              value={onboardingRequestData?.institutionInfo.pspData?.abiCode}
            />
          </>
        )}

        {!isTechPartner && onboardingRequestData?.institutionInfo.recipientCode && (
          <DetailField
            label={billingLabel('recipientCode')}
            value={onboardingRequestData?.institutionInfo.recipientCode}
          />
        )}

        {onboardingRequestData?.institutionInfo.dpoData && (
          <>
            <SectionSubHeading label={billingLabel('protectionOfficerDetailData.title')} />
            <DetailField
              label={billingLabel('protectionOfficerDetailData.address')}
              value={onboardingRequestData?.institutionInfo.dpoData?.address}
            />
            <DetailField
              label={billingLabel('protectionOfficerDetailData.mailPEC')}
              value={onboardingRequestData?.institutionInfo.dpoData?.pec.toLocaleLowerCase()}
            />
            <DetailField
              label={billingLabel('protectionOfficerDetailData.mail')}
              value={onboardingRequestData?.institutionInfo.dpoData?.email.toLocaleLowerCase()}
            />
          </>
        )}
      </CollapsibleSection>

      {/* Informazioni aggiuntive (GSP / prod-pagopa) */}
      {onboardingRequestData?.institutionInfo.institutionType === 'GSP' &&
        onboardingRequestData.productId === 'prod-pagopa' && (
          <CollapsibleSection
            index="2"
            title={t('onboardingRequestPage.summaryStepSection.additionalInfoSummarySection.title')}
          >
            <DetailField
              label={additionalLabel('establishedByRegulatoryProvision')}
              value={boolean2response(
                onboardingRequestData?.institutionInfo.additionalInformations
                  ?.establishedByRegulatoryProvision
              )}
            />
            {onboardingRequestData.institutionInfo.additionalInformations
              ?.establishedByRegulatoryProvisionNote && (
              <DetailField
                label={additionalLabel('establishedByRegulatoryProvisionNote')}
                value={
                  onboardingRequestData?.institutionInfo.additionalInformations
                    ?.establishedByRegulatoryProvisionNote
                }
              />
            )}
            <DetailField
              label={additionalLabel('belongRegulatedMarket')}
              value={boolean2response(
                onboardingRequestData?.institutionInfo.additionalInformations?.belongRegulatedMarket
              )}
            />
            {onboardingRequestData.institutionInfo.additionalInformations?.regulatedMarketNote && (
              <DetailField
                label={additionalLabel('belongRegulatedMarketNote')}
                value={
                  onboardingRequestData?.institutionInfo.additionalInformations?.regulatedMarketNote
                }
              />
            )}
            <DetailField
              label={additionalLabel('ipa')}
              value={boolean2response(
                onboardingRequestData?.institutionInfo.additionalInformations?.ipa
              )}
            />
            {onboardingRequestData.institutionInfo.additionalInformations?.ipaCode && (
              <DetailField
                label={additionalLabel('ipaCode')}
                value={onboardingRequestData?.institutionInfo.additionalInformations?.ipaCode}
              />
            )}
            <DetailField
              label={additionalLabel('agentOfPublicService')}
              value={boolean2response(
                onboardingRequestData?.institutionInfo.additionalInformations?.agentOfPublicService
              )}
            />
            {onboardingRequestData.institutionInfo.additionalInformations
              ?.agentOfPublicServiceNote && (
              <DetailField
                label={additionalLabel('agentOfPublicServiceNote')}
                value={
                  onboardingRequestData?.institutionInfo.additionalInformations
                    ?.agentOfPublicServiceNote
                }
              />
            )}
            <DetailField
              label={additionalLabel('other')}
              value={boolean2response(
                !!onboardingRequestData?.institutionInfo.additionalInformations?.otherNote
              )}
            />
            {onboardingRequestData.institutionInfo.additionalInformations?.otherNote && (
              <DetailField
                label={additionalLabel('otherNote')}
                value={onboardingRequestData?.institutionInfo.additionalInformations?.otherNote}
              />
            )}
          </CollapsibleSection>
        )}

      {/* Dati del Legale Rappresentante */}
      {!isTechPartner && onboardingRequestData?.manager && (
        <CollapsibleSection
          index="3"
          icon={<PersonOutlineIcon color="disabled" />}
          title={t('onboardingRequestPage.summaryStepSection.managerInfoSummarySection.title')}
        >
          <DetailField
            label={t(
              'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.name'
            )}
            value={onboardingRequestData.manager.name}
          />
          <DetailField
            label={t(
              'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.surname'
            )}
            value={onboardingRequestData.manager.surname}
          />
          <DetailField
            label={t(
              'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.taxCode'
            )}
            value={onboardingRequestData.manager.fiscalCode}
          />
          <DetailField
            label={t(
              'onboardingRequestPage.summaryStepSection.managerInfoSummarySection.managerInfoSummary.mailPEC'
            )}
            value={onboardingRequestData.manager.email.toLocaleLowerCase()}
          />
        </CollapsibleSection>
      )}

      {/* Dati dell'Amministratore */}
      {onboardingRequestData?.admins && onboardingRequestData?.admins?.length > 0 && (
        <CollapsibleSection
          index="4"
          icon={<PersonOutlineIcon color="disabled" />}
          title={t('onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.title')}
        >
          {onboardingRequestData?.admins.map((admin, index) => (
            <Grid container item xs={12} key={index}>
              {onboardingRequestData?.admins &&
                onboardingRequestData?.admins.length > 1 &&
                index + 1 !== 1 && (
                  <SectionSubHeading
                    label={`${t(
                      'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.moreOfOneAdmin'
                    )}${index + 1}`}
                  />
                )}
              <DetailField
                label={t(
                  'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.name'
                )}
                value={admin.name}
              />
              <DetailField
                label={t(
                  'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.surname'
                )}
                value={admin.surname}
              />
              <DetailField
                label={t(
                  'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.taxCode'
                )}
                value={admin.fiscalCode}
              />
              <DetailField
                label={t(
                  'onboardingRequestPage.summaryStepSection.delegatesInfoSummarySection.delegatesInfoSummary.mailPEC'
                )}
                value={admin.email.toLocaleLowerCase()}
              />
            </Grid>
          ))}
        </CollapsibleSection>
      )}

      {/* Documenti */}
      {(attachments.length > 0 || signedContractFilename) && (
        <CollapsibleSection
          index="5"
          icon={<DescriptionOutlinedIcon color="disabled" />}
          title={t('onboardingRequestPage.documentsSection.title')}
        >
          {attachments.map((attachmentName, index) => (
            <Grid item xs={12} key={index} className="detail-field" sx={{ py: 1.5 }}>
              <Link
                component="button"
                onClick={() => onDownloadDocument(attachmentName, 'ATTACHMENT')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textDecoration: 'none',
                }}
              >
                <Typography sx={{ fontSize: '16px', color: 'primary.main', textAlign: 'left' }}>
                  {attachmentName}
                </Typography>
                <LaunchOutlinedIcon color="primary" fontSize="small" />
              </Link>
            </Grid>
          ))}
          {signedContractFilename && (
            <Grid item xs={12} className="detail-field" sx={{ py: 1.5 }}>
              <Link
                component="button"
                onClick={() => onDownloadDocument(signedContractFilename, 'CONTRACT_SIGNED')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textDecoration: 'none',
                }}
              >
                <Typography sx={{ fontSize: '16px', color: 'primary.main', textAlign: 'left' }}>
                  {signedContractFilename}
                </Typography>
                <LaunchOutlinedIcon color="primary" fontSize="small" />
              </Link>
            </Grid>
          )}
        </CollapsibleSection>
      )}
    </Stack>
  );
}
