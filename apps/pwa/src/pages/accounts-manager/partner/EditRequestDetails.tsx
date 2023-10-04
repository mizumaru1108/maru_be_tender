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

function EditRequestDetails() {
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
        const tmpOldData: IEditedValues = rest.data.data.old_data;
        const tmpNewData: IEditedValues = rest.data.data.new_data;
        const tmpDiffrence: IEditedValues = rest.data.data.diffrence;
        const tmpEntityMobileNewData =
          !tmpNewData.entity_mobile && tmpOldData.entity_mobile
            ? tmpOldData.entity_mobile
            : tmpNewData.entity_mobile;
        const tmpRegionOldData = tmpOldData.region_detail?.name
          ? tmpOldData.region_detail?.name
          : tmpOldData.region;
        // console.log('test', tmpEntityMobileNewData);
        setTmpEditValues((prev: any) => ({
          ...prev,
          old_data: { ...tmpOldData, region: tmpRegionOldData },
          new_data: {
            ...tmpNewData,
            entity_mobile: tmpEntityMobileNewData,
          },
          difference: tmpDiffrence,
        }));
        // console.log({ rest });
      }
    } catch (err) {
      // handle error fetching
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
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
    // <Page title="Partner Details">
    <Page title={translate('pages.account_manager.edit_request_details')}>
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

export default EditRequestDetails;
