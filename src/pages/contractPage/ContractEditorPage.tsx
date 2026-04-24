import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend/lib';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type RouteComponentProps } from 'react-router-dom';
import { uploadContractTemplate } from '../../services/contractService';
import { ENV } from '../../utils/env';
import { ContractEditor } from './components/ContractEditor';

type Product = {
  id: string;
  title: string;
};

type LocationState = {
  products?: Array<Product>;
  productId?: string;
  name?: string;
  version?: string;
  contractHtml?: string;
};

type RouteParams = {
  productId?: string;
};

type Props = RouteComponentProps<RouteParams>;

const SIDEBAR_WIDTH = 420;

export default function ContractEditorPage({ location, history }: Props) {
  const { t } = useTranslation();

  const isDesktop = useMediaQuery('(min-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const drawerVariant = useMemo(() => (isDesktop ? 'persistent' : 'temporary'), [isDesktop]);

  const state = location.state as LocationState | undefined;
  const products: Array<Product> = state?.products ?? [];

  const [selectedProductId, setSelectedProductId] = useState<string>(state?.productId ?? '');
  const [selectedName, setSelectedName] = useState<string>(state?.name ?? "");
  const [selectedVersion, setSelectedVersion] = useState<string>(state?.version ?? "");
  const [contractHtml] = useState<string>(state?.contractHtml ?? "");

  useEffect(() => {
    if (contractHtml) {
      const el = document.querySelector(".pell-content") as HTMLDivElement | null;
      if (el) {
        // eslint-disable-next-line functional/immutable-data
        el.innerHTML = contractHtml;
      }
    }
  }, [contractHtml]);

  const handleBack = () => {
    history.push(ENV.ROUTES.ADMIN_CONTRACT);
  };

  const handleSave = async () => {
    const el = document.querySelector('.pell-content') as HTMLDivElement | null;
    if (el && selectedProductId && selectedName && selectedVersion) {
      uploadContractTemplate(safeSelectedProductId, selectedName, selectedVersion, el.innerHTML)
        .then(() => {
          alert('Template del contratto salvato con successo');
          handleBack();
        })
        .catch((err) => {
          console.error(err);
          alert('ERRORE: impossibile salvare il template del contratto. Versione già esistente?');
        });
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow partial matches while typing
    const regex = /^(\d|\d\.|\d\.\d|\d\.\d\.|\d\.\d\.\d)?$/;

    if (regex.test(newValue)) {
      setSelectedVersion(newValue);
    }
  };

  const safeSelectedProductId = products.some((p) => p.id === selectedProductId)
    ? selectedProductId
    : '';

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container px={3} mt={3} spacing={3}>
        <Grid item xs={12}>
          <TitleBox
            variantTitle="h4"
            variantSubTitle="body1"
            title={t('contractPage.contractEditor.title')}
            subTitle={t('contractPage.contractEditor.subtitle')}
            mbTitle={2}
            mbSubTitle={3}
          />
        </Grid>

        <IconButton
          onClick={() => setSidebarOpen((v) => !v)}
          sx={(theme) => ({
            position: 'fixed',
            top: theme.spacing(10),
            right: sidebarOpen && isDesktop ? `${SIDEBAR_WIDTH + 16}px` : theme.spacing(2),
            zIndex: theme.zIndex.drawer + 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            transition: theme.transitions.create(['right'], {
              duration: theme.transitions.duration.shortest,
            }),
          })}
          aria-label={sidebarOpen ? 'Nascondi dettagli' : 'Mostra dettagli'}
        >
          {sidebarOpen ? <ChevronRightIcon /> : <TuneIcon />}
        </IconButton>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px dashed',
              borderColor: 'divider',
              minHeight: 520,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              position: 'relative',

              ...(isDesktop && sidebarOpen
                ? { width: `calc(100% - ${SIDEBAR_WIDTH}px)` }
                : { width: '100%' }),

              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.shortest,
                }),
            }}
          >
            <ContractEditor productId={safeSelectedProductId} />
          </Paper>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" size="small" onClick={handleBack}>
              Indietro
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={!selectedName || !selectedVersion || !selectedProductId}
            >
              Salva
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Drawer
        variant={drawerVariant as any}
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            p: 3,
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">Informazioni contratto</Typography>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Nome documento"
            fullWidth
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            required
          />
          <TextField
            label="Versione"
            fullWidth
            value={selectedVersion}
            onChange={handleVersionChange}
            required
            placeholder="0.0.1"
          />

          <TextField
            select
            label="Tipo prodotto"
            value={safeSelectedProductId}
            fullWidth
            disabled={products.length === 0}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <MenuItem value="" disabled>
              Seleziona prodotto
            </MenuItem>

            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.title}
              </MenuItem>
            ))}
          </TextField>

          {products.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              Nessun prodotto disponibile
            </Typography>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
