import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: '10px',
        },
      },
    },
  };
}
