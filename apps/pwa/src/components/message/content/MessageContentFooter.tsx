import { Box, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { FooterContent } from '../type';

export default function MessageContentFooter({ data }: FooterContent) {
  const [messages, setMessages] = useState('');
  return (
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
          data.push({
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
        <img src="/assets/icons/send-message-icon.svg" alt="logo" width={16} height={16} />
      </Box>
      <TextField
        size="small"
        placeholder="write something"
        sx={{ width: '80%' }}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && e.currentTarget.value !== '') {
            data.push({
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
  );
}
