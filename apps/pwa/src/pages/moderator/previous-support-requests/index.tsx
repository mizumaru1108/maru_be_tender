import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { filterInterface, ProjectCardProps } from '../../../components/card-table/types';
import { HASURA_ADMIN_SECRET, HASURA_GRAPHQL_URL } from '../../../config';
import { previousRequest } from '../../../queries/Moderator/supportRequest';
import { CardTablePreviousSupportRequests } from '../mock-data';

function PreviousSupportRequests() {
  const [supportRequests, setSupportRequests] = useState<ProjectCardProps[]>([]);

  const [incoming, fetchIncoming] = useQuery({
    query: previousRequest,
  });

  const { data: incomingData, fetching: fetchingIncoming, error: errorIncoming } = incoming;

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  const filter: filterInterface = {
    name: 'filter',
    options: [
      {
        label: 'filter',
        value: 'a to z',
      },
    ],
  };

  useEffect(() => {
    const previousSupport = [];
    if (incomingData) {
      const prev = incomingData.proposal.map((item: any) => ({
        title: {
          id: item.id,
          inquiryStatus:
            item.outter_status.toLowerCase() === 'ongoing'
              ? 'completed'
              : item.outter_status.toLowerCase(),
        },
        content: {
          projectName: item.project_name,
          employee: item.user.employee_name,
          sentSection: item.state,
        },
        footer: {
          createdAt: item.created_at,
        },
      })) as ProjectCardProps[];
      previousSupport.push(...prev);
      setSupportRequests(previousSupport);
      console.log('hasil set state : ', previousSupport);
    }
  }, [incomingData]);

  return (
    <Page title="Previous Support Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={supportRequests} // For testing, later on we will send the query to it
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
