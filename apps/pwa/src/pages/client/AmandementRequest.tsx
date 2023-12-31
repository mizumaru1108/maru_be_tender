import { Button, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { getBeneficiariesList } from 'redux/slices/proposal';
import { dispatch, useSelector } from 'redux/store';
import { AmandementFields, AmandmentRequestForm } from '../../@types/proposal';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';
import AmandementClientForm from '../../sections/client/funding-project-request/amandement-project/AmandementClientForm';
import axiosInstance from '../../utils/axios';
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
}));

type ITmpValues = {
  data: AmandmentRequestForm;
  revised: AmandementFields;
};

const AmandementRequest = () => {
  const { translate, currentLang } = useLocales();
  const { loadingCount } = useSelector((state) => state.proposal);
  const navigate = useNavigate();
  const params = useParams();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tmpValues, setTmpValues] = React.useState<ITmpValues | null>(null);
  // console.log({ tmpValues });
  const formatingFieldName = (fieldName: string) => {
    const nameField = fieldName.split('_');
    return nameField.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const fetchingData = React.useCallback(async () => {
    try {
      const rest = await axiosInstance.get(
        `/tender-proposal/amandement?id=${params.proposal_id as string}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        setTmpValues({
          data: rest.data.data.proposal,
          revised: rest.data.data.detail,
        });
      }
    } catch (err) {
      // handle error fetching
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, params.proposal_id, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingData();
    dispatch(getBeneficiariesList(activeRole!, true));
  }, [fetchingData, activeRole]);

  if (loadingCount) return <>Loading...</>;

  return (
    // <Page title="Fundin Project Request">
    <Page title={translate('pages.client.amandement_request_form')}>
      <Container>
        <ContentStyle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  onClick={() => navigate(-1)}
                  sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
                >
                  <Iconify
                    icon={
                      currentLang.value === 'en'
                        ? 'eva:arrow-ios-back-outline'
                        : 'eva:arrow-ios-forward-outline'
                    }
                    width={25}
                    height={25}
                  />
                </Button>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}
                  >
                    {translate('content.client.main_page.amandement_projects')}
                  </Typography>
                </Box>
              </Stack>
              <ContentStyle>
                <AmandementClientForm tmpValues={tmpValues ?? undefined} />
              </ContentStyle>
            </Grid>
            <Grid item xs={12} md={3}>
              <ContentStyle>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    position: 'sticky',
                    top: 70,
                    minHeight: '30vh',
                    padding: 3,
                    borderRadius: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', color: 'text.secondary' }}
                  >
                    {translate('proposal_amandement.notes.label')}
                  </Typography>
                  {tmpValues &&
                    tmpValues.revised &&
                    Object.entries(tmpValues?.revised)
                      .filter(
                        ([name, value]) => name !== 'beneficiary_id'
                        // name !== 'region_id' &&
                        // name !== 'governorate_id'
                      )
                      .map(([name, value]) => (
                        <Box key={name} sx={{ mb: 2 }}>
                          <Typography
                            sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', color: 'text.secondary' }}
                          >
                            {/* {formatingFieldName(name)} */}
                            {/* {name} */}
                            {translate(`amandement.client.amandement_request.${name}`)}
                          </Typography>
                          <Typography
                            sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', color: 'text.primary' }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                </Box>
              </ContentStyle>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
};

export default AmandementRequest;
