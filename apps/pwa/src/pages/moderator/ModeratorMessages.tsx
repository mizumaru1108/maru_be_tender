import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { CardTableIncomingSupportRequests, Messages } from './mock-data';
import { Stack } from '@mui/system';
import Iconify from '../../components/Iconify';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  // minHeight: '30vh',
  // maxHeight: '100%',
  // height: '80%',
  // display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  // gap: 20,
}));

const TabItemCustom = styled(Tab)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  // marginRight: '16px !important',
  // padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  transition: 'all 0.5s',
  '&.Mui-selected': {
    backgroundColor: '#0E8478',
    color: '#fff',
  },
}));

function a11yItemProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-ta anel-${index}`,
  };
}

function ModeratorMessages() {
  const [valueTabItem, setValueTabItem] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);
  const handleChangeTabsItem = (event: React.SyntheticEvent, newValue: number) => {
    setValueTabItem(newValue);
  };

  useEffect(() => {
    console.log('focusedIndex', focusedIndex);
  }, [focusedIndex]);

  return (
    <Page title="Previous Funding Requests">
      {/* <Container sx={{ m: 0, border: '1px solid red' }}> */}
      <ContentStyle>
        <Grid
          container
          columns={14}
          direction="row"
          sx={{
            height: '0vh',
          }}
        >
          {/* Grid Container Kiri */}
          <Grid item xs={8} sx={{ border: '2px solid red' }}>
            <Typography variant="h4">test</Typography>
          </Grid>

          {/* Grid Container Kanan */}
          <Grid item xs={6}>
            {/* Stack for Message Option */}
            <Stack spacing={1} sx={{ margin: 2 }}>
              {/* Box for Tabs */}
              <Box>
                {/* Tabs */}
                <Tabs
                  value={valueTabItem}
                  onChange={handleChangeTabsItem}
                  variant="fullWidth"
                  textColor="inherit"
                  TabIndicatorProps={{
                    style: { display: 'none' },
                  }}
                  aria-label="full width tabs example"
                >
                  <TabItemCustom label="External Corespondence" {...a11yItemProps(0)} />
                  <TabItemCustom label="Internal Corespondence" {...a11yItemProps(1)} />
                </Tabs>
              </Box>
              {/* Filter & Message */}
              <Grid container direction="row" columns={14}>
                <Grid item xs={4}>
                  <Button
                    sx={{
                      color: '#000',
                      backgroundColor: '#fff',
                      border: '1px solid #000',
                      width: 100,
                    }}
                    endIcon={
                      <Iconify icon={'clarity:filter-line'} color="#000" width={24} height={24} />
                    }
                  >
                    Filter
                  </Button>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h4" sx={{ textAlign: 'left' }}>
                    Message
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ height: '300px', overflowX: 'auto' }}>
                {Messages.map((item, index) => (
                  <Grid
                    container
                    key={index}
                    sx={{
                      py: 1,
                      color: '#000',
                      backgroundColor:
                        focusedIndex === index ? '#fff' : 'rgba(147, 163, 176, 0.16)',

                      // set on hover to change color, give delay 0.5s
                      '&:hover': {
                        // only if focusedIndex is not equal to index
                        ...(focusedIndex !== index && {
                          //set transition when mouse hover
                          transition: 'all 1.2s',
                          color: '#000',
                          // background color gradient darker than #fff
                          backgroundColor: '#fff',
                        }),
                      },
                    }}
                    // on hover
                    onClick={() => {
                      setFocusedIndex(index);
                    }}
                  >
                    <Grid item xs={11}>
                      <Typography>
                        {item.partnerName} - {item.projectName}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Iconify icon={'codicon:account'} color="#000" width={24} height={24} />
                    </Grid>
                    <Grid item xs={12}>
                      {item.message}
                    </Grid>
                    <Grid item xs={12}>
                      {new Date(item.footer).toLocaleString()}
                    </Grid>
                  </Grid>
                ))}
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  sx={{ backgroundColor: '#0E8478', color: '#fff', borderRadius: 4, padding: 2 }}
                  endIcon={
                    <Iconify icon={'bi:chat-square-text'} color="#fff" width={24} height={24} />
                  }
                >
                  Create a new message
                </Button>
              </Box>

              {/* <Typography display="flex" justifyContent="flex-end" padding={2}>
                asdas
              </Typography> */}
            </Stack>
          </Grid>
        </Grid>
      </ContentStyle>
      {/* </Container> */}
    </Page>
  );
}

export default ModeratorMessages;
