import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { gettingPreviousRequests } from 'queries/Moderator/gettingPreviousRequests';
import CardTableByBE from '../../../components/card-table/CardTableByBE';

function PreviousSupportRequests() {
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
    // <Page title="Previous Support Requests | Moderator">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingPreviousRequests}
            title={translate('previous_support_requests')}
            cardFooterButtonAction="show-project"
            destination="previous-funding-requests"
            dateFilter={true}
            filters={[
              {
                name: 'status',
                title: 'الرجاء اختيار حالة المشروع',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'معلقة', value: 'PENDING' },
                  { label: 'مكتملة', value: 'COMPLETED' },
                  { label: 'ملغاة', value: 'CANCELED' },
                ],
                generate_filter: (value: string) => ({
                  outter_status: { _eq: value },
                }),
              },
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
            // baseFilters={{
            //   outter_status: { outter_status: { _neq: 'ONGOING' } },
            // }}
            baseFilters={{
              filter1: {
                inner_status: { _nin: ['CREATED_BY_CLIENT'] },
              },
            }}
          /> */}
          <CardTableByBE
            title={translate('previous_support_requests')}
            endPoint="tender-proposal/previous"
            destination="previous-funding-requests"
            limitShowCard={6}
            cardFooterButtonAction="show-project"
            sorting={[
              'sorting',
              'project_name',
              'project_status',
              'range_date',
              'client_name',
              'track',
            ]}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
