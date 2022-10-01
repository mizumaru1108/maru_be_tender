import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { filterInterface, ProjectCardProps } from '../../../components/card-table/types';
import useLocales from '../../../hooks/useLocales';
import { incomingRequest } from '../../../queries/Moderator/supportRequest';

function IncomingSupportRequests() {
  const [supportRequest, setSupportRequest] = useState<ProjectCardProps[]>([]);
  const { currentLang, translate } = useLocales();
  const [incoming, fetchIncoming] = useQuery({
    query: incomingRequest,
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
        value: 'filter',
      },
    ],
  };

  useEffect(() => {
    const previousSupport: ProjectCardProps[] = [];
    if (incomingData) {
      // map incomingData then push to previousSupport with const function
      const prev = incomingData.proposal.map((item: any) => ({
        title: {
          id: item.id,
        },
        content: {
          projectName: item.project_name,
          employee: item.user.employee_name,
          sentSection: item.state,
        },
        footer: {
          createdAt: item.created_at,
        },
        cardFooterButtonAction: 'show-details',
      }));
      previousSupport.push(...prev);
      setSupportRequest(previousSupport);
      console.log('hasil set state : ', previousSupport);
    }
  }, [incomingData]);

  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={supportRequest} // For testing, later on we will send the query to it
            title={translate('incoming_support_requests')}
            alphabeticalOrder={true} // optional
            filters={[filter]} // optional
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingSupportRequests;
