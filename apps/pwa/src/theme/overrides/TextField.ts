import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.default,
          borderRadius: '10px',
        },
      },
    },
  };
}
