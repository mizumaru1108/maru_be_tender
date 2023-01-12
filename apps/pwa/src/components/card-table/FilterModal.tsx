import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { filterInterface } from './types';
import useLocales from 'hooks/useLocales';

type Props = {
  open: boolean;
  handleClose: () => void;
  filters?: filterInterface[];
};

function FilterModal({ open, handleClose, filters }: Props) {
  const { translate } = useLocales();
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
            <Typography>{translate('commons.filter_button_label')}</Typography>
            {filters?.map((item, index) => (
              <TextField select label={item.name} key={index}>
                {item.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option.label}>
                    {option.label}
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

export default FilterModal;
