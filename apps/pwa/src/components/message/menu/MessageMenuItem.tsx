// React
import { useState, useEffect } from 'react';
// @mui
import { Typography, useTheme, Stack } from '@mui/material';
// icon
import Iconify from '../../Iconify';
import Label from 'components/Label';
// types
import { Conversation } from '../../../@types/wschat';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// redux
import { setActiveConversationId } from 'redux/slices/wschat';
import { useDispatch, useSelector } from 'redux/store';
// moment
import moment from 'moment';
import axiosInstance from 'utils/axios';

type IPropsMessageItem = {
  data: Conversation[];
  activeRole: string;
};

export default function MessageMenuItem({ data, activeRole }: IPropsMessageItem) {
  const theme = useTheme();
  const { user } = useAuth();
  const { currentLang, translate } = useLocales();

  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const { conversations, activeConversationId } = useSelector((state) => state.wschat);

  // redux
  const dispatch = useDispatch();

  const handleFocusItem = (id: string) => {
    dispatch(setActiveConversationId(id));

    setFocusedItem(activeConversationId ? activeConversationId : null);

    handleReadStatus(id);
  };

  useEffect(() => {
    if (conversations.length) {
      if (activeConversationId) {
        setFocusedItem(activeConversationId);
      }
    }
  }, [conversations, activeConversationId]);

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

  return (
    <>
      {data.map((item, index) => (
        <Stack
          component="div"
          key={index}
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: 2,
            borderRadius: 1,
            color: '#000',
            backgroundColor: {
              ...(activeConversationId === item.id && {
                transition: 'all 0.25s',
                color: '#000',
                backgroundColor: '#fff',
              }),
            },
            '&:hover': {
              cursor: 'pointer',
              backgroundColor: theme.palette.grey[300],
              ...(activeConversationId === item.id && {
                transition: 'all 0.25s',
                color: '#000',
                backgroundColor: '#fff',
              }),
            },
          }}
          onClick={() => handleFocusItem(item.id!)}
        >
          <Stack component="div" spacing={2} direction="row" alignItems="flex-start">
            <Iconify icon={'codicon:account'} color="#000" width={28} height={28} />
            <Stack component="div" direction="column">
              <Typography
                variant="subtitle2"
                sx={{
                  ...(item.unread_message! > 0 && {
                    fontWeight: 700,
                  }),
                }}
              >
                {item.messages[0].owner_id === user?.id
                  ? item.messages[0].receiver?.employee_name
                  : item.messages[0].sender?.employee_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '12px',
                  lineHeight: '24px',
                  ...(item.unread_message! > 0 && {
                    fontWeight: 700,
                  }),
                }}
              >
                {item.messages.length
                  ? item.messages[0].content_type_id === 'TEXT'
                    ? item.messages[0].content
                      ? item.messages[0].content.length > 50
                        ? `${item.messages[0].content.slice(0, 50)} ...`
                        : item.messages[0].content
                      : ''
                    : 'New Attecment Message'
                  : 'No message yet.'}
              </Typography>

              <Typography
                sx={{
                  fontSize: '10px',
                  color: '#8E8E8E',
                  ...(item.unread_message! > 0 && {
                    fontWeight: 700,
                  }),
                }}
              >
                {moment(item.messages[0].created_at).format('LLL')}
              </Typography>
            </Stack>
          </Stack>
          {item.unread_message! > 0 ? <Label color="primary">{item.unread_message}</Label> : null}
        </Stack>
      ))}
    </>
  );
}
