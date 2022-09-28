import { Box, Button, Grid, Modal, Stack, TextField, Typography } from '@mui/material';

type Props = {
  open: boolean;
  handleClose: () => void;
};

function AddAuthorityModal({ open, handleClose }: Props) {
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
            <Typography variant="h4">اضافة جهة مشرفة جديدة</Typography>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="التصنيف"
                  placeholder="الرجاء كتابة اسم التصنيف"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="إضافي"
                  placeholder="الرجاء كتابة الإضافي"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="center">
              <Button onClick={handleClose}>رجوع</Button>
              <Button onClick={handleClose} sx={{ backgroundColor: '#0E8478', color: '#fff' }}>
                إنشاء
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default AddAuthorityModal;
