import { Typography, Stack } from '@mui/material';
import { IconButtonAnimate } from 'components/animate';
import Iconify from 'components/Iconify';
import { useState } from 'react';
import ActionPopup from './follow-ups-popups/ActionPopup';
import FilePopup from './follow-ups-popups/FilePopup';

function FollowUpsAction() {
  const [actoinOpen, setActionOpen] = useState(false);

  const [fileOpen, setFileOpen] = useState(false);

  const handleActionClose = () => {
    setActionOpen(false);
  };

  const handleActionOpen = () => {
    setActionOpen(true);
  };

  const handleFileClose = () => {
    setFileOpen(false);
  };

  const handleFileOpen = () => {
    setFileOpen(true);
  };

  return (
    <Stack direction="row" gap={1}>
      <ActionPopup open={actoinOpen} handleClose={handleActionClose} />
      <FilePopup open={fileOpen} handleClose={handleFileClose} />
      <IconButtonAnimate
        onClick={handleActionOpen}
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          ':hover': { backgroundColor: '#fff' },
          borderRadius: '5px',
        }}
      >
        <Iconify icon="eva:edit-2-outline" />
        <Typography sx={{ fontWeight: 700 }}>إضافة إجراء</Typography>
      </IconButtonAnimate>
      <IconButtonAnimate
        onClick={handleFileOpen}
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          ':hover': { backgroundColor: '#fff' },
          borderRadius: '5px',
          border: '0.5px dashed',
          borderColor: 'gray',
        }}
      >
        <img src="/icons/add-action-follow-up-icon.svg" alt="" />
        <Typography sx={{ fontWeight: 700 }}>رفع ملف جديد</Typography>
      </IconButtonAnimate>
    </Stack>
  );
}

export default FollowUpsAction;
