import { useEffect, useState } from 'react';
// material
import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
// components
import Page from 'components/Page';
// sections
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
//
import { IEditedValues } from '../../../@types/client_data';
import EditedRequestStatus from '../../../sections/account_manager/edit-request-profile/EditedRequestStatus';
import EditRequestTabs from '../../../sections/account_manager/EditRequestTabs';
import axiosInstance from '../../../utils/axios';
import ActionButtonEditRequest from '../../../sections/account_manager/edit-request-profile/ActionButtonEditRequest';
import RejectedEditRequestPopUp from '../../../sections/account_manager/edit-request-profile/RejectedEditRequestPopUp';
import ProposalAmandementHeader from '../../../sections/amandement-request/proposal/ProposalAmandementHeader';
import { AmandementFields, AmandementProposal } from '../../../@types/proposal';
import { useQuery } from 'urql';
import { getOneAmandement } from '../../../queries/commons/getOneAmandementProposal';
import ActionButtonAmandementProposal from '../../../sections/amandement-request/proposal/ActionButtonAmandementProposal';
import AmandementForms from '../forms/AmandementForms';
import ConfirmAmandement from '../forms/ConfirmAmandement';

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedLength, setSelectedLength] = useState(0);

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

  useEffect(() => {
    // setLoading(true);
    if (!!data) {
      // console.log('data', data.proposal);
      setAmandementProposal(data.proposal);
    }
  }, [data]);
  // console.log('AmandementProposal', AmandementProposal);
  return (
    <Page title="Partner Details">
      <Container>
        <ContentStyle sx={{ alignItems: 'center' }}>
          {/* <EditedRequestStatus EditStatus={EditStatus} /> */}
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
                // console.log('data', data);
                setTmpValues(data);
              }}
            >
              <ActionButtonAmandementProposal
                isLoad={isLoad}
                isDisabled={selectedLength === 0 ?? false}
              />
            </AmandementForms>
            <ConfirmAmandement
              open={open}
              handleClose={() => {
                setOpen(false);
              }}
              defaultValues={tmpValues ?? undefined}
            />
          </Container>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AmandementRequestProposal;
