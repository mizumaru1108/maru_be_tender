import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import dayjs from 'dayjs';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';
import FundingProjectRequestForm from 'sections/client/funding-project-request';
import { useQuery } from 'urql';
import ProposalDisableModal from '../../components/modal-dialog/ProposalDisableModal';
import {
  FEATURE_DISABLE_PROPOSAL_DATE,
  FEATURE_MENU_ADMIN_APLICATION_ADMISSION,
} from '../../config';
import useAuth from '../../hooks/useAuth';
import { getClientTotalProposal } from '../../queries/client/getClientTotalProposal';
import { getApplicationAdmissionSettings } from '../../redux/slices/applicationAndAdmissionSettings';
import { dispatch, useSelector } from '../../redux/store';
import { isDateBetween } from '../../utils/checkIsAboveDate';
import { hasDayExpired } from '../../utils/checkIsExpired';

const FundingProjectRequest = () => {
  const { translate } = useLocales();
  const { activeRole, user } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [date, setDate] = useState({
    startDate: '',
    endDate: '',
  });

  // selector for applicationAndAdmissionSettings
  const {
    application_admission_settings,
    isLoading: isFetchingData,
    error: errorFetchingData,
  } = useSelector((state) => state.applicationAndAdmissionSettings);

  const [result, reExecute] = useQuery({
    query: getClientTotalProposal,
    variables: { submitter_user_id: user?.id, _lte: date.endDate, _gte: date.startDate },
    pause: date.startDate === '' && date.endDate === '',
  });
  const { data, fetching, error } = result;

  const totalProposal: number = data?.proposal_aggregate?.aggregate?.count;
  // console.log({ totalProposal });
  const todayDate = dayjs().format('DD-MM-YYYY');

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

  useEffect(() => {
    dispatch(getApplicationAdmissionSettings(activeRole!));
  }, [activeRole]);

  useEffect(() => {
    if (!isFetchingData) {
      const startDate = dayjs(application_admission_settings.starting_date).format(
        'YYYY-MM-DD HH:mm:ssZ'
      );
      const endDate = dayjs(application_admission_settings.ending_date).format(
        'YYYY-MM-DD HH:mm:ssZ'
      );
      setDate({
        startDate,
        endDate,
      });
    }
  }, [application_admission_settings, isFetchingData]);

  useEffect(() => {
    if (application_admission_settings.applying_status) {
      if (
        application_admission_settings?.number_of_allowing_projects &&
        totalProposal >= application_admission_settings?.number_of_allowing_projects
      ) {
        setOpenModal(true);
        const checkExistMessage = [...errorMessage].includes('modal.disable_proposal.exceed_limit');
        if (!checkExistMessage) {
          setErrorMessage((prev) => [...prev, 'modal.disable_proposal.exceed_limit']);
        }
      }
      if (
        application_admission_settings?.starting_date &&
        application_admission_settings?.ending_date
      ) {
        const startDate = dayjs(application_admission_settings.starting_date).format('DD-MM-YYYY');
        const endingDate = dayjs(application_admission_settings.ending_date).format('DD-MM-YYYY');
        const isBetweenDate = isDateBetween(todayDate, startDate, endingDate);
        if (!isBetweenDate) {
          setOpenModal(true);
          const checkExistMessage = [...errorMessage].includes(
            'modal.disable_proposal.exceed_day_limit'
          );
          if (!checkExistMessage) {
            setErrorMessage((prev) => [...prev, 'modal.disable_proposal.exceed_day_limit']);
          }
        }
      }
    } else {
      setOpenModal(true);
      const checkExistMessage = [...errorMessage].includes('modal.disable_proposal.disabled');
      if (!checkExistMessage) {
        setErrorMessage((prev) => [...prev, 'modal.disable_proposal.disabled']);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalProposal, application_admission_settings, todayDate]);

  // if (fetching || isFetchingData) return <>{translate('pages.common.loading')}</>;
  if (fetching) return <>{translate('pages.common.loading_common')}</>;
  if (isFetchingData) return <>{translate('pages.common.loading_data')}</>;
  if (error || (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION))
    return <>{translate('pages.common.error')}</>;

  return (
    <Page title={translate('pages.common.funding_requests')}>
      <Container>
        {!fetching && !isFetchingData ? (
          <ContentStyle>
            <ProposalDisableModal
              open={isOpen || openModal}
              message={openModal ? errorMessage : [translate('modal.disable_proposal.message')]}
            />
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
                {translate('create_a_new_support_request')}
              </Typography>
            </Box>
            {isOpen || openModal ? null : <FundingProjectRequestForm />}
          </ContentStyle>
        ) : null}
      </Container>
      {/* testing */}
    </Page>
  );
};

export default FundingProjectRequest;
