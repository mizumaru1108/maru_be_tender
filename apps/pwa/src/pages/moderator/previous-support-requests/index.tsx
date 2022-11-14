import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { gettingPreviousRequests } from 'queries/Moderator/gettingPreviousRequests';

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
    <Page title="Previous Support Requests | Moderator">
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingPreviousRequests}
            title={'طلبات الدعم السابقة'}
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
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
