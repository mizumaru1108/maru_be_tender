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

function ExchangePermission() {
  const { translate } = useLocales();
  const { user } = useAuth();

  console.log(user?.id);

  return (
    // <Page title="Previous Funding Requests">
    <Page title={translate('pages.common.exchange_permission')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={getProposals}
            title={translate('exchange_permission')}
            cardFooterButtonAction="completing-exchange-permission"
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
                  payments: { status: { _in: ['accepted_by_supervisor', 'issued_by_supervisor'] } },
                },
              },
            }}
            destination={'exchange-permission'}
          />
          {/* <CardTable
            data={data2} // For testing, later on we will send the query to it
            title="إذن الصرف"
            cardFooterButtonAction="completing-exchange-permission"
            alphabeticalOrder={true}
            filters={[
              { name: 'اسم الجهة المشرفة*', options: [{ label: 'اسم الجهة المشرفة*', value: '' }] },
            ]}
          /> */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ExchangePermission;
