import { Box, Stack, Typography } from '@mui/material';
import { BodyContent } from '../type';

const MessageContentBody = ({ data }: BodyContent) => {
  return (
    <Stack>
      {data.map((item, index) => (
        <Stack
          key={index}
          justifyContent="center"
          alignItems={item.sender === 'moderator' ? 'flex-start' : 'flex-end'}
          width={1}
        >
          <Box
            width="450px"
            sx={{
              backgroundColor:
                item.sender === 'moderator' ? ' rgba(147, 163, 176, 0.24)' : '#0E8478',
              borderRadius: '8px',
              p: 1,
            }}
          >
            <Typography
              sx={{
                ml: '5px',
                color: item.sender === 'moderator' ? ' #1E1E1E' : '#fff',
              }}
            >
              {item.messageBody}
            </Typography>
          </Box>
          <Typography sx={{ mt: '5px' }}>{item.timeCreated}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};
export default MessageContentBody;
