import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton, Stack, Typography } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import {
  getEditRequestProfileList,
  tableInfoUpdateRequest,
} from 'queries/account_manager/clientNewRequest';
import useAuth from 'hooks/useAuth';
//
import { IPropsTablesList } from 'components/table/type';
import axiosInstance from '../../../utils/axios';
// import useLocales from '../../../hooks/useLocales';
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
    query: getEditRequestProfileList,
  });

  const {
    data: resultInfoUpdate,
    fetching: fetchingInfoUpdate,
    error: errorNewInfoUpdate,
  } = resultInfoUpdateQuery;

  // const fetchingEditRequestList = async () => {
  //   try {
  //     const rest = await axiosInstance.get('tender/client/edit-request/list', {
  //       headers: { 'x-hasura-role': activeRole! },
  //     });
  //     // console.log({ rest });
  //     if (rest.data) {
  //       setInfoUpdateRequest(rest.data.data);
  //       setLoading(false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    setLoading(true);
    // fetchingEditRequestList();
    if (resultInfoUpdate) {
      const newEditRequestList = resultInfoUpdate?.edit_requests.map((item: any) => {
        const vcd = item;
        return {
          id: vcd.id,
          partner_name: vcd.user.client_data.entity,
          createdAt: vcd.created_at,
          status_id: vcd.status_id,
        };
      });
      setInfoUpdateRequest(newEditRequestList);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultInfoUpdate]);

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
          {/* {!infoUpdateRequest && !loading && (
            <Stack textAlign="center">
              <Typography variant="h5">لا توجد بيانات إدخال ...</Typography>
            </Stack>
          )} */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;
