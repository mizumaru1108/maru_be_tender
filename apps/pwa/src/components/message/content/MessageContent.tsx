import { Box, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import MessageContentBody from './MessageContentBody';
import MessageContentFooter from './MessageContentFooter';
import MessageContentHeader from './MessageContentHeader';
import { IContentMessage } from '../type';

export default function MessageContent({ data }: IContentMessage) {
  const [messages, setMessages] = useState('');
  return (
    <Stack display="flex">
      <MessageContentHeader />
      {/* Stack for body message */}
      <Stack display="flex" direction="column" gap={1} height="660px" overflow="hidden">
        <Stack justifyContent="flex-end" alignItems="center" width={1}>
          <Typography sx={{ mt: '5px' }}>date</Typography>
        </Stack>
        <MessageContentBody data={data} />
      </Stack>
      {/* for button action in the message content */}
      <MessageContentFooter data={data} />
    </Stack>
  );
}
