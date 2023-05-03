import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingMyRequestedProcess } from 'queries/project-supervisor/gettingMyRequestedProcess';
import useAuth from 'hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import CardTableByBE from '../../components/card-table/CardTableByBE';

function RequestsInProcess() {
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
    // <Page title="Requests In Process | Supervisor">
    <Page title={translate('pages.common.request_in_process')}>
      <Container>
        <ContentStyle>
          {/* <CardTableBE
            resource={gettingMyRequestedProcess}
            title="طلبات قيد الإجراء"
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
            // baseFilters={{
            //   filter1: {
            //     // supervisor_id: { _eq: user?.id },
            //     clasification_field: { _is_null: false },
            //     inner_status: {
            //       _nin: [
            //         'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
            //         'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
            //       ],
            //     },
            //     outter_status: { _neq: 'ON_REVISION' },
            //   },
            // }}
            baseFilters={{
              filter1: {
                // supervisor_id: { _eq: user?.id },
                support_outputs: { _is_null: false },
                inner_status: {
                  _eq: 'ACCEPTED_BY_MODERATOR',
                },
                outter_status: { _nin: ['ON_REVISION', 'ASKED_FOR_AMANDEMENT', 'CANCELED'] },
              },
            }}
            destination={'requests-in-process'}
          /> */}
          <CardTableByBE
            title={translate('incoming_support_requests')}
            destination="requests-in-process"
            endPoint="tender-proposal/request-in-process"
            limitShowCard={6}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;
