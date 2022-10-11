import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { IFilterMessage } from '../type';

type Props = {
  open: boolean;
  handleClose: () => void;
  filters?: IFilterMessage[];
};

function FilterModalMessage({ open, handleClose, filters }: Props) {
  const [selected, setSelected] = useState('');
  const handleChange = (event: any) => {
    // console.log(event.target.value);
    setSelected(event.target.value as string);
  };
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '52%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#fff',
    border: '2px solid #000',
    p: 4,
    h: '1000px',
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" gap={4}>
            <Typography>فلتر</Typography>
            {filters?.map((item, index) => (
              // <TextField fullWidth select label={item.name} key={index}>
              //   {item.options.map((option, optionIndex) => (
              //     <option key={optionIndex} value={option.label} style={{ padding: 1 }}>
              //       {option.label} - {option.Role}
              //     </option>
              //   ))}
              // </TextField>
              <TextField
                key={index}
                label={item.name}
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: true }}
                select
                fullWidth
                value={selected}
                onChange={handleChange}
              >
                {item.options.map((option, index) => (
                  <option key={index} value={option.value} style={{ backgroundColor: '#fff' }}>
                    {option.label} {option.Role !== undefined && `- ${option.Role}`}
                  </option>
                ))}
              </TextField>
            ))}

            <Stack direction="row" justifyContent="center">
              <Button onClick={handleClose}>رجوع</Button>
              <Button onClick={handleClose}>تأكيد</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default FilterModalMessage;
