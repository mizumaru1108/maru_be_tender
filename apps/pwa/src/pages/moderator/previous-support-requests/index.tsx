import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { useEffect, useState } from 'react';
import { filterInterface, ProjectCardProps } from '../../../components/card-table/types';
import { HASURA_ADMIN_SECRET, HASURA_GRAPHQL_URL } from '../../../config';
import { CardTablePreviousSupportRequests } from '../mock-data';

function PreviousSupportRequests() {
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
    gap: 20,
  }));

  const fetchProjectList = async () => {
    const queryData = {
      query: `
      query MyQuery {
        proposal {
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

  const filter: filterInterface = {
    name: 'filter',
    options: [
      {
        label: 'filter',
        value: 'a to z',
      },
    ],
  };

  return (
    <Page title="Previous Support Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={incomingSupportRequests} // For testing, later on we will send the query to it
            title="طلبات الدعم السابقة"
            filters={[filter]} // optional
            dateFilter={true}
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-project"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
