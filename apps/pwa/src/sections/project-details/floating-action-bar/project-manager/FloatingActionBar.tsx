import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useLocation, useNavigate, useParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ModalDialog from 'components/modal-dialog';
import { useState } from 'react';
import FormActionBox from './FormActionBox';
import ProposalAcceptingForm from './ProposalAcceptingForm';
import ProposalRejectingForm from './ProposalRejectingForm';
import { rejectProposal } from 'queries/commons/rejectProposal';
import { approveProposal } from 'queries/commons/approveProposal';
import { CreateProposalLog } from 'queries/commons/createProposalLog';
import { useMutation, useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useSnackbar } from 'notistack';
import { nanoid } from 'nanoid';

function FloatingActionBar({ organizationId }: any) {
  const { id } = useParams();
  const { user } = useAuth();
  const employee_id = user?.id;
  const [result] = useQuery({
    query: `query MyQuery($id: String = "") {
      user: user_by_pk(id: $id) {
        track: employee_path
      }
    }
    `,
    variables: {
      id: employee_id,
    },
  });
  const { data, fetching, error } = result;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [proposalRejection, reject] = useMutation(rejectProposal);
  const [proposalAccepting, accept] = useMutation(approveProposal);
  const [_, createLog] = useMutation(CreateProposalLog);
  const { fetching: accFetch, error: accError } = proposalAccepting;
  const { fetching: rejFetch, error: rejError } = proposalRejection;
  const { translate } = useLocales();
  const theme = useTheme();
  const [action, setAction] = useState<
    'accept' | 'reject' | 'edit_request' | 'send_client_message' | 'accept_cons'
  >('reject');
  const [modalState, setModalState] = useState(false);
  const handleOpenModal = () => {
    setModalState(true);
  };
  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleApproval = (values: any) => {
    accept({
      proposalId: id,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED_BY_PROJECT_MANAGER',
        outter_status: 'PENDING',
        state: 'CEO',
      },
    });

    if (!accFetch) {
      enqueueSnackbar(translate('proposal_approved'), {
        variant: 'success',
      });
      createLog({
        proposalLogPayload: {
          id: nanoid(),
          reviewer_id: user?.id,
          proposal_id: id,
          organization_id: organizationId, // from clientid
          status: 'ACCEPTED',
          assign: 'CEO',
          notes: values.notes,
          procedures: values.procedures,
        },
      });
      navigate('/project-manager/dashboard/app');
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
  const handleApprovalConu = (values: any) => {
    accept({
      proposalId: id,
      approveProposalPayloads: {
        inner_status: 'ACCEPTED_AND_NEED_CONSULTANT',
        outter_status: 'PENDING',
        state: 'CONSULTANT',
      },
    });

    if (!accFetch) {
      enqueueSnackbar(translate('proposal_approved'), {
        variant: 'success',
      });
      createLog({
        proposalLogPayload: {
          id: nanoid(),
          reviewer_id: user?.id,
          proposal_id: id,
          organization_id: organizationId, // from clientid
          status: 'ACCEPTED',
          assign: 'CEO',
          notes: values.notes,
          procedures: values.procedures,
        },
      });
      navigate('/project-manager/dashboard/app');
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
  const handleRejected = (values: any) => {
    reject({
      proposalId: id,
      rejectProposalPayloads: {
        inner_status: 'REJECTED',
        outter_status: 'CANCELED',
        state: 'CLIENT',
      },
    });

    if (!rejFetch) {
      enqueueSnackbar(translate('proposal_rejected'), {
        variant: 'success',
      });
      createLog({
        proposalLogPayload: {
          id: nanoid(),
          reviewer_id: user?.id,
          proposal_id: id,
          organization_id: organizationId, // from clientid
          status: 'ACCEPTED',
          assign: 'CEO', // asfasdf
          notes: values.notes,
          procedures: values.procedures,
        },
      });
      navigate('/project-manager/dashboard/app');
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (fetching) return <>... Loading</>;
  if (error) return <>... Ops somthing went wrong</>;
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid ${theme.palette.grey[400]}`,
        }}
      >
        <Grid container rowSpacing={5} alignItems="center" justifyContent="space-around">
          <Grid item md={5} xs={12}>
            <Button
              variant="contained"
              endIcon={<Iconify icon="eva:edit-2-outline" />}
              onClick={() => setAction('edit_request')}
              sx={{
                flex: 1,
                backgroundColor: '#0169DE',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              {translate('partner_details.submit_amendment_request')}
            </Button>
          </Grid>
          <Grid item md={7} xs={12}>
            <Stack direction="row" gap={2} justifyContent="space-around">
              <Button
                sx={{ flex: 1, '&:hover': { backgroundColor: '#FF170F' } }}
                variant="contained"
                color="error"
                onClick={() => {
                  setAction('reject');
                  handleOpenModal();
                }}
                endIcon={<ClearIcon />}
              >
                {translate('reject_project')}
              </Button>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={
                  data.user.track === 'CONCESSIONAL_GRANTS'
                    ? handleClick
                    : () => {
                        handleOpenModal();
                        setAction('accept');
                      }
                }
                variant="contained"
                color="primary"
                endIcon={<CheckIcon />}
                sx={{ flex: 1, '&:hover': { backgroundColor: '#13B2A2' } }}
              >
                قبول المشروع
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAction('accept');
                    handleOpenModal();
                  }}
                >
                  قبول المشروع وارساله للمدير التنفيذي
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAction('accept_cons');
                    handleOpenModal();
                  }}
                >
                  قبول المشروع وعرضه على لجنة المستشارين
                </MenuItem>
              </Menu>
              <Button
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="eva:message-circle-outline" />}
                onClick={() => setAction('send_client_message')}
                sx={{ flex: 2 }}
              >
                عرض المشروع على المستشارين
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <ModalDialog
        maxWidth="md"
        title={
          <Stack display="flex">
            <Typography variant="h6" fontWeight="bold" color="#000000">
              {action === 'accept' ? translate('accept_project') : translate('reject_project')}
            </Typography>
          </Stack>
        }
        content={
          action === 'accept' ? (
            <ProposalAcceptingForm
              onSubmit={(values) => {
                console.log('form callback', values);
                console.log('just a dummy not create log yet');
                handleApproval(values);
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : action === 'accept_cons' ? (
            <ProposalAcceptingForm
              onSubmit={(values) => {
                console.log('form callback', values);
                console.log('just a dummy not create log yet');
                handleApprovalConu(values);
              }}
            >
              <FormActionBox
                action="accept"
                isLoading={false}
                onReturn={() => {
                  setModalState(false);
                }}
              />
            </ProposalAcceptingForm>
          ) : (
            <ProposalRejectingForm
              onSubmit={(values: any) => {
                console.log('form callback', values);
                console.log('just a dummy not create log yet');
                handleRejected(values);
              }}
            >
              <FormActionBox
                action="reject"
                isLoading={false}
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
    </>
  );
}

export default FloatingActionBar;
