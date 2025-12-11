import { Paper } from '@mui/material';
import { useMemo } from 'react';
import { getContractTemplate } from '../utils/contractTemplate';

interface ContractPreviewProps {
  content: string;
  logoUrl?: string;
}

const ContractPreview = ({ content, logoUrl }: ContractPreviewProps): JSX.Element => {
  const htmlContent = useMemo(() => {
    return getContractTemplate(content, logoUrl);
  }, [content, logoUrl]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        border: '1px solid #E3E3E3',
        backgroundColor: '#fff',
        maxHeight: '800px',
        overflow: 'hidden',
      }}
    >
      <iframe
        srcDoc={htmlContent}
        style={{
          width: '100%',
          height: '800px',
          border: 'none',
        }}
        title="Contract Preview"
      />
    </Paper>
  );
};

export default ContractPreview;
