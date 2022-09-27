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
          spacing={4}
          direction="row"
          sx={{
            '& .MuiGrid-root.MuiGrid-item': {
              paddingTop: '24px',
              paddingBottom: '24px',
              paddingRight: 0,
            },
          }}
        >
          {/* Grid Container Kanan */}
          <Grid item xs={6}>
            {/* Stack for Message Option */}
            <Stack display="flex" spacing={1} sx={{ margin: 2 }} gap="24px">
              {/* Tabs */}
              <Tabs
                value={valueTabItem}
                onChange={handleChangeTabsItem}
                variant="fullWidth"
                textColor="inherit"
                TabIndicatorProps={{
                  style: { display: 'none' },
                }}
                sx={{
                  backgroundColor: 'rgba(147, 163, 176, 0.16)',
                  borderRadius: '16px',
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'orange',
                  },
                  '& .MuiTab-root.Mui-selected': {
                    backgroundColor: '#0E8478',
                    color: '#fff',
                    borderRadius: 2,
                  },
                  '& .MuiButtonBase-root.MuiTab-root:not(:last-of-type)': {
                    marginRight: 0,
                  },
                }}
                aria-label="full width tabs example"
              >
                <Tab label="External Corespondence" {...a11yItemProps(0)} />
                <Tab label="Internal Corespondence" {...a11yItemProps(1)} />
              </Tabs>
              {/* Filter & Message */}
              <Stack
                direction="row"
                display="flex"
                gap="24px"
                alignItems="center"
                justifyContent="right"
                sx={{
                  marginTop: '0px !important',
                  '& .MuiStack-root.:not(style)+:not(style)': {
                    marginTop: 0,
                    paddingTop: '8px',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Cairo',
                    fontWeight: 700,
                    fontSize: '24px',
                  }}
                >
                  Message
                </Typography>
                <Stack
                  display="flex"
                  direction="row"
                  onClick={() => alert('Clicked')}
                  sx={{
                    width: '82px',
                    height: '38px',
                    borderRadius: '8px',
                    color: '#000',
                    backgroundColor: '#fff',
                    border: '1px solid #000',
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Iconify icon={'clarity:filter-line'} color="#000" width={16} height={16} />
                  <Typography
                    sx={{
                      fontFamily: 'Cairo',
                      fontWeight: 500,
                      fontSize: '12px',
                      lineHeight: '22px',
                      color: '#1E1E1E',
                      paddingLeft: '4px',
                    }}
                  >
                    Filter
                  </Typography>
                </Stack>
              </Stack>
              {/* Mapping message */}
              <Box sx={{ height: '978px', overflowX: 'hidden' }}>
                {Messages.map((item, index) => (
                  <Stack
                    direction="row"
                    key={index}
                    gap="8px"
                    sx={{
                      padding: 2,
                      color: '#000',
                      backgroundColor: focusedIndex === index ? '#fff' : undefined,

                      // set on hover to change color, give delay 0.5s
                      '&:hover': {
                        cursor: 'pointer',
                        // only if focusedIndex is not equal to index
                        ...(focusedIndex !== index && {
                          //set transition when mouse hover
                          transition: 'all 0.5s',
                          color: '#000',
                          // background color gradient darker than #fff
                          backgroundColor: '#fff',
                        }),
                      },
                    }} // on hover
                    onClick={() => {
                      setFocusedIndex(index);
                    }}
                  >
                    <Stack>
                      <Iconify
                        icon={'codicon:account'}
                        color="#000"
                        sx={{
                          width: '32px',
                          height: '32px',
                        }}
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      sx={{
                        '& .MuiStack-root': {
                          gap: '9px',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          height: '26px',
                          fontFamily: 'Cairo',
                          fontWeight: 700,
                          fontSize: '14px',
                          lineHeight: '26px',
                          color: '#1E1E1E',
                          bottopPadding: '3px',
                        }}
                      >
                        {item.partnerName} - {item.projectName}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Cairo',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '24px',
                          color: '#1E1E1E',
                          bottopPadding: '8px',
                        }}
                      >
                        {item.message}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: 'Cairo',
                          fontWeight: 600,
                          fontSize: '10px',
                          lineHeight: '19px',
                          color: '#8E8E8E',
                          bottopPadding: '8px',
                          height: '19px',
                        }}
                      >
                        {new Date(item.footer).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Box>

              {/* <Typography display="flex" justifyContent="flex-end" padding={2}>
                asdas
              </Typography> */}
            </Stack>

            <Button
              sx={{
                backgroundColor: '#0E8478',
                color: '#fff',
                borderRadius: 4,
                padding: 2,
                width: '162px',
                height: '51px',
              }}
              endIcon={<Iconify icon={'bi:chat-square-text'} color="#fff" width={24} height={24} />}
            >
              <Typography
                sx={{
                  fontFamily: 'Cairo',
                  fontWeight: 600,
                  fontSize: '10px',
                  lineHeight: '19px',
                  color: '#fff',
                }}
              >
                Create a new message
              </Typography>
            </Button>
          </Grid>
          {/* Grid Container Kiri */}
          <Grid item xs={8} sx={{ border: '2px solid red' }}>
            <Stack height="978px">
              <Typography variant="h4">test</Typography>
            </Stack>
          </Grid>
        </Grid>
      </ContentStyle>
      {/* </Container> */}
    </Page>
  );
}

export default ModeratorMessages;
