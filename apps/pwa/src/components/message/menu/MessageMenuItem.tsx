import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from '../../Iconify';
import { IMessageMenuItem } from '../type';

type IroomId = {
  data: {
    id: string;
  }[];
};

export default function MessageMenuItem({ data, getRoomId }: IMessageMenuItem) {
  const [focusedIndex, setFocusedIndex] = useState<number | undefined>(undefined);
  const [id, setId] = useState('');

  const getId = (roomId: string) => {
    const a: IroomId = { data: [] };
    a.data.push({ id: roomId });
    // setId(a.data[0].id);
    getRoomId(a.data[0].id);
  };

  return (
    <>
      {data.map((item, index) => (
        <Stack
          direction="row"
          spacing={1}
          key={index}
          sx={{
            padding: 2,
            color: '#000',
            backgroundColor: focusedIndex === index ? '#fff' : undefined,

            // set on hover to change color, give delay 0.5s
            '&:hover': {
              cursor: 'pointer',
              // only if focusedIndex is not equal to index
              ...(focusedIndex !== index && {
                //set transition when mouse hover
                transition: 'all 0.5s',
                color: '#000',
                // background color gradient darker than #fff
                backgroundColor: '#fff',
              }),
            },
          }} // on hover
          onClick={() => {
            setFocusedIndex(index);
            getId(item.roomId);
          }}
        >
          <Stack>
            <Iconify
              icon={'codicon:account'}
              color="#000"
              sx={{
                width: '32px',
                height: '32px',
              }}
            />
          </Stack>
          <Stack
            direction="column"
            sx={{
              '& .MuiStack-root': {
                gap: '9px',
              },
            }}
          >
            <Typography
              sx={{
                height: '26px',
                fontSize: '14px',
                bottopPadding: '3px',
              }}
            >
              {item.partnerName} - {item.projectName}
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                lineHeight: '24px',
                bottopPadding: '8px',
              }}
            >
              {item.message}
            </Typography>

            <Typography
              sx={{
                fontSize: '10px',
                color: '#8E8E8E',
                bottopPadding: '8px',
                height: '19px',
              }}
            >
              {new Date(item.footer).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </>
  );
}
