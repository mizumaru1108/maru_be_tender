// React
import { useState, useRef, useEffect } from 'react';
// @mui material
import { alpha } from '@mui/material/styles';
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
  Button,
  Link,
  ListItemText,
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
import ModalNewAttachment from '../modal-form/ModalNewAttachment';
import { FileProp } from '../../upload';
import { type } from 'os';
import ButtonDownloadFiles from '../../button/ButtonDownloadFiles';
import { UploadFilesJsonbDto } from '../../../@types/commons';
import { fData } from '../../../utils/formatNumber';

export default function MessageContent() {
  const theme = useTheme();
  const { translate, currentLang } = useLocales();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, activeRole } = useAuth();

  // attachment
  const [openAttachment, setOpenAttachment] = useState<boolean>(false);
  const [attachmentType, setAttachmentType] = useState<'file' | 'image' | 'text'>('text');
  const [attachmentFile, setAttachmentFile] = useState<FileProp | null>(null);

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
  const [sentStatus, setSentStatus] = useState<'sent' | 'pending' | 'failed'>('sent');

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
    content?: string | null;
    attachment?: FileProp | null;
    selectLang: string;
    content_title?: string | null;
  }) => {
    setSentStatus('pending');
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
        setAttachmentFile(null);
        setAttachmentType('text');
        setSentStatus('sent');
      })
      .catch((err) => {
        console.log('err', err.message);
        setAttachmentFile(null);
        setAttachmentType('text');
        setSentStatus('failed');
      });
  };

  const initilizeGroupingMessage = (type: 'TEXT' | 'IMAGE' | 'FILE', file?: FileProp | null) => {
    let listMessageGrouped: IMassageGrouped[] = getMessageGrouped;
    let findTodayMsg = listMessageGrouped.find((el) => el.group_created === 'Today');

    if (findTodayMsg) {
      const listMessage = findTodayMsg.messages;
      const valuesMessage: Message = {
        id: uuidv4(),
        // content_type_id: 'TEXT',
        content_type_id: type,
        // content_title: null,
        content_title: type !== 'TEXT' ? file?.fullName : null,
        // content: messageValue,
        content: type === 'TEXT' ? messageValue : null,
        attachment: type !== 'TEXT' ? file : file ? file : null,
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
      console.log('receiver:', valuesMessage.receiver_role_as);

      postMessage({
        correspondence_type_id: corespondenceType,
        content_type_id: valuesMessage.content_type_id!,
        current_user_selected_role: activeRole!,
        partner_id: valuesMessage.receiver_id!,
        partner_selected_role: valuesMessage.receiver_role_as!,
        // content: messageValue,
        content: valuesMessage.content,
        attachment: valuesMessage.attachment,
        content_title: valuesMessage.content_title,
        selectLang: currentLang.value,
      });
    } else {
      const values: IMassageGrouped = {
        group_created: 'Today',
        messages: [
          {
            id: String(uuidv4()),
            // content_type_id: 'TEXT',
            content_type_id: type,
            content_title: type !== 'TEXT' ? file?.fullName : null,
            // content: messageValue,
            content: type === 'TEXT' ? messageValue : null,
            attachment: type !== 'TEXT' ? file : file ? file : null,
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
        content: values.messages[0].content,
        attachment: values.messages[0].attachment,
        content_title: values.messages[0].content_title,
        selectLang: currentLang.value,
      });
    }

    setGetMessageGrouped(listMessageGrouped);
    dispatch(setMessageGrouped(listMessageGrouped));

    setMessageValue('');
  };

  const handleKeyupMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && messageValue !== '') {
      initilizeGroupingMessage('TEXT');
    }
  };

  const handleClickSendMessage = async () => {
    // initilizeGroupingMessage('TEXT');
    if (attachmentType === 'text') {
      initilizeGroupingMessage('TEXT');
    } else {
      const fileType =
        attachmentType === 'file' ? 'FILE' : attachmentType === 'image' ? 'IMAGE' : 'TEXT';
      initilizeGroupingMessage(fileType, attachmentFile);
    }
    setAttachmentType('text');
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

  // console.log('getMessageGrouped', getMessageGrouped);

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
                  mb: 3,
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
                                            <Box
                                              component={Link}
                                              href={v.attachment.url ?? '#'}
                                              download="ملف مرفقات المشروع"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
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
                                            </Box>
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
                                        ) : (
                                          <>
                                            <ButtonDownloadFiles
                                              files={v.attachment as UploadFilesJsonbDto}
                                              border={undefined}
                                            />
                                          </>
                                        )}
                                      </>
                                    )}
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      mt: 0.5,
                                      fontSize: theme.spacing(1.35),
                                      fontStyle: 'italic',
                                      color:
                                        el.messages!.length === index + 1 && sentStatus === 'failed'
                                          ? 'red'
                                          : theme.palette.grey[500],
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent:
                                        user?.id === v.owner_id ? 'flex-start' : 'flex-end',
                                    }}
                                  >
                                    {/* {moment(v.created_at).format('LT')}.{' '} */}
                                    {el.messages!.length === index + 1 && sentStatus === 'failed'
                                      ? translate('message_sent_failed')
                                      : moment(v.created_at).format('LT')}
                                    {/* <Iconify
                                      icon="quill:checkmark-double"
                                      width={17}
                                      height={17}
                                      sx={{
                                        color: v.read_status
                                          ? theme.palette.primary.main
                                          : theme.palette.grey[400],
                                        ml: 0.25,
                                      }}
                                    /> */}
                                    {el.messages!.length === index + 1 &&
                                    sentStatus === 'pending' ? (
                                      <Iconify
                                        icon="quill:checkmark"
                                        width={17}
                                        height={17}
                                        sx={{
                                          color: v.read_status
                                            ? theme.palette.primary.main
                                            : theme.palette.grey[400],
                                          ml: 0.25,
                                        }}
                                      />
                                    ) : el.messages!.length === index + 1 &&
                                      sentStatus === 'failed' ? (
                                      <Iconify
                                        icon="mdi:warning-circle-outline"
                                        width={17}
                                        height={17}
                                        sx={{
                                          color: 'red',
                                          ml: 0.25,
                                        }}
                                      />
                                    ) : (
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
                                    )}
                                    {/* {el.messages!.length === index + 1 && sentStatus === 'sent' ? (
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
                                    )} */}
                                    {/* {el.messages!.length === index + 1 && sentStatus === 'failed' && (
                                      <Iconify
                                        icon="mdi:warning-circle-outline"
                                        width={17}
                                        height={17}
                                        sx={{
                                          color: 'red',
                                          ml: 0.25,
                                        }}
                                      />
                                    )} */}
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
                {/* <TextField
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
                /> */}
                {!attachmentFile ? (
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
                ) : (
                  <>
                    {/* <Stack direction={'row'} justifyContent="center" alignItems="center"> */}
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12}>
                        {attachmentType === 'image' && (
                          <Box
                            sx={{
                              p: 0,
                              m: 0.5,
                              width: 80,
                              height: 80,
                              borderRadius: 1.25,
                              overflow: 'hidden',
                              position: 'relative',
                              display: 'inline-flex',
                              border: (theme) => `solid 1px ${theme.palette.divider}`,
                            }}
                          >
                            <Image
                              disabledEffect
                              visibleByDefault
                              alt="empty content"
                              src={
                                attachmentFile.url ||
                                '/assets/illustrations/illustration_empty_content.svg'
                              }
                              // sx={{ height: 100 }}
                            />
                            <IconButton
                              size="small"
                              // onClick={() => onRemove(file)}
                              onClick={() => {
                                setAttachmentFile(null);
                                setAttachmentType('text');
                              }}
                              sx={{
                                top: 6,
                                p: '2px',
                                right: 6,
                                position: 'absolute',
                                color: 'common.white',
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                },
                              }}
                            >
                              <Iconify icon={'eva:close-fill'} />
                            </IconButton>
                          </Box>
                        )}
                        {attachmentType === 'file' && (
                          <Box
                            sx={{
                              my: 1,
                              px: 2,
                              py: 0.75,
                              borderRadius: 0.75,
                              border: (theme) => `solid 1px ${theme.palette.divider}`,
                            }}
                          >
                            <Iconify
                              icon={'eva:file-fill'}
                              sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }}
                            />

                            <ListItemText
                              primary={
                                typeof attachmentFile === 'string'
                                  ? attachmentFile
                                  : attachmentFile.fullName
                              }
                              secondary={
                                typeof attachmentFile === 'string'
                                  ? ''
                                  : fData(attachmentFile.size || 0)
                              }
                              primaryTypographyProps={{ variant: 'subtitle2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                            <IconButton
                              size="small"
                              // onClick={() => onRemove(file)}
                              onClick={() => {
                                setAttachmentFile(null);
                                setAttachmentType('text');
                              }}
                              sx={{
                                top: 24,
                                p: '2px',
                                right: 6,
                                position: 'absolute',
                                color: 'common.white',
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                },
                              }}
                            >
                              <Iconify icon={'eva:close-fill'} />
                            </IconButton>
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {/* <ButtonDownloadFiles
                      files={attachmentFile as UploadFilesJsonbDto}
                      border={undefined}
                    />
                    <Button
                      sx={{
                        color: '#fff',
                        backgroundColor: '#FF4842',
                        ':hover': {
                          backgroundColor: '#FF170F',
                        },
                      }}
                      onClick={() => {
                        setAttachmentFile(null);
                        setAttachmentType('text');
                      }}
                    >
                      حذف
                    </Button> */}
                  </>
                )}
                {attachmentFile ? null : (
                  <>
                    <Box sx={{ justifyContent: 'flex-end', display: 'flex', direction: 'row' }}>
                      <Box
                        onClick={() => {
                          setOpenAttachment(!openAttachment);
                          setAttachmentType('file');
                          // alert('upload attachment')
                        }}
                        sx={{
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <Image src="/assets/icons/upload-attachment-icon.svg" alt="logo" />
                      </Box>
                      <Box
                        onClick={() => {
                          setOpenAttachment(!openAttachment);
                          setAttachmentType('image');
                          // alert('upload image')
                        }}
                        sx={{
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                      >
                        <Image src="/assets/icons/upload-image-icon.svg" alt="logo" />
                      </Box>
                    </Box>
                  </>
                )}
              </Stack>
            </>
          )}
          <ModalNewAttachment
            open={openAttachment}
            handleClose={() => setOpenAttachment(!openAttachment)}
            attachment_type={attachmentType}
            header_title={attachmentType === 'file' ? 'Upload File' : 'Upload Image'}
            onSubmit={(data: FileProp) => {
              // console.log({ data });
              setAttachmentFile(data ?? null);
            }}
          />
        </Box>
      )}
    </>
  );
}
