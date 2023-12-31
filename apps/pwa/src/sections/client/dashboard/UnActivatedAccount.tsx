import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useResponsive from 'hooks/useResponsive';
import Page500 from 'pages/Page500';
import React, { useEffect } from 'react';
import LoadingPage from './LoadingPage';
import UpdateInformation from './UpdateInformation';
import { clientMainPage } from 'queries/client/clientMainPage';
import { useQuery } from 'urql';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import { useLocation } from 'react-router-dom';
import { getProfileData } from 'queries/client/getProfileData';
import { getClientData } from 'redux/slices/clientData';
import { useDispatch, useSelector } from 'redux/store';
import OldProposalPage from 'pages/client/OldProposal';
import axiosInstance from 'utils/axios';
import useLocales from 'hooks/useLocales';

function UnActivatedAccount() {
  const isMobile = useResponsive('down', 'sm');
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const { clientData: dataClient, fillUpData } = useSelector((state) => state.clientData);

  const urlArr: string[] = location.pathname.split('/');
  const getUrlArr = `${urlArr[1]}/${urlArr[2]}/${urlArr[3]}`;

  const [open, setOpen] = React.useState<boolean>(false);
  const [oldProposal, setOldProposal] = React.useState([]);

  const getDataClient = async () => {
    try {
      const response = await axiosInstance.get(`tender-proposal/old/list`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (response.data.statusCode === 200) {
        setOldProposal(response.data.data);
      }
      return response.data;
    } catch (error) {
      return <>...Opss, something went wrong</>;
    }
  };

  const [result, mutate] = useQuery({
    query: clientMainPage,
  });
  const { data, fetching, error } = result;

  useEffect(() => {
    getDataClient();
    dispatch(getClientData(user?.id));
    if (fillUpData) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fillUpData, user?.id]);

  useEffect(() => {}, [dataClient, oldProposal]);

  if (fetching) return <LoadingPage />;
  if (error) return <Page500 error={error.message} />;

  const showProposal =
    getUrlArr === 'client/dashboard/app' &&
    (data.completed_client_projects.length > 0 ||
      data.pending_client_projects.length > 0 ||
      data.amandement_proposal.length > 0 ||
      data.all_client_projects.length > 0);

  const showOldProposal = getUrlArr === 'client/dashboard/old-proposal' && oldProposal.length > 0;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  return (
    // <Page title="Un Activated Page">
    <Page title={translate('pages.common.unactivated_account')}>
      <ModalDialog
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        isOpen={open}
        maxWidth="md"
        content={<UpdateInformation onClose={handleOnClose} />}
        onClose={handleOnClose}
      />
      <Container sx={{ paddingTop: '20px' }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent={showProposal || showOldProposal ? 'start' : 'center'}
          position="relative"
          style={{ height: showProposal || showOldProposal ? '250vh' : '70vh' }}
        >
          <Box
            sx={{
              width: '100%',
              height: isMobile ? '100%' : '130px',
              borderRadius: '30px',
              backgroundColor: '#FFC107',
              position: 'relative',
            }}
          >
            <img
              src={'/icons/client-activate-icons/top-left.svg'}
              alt=""
              style={{
                width: '68.64px',
                height: '77.19px',
                position: 'absolute',
                left: '43.31px',
                top: '-40px',
              }}
            />

            <img
              src={'/icons/client-activate-icons/top-left-circul-1.svg'}
              style={{
                width: '22px',
                height: '22px',
                position: 'absolute',
                left: '85px',
                top: '32px',
              }}
              alt=""
            />
            <img
              src={'/icons/client-activate-icons/top-left-circul-2.svg'}
              style={{
                width: '8.32px',
                position: 'absolute',
                left: '72.04px',
                top: '65px',
              }}
              alt=""
            />
            <img
              src={'/icons/client-activate-icons/top-left-circul-3.svg'}
              style={{
                width: '5.55px',
                height: '5.55px',
                position: 'absolute',
                left: '25.22px',
                top: '30px',
              }}
              alt=""
            />
            <div
              style={{
                left: '0px',
                top: '52.8px',
                position: 'absolute',
                overflow: 'hidden',
                borderBottomLeftRadius: '30px',
              }}
            >
              <img
                src={'/icons/client-activate-icons/bottom-left.svg'}
                alt=""
                style={{ height: '77.19px' }}
              />
            </div>
            {isMobile ? (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                }}
              >
                {activeRole === 'tender_client' ? (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لقد تم انشاء حسابك في غيث بنجاح
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      الرجاء الانتظار ليتم تفعيل حسابك
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لتستطيع انشاء مشاريع دعم
                    </Typography>
                  </Stack>
                ) : (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      هذا الحساب غير مفعل
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      يرجى التواصل مع الأدمن لتفعيله
                    </Typography>
                  </Stack>
                )}
              </div>
            ) : (
              <div
                style={{
                  position:
                    getUrlArr === 'client/dashboard/app' || showOldProposal
                      ? 'relative'
                      : 'absolute',
                  top: '30%',
                  width: '100%',
                }}
              >
                {activeRole === 'tender_client' ? (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لقد تم انشاء حسابك في غيث بنجاح
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      الرجاء الانتظار ليتم تفعيل حسابك لتستطيع انشاء مشاريع دعم
                    </Typography>
                  </Stack>
                ) : (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      هذا الحساب غير مفعل
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      يرجى التواصل مع الأدمن لتفعيله
                    </Typography>
                  </Stack>
                )}

                {/* it showed when any proposal was created and showed only in dashboard */}
                {showProposal ? <PreviousFundingInqueries /> : null}
                {showOldProposal ? (
                  <Grid item md={12} xs={12} sx={{ my: 10, position: 'relative' }}>
                    <OldProposalPage />
                  </Grid>
                ) : null}
              </div>
            )}
          </Box>
        </Grid>
      </Container>
    </Page>
  );
}

export default UnActivatedAccount;
