import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Typography(theme: Theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          wordWrap: 'break-word',
        },
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}
