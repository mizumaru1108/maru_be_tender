import { Box, Button, Grid, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import React, { useState } from 'react';
import ActionPopup from './follow-ups-popups/ActionPopup';
import FilePopup from './follow-ups-popups/FilePopup';

type Props = {
  mutate: () => void;
};
function FollowUpsAction({ mutate }: Props) {
  const theme = useTheme();
  const [actoinOpen, setActionOpen] = useState(false);
  const [fileOpen, setFileOpen] = useState(false);
  const handleActionClose = () => {
    setActionOpen(false);
  };
  const handleActionOpen = () => {
    setActionOpen(true);
  };
  const handleFileClose = () => {
    setFileOpen(false);
  };
  const handleFileOpen = () => {
    setFileOpen(true);
  };
  return (
    <Grid container>
      <ActionPopup open={actoinOpen} handleClose={handleActionClose} mutate={mutate} />
      <FilePopup open={fileOpen} handleClose={handleFileClose} mutate={mutate} />
      <Grid item md={4} xs={12}>
        <Box>{''}</Box>
      </Grid>
      <Grid item md={4}>
        <Box
          sx={{
            px: '40px',
            py: '15px',
            backgroundColor: 'white',
            width: '100%',
            border: `1px solid ${theme.palette.grey[400]}`,
            display: 'flex',
            direction: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={handleActionOpen}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              ':hover': { backgroundColor: 'gray', color: '#fff' },
            }}
            startIcon={<Iconify icon="eva:edit-2-outline" />}
          >
            إضافة تعليق
          </Button>
          <Button
            onClick={handleFileOpen}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              ':hover': { backgroundColor: 'gray', color: '#fff' },
              border: '1.5px dashed',
              borderColor: 'gray',
            }}
            startIcon={
              <>
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 12.0002V21.0002M12.5 12.0002L9.99996 14.0002M12.5 12.0002L15 14.0002M5.53396 9.11719C4.58817 9.35518 3.76184 9.93035 3.21021 10.7346C2.65859 11.5389 2.41964 12.5169 2.53827 13.485C2.65689 14.453 3.12492 15.3444 3.85443 15.9917C4.58393 16.639 5.52469 16.9976 6.49996 17.0002H7.49996"
                    stroke="#1E1E1E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.3299 7.13772C15.9881 5.78429 15.1445 4.61146 13.97 3.85698C12.7956 3.10249 11.3782 2.82281 10.0052 3.07462C8.63215 3.32643 7.40625 4.0909 6.57598 5.21306C5.7457 6.33521 5.37318 7.73109 5.53392 9.11772C5.53392 9.11772 5.68692 9.99972 5.99992 10.4997"
                    stroke="#1E1E1E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.5 17C18.206 16.9995 18.904 16.8495 19.5479 16.5599C20.1917 16.2702 20.767 15.8475 21.2357 15.3195C21.7045 14.7915 22.0561 14.1702 22.2674 13.4965C22.4787 12.8229 22.545 12.1121 22.4618 11.4109C22.3786 10.7098 22.1479 10.0343 21.7848 9.42874C21.4217 8.82321 20.9345 8.30145 20.3552 7.89778C19.776 7.49412 19.1178 7.21772 18.424 7.08676C17.7302 6.9558 17.0166 6.97327 16.33 7.138L15 7.5"
                    stroke="#1E1E1E"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </>
            }
          >
            رفع ملف جديد
          </Button>
        </Box>
      </Grid>
      <Grid item md={4}>
        <Box>{''}</Box>
      </Grid>
    </Grid>
  );
}

export default FollowUpsAction;
