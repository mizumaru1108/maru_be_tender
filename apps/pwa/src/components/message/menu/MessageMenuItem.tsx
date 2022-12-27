// React
import { useState, useEffect } from 'react';
// @mui
import { Typography, Box, useTheme } from '@mui/material';
// icon
import Iconify from '../../Iconify';
// types
import { Conversation } from '../../../@types/wschat';
import { IMessageMenuItem } from '../type';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';

type IPropsMessageItem = {
  data: Conversation[];
};

// export default function MessageMenuItem({ data, getRoomId }: IMessageMenuItem) {
export default function MessageMenuItem({ data }: IPropsMessageItem) {
  const theme = useTheme();
  const { currentLang, translate } = useLocales();

  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);

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
              ...(focusedIndex === index && {
                transition: 'all 0.25s',
                color: '#000',
                backgroundColor: '#fff',
              }),
            },
            '&:hover': {
              cursor: 'pointer',
              backgroundColor: theme.palette.grey[300],
              ...(focusedIndex === index && {
                transition: 'all 0.25s',
                color: '#000',
                backgroundColor: '#fff',
              }),
            },
          }}
          onClick={() => {
            setFocusedIndex(index);
          }}
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
              {item.participant2?.employee_name} - {translate(item.participant2?.roles)}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: '24px',
                pb: 0.5,
              }}
            >
              {item.messages.length
                ? item.messages[0].content
                  ? `${item.messages[0].content}`
                  : 'No message yet.'
                : 'No message yet.'}
            </Typography>

            <Typography
              sx={{
                fontSize: '10px',
                color: '#8E8E8E',
              }}
            >
              {new Date(item.messages[0].created_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
