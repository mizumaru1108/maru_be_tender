// React
import { useState, useEffect } from 'react';
// @mui material
import { Box, Stack, Tab, Tabs, Typography, Skeleton, useTheme } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Iconify from 'components/Iconify';
import ModalDialog from '../../modal-dialog';
import FilterModalMessage from '../modal-form/FilterModalMessage';
import NewMessageModalForm from '../modal-form/NewMessageModalForm';
import MessageMenuButton from './MessageMenuButton';
import MessageMenuHeader from './MessageMenuHeader';
import MessageMenuItem from './MessageMenuItem';
// types
import { IMenu, TabPanelProps } from '../type';
// mock
import { filterProjectTrack, filterSupervisor } from '../mock-data';
// redux
import { addConversation, setActiveConversationId, setMessageGrouped } from 'redux/slices/wschat';
import { useDispatch, useSelector } from 'redux/store';
import { Conversation } from '../../../@types/wschat';
import axiosInstance from 'utils/axios';

const MessageMenu = ({ accountType, user, fetching }: IMenu) => {
  const theme = useTheme();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const { conversations } = useSelector((state) => state.wschat);

  const [modalState, setModalState] = useState(false);
  const [open, setOpen] = useState(false);
  const [valueTabItem, setValueTabItem] = useState(0);
  const [corespondence, setCorespondence] = useState('external');

  const [newConversation, setNewConversation] = useState<Conversation[] | []>(conversations);

  const handleChangeTabsItem = (event: React.SyntheticEvent, newValue: number) => {
    setValueTabItem(newValue);
    newValue === 0 ? setCorespondence('external') : setCorespondence('internal');

    dispatch(setActiveConversationId(null));
    dispatch(setMessageGrouped([]));
  };

  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleCloseFilter = () => setOpen(false);

  const handleReadMessages = async (conversationId: string) => {
    await axiosInstance.patch(
      '/tender/messages/toogle-read',
      {
        roomId: conversationId,
      },
      {
        headers: { 'x-hasura-role': accountType! },
      }
    );
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
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    if (conversations.length) {
      setNewConversation(conversations);
    }
  }, [conversations, newConversation]);

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
        'tender_consultant',
        'tender_ceo',
        'tender_finance',
        'tender_cashier',
      ].includes(accountType) && (
        <MessageMenuButton
          onClick={() => {
            dispatch(setActiveConversationId(null));
            dispatch(setMessageGrouped([]));
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
          <Tab label={translate('message_tab.external')} {...a11yProps(0)} />
          <Tab label={translate('message_tab.internal')} {...a11yProps(1)} />
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
                  dispatch(setActiveConversationId(null));
                  dispatch(setMessageGrouped([]));
                  setModalState(true);
                }}
              />
            )}

            <Stack
              direction="column"
              component="div"
              spacing={1}
              sx={{ overflowX: 'hidden', mt: 4 }}
            >
              {fetching ? (
                <>
                  {[...Array(2)].map((el, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height="100px"
                      animation="pulse"
                      sx={{ bgcolor: 'grey.300', borderRadius: 1, mb: 1.5 }}
                    />
                  ))}
                </>
              ) : (
                <>
                  {!newConversation.filter((el) => el.correspondance_category_id === 'EXTERNAL')
                    .length ? null : (
                    <MessageMenuItem
                      data={newConversation.filter(
                        (el) => el.correspondance_category_id === 'EXTERNAL'
                      )}
                      activeRole={accountType}
                    />
                  )}
                </>
              )}
            </Stack>
          </TabPanel>
          <TabPanel value={valueTabItem} index={1}>
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
                  dispatch(setActiveConversationId(null));
                  dispatch(setMessageGrouped([]));
                  setModalState(true);
                }}
              />
            )}

            <Stack
              direction="column"
              component="div"
              spacing={1}
              sx={{ overflowX: 'hidden', mt: 4 }}
            >
              {fetching ? (
                <>
                  {[...Array(2)].map((el, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height="100px"
                      animation="pulse"
                      sx={{ bgcolor: 'grey.300', borderRadius: 1, mb: 1.5 }}
                    />
                  ))}
                </>
              ) : (
                <>
                  {!newConversation.filter((el) => el.correspondance_category_id === 'INTERNAL')
                    .length ? null : (
                    <MessageMenuItem
                      data={newConversation.filter(
                        (el) => el.correspondance_category_id === 'INTERNAL'
                      )}
                      activeRole={accountType}
                    />
                  )}
                </>
              )}
            </Stack>
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
          {fetching ? (
            <>
              {[...Array(2)].map((el, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height="100px"
                  animation="pulse"
                  sx={{ bgcolor: 'grey.300', borderRadius: 1, mb: 1.5 }}
                />
              ))}
            </>
          ) : (
            <>
              {!newConversation.length ? null : (
                <MessageMenuItem data={newConversation} activeRole={accountType} />
              )}
            </>
          )}
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
              user={user}
              activeRole={accountType}
              corespondence={corespondence}
              onSubmit={(v: Conversation) => {
                const valueFromModal = v;
                const valueNewConversation = newConversation;
                let hasConversationId: string | undefined = undefined;

                if (valueNewConversation.length) {
                  for (let index = 0; index < valueNewConversation.length; index++) {
                    const messages = valueNewConversation[index].messages;
                    const findReceiverId = messages.find(
                      (el) =>
                        el.owner_id === valueFromModal.messages[0].receiver_id ||
                        el.receiver_id === valueFromModal.messages[0].receiver_id
                    );

                    if (findReceiverId) {
                      hasConversationId = valueNewConversation[index].id;
                    }
                  }
                }

                if (hasConversationId) {
                  dispatch(setActiveConversationId(hasConversationId));
                  handleReadMessages(hasConversationId);
                  setModalState(false);
                } else {
                  dispatch(addConversation(valueFromModal));
                  dispatch(setActiveConversationId(valueFromModal.id!));
                  handleReadMessages(valueFromModal.id!);
                  setModalState(false);
                }
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
