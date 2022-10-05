// material
import { Container, styled } from '@mui/material';
// components
import { CardInsight } from 'components/card-insight';
import Page from 'components/Page';
import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { CardInsightProps } from '../../components/card-insight/types';
import { CardTable } from '../../components/card-table';
import { ProjectCardProps } from '../../components/card-table/types';
import useLocales from '../../hooks/useLocales';
import {
  acceptableRequest,
  incomingNewRequest,
  pendingRequest,
  rejectedRequest,
  totalRequest,
} from '../../queries/Moderator/stactic';
import { incomingRequest } from '../../queries/Moderator/supportRequest';

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
  const [supportRequest, setSupportRequest] = useState<ProjectCardProps[]>([]);
  const [cardInsightData, setCardInsightData] = useState<CardInsightProps>();

  const { currentLang, translate } = useLocales();

  // graphql for statistic data
  const [acc, reexecuteAcc] = useQuery({
    query: acceptableRequest,
  });
  const [rejected, reexecuteRejected] = useQuery({
    query: rejectedRequest,
  });
  const [incomingNew, reexecuteIncomingNew] = useQuery({
    query: incomingNewRequest,
  });
  const [pending, reexecutePending] = useQuery({
    query: pendingRequest,
  });
  const [total, reexecuteTotal] = useQuery({
    query: totalRequest,
  });

  const { data: countAcc, fetching: fetchingAcc, error: errorAcc } = acc;
  const { data: countRejected, fetching: fetchingRejected, error: errorRejected } = rejected;
  const {
    data: countIncomingNew,
    fetching: fetchingIncomingNew,
    error: errorIncomingNew,
  } = incomingNew;
  const { data: countPending, fetching: fetchingPending, error: errorPending } = pending;
  const { data: countTotal, fetching: fetchingTotal, error: errorTotal } = total;

  // graphql for fetching all incoming request
  const [incoming, fetchIncoming] = useQuery({
    query: incomingRequest,
  });

  const { data: incomingData, fetching: incomingFetching, error: incomingError } = incoming;

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));
  console.log('adskadkla');

  useEffect(() => {
    const previousSupport: ProjectCardProps[] = [];
    const newCard: CardInsightProps = {
      data: [],
    };
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
    }
    if (countAcc && countRejected && countIncomingNew && countPending && countTotal) {
      newCard.data.push(
        {
          title: translate('acceptable_projects'),
          value: countAcc?.proposal_aggregate?.aggregate?.count,
        },
        {
          title: translate('rejected_projects'),
          value: countRejected?.proposal_aggregate?.aggregate?.count,
        },
        {
          title: translate('incoming_new_projects'),
          value: countIncomingNew?.proposal_aggregate?.aggregate?.count,
        },
        {
          title: translate('pending_projects'),
          value: countPending.proposal_aggregate.aggregate.count,
        },
        {
          title: translate('total_number_of_projects'),
          value: countTotal?.proposal_aggregate?.aggregate?.count,
        }
      );
      setCardInsightData(newCard);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingData, countAcc, countRejected, countIncomingNew, countPending, countTotal]);

  return (
    <Page title="Moderator Dashboard">
      <Container>
        <ContentStyle>
          {cardInsightData && (
            <CardInsight
              headline={translate('daily_stats')}
              data={cardInsightData.data}
              cardContainerColumns={15}
              cardContainerSpacing={1}
              cardStyle={{ p: 2, bgcolor: 'white' }}
            />
          )}
          <CardTable
            data={supportRequest} // For testing, later on we will send the query to it
            title={translate('incoming_support_requests')}
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
