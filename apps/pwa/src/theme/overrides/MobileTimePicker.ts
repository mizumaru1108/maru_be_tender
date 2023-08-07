import { Theme } from '@mui/material/styles';

//----------------------------------------------------------------------

export default function MobileTimePicker(theme: Theme) {
  return {
    MobileTimePicker: {
      styleOverrides: {
        root: {
          // width: '95%',
          // '& .css-1cnkspq>*': {
          //   position: 'relative',
          // },
          backgroundColor: '#fff !important',
        },
      },
    },
  };
}
