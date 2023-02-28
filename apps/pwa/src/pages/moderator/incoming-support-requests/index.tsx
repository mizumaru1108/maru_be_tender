import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import Page from 'components/Page';
import { gettingIncomingRequests } from 'queries/Moderator/gettingIncomingRequests';
import { useState } from 'react';
import { ProjectCardProps } from '../../../components/card-table/types';
import useLocales from '../../../hooks/useLocales';

function IncomingSupportRequests() {
  const { translate } = useLocales();

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    // <Page title="Incoming Support Requests | Moderator">
    <Page title={translate('pages.common.incoming_funding_requests')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingIncomingRequests}
            title={translate('incoming_support_requests')}
            cardFooterButtonAction="show-details"
            destination="requests-in-process"
            alphabeticalOrder={true}
            filters={[
              {
                name: 'entity',
                title: 'اسم الجهة المشرفة',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'اسم المستخدم الأول', value: 'Essam Kayal' },
                  { label: 'اسم المستخدم الثاني', value: 'hisham' },
                  { label: 'اسم المستخدم الثالت', value: 'danang' },
                  { label: 'اسم المستخدم الرابع', value: 'yamen' },
                  { label: 'اسم المستخدم الخامس', value: 'hamdi' },
                ],
                generate_filter: (value: string) => ({
                  user: { client_data: { entity: { _eq: value } } },
                }),
              },
            ]}
            baseFilters={{
              project_state: { state: { _in: ['MODERATOR'] } },
              outter_status: { outter_status: { _in: ['PENDING', 'ONGOING'] } },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingSupportRequests;
