import { useEffect, useState } from 'react';
// material
import { Container, styled, Grid, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { CardInsight } from 'components/card-insight';
import { TableAMCustom } from 'components/table';
// hooks
import axios from 'axios';
import { HASURA_GRAPHQL_URL, HASURA_ADMIN_SECRET } from 'config';
// mock
// import { AM_NEW_REQUEST, AM_UPDATE_REQUEST } from './mock-data';
//
import { PATH_ACCOUNTS_MANAGER } from '../../routes/paths';
import { CardInsightProps } from 'components/card-insight/types';
import { IPropsTablesList } from 'components/table/type';

// -------------------------------------------------------------------------------

// const INSIGHT_DATA = [
//   { title: 'number_of_request', value: 57 },
//   { title: 'active_partners', value: 14 },
//   { title: 'rejected', value: 2 },
//   { title: 'suspended_partners', value: 1 },
// ];

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
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET || 'hbd4KbAS5XjHw5';

  const [cardInsightData, setCardInsightData] = useState<CardInsightProps | null>(null);
  const [newJoinRequestData, setNewJoinRequestData] = useState<IPropsTablesList[] | null>(null);

  const getClientInsightData = async () => {
    const queryData = {
      query: `
        query MyQuery {
          client_data_aggregate {
            aggregate {
              count
            }
          }
        }
      `,
    };

    const headers = {
      headers: {
        'Content-Type': 'aplication/json',
        'x-hasura-admin-secret': `${secret}`,
      },
    };

    await axios
      .post(`${path}`, queryData, headers)
      .then(({ data }) => {
        if (data.data) {
          const count = data?.data?.client_data_aggregate?.aggregate?.count;

          setCardInsightData({
            data: [
              { title: 'number_of_request', value: count },
              { title: 'active_partners', value: count },
              { title: 'rejected', value: count },
              { title: 'suspended_partners', value: count },
            ],
          });
        } else {
          console.log('errorResponse', data.errors);
        }
      })
      .catch((err) => console.log('error', err.message));
  };

  const getNewJoinRequestData = async () => {
    const queryData = {
      query: `
        query MyQuery {
          client_data {
            created_at
            email
            id
            ceo_mobile
            ceo_name
          }
        }
      `,
    };

    const headers = {
      headers: {
        'Content-Type': 'aplication/json',
        'x-hasura-admin-secret': `${secret}`,
      },
    };

    await axios
      .post(`${path}`, queryData, headers)
      .then(({ data }) => {
        if (data.data) {
          const clientData = data?.data?.client_data.map((v: any) => ({
            id: v.id,
            partner_name: v.ceo_name,
            createdAt: v.created_at,
            account_status: 'waiting',
            events: v.email,
          }));

          setNewJoinRequestData(clientData);
          console.log('errorResponse', data.errors);
        }
      })
      .catch((err) => console.log('error', err.message));
  };

  useEffect(() => {
    getClientInsightData();
    getNewJoinRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Account Manager Dashboard">
      <Container>
        <ContentStyle>
          {cardInsightData ? (
            <CardInsight headline="daily_stats" data={cardInsightData.data} />
          ) : (
            <Grid container direction="row" alignItems="center" spacing={{ xs: 2, md: 4 }}>
              {[...Array(4)].map((item, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Skeleton variant="rectangular" sx={{ height: 135, borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          )}
          {newJoinRequestData ? (
            <TableAMCustom
              data={newJoinRequestData}
              headline="new_join_request"
              view_all={PATH_ACCOUNTS_MANAGER.newJoinRequest}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {newJoinRequestData ? (
            <TableAMCustom
              data={newJoinRequestData}
              headline="info_update_request"
              view_all={PATH_ACCOUNTS_MANAGER.infoUpdateRequest}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;
