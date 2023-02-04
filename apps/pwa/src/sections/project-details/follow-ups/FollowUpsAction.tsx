import { Typography, Stack } from '@mui/material';
import { IconButtonAnimate } from 'components/animate';
import Iconify from 'components/Iconify';
import React, { useState } from 'react';
import ActionPopup from './follow-ups-popups/ActionPopup';
import FilePopup from './follow-ups-popups/FilePopup';
import useLocales from '../../../hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL } from 'config';

function FollowUpsAction() {
  const { translate } = useLocales();

  const { activeRole } = useAuth();

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
      {activeRole !== 'tender_client' && (
        <>
          <Stack direction="row" gap={1}>
            <ActionPopup open={actoinOpen} handleClose={handleActionClose} />
            <FilePopup open={fileOpen} handleClose={handleFileClose} />
            {!FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL ? null : (
              <React.Fragment>
                <IconButtonAnimate
                  onClick={FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL ? handleActionOpen : undefined}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    ':hover': { backgroundColor: '#fff' },
                    borderRadius: '5px',
                  }}
                >
                  <Iconify icon="eva:edit-2-outline" />
                  <Typography sx={{ fontWeight: 700 }}>{translate('add_action')}</Typography>
                </IconButtonAnimate>
                <IconButtonAnimate
                  onClick={FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL ? handleActionOpen : undefined}
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
                  <Typography sx={{ fontWeight: 700 }}>{translate('upload_a_new_file')}</Typography>
                </IconButtonAnimate>
              </React.Fragment>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default FollowUpsAction;
