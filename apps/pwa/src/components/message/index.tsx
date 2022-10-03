import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import Page from 'components/Page';
import React, { useEffect, useState } from 'react';
import {
  Message,
  MessagesExternalCorespondence,
  MessagesInternalCorespondence,
} from '../../pages/moderator/mock-data';
import Iconify from '../Iconify';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  // minHeight: '30vh',
  // maxHeight: '100%',s
  // height: '80%',
  // display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  // gap: 20,
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function MessagesPage() {
  const [valueTabItem, setValueTabItem] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);
  const handleChangeTabsItem = (event: React.SyntheticEvent, newValue: number) => {
    setValueTabItem(newValue);
  };
  const [messages, setMessages] = useState<string>('');

  // useEffect(() => {
  //   console.log('focusedIndex', focusedIndex);
  //   console.log('messages', messages);
  // }, [focusedIndex, messages]);

  return (
    <Page title="Previous Funding Requests">
      {/* <Container sx={{ border: '1px solid red' }}> */}
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
          <Grid item xs={6} sx={{ pb: '0 !important' }}>
            {/* Stack for Message Option */}
            <Stack display="flex" spacing={1} sx={{ margin: 2 }} gap="20px">
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
                <Tab label="External Corespondence" {...a11yProps(0)} />
                <Tab label="Internal Corespondence" {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={valueTabItem} index={0}>
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
                        fontSize: '12px',
                        color: '#1E1E1E',
                        paddingLeft: '4px',
                      }}
                    >
                      Filter
                    </Typography>
                  </Stack>
                </Stack>
                {/* Mapping message */}
                <Box sx={{ overflowX: 'hidden', height: '550px' }}>
                  {MessagesExternalCorespondence.map((item, index) => (
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
                            fontSize: '14px',
                            bottopPadding: '3px',
                          }}
                        >
                          {item.partnerName} - {item.projectName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            lineHeight: '24px',
                            bottopPadding: '8px',
                          }}
                        >
                          {item.message}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '10px',
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
              </TabPanel>
              <TabPanel value={valueTabItem} index={1}>
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
                        fontSize: '12px',
                        color: '#1E1E1E',
                        paddingLeft: '4px',
                      }}
                    >
                      Filter
                    </Typography>
                  </Stack>
                </Stack>
                {/* Mapping message */}
                <Box sx={{ overflowX: 'hidden', height: '550px' }}>
                  {MessagesInternalCorespondence.map((item, index) => (
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
                            fontSize: '14px',
                            bottopPadding: '3px',
                          }}
                        >
                          {item.partnerName} - {item.projectName}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            lineHeight: '24px',
                            bottopPadding: '8px',
                          }}
                        >
                          {item.message}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '10px',
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
              </TabPanel>

              <Stack alignItems="flex-start" sx={{ mt: '0 !important' }}>
                <Button
                  sx={{
                    backgroundColor: '#0E8478',
                    color: '#fff',
                    borderRadius: 4,
                    padding: 2,
                    width: '162px',
                    height: '51px',
                  }}
                  endIcon={
                    <Iconify icon={'bi:chat-square-text'} color="#fff" width={24} height={24} />
                  }
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '10px',
                      color: '#fff',
                    }}
                  >
                    Create a new message
                  </Typography>
                </Button>
              </Stack>
            </Stack>
          </Grid>
          {/* Grid Container Kiri */}
          <Grid
            item
            xs={8}
            sx={{
              height: '800px',
              // p: '0 !important',
              pt: '0 !important',
              pl: '16px !important',
              pr: '8px !important',
              pb: '8px !important',
              backgroundColor: '#fff',
            }}
          >
            <Stack display="flex">
              <Stack direction="column" padding="10px" sx={{ mt: 4 }}>
                {/* Stack for header message */}
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <img src="/assets/icons/users-alt-green.svg" alt="logo" />
                  </Box>
                  <Typography>Partner Name - Project Name</Typography>
                </Stack>
                <Stack display="flex" direction="column" gap={1} height="660px" overflow="hidden">
                  {/* Stack for date message */}
                  <Stack justifyContent="flex-end" alignItems="center" width={1}>
                    <Typography sx={{ mt: '5px' }}>date</Typography>
                  </Stack>
                  {/* Stack for body message & time message */}
                  {Message.map((item, index) => (
                    <Stack
                      key={index}
                      justifyContent="center"
                      alignItems={item.sender === 'moderator' ? 'flex-start' : 'flex-end'}
                      width={1}
                    >
                      <Box
                        width="450px"
                        sx={{
                          backgroundColor:
                            item.sender === 'moderator' ? ' rgba(147, 163, 176, 0.24)' : '#0E8478',
                          borderRadius: '8px',
                          p: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            ml: '5px',
                            color: item.sender === 'moderator' ? ' #1E1E1E' : '#fff',
                          }}
                        >
                          {item.messageBody}
                        </Typography>
                      </Box>
                      <Typography sx={{ mt: '5px' }}>{item.timeCreated}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
              <Stack
                display="flex"
                direction="row"
                alignItems="center"
                alignSelf="sefl-strech"
                padding={1}
                justifyContent="flex-end"
              >
                <Box
                  onClick={() => {
                    Message.push({
                      sender: 'moderator',
                      messageBody: `${messages}`,
                      timeCreated: `${new Date().getHours()}:${new Date().getMinutes()}`,
                      dateCreated: String(new Date(2022, 8, 2, 15, 58)),
                    });
                    setMessages('');
                  }}
                  sx={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    pr: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                >
                  <img
                    src="/assets/icons/send-message-icon.svg"
                    alt="logo"
                    width={16}
                    height={16}
                  />
                </Box>
                <TextField
                  size="small"
                  placeholder="write something"
                  sx={{ width: '80%' }}
                  onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter' && e.currentTarget.value !== '') {
                      Message.push({
                        sender: 'moderator',
                        messageBody: messages,
                        timeCreated: `${new Date().getHours()}:${new Date().getMinutes()}`,
                        dateCreated: String(new Date(2022, 8, 2, 15, 58)),
                      });
                      setMessages('');
                    }
                  }}
                  onChange={(e) => {
                    setMessages(e.target.value);
                  }}
                  value={messages}
                />
                <Box sx={{ justifyContent: 'flex-end', display: 'flex', direction: 'row' }}>
                  <Box
                    onClick={() => alert('upload attachment')}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <img src="/assets/icons/upload-attachment-icon.svg" alt="logo" />
                  </Box>
                  <Box
                    onClick={() => alert('upload image')}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <img src="/assets/icons/upload-image-icon.svg" alt="logo" />
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </ContentStyle>
      {/* </Container> */}
    </Page>
  );
}

export default MessagesPage;
