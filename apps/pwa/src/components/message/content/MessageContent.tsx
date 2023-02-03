// React
import { useState, useRef, useEffect } from 'react';
// @mui material
import {
  Box,
  Typography,
  Stack,
  Divider,
  TextField,
  IconButton,
  Grid,
  useTheme,
  CircularProgress,
} from '@mui/material';
// components
import Image from 'components/Image';
import Iconify from 'components/Iconify';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// types
import { IMassageGrouped, Message, Conversation } from '../../../@types/wschat';
// redux
import { setMessageGrouped, setActiveConversationId } from 'redux/slices/wschat';
import { useSelector, useDispatch } from 'redux/store';
// urql + subscription
import { useSubscription } from 'urql';
import { getListMessageByRoom } from 'queries/messages/getListMessageByRoom';
// utils
import axiosInstance from 'utils/axios';
import uuidv4 from 'utils/uuidv4';
//
import moment from 'moment';

export default function MessageContent() {
  const theme = useTheme();
  const { translate } = useLocales();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, activeRole } = useAuth();

  // redux
  const dispatch = useDispatch();
  const { activeConversationId, messageGrouped, conversations } = useSelector(
    (state) => state.wschat
  );

  // setGroupingMessage
  const [getMessageGrouped, setGetMessageGrouped] = useState<IMassageGrouped[] | []>(
    messageGrouped!
  );

  // setValueNewMessage
  const [messageValue, setMessageValue] = useState<string>('');
  const [corespondenceType, setCorespondenceType] = useState<string>('EXTERNAL');
  const [partner, setPartner] = useState<{
    partner_name: string;
    roles: string;
  } | null>(null);

  // urql + subscription
  const [resultMessages] = useSubscription({
    query: getListMessageByRoom,
    variables: {
      activeConversationId: activeConversationId || '',
    },
  });

  const { data, fetching, error } = resultMessages;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReadStatus = async (conversationId: string) => {
    await axiosInstance.patch(
      '/tender/messages/toogle-read',
      {
        roomId: conversationId,
      },
      {
        headers: { 'x-hasura-role': activeRole! },
      }
    );
  };

  const postMessage = async (payload: {
    content_type_id: string;
    correspondence_type_id: string;
    partner_id: string;
    partner_selected_role: string;
    current_user_selected_role: string;
    content: string;
  }) => {
    let getPayload = payload;

    getPayload.partner_selected_role !== 'tender_client'
      ? (getPayload.correspondence_type_id = 'INTERNAL')
      : (getPayload.correspondence_type_id = 'EXTERNAL');

    await axiosInstance
      .post('/tender/messages/send', getPayload, {
        headers: { 'x-hasura-role': activeRole! },
      })
      .then((res) => {
        dispatch(setActiveConversationId(res.data.data.roomChatId));
      })
      .catch((err) => console.log('err', err.message));
  };

  const initilizeGroupingMessage = () => {
    let listMessageGrouped: IMassageGrouped[] = getMessageGrouped;
    let findTodayMsg = listMessageGrouped.find((el) => el.group_created === 'Today');

    if (findTodayMsg) {
      const listMessage = findTodayMsg.messages;
      const valuesMessage: Message = {
        id: uuidv4(),
        content_type_id: 'TEXT',
        attachment: null,
        content_title: null,
        content: messageValue,
        created_at: moment().toISOString(),
        owner_id: user?.id,
        sender_role_as: activeRole,
        receiver_id:
          listMessage[0].owner_id === user?.id
            ? listMessage[0].receiver_id
            : listMessage[0].owner_id,
        receiver_role_as:
          listMessage[0].owner_id === user?.id
            ? listMessage[0].receiver_role_as
            : listMessage[0].sender_role_as,
        updated_at: moment().toISOString(),
        read_status: false,
      };

      findTodayMsg = { ...findTodayMsg, messages: [...listMessage, valuesMessage] };

      const concatValue = listMessageGrouped.map((item: IMassageGrouped) =>
        item.group_created === findTodayMsg?.group_created ? findTodayMsg : item
      );

      listMessageGrouped = concatValue;

      postMessage({
        correspondence_type_id: corespondenceType,
        content_type_id: valuesMessage.content_type_id!,
        current_user_selected_role: activeRole!,
        partner_id: valuesMessage.receiver_id!,
        partner_selected_role: valuesMessage.receiver_role_as!,
        content: messageValue,
      });
    } else {
      const values: IMassageGrouped = {
        group_created: 'Today',
        messages: [
          {
            id: String(uuidv4()),
            content_type_id: 'TEXT',
            attachment: null,
            content_title: null,
            content: messageValue,
            created_at: moment().toISOString(),
            owner_id: user?.id,
            sender_role_as: activeRole,
            receiver_id:
              listMessageGrouped[0].messages[0].owner_id === user?.id
                ? listMessageGrouped[0].messages[0].receiver_id
                : listMessageGrouped[0].messages[0].owner_id,
            receiver_role_as:
              listMessageGrouped[0].messages[0].owner_id === user?.id
                ? listMessageGrouped[0].messages[0].receiver_role_as
                : listMessageGrouped[0].messages[0].sender_role_as,
            updated_at: moment().toISOString(),
            read_status: false,
          },
        ],
      };

      const concatValueMessage: IMassageGrouped[] = [...listMessageGrouped, values];
      listMessageGrouped = concatValueMessage;

      postMessage({
        correspondence_type_id: corespondenceType,
        content_type_id: values.messages[0].content_type_id!,
        current_user_selected_role: activeRole!,
        partner_id: values.messages[0].receiver_id!,
        partner_selected_role: values.messages[0].receiver_role_as!,
        content: messageValue,
      });
    }

    setGetMessageGrouped(listMessageGrouped);
    dispatch(setMessageGrouped(listMessageGrouped));

    setMessageValue('');
  };

  const handleKeyupMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && messageValue !== '') {
      initilizeGroupingMessage();
    }
  };

  const handleClickSendMessage = async () => {
    initilizeGroupingMessage();
  };

  useEffect(() => {
    if (!fetching && data && data.message.length) {
      const findConversation: Conversation = conversations.find(
        (el) => el.id === activeConversationId
      )!;

      if (findConversation) {
        setCorespondenceType(findConversation.correspondance_category_id);
        setPartner({
          partner_name:
            findConversation.messages[0].owner_id === user?.id
              ? findConversation.messages[0].receiver?.employee_name!
              : findConversation.messages[0].sender?.employee_name!,
          roles:
            findConversation.messages[0].owner_id === user?.id
              ? findConversation.messages[0].receiver_role_as!
              : findConversation.messages[0].sender_role_as!,
        });
      }
      const messageContents = data.message;
      let grouped: IMassageGrouped[] = [];

      for (const msg of messageContents) {
        const date = moment(msg.created_at).isSame(moment(), 'day')
          ? 'Today'
          : moment(msg.created_at).isSame(moment().subtract(1, 'days'), 'day')
          ? 'Yesterday'
          : moment(msg.created_at).format('dddd DD/MM/YYYY');

        let group = grouped.find((g) => g.group_created === date)!;

        if (group) {
          group.messages.push(msg);
        } else {
          grouped.push({
            group_created: date,
            messages: [msg],
          });
        }
      }

      setGetMessageGrouped(grouped);
      dispatch(setMessageGrouped(grouped));
    } else {
      const findConversation: Conversation = conversations.find(
        (el) => el.id === activeConversationId
      )!;
      if (findConversation) {
        setCorespondenceType(findConversation.correspondance_category_id);
        setPartner({
          partner_name:
            findConversation.messages[0].owner_id === user?.id
              ? findConversation.messages[0].receiver?.employee_name!
              : findConversation.messages[0].sender?.employee_name!,
          roles:
            findConversation.messages[0].owner_id === user?.id
              ? findConversation.messages[0].receiver_role_as!
              : findConversation.messages[0].sender_role_as!,
        });

        const messageContents = findConversation.messages;
        let groupedAlter: IMassageGrouped[] = [];

        for (const msg of messageContents) {
          const date = moment(msg.created_at).isSame(moment(), 'day')
            ? 'Today'
            : moment(msg.created_at).isSame(moment().subtract(1, 'days'), 'day')
            ? 'Yesterday'
            : moment(msg.created_at).format('dddd DD/MM/YYYY');
          const group = groupedAlter.find((g) => g.group_created === date);
          if (group) {
            group.messages.push(msg);
          } else {
            groupedAlter.push({
              group_created: date,
              messages: [msg],
            });
          }
        }

        setGetMessageGrouped(groupedAlter);
        dispatch(setMessageGrouped(groupedAlter));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, data]);

  useEffect(() => {
    if (getMessageGrouped.length) {
      scrollToBottom();
      // handleReadStatus(activeConversationId!);
    }
  }, [getMessageGrouped, activeConversationId]);

  return (
    <>
      {!activeConversationId ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Iconify
            icon="simple-icons:googlemessages"
            width={50}
            height={50}
            sx={{ color: theme.palette.grey[400], mb: 2 }}
          />
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[500], fontStyle: 'italic' }}
          >
            {translate('message_is_empty')},
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: theme.palette.grey[500], fontStyle: 'italic' }}
          >
            {translate('you_can_create_new_message_for_new_conversation')}.
          </Typography>
        </Box>
      ) : (
        <Box
          component="div"
          sx={{
            position: 'relative',
            minHeight: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            pb: '35px',
          }}
        >
          {fetching ? (
            <Box
              component="div"
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack
                direction="row"
                component="div"
                spacing={2}
                sx={{
                  pt: 1,
                  mb: 1.5,
                  borderBottom: `1px solid ${theme.palette.grey[300]}`,
                  bgcolor: theme.palette.common.white,
                }}
              >
                <Box sx={{ pb: 1.5 }}>
                  <Image src="/assets/icons/users-alt-green.svg" alt="logo" />
                </Box>
                <Typography>
                  {partner && `${partner.partner_name} - ${translate(partner.roles)}`}
                </Typography>
              </Stack>
              <Box
                sx={{
                  maxHeight: '525px',
                  overflowY: 'scroll',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                {!getMessageGrouped.length
                  ? null
                  : getMessageGrouped.map((el, i) => (
                      <Grid container key={i} spacing={1} alignItems="center">
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                            {el.group_created.toString()}
                          </Typography>
                        </Grid>
                        {el.messages!.length &&
                          el.messages!.map((v, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: user?.id === v.owner_id ? 'flex-start' : 'flex-end',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                                flexWrap: 'wrap',
                                px: 1.5,
                                mt: 2.5,
                                width: '100%',
                              }}
                            >
                              {!v.content && !v.attachment ? null : (
                                <Box sx={{ maxWidth: 400 }}>
                                  <Box
                                    sx={{
                                      backgroundColor:
                                        user?.id === v.owner_id
                                          ? ' rgba(147, 163, 176, 0.24)'
                                          : '#0E8478',
                                      color: user?.id === v.owner_id ? '#000000' : '#ffffff',
                                      borderRadius: '8px',
                                      p: 1.25,
                                    }}
                                  >
                                    {v.content && v.content_type_id === 'TEXT' ? (
                                      <Typography
                                        variant="body2"
                                        sx={{ overflow: 'hidden', whiteSpace: 'normal' }}
                                      >
                                        {v.content}
                                      </Typography>
                                    ) : (
                                      <>
                                        {v.attachment && v.content_type_id === 'IMAGE' ? (
                                          <>
                                            <Image
                                              disabledEffect
                                              visibleByDefault
                                              alt="empty content"
                                              src={
                                                v.attachment?.url ||
                                                '/assets/illustrations/illustration_empty_content.svg'
                                              }
                                              sx={{ height: 100 }}
                                            />
                                            {v.content_title && (
                                              <Typography
                                                variant="caption"
                                                sx={{
                                                  mt: 1,
                                                  fontSize: theme.spacing(1.35),
                                                  color: theme.palette.grey[500],
                                                }}
                                              >
                                                {v.content_title}
                                              </Typography>
                                            )}
                                          </>
                                        ) : null}
                                      </>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      mt: 0.5,
                                      fontSize: theme.spacing(1.35),
                                      fontStyle: 'italic',
                                      color: theme.palette.grey[500],
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent:
                                        user?.id === v.owner_id ? 'flex-start' : 'flex-end',
                                    }}
                                  >
                                    {moment(v.created_at).format('LT')}.{' '}
                                    <Iconify
                                      icon="quill:checkmark-double"
                                      width={17}
                                      height={17}
                                      sx={{
                                        color: v.read_status
                                          ? theme.palette.primary.main
                                          : theme.palette.grey[400],
                                        ml: 0.25,
                                      }}
                                    />
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        <Box ref={messagesEndRef} />
                      </Grid>
                    ))}
              </Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                component="div"
                sx={{
                  bgcolor: theme.palette.common.white,
                  position: 'absolute',
                  width: '100%',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  margin: 'auto',
                }}
              >
                <IconButton onClick={handleClickSendMessage}>
                  <Image
                    src="/assets/icons/send-message-icon.svg"
                    alt="logo"
                    width={16}
                    height={16}
                  />
                </IconButton>
                <TextField
                  size="small"
                  placeholder="write something"
                  // sx={{ width: '80%' }}
                  onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyupMsg(e)}
                  onChange={(e) => {
                    setMessageValue(e.target.value);
                  }}
                  fullWidth
                  value={messageValue}
                  autoFocus
                />
                {/* <Box sx={{ justifyContent: 'flex-end', display: 'flex', direction: 'row' }}>
                  <Box
                    onClick={() => alert('upload attachment')}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Image src="/assets/icons/upload-attachment-icon.svg" alt="logo" />
                  </Box>
                  <Box
                    onClick={() => alert('upload image')}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Image src="/assets/icons/upload-image-icon.svg" alt="logo" />
                  </Box>
                </Box> */}
              </Stack>
            </>
          )}
        </Box>
      )}
    </>
  );
}
