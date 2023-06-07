import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { getTracks } from 'redux/slices/track';
import { dispatch, useSelector } from 'redux/store';
import AddNewTrack from './AddNewTrack';
import ContentTrackCard from './ContentTrackCard';

const TransactionProgressionPage = () => {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [open, setOpen] = React.useState<boolean>(false);
  const { tracks } = useSelector((state) => state.tracks);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (data: any) => {};

  React.useEffect(() => {
    dispatch(getTracks(activeRole!));
  }, [activeRole]);

  React.useEffect(() => {}, [tracks]);

  return (
    <Grid>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        // title="اضافة ميزانية جديدة"
        content={
          <AddNewTrack
            // loading={loading}
            onClose={handleOnClose}
            isEdit={true}
            // onSubmit={handleSubmit}
            // action={{
            //   actionLabel: 'إرجاع',
            //   backgroundColor: '#0169DE',
            //   hoverColor: '#1482FE',
            // }}
          />
        }
        onClose={handleOnClose}
      />
      <Grid sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          {translate('pages.admin.transaction_progress')}
        </Typography>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#0E847829',
            py: 1,
            px: 4,
          }}
        >
          <Typography sx={{ color: '#0E8478', fontWeight: 700 }}>
            {translate('pages.admin.project_state')}
          </Typography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={4} sm={6} xs={12}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              py: 8,
              px: 5,
              background: '#F5F6FA',
              border: '1px dashed #0E8478',
              borderRadius: '5px',
              // borderSpacing: '10px',
            }}
          >
            <Typography>{translate('pages.admin.create_a_new_transaction_flow_track')}</Typography>
            <Button
              size="large"
              sx={{
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                },
                bgcolor: 'transparent',
                mt: 0.5,
              }}
              onClick={handleOpen}
            >
              <img src={`/icons/uploading-field/second-field-icon.svg`} alt="" />
            </Button>
          </Stack>
        </Grid>
        {tracks.map((track, index) => (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <Card sx={{ py: 3, background: '#fff' }}>
              <ContentTrackCard
                id={track.id}
                name={track.name}
                withConsultation={track.with_consultation}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default TransactionProgressionPage;
