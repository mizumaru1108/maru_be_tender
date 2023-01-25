import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton, Stack, Typography } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import { tableInfoUpdateRequest } from 'queries/account_manager/clientNewRequest';
import useAuth from 'hooks/useAuth';
//
import { IPropsTablesList } from 'components/table/type';
import axiosInstance from '../../../utils/axios';
import useLocales from '../../../hooks/useLocales';
import { useNavigate } from 'react-router';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// -------------------------------------------------------------------------------

function InfoUpdateRequestPage() {
  const [infoUpdateRequest, setInfoUpdateRequest] = useState<IPropsTablesList[] | null>(null);
  const { user, activeRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [resultInfoUpdateQuery, reexecuteInfoUpdateRequest] = useQuery({
    query: tableInfoUpdateRequest,
  });

  const {
    data: resultInfoUpdate,
    fetching: fetchingInfoUpdate,
    error: errorNewInfoUpdate,
  } = resultInfoUpdateQuery;

  const fetchingEditRequestList = async () => {
    try {
      const rest = await axiosInstance.get('tender/client/edit-request/list', {
        headers: { 'x-hasura-role': activeRole! },
      });
      console.log({ rest });
      if (rest.data) {
        setInfoUpdateRequest(rest.data.data);
        setLoading(false);
      }
      // navigate('/client/my-profile');
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchingEditRequestList();
    // if (resultInfoUpdate) {
    //   const resultDataInfoUpdate = resultInfoUpdate?.user?.map((vcl: any) => {
    //     const vcd = vcl.client_data;
    //     return {
    //       id: vcd.id,
    //       partner_name: vcd.client_data.entity,
    //       createdAt: vcd.client_data.created_at,
    //       account_status: 'REVISED_ACCOUNT',
    //       events: vcd.id,
    //       update_status: true,
    //     };
    //   });
    //   console.log({ resultDataInfoUpdate });
    //   setInfoUpdateRequest(resultDataInfoUpdate);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Information Update Request">
      <Container>
        <ContentStyle>
          {loading && <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />}
          {infoUpdateRequest && (
            <TableAMCustom
              editRequest={true}
              data={infoUpdateRequest}
              headline="account_manager.heading.info_update_request"
            />
          )}
          {!infoUpdateRequest && !loading && (
            <Stack textAlign="center">
              <Typography variant="h5">لا توجد بيانات إدخال ...</Typography>
            </Stack>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;
