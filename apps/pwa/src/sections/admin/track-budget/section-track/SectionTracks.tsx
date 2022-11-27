import { Box, Button, Grid, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import axios from 'axios';
import ModalDialog from 'components/modal-dialog';
import { TMRA_RAISE_URL } from 'config';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from 'urql';
import AddNewSection from './AddNewSection';
import Section from './Section';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axiosInstance from 'utils/axios';

export interface SectionInterface {
  id?: string;
  section_id?: string;
  track_id?: string;
  name?: string;
  budget?: number;
  children: Array<SectionInterface>;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SectionTracks() {
  const [sections, setSections] = React.useState<Array<SectionInterface>>([]);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState<boolean>(false);
  const [openSnackBar, setOpenSnackBar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [isDeleting, setIsDeleting] = React.useState<{ isLoading: boolean; id: string }>({
    isLoading: false,
    id: '',
  });
  const { id: track_id } = useParams();
  const [result, mutate] = useQuery({
    query: `query gettingTrackById($track_id: String = "") {
    track: track_by_pk(id: $track_id) {
      name
      id
    }
  }
  `,
    variables: { track_id },
  });
  const { data, fetching, error } = result;
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar({ open: false, message: '', severity: 'success' });
  };
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting({ isLoading: true, id });
      await axios.delete(`${TMRA_RAISE_URL}/track/track-section/${id}`);
      setIsDeleting({ isLoading: false, id: 'success' });
      setOpenSnackBar({ open: true, message: 'لقد تم حذف القسم بنجاح', severity: 'success' });
      mutate();
    } catch (error) {
      setIsDeleting({ isLoading: false, id: 'success' });
      setOpenSnackBar({ open: true, message: error.message, severity: 'error' });
    }
  };
  React.useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axiosInstance.get(`/track/track-section?track_id=${track_id}`);
        // const res = await axios.get(`${TMRA_RAISE_URL}/track/track-section?track_id=${track_id}`);
        const data = res.data.data as Array<SectionInterface>;
        setSections(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSections();
  }, [track_id, data]);

  if (fetching) return <>... Loading</>;
  if (error) return <>... Opps, something went wrong</>;
  return (
    <Grid container spacing={3}>
      <Snackbar
        open={openSnackBar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={openSnackBar.severity}
          sx={{ width: '100%' }}
        >
          {openSnackBar.message}
        </Alert>
      </Snackbar>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        title="اضافة قسم جديد"
        content={
          <AddNewSection
            sections={sections}
            track={data.track}
            onClose={handleClose}
            mutate={mutate}
          />
        }
        onClose={handleClose}
      />
      <Grid item md={12} xs={12}>
        <IconButton
          onClick={() => {
            navigate('/admin/dashboard/tracks-budget');
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fillOpacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography flex={1} variant="h4">
            {data.track.name}
          </Typography>
          <Button
            sx={{
              py: '10px',
              flex: 0.2,
              backgroundColor: '#0E8478',
              color: '#fff',
              ':hover': { backgroundColor: '#13B2A2' },
            }}
            onClick={handleOpen}
          >
            اضافة قسم
          </Button>
        </Stack>
      </Grid>
      {sections.map((item, index) => (
        <Grid key={index} item md={12} xs={12}>
          <Box sx={{ backgroundColor: '#fff', padding: '20px', border: '1.5px #fff solid' }}>
            <Section item={item} isDeleting={isDeleting} handleDelete={handleDelete} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default SectionTracks;
