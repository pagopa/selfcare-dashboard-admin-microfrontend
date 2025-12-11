import { Box, Typography, Stack } from '@mui/material';

const ContractFooter = (): JSX.Element => (
  <Box
    sx={{
      mt: 4,
      pt: 3,
      borderTop: '2px solid #333',
      textAlign: 'center',
    }}
  >
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        PagoPA S.p.A.
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Firmato digitalmente in conformità alle normative vigenti
      </Typography>
      <Typography variant="caption" color="textSecondary">
        © {new Date().getFullYear()} - Tutti i diritti riservati
      </Typography>
    </Stack>
  </Box>
);

export default ContractFooter;
