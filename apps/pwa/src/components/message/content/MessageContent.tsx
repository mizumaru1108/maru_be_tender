// React
import { useState } from 'react';
// @mui material
import { Box, Typography, Stack, Divider, TextField, IconButton, useTheme, Grid } from '@mui/material';
// components
import Image from 'components/Image';
// types
import { IContentMessage } from '../type';
//
const messageValue = [...Array(50)].map((_, index) => ({
  createdAt: new Date().toLocaleDateString(),
  value: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit',
}));

export default function MessageContent({ data }: IContentMessage) {
  const [messages, setMessages] = useState('');
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pb: '55px',
      }}
    >
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
        <Typography>Partner Name - Project Name</Typography>
      </Stack>
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ maxHeight: '525px', overflowY: 'scroll', whiteSpace: 'nowrap' }}
      >
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{ fontStyle: 'italic' }}
          >
            {new Date().toDateString()}
          </Typography>
        </Grid>
        {messageValue.map((v, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              // alignItems={item.sender === 'moderator' ? 'flex-start' : 'flex-end'}
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              px: 1.5,
              mt: 2.5,
              width: '100%'
            }}
          >
            <Box
              sx={{
                // backgroundColor:
                //   item.sender === 'moderator' ? ' rgba(147, 163, 176, 0.24)' : '#0E8478',
                backgroundColor: 'rgba(147, 163, 176, 0.24)',
                borderRadius: '8px',
                p: 1.25,
              }}
            >
              <Typography variant="body2">
                {v.value}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                fontStyle: 'italic',
                color: theme.palette.grey[500]
              }}
            >
              {v.createdAt}
            </Typography>
          </Box>
        ))}
      </Grid>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
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
        <IconButton>
          <Image src="/assets/icons/send-message-icon.svg" alt="logo" width={16} height={16} />
        </IconButton>
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
        </Box>
      </Stack>
    </Box>
  );
}
