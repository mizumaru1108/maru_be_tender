import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';
import FundingProjectRequestForm from 'sections/client/funding-project-request';
import ProposalDisableModal from '../../components/modal-dialog/ProposalDisableModal';
import { FEATURE_DISABLE_PROPOSAL_DATE } from '../../config';
import useAuth from '../../hooks/useAuth';
import { hasDayExpired } from '../../utils/checkIsExpired';

const FundingProjectRequest = () => {
  const { translate } = useLocales();
  const { activeRole, user } = useAuth();

  const [openModal, setOpenModal] = useState(false);

  // selector for applicationAndAdmissionSettings
  // const {
  //   application_admission_settings,
  //   isLoading: isFetchingData,
  //   error: errorFetchingData,
  // } = useSelector((state) => state.applicationAndAdmissionSettings);

  // const [result, reExecute] = useQuery({
  //   query: getClientTotalProposal,
  //   variables: { submitter_user_id: user?.id },
  //   pause: !user?.id,
  //   // pause: true,
  // });
  // const { data, fetching, error } = result;

  // const totalProposal: number = data?.proposal_aggregate?.aggregate?.count;

  const isOpen =
    FEATURE_DISABLE_PROPOSAL_DATE && hasDayExpired({ expiredDate: FEATURE_DISABLE_PROPOSAL_DATE })
      ? false
      : !FEATURE_DISABLE_PROPOSAL_DATE
      ? false
      : true;

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));

  // useEffect(() => {
  //   dispatch(getApplicationAdmissionSettings(activeRole!));
  // }, [activeRole]);

  // useEffect(() => {
  //   if (!!totalProposal && application_admission_settings?.number_of_allowing_projects) {
  //     if (totalProposal > application_admission_settings?.number_of_allowing_projects) {
  //       setOpenModal(true);
  //     }
  //   }
  // }, [totalProposal, application_admission_settings.number_of_allowing_projects]);

  // if (fetching || isFetchingData) return <>{translate('pages.common.loading')}</>;
  // if (error || errorFetchingData) return <>{translate('pages.common.error')}</>;

  return (
    // <Page title="Funding Project Requests">
    <Page title={translate('pages.common.funding_requests')}>
      <Container>
        <ContentStyle>
          <ProposalDisableModal
            open={isOpen || openModal}
            message={
              openModal
                ? translate('modal.disable_proposal.exceed_limit')
                : translate('modal.disable_proposal.message')
            }
          />
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              {translate('create_a_new_support_request')}
            </Typography>
          </Box>
          {isOpen || openModal ? null : <FundingProjectRequestForm />}
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default FundingProjectRequest;
