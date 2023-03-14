// @mui
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import CardTableBE from 'components/card-table/CardTableBE';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// query
import { gettingPaymentAdjustment } from 'queries/project-supervisor/gettingPaymentAdjustment';

function IncomingCloseReports() {
  const { user } = useAuth();
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
    <Page title={translate('pages.common.close_report.text.heading_spv')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingPaymentAdjustment}
            title={translate('pages.common.close_report.text.heading_spv')}
            cardFooterButtonAction="show-project"
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
              filter1: {
                supervisor_id: { _eq: user?.id },
                inner_status: {
                  _in: ['DONE_BY_CASHIER'],
                },
              },
            }}
            destination={'incoming-close-reports'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingCloseReports;
