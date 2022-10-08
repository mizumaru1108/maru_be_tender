import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import Iconify from '../../Iconify';
import { Menu, TabPanelProps } from '../type';

const MessageMenu = ({ internalTabData, externalTabData }: Menu) => {
  const [valueTabItem, setValueTabItem] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);
  const handleChangeTabsItem = (event: React.SyntheticEvent, newValue: number) => {
    setValueTabItem(newValue);
  };

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

  return (
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
          {internalTabData.map((item, index) => (
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
          {externalTabData.map((item, index) => (
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
          endIcon={<Iconify icon={'bi:chat-square-text'} color="#fff" width={24} height={24} />}
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
  );
};
export default MessageMenu;
