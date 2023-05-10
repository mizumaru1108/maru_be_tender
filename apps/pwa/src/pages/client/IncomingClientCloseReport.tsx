// @mui
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import CardTableBE from 'components/card-table/CardTableBE';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// query
import { gettingClosingReportProposals } from 'queries/client/gettingClosingReportProposals';
import CardTableByBE from 'components/card-table/CardTableByBE';

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
    <Page title={translate('pages.common.close_report.text.project_report')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingClosingReportProposals}
            title={translate('pages.common.close_report.text.project_report')}
            cardFooterButtonAction="show-details"
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
                submitter_user_id: { _eq: user?.id },
                inner_status: {
                  _in: ['REQUESTING_CLOSING_FORM'],
                },
              },
            }}
            destination={'project-report'}
          /> */}
          <CardTableByBE
            title={translate('pages.common.close_report.text.project_report')}
            destination="project-report"
            endPoint="tender-proposal/rejection-list"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingCloseReports;
