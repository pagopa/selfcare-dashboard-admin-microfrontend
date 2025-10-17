import { styled } from '@mui/material';

export const commonStyles = {
  backgroundColor: 'background.paper',
  p: 3,
  borderRadius: '4px',
  marginBottom: 5,
};

export const CustomListbox = styled('ul')({
  '&::-webkit-scrollbar': {
    width: 4,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
    borderRadius: '16px',
  },
  overflowY: 'auto',
  overflowX: 'hidden',
});
