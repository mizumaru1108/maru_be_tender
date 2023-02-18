import { useState, useEffect } from 'react';
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

  const role = activeRole!;

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
        dispatch(getProposal(id as string, role as string));
        enqueueSnackbar(translate('content.client.main_page.delete_success'), {
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

  useEffect(() => {
    if (checkedItems.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [checkedItems]);

  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12} display="flex" justifyContent="space-between">
        <Grid>
          <Typography variant="h6">
            {translate('content.client.main_page.project_followups')}
          </Typography>
        </Grid>
        <Grid>
          {(role === 'tender_ceo' || role === 'tender_project_manager') &&
            FEATURE_FOLLOW_UP_INTERNAL_EXTERNAL && (
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
                onClick={() => handleDelFollowUps()}
              >
                {translate('table_actions.delete_button_label').toUpperCase()}
              </LoadingButton>
            )}
        </Grid>
      </Grid>
      <Grid item md={12} xs={12}>
        {role === 'tender_client' ? <ClientFollowUpsPage /> : <EmployeeFollowUpsPage />}
      </Grid>
    </Grid>
  );
}

export default FollowUps;
