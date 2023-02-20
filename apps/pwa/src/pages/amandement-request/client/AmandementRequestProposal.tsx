import { useEffect, useState } from 'react';
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
        setIsLoad(false);
      }
    } catch (err) {
      setIsLoad(false);
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
    }
  };

  useEffect(() => {
    // setLoading(true);
    if (!!data) {
      setAmandementProposal(data.proposal);
    }
  }, [data]);
  return (
    <Page title="Partner Details">
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
