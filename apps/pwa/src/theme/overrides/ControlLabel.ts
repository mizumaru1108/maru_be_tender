import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function ControlLabel(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          ...theme.typography.body2,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: '0px 0px 0px 0px !important',
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.disabled,
        },
      },
    },
  };
}
