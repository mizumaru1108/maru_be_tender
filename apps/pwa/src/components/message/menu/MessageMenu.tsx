import { Box, Stack, Tab, Tabs, Typography, Button, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import { useState } from 'react';
import useLocales from '../../../hooks/useLocales';
import ModalDialog from '../../modal-dialog';
import { filterProjectTrack, filterSupervisor } from '../mock-data';
import FilterModalMessage from '../modal-form/FilterModalMessage';
import NewMessageModalForm from '../modal-form/NewMessageModalForm';
import { IMenu, TabPanelProps } from '../type';
import MessageMenuButton from './MessageMenuButton';
import MessageMenuHeader from './MessageMenuHeader';
import MessageMenuItem from './MessageMenuItem';

const MessageMenu = ({ internalData, externalData, accountType, roomId }: IMenu) => {
  const theme = useTheme();
  const { translate } = useLocales();
  const [modalState, setModalState] = useState(false);
  const [open, setOpen] = useState(false);
  const [valueTabItem, setValueTabItem] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);
  const handleChangeTabsItem = (event: React.SyntheticEvent, newValue: number) => {
    setValueTabItem(newValue);
  };
  const [messageModalState, setMesssageModalState] = useState(false);
  const [filterModalState, setFilterModalState] = useState(false);
  const [id, setId] = useState('');

  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleOpenFilter = () => setOpen(true);
  const handleCloseFilter = () => setOpen(false);

  const handleAddNewMessage = () => {};

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
          <Box>{children}</Box>
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
    <Stack display="flex" spacing={3} sx={{ margin: 2.5 }}>
      <MessageMenuHeader onClickFilter={() => setOpen(true)} />
      <FilterModalMessage
        open={open}
        handleClose={handleCloseFilter}
        appliedFilter={(value) => {
          console.log('value : ', value);
        }}
        supervisors={filterSupervisor}
        projectTracks={filterProjectTrack}
      />

      {[
        'tender_project_manager',
        'tender_accounts_manager',
        'tender_project_supervisor',
        'tender_moderator',
        'tender_consultant',
        'tender_ceo',
        'tender_finance',
        'tender_cashier',
      ].includes(accountType) && (
        <MessageMenuButton
          onClick={() => {
            setModalState(true);
          }}
        />
      )}

      {[
        'tender_moderator',
        'tender_accounts_manager',
        'tender_project_supervisor',
        'tender_admin',
      ].includes(accountType) && (
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
      )}

      {[
        'tender_moderator',
        'tender_accounts_manager',
        'tender_project_supervisor',
        'tender_admin',
      ].includes(accountType) && (
        <>
          <TabPanel value={valueTabItem} index={0}>
            <Box sx={{ overflowX: 'hidden', height: '550px' }}>
              <MessageMenuItem
                data={externalData}
                // data={internalData}
                getRoomId={(value) => roomId(value)}
              />
            </Box>
          </TabPanel>
          <TabPanel value={valueTabItem} index={1}>
            <Box sx={{ overflowX: 'hidden', height: '550px' }}>
              <MessageMenuItem
                // data={externalData}
                data={internalData}
                getRoomId={(value) => roomId(value)}
              />
            </Box>
          </TabPanel>
        </>
      )}

      {[
        'tender_client',
        'tender_project_manager',
        'tender_consultant',
        'tender_ceo',
        'tender_finance',
        'tender_cashier',
      ].includes(accountType) && (
        <Box sx={{ overflowX: 'hidden' }}>
          <MessageMenuItem data={internalData} getRoomId={(value) => roomId(value)} />
        </Box>
      )}

      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {translate('new_message_modal.title')}
            </Typography>
          </Stack>
        }
        content={
          <Box sx={{ mx: 1.5 }}>
            <NewMessageModalForm
              onSubmit={(value: any) => {
                console.log('form callback', value);
                handleAddNewMessage();
              }}
            />
          </Box>
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: 2.25, backgroundColor: '#fff' }}
        maxWidth="md"
      />
    </Stack>
  );
};
export default MessageMenu;
