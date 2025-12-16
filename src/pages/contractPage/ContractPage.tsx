import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend/lib';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ContractTemplateResponse } from '../../api/generated/b4f-dashboard/ContractTemplateResponse';
import { fetchContractTemplates, downloadContractTemplate } from '../../services/contractService';
import { Product } from '../../model/Product';
import { fetchProducts } from '../../services/productService';

export default function ContractPage() {
  const { t } = useTranslation();
  const addError = useErrorDispatcher();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Array<Product>>([]);
  const [productContractsMap, setProductContractsMap] = useState<
    Map<string, Array<ContractTemplateResponse>>
  >(new Map());
  const [expandedProduct, setExpandedProduct] = useState<string | false>(false);

  useEffect(() => {
    void loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);

      const contractsMap = new Map<string, Array<ContractTemplateResponse>>();
      for (const product of productsData) {
        try {
          const contracts = await fetchContractTemplates(product.title, '');
          contractsMap.set(product.id, contracts);
        } catch {
          contractsMap.set(product.id, []);
        }
      }
      setProductContractsMap(contractsMap);
    } catch (error) {
      addError({
        id: 'load-contracts-error',
        blocking: false,
        techDescription: 'Failed to load contract templates',
        toNotify: false,
        error: error as Error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (contractId: string, productId: string, fileName: string) => {
    try {
      const file = await downloadContractTemplate(contractId, productId);
      if (file.data) {
        const link = document.createElement('a');
        // eslint-disable-next-line functional/immutable-data
        link.href = `data:${file.type === 'PDF' ? 'application/pdf' : 'text/html'};base64,${file.data}`;
        // eslint-disable-next-line functional/immutable-data
        link.download = `${fileName}.${file.type === 'PDF' ? 'pdf' : 'html'}`;
        // eslint-disable-next-line functional/immutable-data
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      addError({
        id: `download-contract-${contractId}-error`,
        blocking: false,
        techDescription: `Failed to download contract ${contractId}`,
        toNotify: false,
        error: error as Error,
      });
    }
  };

  const getProductContracts = (productId: string): Array<ContractTemplateResponse> =>
    productContractsMap.get(productId) || [];

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container px={3} mt={3} sx={{ width: '100%', backgroundColor: 'transparent !important' }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          title={t('contractPage.title', 'Gestione template contratti')}
          subTitle={t(
            'contractPage.subtitle',
            'Visualizza e gestisci i template dei contratti per i diversi prodotti'
          )}
          mbTitle={2}
          mbSubTitle={5}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={2}>
          {products.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              {t('contractPage.noProducts', 'Nessun prodotto disponibile')}
            </Typography>
          ) : (
            products.map((product) => {
              const contracts = getProductContracts(product.id);
              return (
                <Accordion
                  key={product.id}
                  expanded={expandedProduct === product.id}
                  onChange={() =>
                    setExpandedProduct(expandedProduct === product.id ? false : product.id)
                  }
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {contracts.length}{' '}
                        {t('contractPage.contracts', 'contratti', {
                          count: contracts.length,
                        })}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    {contracts.length === 0 ? (
                      <Typography variant="body2" color="textSecondary">
                        {t('contractPage.noContracts', 'Nessun contratto disponibile per questo prodotto')}
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {t('contractPage.name', 'Nome')}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {t('contractPage.version', 'Versione')}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {t('contractPage.createdAt', 'Data creazione')}
                              </TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>
                                {t('contractPage.createdBy', 'Creato da')}
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {t('contractPage.actions', 'Azioni')}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {contracts.map((contract, index) => (
                              <TableRow key={contract.contractTemplateId || index}>
                                <TableCell>{contract.name}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {contract.contractTemplateVersion}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {contract.createdAt
                                    ? new Date(contract.createdAt).toLocaleDateString()
                                    : '-'}
                                </TableCell>
                                <TableCell>{contract.createdBy || '-'}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    size="small"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={() =>
                                      handleDownload(
                                        contract.contractTemplateId || '',
                                        product.id,
                                        `${contract.name}_v${contract.contractTemplateVersion}`
                                      )
                                    }
                                    disabled={!contract.contractTemplateId}
                                  >
                                    {t('contractPage.download', 'Download')}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
