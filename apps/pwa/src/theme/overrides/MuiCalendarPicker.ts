import { Theme } from '@mui/material/styles';

//----------------------------------------------------------------------

export default function MuiCalendarPicker(theme: Theme) {
  return {
    MuiCalendarPicker: {
      styleOverrides: {
        root: {
          width: '95%',
          // height: ,
          '& .css-1cnkspq>*': {
            position: 'relative',
          },
          overflow: 'auto',
          maxHeight: 'unset !important',
          '& .css-1lx7ma4-MuiButtonBase-root-MuiPickersDay-root:not(.Mui-selected)': {
            border: '1.5px solid #0E8478',
            // height: '25px',
            // width: '25px',
            // backgroundColor: '#bbb',
            // borderRadius: '50%',
            // display: 'inline-block',
          },
          // backgroundColor: 'red',
          // height: '100%',
          '& .MuiPickersArrowSwitcher-root .MuiButtonBase-root': {
            color: '#000 !important',
          },
          '& .MuiButtonBase-root': {
            // backgroundColor: '#EEF0F2 !important',
            // width: '100%',
            width: '56px',
            height: '56px',
            // fontSize:'14px',
            '&:hover': {
              backgroundColor: `#0E8478 !important`,
              color: '#fff',
            },
          },
          '& .MuiPickersDay-dayOutsideMonth': {
            backgroundColor: '#fff !important',
          },
          '& .rtl-3g297t .MuiButtonBase-root': {
            color: '#000 !important',
          },
          '& .Mui-selected, & .Mui-selected:focus, & .Mui-selected:hover': {
            color: '#fff !important',
            backgroundColor: `#0E8478 !important`,
            // marginBottom: '4px',
          },
          // '& .css-uer8rp-MuiButtonBase-root-MuiPickersDay-root': {
          //   backgroundColor: `#fff`,
          // },
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
            marginBottom: '16px',
            color: `#000 !important`,
          },
        },
      },
    },
  };
}
