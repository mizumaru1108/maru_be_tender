import React from 'react';
import { Grid, Typography, Card, Box, Button, Stack } from '@mui/material';
import useLocales from 'hooks/useLocales';
import ContentTrackCard from './ContentTrackCard';
import ModalDialog from 'components/modal-dialog';
import AddNewTrack from './AddNewTrack';
import { useNavigate } from 'react-router';
import Iconify from 'components/Iconify';

const ReviewOperationTrack = () => {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const [open, setOpen] = React.useState<boolean>(false);

  const TRACK_ITEMS = [
    { id: 1, employee: 'Partner', action: 'Enter' },
    { id: 2, employee: 'Screening', action: 'Referral' },
    { id: 3, employee: 'Admin', action: 'study' },
    { id: 4, employee: 'Manager Director', action: 'lnitial Approval' },
    { id: 5, employee: 'Chief Excecutive Officer', action: 'Admin' },
    { id: 6, employee: 'Admin', action: 'Payment Adjustment' },
    { id: 7, employee: 'Manager Director', action: 'Final Approval' },
    { id: 8, employee: 'Financial Management', action: 'Approval of the exchange permission' },
  ];

  // const handleSubmit = () => {
  //   navigate('/admin/dashboard/transaction-progression/add')
  //   console.log()
  // };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  return (
    <Grid>
      <Grid
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 6,
          mb: 3,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Button
            color="inherit"
            variant="contained"
            onClick={() => navigate('/admin/dashboard/transaction-progression')}
            sx={{ padding: 2, mr: 3 }}
          >
            <Iconify
              icon={
                currentLang.value === 'en'
                  ? 'eva:arrow-ios-back-outline'
                  : 'eva:arrow-ios-forward-outline'
              }
              width={35}
              height={25}
            />
          </Button>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            Track Name
          </Typography>
        </Stack>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#0E847829',
            py: 1,
            px: 4,
          }}
        >
          <Typography sx={{ color: '#0E8478', fontWeight: 700 }}>Project State</Typography>
        </Box>
      </Grid>
      <Grid>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Cairo', mt: 5 }}>
          The order of operations in the track
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        {TRACK_ITEMS.map((item, index) => (
          <Grid item md={3} sm={4} xs={12} key={index}>
            <Card sx={{ p: 3, background: '#fff' }}>
              <Typography sx={{ fontSize: '12px', mb: 1 }}>
                {index < 9 ? `0${index + 1}` : index + 1}
              </Typography>
              <Typography sx={{ fontWeight: 'Bold', fontSize: '14px' }}>{item.employee}</Typography>
              <Typography sx={{ fontSize: '12px' }}>{item.action}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ReviewOperationTrack;
