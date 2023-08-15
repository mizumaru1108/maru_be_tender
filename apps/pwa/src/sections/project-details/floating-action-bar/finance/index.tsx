import { Box, Grid, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
//
import { LoadingButton } from '@mui/lab';

function FinanceFloatingActionBar() {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { id: proposal_id } = useParams();

  const theme = useTheme();

  const [isSubmittingStepback, setIsSubmittingStepback] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Stack direction={{ sm: 'column', md: 'row' }} justifyContent="space-between">
          <Grid item md={2} xs={12}>
            <LoadingButton
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
              onClick={handleClick}
              loading={isSubmittingStepback}
            >
              {translate('partner_details.submit_amendment_request')}
            </LoadingButton>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem
                // disabled={true}
                onClick={() => {
                  navigate(`/finance/dashboard/amandement-request/${proposal_id}`);
                  handleClose();
                }}
              >
                {translate('proposal_amandement.button_label')}
              </MenuItem>
            </Menu>
          </Grid>
        </Stack>
      </Box>
    </>
  );
}

export default FinanceFloatingActionBar;
