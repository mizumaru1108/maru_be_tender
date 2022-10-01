import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { getOneProposal } from 'queries/commons/getOneProposal';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from 'urql';
import FloatingActionBar from '../../components/floating-action-bar/FloatingActionBar';
import ModalDialog from '../../components/modal-dialog';
import { Role } from '../../guards/RoleBasedGuard';
import useAuth from '../../hooks/useAuth';
import { approveProposal } from '../../queries/commons/approveProposal';
import { CreateProposalLog } from '../../queries/commons/createProposalLog';
import { rejectProposal } from '../../queries/commons/rejectProposal';
import FormActionBox from '../ceo/forms/FormActionBox';
import ProposalAcceptingForm from '../ceo/forms/ProposalAcceptingForm';
import ProposalRejectingForm from '../ceo/forms/ProposalRejectingForm';
import ActionBar from './ActionBar';
import ExchangeDetails from './ExchangeDetails';
import FloatinActonBar from './floatin-acton-bar/FloatinActonBar';
import FollowUps from './FollowUps';
import MainPage from './MainPage';
import Payments from './Payments';
import ProjectBudget from './ProjectBudget';

function ProjectDetailsMainPage() {
  const { id } = useParams();
  const [result, reexecuteQuery] = useQuery({
    query: getOneProposal,
    variables: { id },
  });
  const { data, fetching, error } = result;
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as Role;

  // Language
  const { currentLang, translate } = useLocales();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const pid = location.pathname.split('/')[4];
  const activeTap = location.pathname.split('/').at(-1);
  const actionType = location.pathname.split('/').at(-2);

  const [modalState, setModalState] = useState(false);
  //create handleclose modal function
  const handleCloseModal = () => {
    setModalState(false);
  };

  // Logic here to get current user role

  const currentRoles = user?.registrations[0].roles[0] as Role;

  // var for insert into navigate in handel Approval and Rejected
  const p = currentRoles.split('_')[1];

  // var for else on state in approveProposalPayloads
  const a = p.toUpperCase();

  const [proposalRejection, reject] = useMutation(rejectProposal);
  const [proposalAccepting, accept] = useMutation(approveProposal);
  const [creatingLog, createLog] = useMutation(CreateProposalLog);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const [action, setAction] = useState<'accept' | 'reject'>('reject');
  const handleApproval = () => {
    accept({
      proposalId: pid,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED',
        outter_status: 'ONGOING',
        state:
          currentRoles === 'tender_ceo'
            ? 'PROJECT_SUPERVISOR'
            : currentRoles === 'tender_moderator'
            ? 'PROJECT_SUPERVISOR'
            : `${a}`, // the next step when accepted
      },
    });

    if (!accFetch) {
      enqueueSnackbar('Proposal Approved!', {
        variant: 'success',
      });
      navigate(`/${p}/dashboard/app`);
    }
    if (accError) {
      enqueueSnackbar(accError.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      console.log(accError);
    }
  };

  const handleRejected = () => {
    reject({
      proposalId: pid,
      rejectProposalPayloads: {
        inner_status: 'REJECTED',
        outter_status: 'CANCELED',
        state:
          currentRoles === 'tender_moderator'
            ? 'CLIENT'
            : currentRoles === 'tender_ceo'
            ? 'CLIENT'
            : `${a}`,
      },
    });

    if (!rejFetch) {
      enqueueSnackbar('Proposal Rejected Successfully!', {
        variant: 'success',
      });
      navigate(`/${p}/dashboard/app`);
    }
    if (rejError) {
      enqueueSnackbar(rejError.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
      console.log(rejError);
    }
  };

  if (fetching) return <>...Loading</>;
  if (error) return <>{error.graphQLErrors}</>;
  if (data.proposal_by_pk === null) return <>There is no data for this tap ... </>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row">
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fillOpacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" gap={1}>
          <Typography variant="h4">{data.proposal_by_pk.project_name}</Typography>
          <Typography>
            {`أنشئ بواسطة ${data.proposal_by_pk.user.employee_name} تاريخ ${new Date(
              data.proposal_by_pk.created_at
            ).getDay()}.
          ${new Date(data.proposal_by_pk.created_at).getMonth()}.
          ${new Date(data.proposal_by_pk.created_at).getFullYear()} في 
          ${new Date(data.proposal_by_pk.created_at).getHours()}:
          ${new Date(data.proposal_by_pk.created_at).getMinutes()}`}
          </Typography>
        </Stack>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#0E847829',
            p: '5px',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#0E8478',
              fontSize: '15px !important',
              mt: '12px',
            }}
          >
            حالة المشروع
          </Typography>
        </Box>
      </Stack>
      <ActionBar />

      {activeTap === 'main' && <MainPage data={data.proposal_by_pk} />}
      {activeTap === 'project-budget' && <ProjectBudget />}
      {activeTap === 'follow-ups' && <FollowUps />}
      {activeTap === 'payments' && <Payments />}
      {activeTap === 'exchange-details' && <ExchangeDetails />}

      {activeTap &&
        ['main', 'project-budget'].includes(activeTap) &&
        actionType &&
        actionType === 'show-details' &&
        ['tender_ceo', 'tender_moderator'].includes(role) && (
          /** Floating Action Bar for Moderator and CEO */
          <FloatingActionBar
            handleAccept={() => {
              setModalState(true);
              setAction('accept');
            }}
            handleReject={() => {
              setModalState(true);
              setAction('reject');
            }}
            role={currentRoles}
          />
        )}
      {/* Modal Dialog for moderator and CEO */}
      <ModalDialog
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {action === 'accept' ? 'Project Accept Form' : 'Project Reject Form'}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
            <ProposalAcceptingForm
              onSubmit={(data) => {
                console.log('form callback', data);
                console.log('just a dummy not create log yet');
                handleApproval();
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={accFetch}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : (
            <ProposalRejectingForm
              onSubmit={(value) => {
                console.log('form callback', value);
                console.log('just a dummy not create log yet');
                handleRejected();
              }}
            >
              <FormActionBox
                action="reject"
                isLoading={rejFetch}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalRejectingForm>
          )
        }
        isOpen={modalState}
        onClose={handleCloseModal}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
      />
      <FloatinActonBar proposalData={data.proposal_by_pk} />
    </Box>
  );
}

export default ProjectDetailsMainPage;
