import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';

function FilterModal({ open, handleClose }: any) {
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
            <TextField select label="اسم الجهة المشرفة*">
              <option>test</option>
            </TextField>
            <TextField select label="حالة المشروع*">
              <option>test</option>
            </TextField>
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
