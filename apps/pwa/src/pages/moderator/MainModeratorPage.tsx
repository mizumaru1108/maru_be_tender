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

// -------------------------------------------------------------------------------

function MainManagerPage() {
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET;
  const [incomingSupportRequests, setIncomingSupportRequests] = useState<ProjectCardProps[]>([]);
  const incoming: ProjectCardProps[] = [];

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));
  console.log('adskadkla');

  const fetchProjectList = async () => {
    const queryData = {
      query: `
      query MyQuery {
        proposal(where: {state: {_eq: MODERATOR}}) {
          id
          created_at
          project_name
          user {
            employee_name
          }
          state
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

    try {
      const response = await axios.post(`${path}`, queryData, headers);
      const { data } = response.data.data;
      console.log('Data : ', data);
      // map data to ProjectCardProps without arrow function
      const newData = data.proposal.map(function (item: any) {
        return {
          title: {
            id: item.id,
          },
          content: {
            projectName: item.project_name,
            employee: item.user.employee_name,
            sentSection: item.state,
          },
          footer: {
            createAt: item.created_at,
          },
        };
      }) as ProjectCardProps[];
      incoming.push(...newData);
      setIncomingSupportRequests(incoming);
      console.log('Incoming : ', incoming);
    } catch (err) {
      console.log('Error:  ', err);
    }
  };

  useEffect(() => {
    fetchProjectList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            data={incomingSupportRequests} // For testing, later on we will send the query to it
            title="طلبات الدعم السابقة"
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
