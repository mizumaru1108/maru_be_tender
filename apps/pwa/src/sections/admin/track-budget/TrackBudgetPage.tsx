import { Button, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from 'urql';
import Track from './Track';
import React from 'react';
import ModalDialog from 'components/modal-dialog';
import AddNewBudget from './AddNewBudget';

function TrackBudgetPage() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [result] = useQuery({
    query: `query MyQuery {
    track {
      id
      name
      budget
    }
  }
  `,
  });
  const { data, fetching, error } = result;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleOnClose = () => {
    setOpen(false);
  };
  if (fetching) return <>... Loading</>;
  if (error) return <>Opss. somthing went wrong</>;
  return (
    <Grid container spacing={3}>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        title="اضافة ميزانية جديدة"
        content={<AddNewBudget data={data.track} />}
        onClose={handleOnClose}
      />
      <Grid item md={6} xs={6}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          ميزانية المسارات
        </Typography>
      </Grid>
      <Grid item md={6} xs={6}>
        <Stack direction="row" justifyContent={'end'}>
          <Button
            sx={{
              flex: 0.2,
              py: '10px',
              backgroundColor: '#0E8478',
              color: '#fff',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            // onClick={handleOpen}
          >
            اضافة ميزانية
          </Button>
        </Stack>
      </Grid>

      {data.track.map((item: any, index: any) => (
        <Grid item md={12} xs={12} key={index}>
          <Track key={index} name={item.name} id={item.id} budget={item.budget} />
        </Grid>
      ))}
    </Grid>
  );
}

export default TrackBudgetPage;
