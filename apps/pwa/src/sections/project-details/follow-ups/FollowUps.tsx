import { useState } from 'react';
import { useParams } from 'react-router';
import { Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import ClientFollowUpsPage from './ClientFollowUpsPage';
import EmployeeFollowUpsPage from './EmployeeFollowUpsPage';
import useLocales from 'hooks/useLocales';
import { LoadingButton } from '@mui/lab';
import axiosInstance from 'utils/axios';
import { getProposal, setCheckedItems } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import { useSnackbar } from 'notistack';
import { FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL } from 'config';

function FollowUps() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeRole } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { checkedItems } = useSelector((state) => state.proposal);

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleDelFollowUps = async () => {
    try {
      setLoading(true);
      setDisabled(true);
      const response = await axiosInstance.patch(
        `tender-proposal/follow-up/delete`,
        {
          id: checkedItems,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (response) {
        dispatch(setCheckedItems([]));
        dispatch(getProposal(id as string));
        enqueueSnackbar('delete success', {
          variant: 'success',
        });
        setLoading(false);
        setDisabled(false);
      }
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      return error;
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12} display="flex" justifyContent="space-between">
        <Grid>
          <Typography variant="h6">
            {translate('content.client.main_page.project_followups')}
          </Typography>
        </Grid>
        <Grid>
          {activeRole === 'tender_ceo' && (
            <LoadingButton
              loading={loading}
              disabled={disabled}
              sx={{
                background: disabled ? '#ddd' : 'red',
                color: '#fff',
                py: 1.5,
                px: 4,
                ':hover': { backgroundColor: 'darkred' },
              }}
              onClick={FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL ? () => handleDelFollowUps() : undefined}
            >
              DELETE
            </LoadingButton>
          )}
        </Grid>
      </Grid>
      <Grid item md={12} xs={12}>
        {activeRole === 'tender_client' ? <ClientFollowUpsPage /> : <EmployeeFollowUpsPage />}
      </Grid>
    </Grid>
  );
}

export default FollowUps;
