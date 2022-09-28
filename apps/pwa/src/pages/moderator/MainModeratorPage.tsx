// material
import { async } from '@firebase/util';
import { Container, styled } from '@mui/material';
import axios from 'axios';
// components
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import { useCallback, useEffect, useState } from 'react';
import { CardTable } from '../../components/card-table';
import { ProjectCardProps } from '../../components/card-table/types';
import { HASURA_ADMIN_SECRET, HASURA_GRAPHQL_URL } from '../../config';
import { CardTableIncomingSupportRequests } from './mock-data';

// -------------------------------------------------------------------------------

const INSIGHT_DATA = [
  { title: 'rejected_pojects', value: 2 },
  { title: 'acceptable_projects', value: 2 },
  { title: 'pending_projects', value: 2 },
  { title: 'incoming_new_projects', value: 4 },
  { title: 'total_number_of_projects', value: 10 },
];

// -------------------------------------------------------------------------------

function MainManagerPage() {
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET;
  const [incomingSupportRequests, setIncomingSupportRequests] = useState<ProjectCardProps[] | []>(
    []
  );

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));
  console.log('adskadkla');

  // create a function to get data from hasura using callback
  // const getData = useCallback(async () => {
  //   setIncomingSupportRequests([]);
  //   const queryData = {
  //     query: `
  //     query MyQuery {
  //       proposal(where: {proposal_assign: {assign: {_is_null: false}}}, order_by: {created_at: asc}) {
  //         created_at
  //         user {
  //           employee_name
  //         }
  //         id
  //         project_name
  //         proposal_assign {
  //           assign
  //         }
  //       }
  //     }
  //     `,
  //   };

  //   const headers = {
  //     headers: {
  //       'Content-Type': 'aplication/json',
  //       'x-hasura-admin-secret': `${secret}`,
  //     },
  //   };

  //   try {
  //     const res = await axios.post(path, queryData, headers);
  //     const data = res.data.data.proposal;
  //     const newData = data.map((v: any, index: number) => {
  //       return {
  //         title: {
  //           id: v.id,
  //         },
  //         content: {
  //           projectName: v.project_name,
  //           employee: v.user.employee_name,
  //           sentSection: v.proposal_assign[index].assign,
  //         },
  //         footer: {
  //           createdAt: v.created_at,
  //         },
  //       };
  //     });
  //     console.log('data :', data);
  //     console.log('newData :', newData);
  //     if (data.length > 0) {
  //       setIncomingSupportRequests(newData);
  //     }
  //     console.log('incomingSupportRequests :', incomingSupportRequests);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);
  // // create useEffect for fetch data using async function
  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <Page title="Manager Dashboard">
      <Container>
        <ContentStyle>
          <CardInsight
            headline="daily_stats"
            data={INSIGHT_DATA}
            cardContainerColumns={15}
            cardContainerSpacing={1}
            cardStyle={{ p: 2, bgcolor: 'white' }}
          />
          <CardTable
            data={CardTableIncomingSupportRequests} // For testing, later on we will send the query to it
            title="مسودة طلبات الدعم"
            pagination={false}
            limitShowCard={4}
            // alphabeticalOrder={true} // optional
            // filters={[filter]} // optional
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;
