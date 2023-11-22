import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { gettingSavedProjects } from 'queries/client/gettingSavedProjects';
import CardTableBE from 'components/card-table/CardTableBE';
import useLocales from '../../../hooks/useLocales';
import { hasDayExpired } from '../../../utils/checkIsExpired';
import ProposalDisableModal from '../../../components/modal-dialog/ProposalDisableModal';
import {
  FEATURE_DISABLE_PROPOSAL_DATE,
  FEATURE_MENU_ADMIN_APLICATION_ADMISSION,
} from '../../../config';
import useAuth from '../../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { dispatch, useSelector } from '../../../redux/store';
import { useQuery } from 'urql';
import { getClientTotalProposal } from '../../../queries/client/getClientTotalProposal';
import dayjs from 'dayjs';
import { getApplicationAdmissionSettings } from '../../../redux/slices/applicationAndAdmissionSettings';
import { isDateBetween } from '../../../utils/checkIsAboveDate';

function DraftsFundingRequest() {
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

  // useEffect(() => {
  //   if (!isFetchingData) {
  //     const startDate = dayjs(application_admission_settings.starting_date).format(
  //       'YYYY-MM-DD HH:mm:ssZ'
  //     );
  //     const endDate = dayjs(application_admission_settings.ending_date).format(
  //       'YYYY-MM-DD HH:mm:ssZ'
  //     );
  //     setDate({
  //       startDate,
  //       endDate,
  //     });
  //   }
  // }, [application_admission_settings, isFetchingData]);

  // useEffect(() => {
  //   if (!!totalProposal && application_admission_settings.applying_status) {
  //     if (
  //       application_admission_settings?.number_of_allowing_projects &&
  //       totalProposal > application_admission_settings?.number_of_allowing_projects
  //     ) {
  //       setOpenModal(true);
  //       const checkExistMessage = [...errorMessage].includes('modal.disable_proposal.exceed_limit');
  //       if (!checkExistMessage) {
  //         setErrorMessage((prev) => [...prev, 'modal.disable_proposal.exceed_limit']);
  //       }
  //     }
  //     if (
  //       application_admission_settings?.starting_date &&
  //       application_admission_settings?.ending_date
  //     ) {
  //       const startDate = dayjs(application_admission_settings.starting_date).format('DD-MM-YYYY');
  //       const endingDate = dayjs(application_admission_settings.ending_date).format('DD-MM-YYYY');
  //       const isBetweenDate = isDateBetween(todayDate, startDate, endingDate);
  //       if (!isBetweenDate) {
  //         setOpenModal(true);
  //         const checkExistMessage = [...errorMessage].includes(
  //           'modal.disable_proposal.exceed_day_limit'
  //         );
  //         if (!checkExistMessage) {
  //           setErrorMessage((prev) => [...prev, 'modal.disable_proposal.exceed_day_limit']);
  //         }
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [totalProposal, application_admission_settings, todayDate]);

  if (fetching || isFetchingData) return <>{translate('pages.common.loading')}</>;
  if (error || (errorFetchingData && FEATURE_MENU_ADMIN_APLICATION_ADMISSION))
    return <>{translate('pages.common.error')}</>;
  return (
    <Page title={translate('pages.client.draft_funding_requests')}>
      <Container>
        <ContentStyle>
          {/* <ProposalDisableModal
            open={isOpen || openModal}
            message={openModal ? errorMessage : [translate('modal.disable_proposal.message')]}
          /> */}
          <CardTableBE
            resource={gettingSavedProjects}
            title="طلبات دعم مسودة"
            alphabeticalOrder={true}
            cardFooterButtonAction="draft"
            baseFilters={{
              step: {
                step: {
                  _neq: 'ZERO',
                },
              },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default DraftsFundingRequest;
