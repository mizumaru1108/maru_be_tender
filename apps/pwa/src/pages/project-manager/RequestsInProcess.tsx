import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { getProposals } from 'queries/commons/getProposal';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function RequestsInProcess() {
  const { translate } = useLocales();
  const { user } = useAuth();

  return (
    // <Page title="Requests in Proccess | Project-Manager">
    <Page title={translate('pages.common.request_in_process')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title={translate('content.client.main_page.process_request')}
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
                project_manager_id: { _eq: user?.id },
                _and: {
                  inner_status: { _eq: 'ACCEPTED_BY_SUPERVISOR' },
                  // outter_status: { _nin: ['ON_REVISION', 'ASKED_FOR_AMANDEMENT', 'CANCELED'] },
                },

                // _or: [
                //   {
                //     project_manager_id: { _eq: user?.id },
                //     _and: { inner_status: { _eq: 'ACCEPTED_BY_SUPERVISOR' } },
                //   },
                //   {
                //     supervisor_id: { _is_null: false },
                //     _and: { inner_status: { _eq: 'REJECTED_BY_SUPERVISOR' } },
                //   },
                // ],
              },
            }}
            destination={'incoming-funding-requests'}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default RequestsInProcess;
