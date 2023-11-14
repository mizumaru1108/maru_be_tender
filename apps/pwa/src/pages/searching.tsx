import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import NewCardTable from 'components/card-table/NewCardTable';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import CardTableByBE from '../components/card-table/CardTableByBE';
import useLocales from '../hooks/useLocales';
import { useSelector } from '../redux/store';

function PreviousSupportRequests() {
  const { translate } = useLocales();
  const { activeRole } = useAuth();

  // Redux
  const {
    sort,
    filtered,
    activeOptionsSearching,
    outter_status: filter_outter_status,
  } = useSelector((state) => state.searching);

  // redux: selector for applicationAndAdmissionSettings

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  const DATA_URL = '/tender-user/find-users';

  const HEADERS = { 'x-hasura-role': activeRole! };

  return (
    <Page title={translate('pages.common.search')}>
      <Container>
        <ContentStyle>
          {activeRole !== 'tender_accounts_manager' ? (
            // <CardSearching
            //   title={translate('pages.common.search')}
            //   cardFooterButtonAction="show-project"
            // />
            <CardTableByBE
              title={translate('pages.common.search')}
              destination="current-project"
              endPoint="tender-proposal/list"
              limitShowCard={6}
              cardFooterButtonAction="show-project"
              showPagination={true}
              sorting={['sorting']}
              onSearch={true}
              addCustomFilter={{
                sort: sort || undefined,
                project_name:
                  activeOptionsSearching.project_name && filtered ? filtered : undefined,
                employee_name:
                  activeOptionsSearching.employee_name && filtered ? filtered : undefined,
                project_number:
                  activeOptionsSearching.project_number && filtered ? filtered : undefined,
                outter_status:
                  activeOptionsSearching.outter_status && filter_outter_status
                    ? filter_outter_status
                    : undefined,
              }}
            />
          ) : (
            <NewCardTable
              title={translate('pages.common.search')}
              cardFooterButtonAction="show-project"
              url={DATA_URL}
              headersProps={HEADERS}
            />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
