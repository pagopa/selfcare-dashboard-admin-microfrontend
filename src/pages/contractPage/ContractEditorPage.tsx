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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RouteComponentProps } from 'react-router-dom';
import { ENV } from '../../utils/env';
import ContractEditor from './components/ContractEditor';

type Product = {
  id: string;
  title: string;
};

type LocationState = {
  products?: Array<Product>;
};

type RouteParams = {
  productId?: string;
};

type Props = RouteComponentProps<RouteParams>;

const SIDEBAR_WIDTH = 420;

export default function ContractBuildPage({ match, location, history }: Props) {
  const { t } = useTranslation();

  const isDesktop = useMediaQuery('(min-width:900px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const drawerVariant = useMemo(() => (isDesktop ? 'persistent' : 'temporary'), [isDesktop]);

  const state = location.state as LocationState | undefined;
  const products: Array<Product> = state?.products ?? [];

  const [selectedProductId, setSelectedProductId] = useState<string>(match.params.productId ?? '');

  const handleBack = () => {
    history.push(ENV.ROUTES.ADMIN_CONTRACT);
  };

  const handleSave = () => {
    console.log('todo');
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
            title={t('contractEditor.title')}
            subTitle={t('contractEditor.subtitle')}
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
              alignItems: 'center',
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
            <ContractEditor />
          </Paper>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" size="small" onClick={handleBack}>
              Indietro
            </Button>

            <Button variant="contained" size="small" onClick={handleSave}>
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
          <TextField label="Nome documento" fullWidth />
          <TextField label="Versione" fullWidth />

          <TextField
            select
            label="Tipo prodotto"
            value={safeSelectedProductId}
            fullWidth
            disabled={products.length === 0}
            onChange={(e) => setSelectedProductId(e.target.value)}
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
