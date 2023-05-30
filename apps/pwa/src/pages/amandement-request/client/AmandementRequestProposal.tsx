import { useEffect, useLayoutEffect, useState } from 'react';
// material
import { Container, Divider, Skeleton, styled, useTheme } from '@mui/material';
// components
import Page from 'components/Page';
// sections
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//
import { useQuery } from 'urql';
import { IEditedValues } from '../../../@types/client_data';
import { AmandementFields, AmandementProposal } from '../../../@types/proposal';
import ConfirmationModal from '../../../components/modal-dialog/ConfirmationModal';
import { getOneAmandement } from '../../../queries/commons/getOneAmandementProposal';
import ActionButtonAmandementProposal from '../../../sections/amandement-request/proposal/ActionButtonAmandementProposal';
import ProposalAmandementHeader from '../../../sections/amandement-request/proposal/ProposalAmandementHeader';
import axiosInstance from '../../../utils/axios';
import AmandementForms from '../forms/AmandementForms';
import { dispatch, useSelector } from 'redux/store';
import { getProposal } from 'redux/slices/proposal';

// -------------------------------------------------------------------------------

// const ContentStyle = styled('div')(({ theme }) => ({
//   maxWidth: '100%',
//   minHeight: '100vh',
//   display: 'flex',
//   justifyContent: 'start',
//   flexDirection: 'column',
//   rowGap: 24,
// }));
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
}));

interface ITmpValues {
  old_data: IEditedValues;
  new_data: IEditedValues;
  difference: IEditedValues;
}

// -------------------------------------------------------------------------------

function AmandementRequestProposal() {
  const { user, activeRole } = useAuth();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const { proposal, isLoading } = useSelector((state) => state.proposal);

  // state for handling
  const [open, setOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedLength, setSelectedLength] = useState(0);

  //for navigate to dashboard supervisor
  const { pathname } = useLocation();
  const dahsboardUrl = pathname.split('/').slice(0, 3).join('/').concat('/app');

  //tmp variable
  const [AmandementProposal, setAmandementProposal] = useState<AmandementProposal | null>(null);
  const [tmpValues, setTmpValues] = useState<AmandementFields | null>(null);

  // Routes
  const params = useParams();
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();

  //Variable for use Query gql
  const [result, reexecute] = useQuery({
    query: getOneAmandement,
    variables: {
      id: params.proposal_id,
    },
  });
  const { data, fetching, error } = result;

  const handleSubmit = async () => {
    setIsLoad(true);
    try {
      const rest = await axiosInstance.post(
        'tender-proposal/send-amandement',
        {
          ...tmpValues,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Edit request has been approved', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate(dahsboardUrl);
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(`${statusCode < 500 && message ? message : 'something went wrong!'}`, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoad(false);
    }
  };

  useEffect(() => {
    dispatch(getProposal(params.proposal_id as string, activeRole as string));
    // setLoading(true);
    // if (!!data) {
    //   setAmandementProposal(data.proposal);
    // }
  }, [activeRole, params.proposal_id]);

  useEffect(() => {
    if (!isLoading && proposal) {
      // console.log({ proposal });
      setAmandementProposal(proposal);
    }
  }, [isLoading, proposal]);

  if (isLoading || (proposal && proposal.id === '-1')) return <>Loading...</>;

  return (
    // <Page title="Amandement Request">
    <Page title={translate('pages.amandement_request.client')}>
      <Container>
        <ContentStyle sx={{ alignItems: 'center' }}>
          <ProposalAmandementHeader />
          {fetching && <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />}
          <Divider />
          <Container sx={{ padding: '10px' }}>
            <AmandementForms
              defaultValues={AmandementProposal}
              selectedLength={(length) => {
                setSelectedLength(length);
              }}
              openConfirm={() => {
                setOpen(true);
              }}
              onSubmit={(data) => {
                setTmpValues(data);
              }}
            >
              <ActionButtonAmandementProposal
                isLoad={isLoad}
                isDisabled={selectedLength === 0 ?? false}
              />
            </AmandementForms>
            <ConfirmationModal
              open={open}
              message={translate('modal.confirm_amandement')}
              handleClose={() => {
                setOpen(false);
              }}
              onSumbit={handleSubmit}
            />
          </Container>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AmandementRequestProposal;
