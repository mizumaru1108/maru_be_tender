import { useEffect, useState } from 'react';
// material
import { Box, Container, Divider, Skeleton, styled, Typography, useTheme } from '@mui/material';
// components
import Page from 'components/Page';
// sections
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
//
import { IEditedValues } from '../../../@types/client_data';
import EditedRequestStatus from '../../../sections/account_manager/edit-request-profile/EditedRequestStatus';
import EditRequestTabs from '../../../sections/account_manager/EditRequestTabs';
import axiosInstance from '../../../utils/axios';
import ActionButtonEditRequest from '../../../sections/account_manager/edit-request-profile/ActionButtonEditRequest';
import RejectedEditRequestPopUp from '../../../sections/account_manager/edit-request-profile/RejectedEditRequestPopUp';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

interface ITmpValues {
  old_data: IEditedValues;
  new_data: IEditedValues;
  difference: IEditedValues;
}

// -------------------------------------------------------------------------------

function AccountPartnerDetails() {
  const { user, activeRole } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //tmp for old & new values edit
  const [tmpEditValues, setTmpEditValues] = useState<ITmpValues | null>(null);

  // Routes
  const params = useParams();
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();

  //For status edit request
  const EditStatus = params.editStatus as string;

  const fetchingData = async () => {
    try {
      const rest = await axiosInstance.get(
        `/tender/client/edit-request/find?requestId=${params.requestId as string}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        setTmpEditValues((prev: any) => ({
          ...prev,
          old_data: rest.data.data.old_data,
          new_data: rest.data.data.new_data,
          difference: rest.data.data.diffrence,
        }));
        // console.log({ rest });
        setLoading(false);
      } else {
        alert('Something went wrong');
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // const newId = params.partnerId as string;
    fetchingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Partner Details">
      <Container>
        <ContentStyle sx={{ alignItems: 'center' }}>
          <EditedRequestStatus EditStatus={EditStatus} />
          {loading && <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />}
          {!loading && !!tmpEditValues && (
            <>
              <Divider />
              <EditRequestTabs EditValues={tmpEditValues} />
              {EditStatus === 'PENDING' && (
                <ActionButtonEditRequest
                  EditStatus={EditStatus}
                  setOpen={() => {
                    setOpen(true);
                  }}
                />
              )}
            </>
          )}

          <RejectedEditRequestPopUp
            requestId={params.requestId ?? '-'}
            open={open}
            handleClose={() => setOpen(false)}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AccountPartnerDetails;
