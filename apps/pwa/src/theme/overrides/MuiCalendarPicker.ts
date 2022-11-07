import { Theme } from '@mui/material/styles';

//----------------------------------------------------------------------

export default function MuiCalendarPicker(theme: Theme) {
  return {
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          width: '100%',
          maxHeight: 'unset !important',
          height: '100%',
          '& .MuiPickersArrowSwitcher-root .MuiButtonBase-root': {
            color: '#000 !important',
          },
          '& .rtl-3g297t .MuiButtonBase-root': { color: '#000 !important' },
          '& .Mui-selected, & .Mui-selected:focus, & .Mui-selected:hover': {
            color: '#000 !important',
            backgroundColor: `#0E8478 !important`,
            marginBottom: '4px',
          },
        },
        viewTransitionContainer: {
          '& > div > div': {
            justifyContent: 'space-between !important',
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
            marginBottom: '4px',
            color: `#000 !important`,
          },
          '& div[role=row]': {
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
            justifyContent: 'space-between !important',
            marginBottom: '4px',
            color: `#000 !important`,
          },
        },
      },
    },
  };
}
