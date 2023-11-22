import { useEffect, useState } from 'react';
// material
import { Container, styled, Grid, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { CardInsight } from 'components/card-insight';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import {
  numberOfRequests,
  activePartners,
  rejectedPartners,
  suspendedPartners,
} from 'queries/account_manager/statistic';
import {
  tableNewRequest,
  getEditRequestProfileList,
} from 'queries/account_manager/clientNewRequest';
//
import { PATH_ACCOUNTS_MANAGER } from '../../routes/paths';
import { CardInsightProps } from 'components/card-insight/types';
import { IPropsTablesList } from 'components/table/type';
import useLocales from '../../hooks/useLocales';

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

function MainManagerPage() {
  const { user } = useAuth();
  const { translate } = useLocales();

  const [cardInsightData, setCardInsightData] = useState<CardInsightProps | null>(null);
  const [newJoinRequestData, setNewJoinRequestData] = useState<IPropsTablesList[] | null>(null);
  const [infoUpdateRequest, setInfoUpdateRequest] = useState<IPropsTablesList[] | null>(null);

  // Statistic Data
  const [resultNumberRequest, reexecuteQueryNumber] = useQuery({
    query: numberOfRequests,
  });

  const [activePartnersQuery, reexecuteActivePartners] = useQuery({
    query: activePartners,
  });

  const [rejectedPartnersQuery, reexecuteRejectedPartners] = useQuery({
    query: rejectedPartners,
  });

  const [suspendedPartnersQuery, reexecuteSuspendedPartners] = useQuery({
    query: suspendedPartners,
  });

  const {
    data: numberOfRequestData,
    fetching: fetchingNumberRequest,
    error: errorNumberRequest,
  } = resultNumberRequest;
  const {
    data: activePartnerData,
    fetching: fetchingActivePartner,
    error: errorActivePartner,
  } = activePartnersQuery;
  const {
    data: rejectedPartnerData,
    fetching: fetchingRejectedPartner,
    error: errorRejectedPartner,
  } = rejectedPartnersQuery;
  const {
    data: suspendedPartnerData,
    fetching: fetchingSuspendedPartner,
    error: errorSuspenedPartner,
  } = suspendedPartnersQuery;

  // Table New Request
  const [resultNewRequestQuery, reexecuteTableNewRequest] = useQuery({
    query: tableNewRequest,
  });

  const [resultInfoUpdateQuery, reexecuteInfoUpdateRequest] = useQuery({
    query: getEditRequestProfileList,
  });

  const {
    data: resultNewRequest,
    fetching: fetchingNewRequest,
    error: errorNewRequest,
  } = resultNewRequestQuery;

  const {
    data: resultInfoUpdate,
    fetching: fetchingInfoUpdate,
    error: errorNewInfoUpdate,
  } = resultInfoUpdateQuery;

  useEffect(() => {
    const newDataInsight: CardInsightProps = {
      data: [],
    };

    // done
    if (numberOfRequestData) {
      newDataInsight.data.push({
        title: 'account_manager.card.number_of_request',
        value: numberOfRequestData?.user_aggregate?.aggregate?.count,
        redirect_link: '/accounts-manager/dashboard/new/join-request',
      });
    }

    // done
    if (activePartnerData) {
      newDataInsight.data.push({
        title: 'account_manager.card.active_partners',
        value: activePartnerData?.user_aggregate?.aggregate?.count,
        redirect_link: '/accounts-manager/dashboard/partner/management',
      });
    }

    // done
    if (rejectedPartnerData) {
      newDataInsight.data.push({
        title: 'account_manager.card.rejected_partners',
        value: rejectedPartnerData?.user_aggregate?.aggregate?.count,
        redirect_link: '/accounts-manager/dashboard/partner/management',
      });
    }

    // done
    if (suspendedPartnerData) {
      newDataInsight.data.push({
        title: 'account_manager.card.suspended_partners',
        value: suspendedPartnerData?.user_aggregate?.aggregate?.count,
        redirect_link: '/accounts-manager/dashboard/partner/management',
      });
    }

    if (newDataInsight && newDataInsight.data.length) {
      setCardInsightData(newDataInsight);
    }

    if (resultNewRequest && resultNewRequest?.user && resultNewRequest?.user.length > 0) {
      const resultDataNR = resultNewRequest?.user.map((v: any) => ({
        id: v.id,
        partner_name:
          v && v.client_data && v.client_data.entity ? v.client_data.entity : '-No Data-',
        createdAt: v.client_data.created_at,
        account_status: 'WAITING_FOR_ACTIVATION',
        events: v.id,
        email: v.email,
      }));

      setNewJoinRequestData(resultDataNR);
    }

    if (resultInfoUpdate) {
      const newEditRequestList = resultInfoUpdate?.edit_requests
        .filter((item: any) => item.status_id !== 'APPROVED')
        .map((item: any) => {
          const vcd = item;
          let tmpName = '';
          if (vcd && vcd.user && vcd.user.client_data && !!vcd.user.client_data.entity) {
            tmpName = vcd.user.client_data.entity;
          } else {
            tmpName = '-No Data-';
          }
          return {
            id: vcd.id,
            partner_name: tmpName,
            createdAt: vcd.created_at,
            status_id: vcd.status_id,
          };
        });
      setInfoUpdateRequest(newEditRequestList);
    }
  }, [
    activePartnerData,
    numberOfRequestData,
    rejectedPartnerData,
    resultInfoUpdate,
    resultNewRequest,
    suspendedPartnerData,
  ]);

  return (
    <Page title={translate('pages.account_manager.main')}>
      <Container>
        <ContentStyle>
          {fetchingNumberRequest &&
            fetchingActivePartner &&
            fetchingRejectedPartner &&
            fetchingSuspendedPartner && (
              <Grid container direction="row" alignItems="center" spacing={{ xs: 2, md: 4 }}>
                {[...Array(4)].map((item, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Skeleton variant="rectangular" sx={{ height: 135, borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            )}
          {cardInsightData && (
            <CardInsight
              headline="account_manager.heading.daily_stats"
              cardItemXsBreakpoints={12}
              cardItemSmBreakpoints={6}
              cardItemMdBreakpoints={3}
              data={cardInsightData.data}
            />
          )}

          {fetchingNewRequest && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {newJoinRequestData && (
            <TableAMCustom
              data={newJoinRequestData}
              headline="account_manager.heading.new_join_request"
              view_all={PATH_ACCOUNTS_MANAGER.newJoinRequest}
            />
          )}

          {fetchingInfoUpdate && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {infoUpdateRequest && (
            <TableAMCustom
              editRequest={true}
              data={infoUpdateRequest}
              headline="account_manager.heading.info_update_request"
              view_all={PATH_ACCOUNTS_MANAGER.infoUpdateRequest}
            />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;
