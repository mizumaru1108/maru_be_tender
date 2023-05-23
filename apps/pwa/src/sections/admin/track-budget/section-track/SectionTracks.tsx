// react
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import { Box, Button, Grid, Stack, Typography, styled, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import ModalDialog from 'components/modal-dialog';
import Iconify from 'components/Iconify';
import AddNewSection from './AddNewSection';
import Section from './Section';
// hooks
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';

// ------------------------------------------------------------------------------------------

export interface SectionInterface {
  id?: string;
  name?: string;
  budget?: number;
}

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// ------------------------------------------------------------------------------------------

export default function SectionTracks() {
  const navigate = useNavigate();
  const { currentLang, translate } = useLocales();
  const [open, setOpen] = useState<boolean>(false);

  //
  const { id: track_id } = useParams();
  const [result, mutate] = useQuery({
    query: `query gettingTrackById($track_id: String = "") {
    track: track_by_pk(id: $track_id) {
      name
      id
      track_sections{
        id
        name
        budget
      }
    }
  }
  `,
    variables: { track_id },
  });

  const { data, fetching, error } = result;

  //
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (fetching) return <>Loading ...</>;
  if (error) return <>Opps, something went wrong ...</>;

  // console.log({ data });

  return (
    <Container>
      <ContentStyle>
        <Grid container spacing={4}>
          <ModalDialog
            styleContent={{ padding: '1em', backgroundColor: '#fff' }}
            isOpen={open}
            maxWidth="md"
            title={translate('pages.admin.tracks_budget.heading.add_new_section')}
            content={<AddNewSection tracks={data.track} onClose={handleClose} />}
            onClose={handleClose}
          />

          <Grid item md={12} xs={12}>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ p: 1, minWidth: 25, minHeight: 25, mr: 3 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={25}
                height={25}
              />
            </Button>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography flex={1} variant="h4">
                {translate(data.track.name)}
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
                {translate('pages.admin.tracks_budget.btn.add_section')}
              </Button>
            </Stack>
          </Grid>
          {!fetching && data
            ? data.track.track_sections.map(
                (item: { id: string; budget: number; name: string }, index: number) => (
                  <Grid key={index} item md={12} xs={12}>
                    <Box
                      sx={{
                        backgroundColor: '#fff',
                        p: 2,
                        border: '1.5px #fff solid',
                        borderRadius: 1,
                      }}
                    >
                      <Section item={item} />
                    </Box>
                  </Grid>
                )
              )
            : null}
        </Grid>
      </ContentStyle>
    </Container>
  );
}
