// React
import { useState } from 'react';
// @mui
import { Typography, Box, useTheme } from '@mui/material';
// icon
import Iconify from '../../Iconify';
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
  const { activeConversationId } = useSelector((state) => state.wschat);

  // redux
  const dispatch = useDispatch();

  const handleFocusItem = (id: string) => {
    dispatch(setActiveConversationId(id));

    setFocusedItem(activeConversationId ? activeConversationId : null);

    handleReadStatus(id);
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

  return (
    <>
      {data.map((item, index) => (
        <Box
          component="div"
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'self-start',
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
          <Iconify icon={'codicon:account'} color="#000" width={28} height={28} />
          <Box
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              ml: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                pb: 0.25,
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
                pb: 0.5,
              }}
            >
              {item.messages.length
                ? item.messages[0].content_type_id === 'TEXT'
                  ? item.messages[0].content
                    ? item.messages[0].content.length > 50
                      ? `${item.messages[0].content.slice(0, 50)} ...`
                      : item.messages[0].content
                    : ''
                  : 'New Image Message'
                : 'No message yet.'}
            </Typography>

            <Typography
              sx={{
                fontSize: '10px',
                color: '#8E8E8E',
              }}
            >
              {moment(item.messages[0].created_at).format('LLL')}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
