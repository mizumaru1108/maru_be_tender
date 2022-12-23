// React
import { useEffect, useState } from 'react';
// @mui
import { Stack, Typography, Box, useTheme } from '@mui/material';
// icon
import Iconify from '../../Iconify';
// types
import { Conversation } from '../../../@types/wschat';
import { IMessageMenuItem } from '../type';

type IPropsMessageItem = {
  data: Conversation[];
};

// export default function MessageMenuItem({ data, getRoomId }: IMessageMenuItem) {
export default function MessageMenuItem({ data }: IPropsMessageItem) {
  const theme = useTheme();
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
              {item.partner_username} - {item.partner_selected_role}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: '24px',
                pb: 0.5,
              }}
            >
              {item.content && item.content.length ? `${item.content[0].body}` : 'No message yet.'}
            </Typography>

            <Typography
              sx={{
                fontSize: '10px',
                color: '#8E8E8E',
              }}
            >
              {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  );
}
