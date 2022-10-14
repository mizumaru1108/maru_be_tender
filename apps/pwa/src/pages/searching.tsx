import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import { filterInterface, ProjectCardProps } from 'components/card-table/types';
import Page from 'components/Page';
import { previousRequest } from 'queries/Moderator/supportRequest';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { CardTableSearching } from '../components/card-table';

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
    <Page title="Searching Page">
      <Container>
        <ContentStyle>
          <CardTableSearching
            data={supportRequests} // For testing, later on we will send the query to it
            title="نتيجة البحث"
            // dateFilter={true}
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-project"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
