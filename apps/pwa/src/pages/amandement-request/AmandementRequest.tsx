// material
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
// components
import Iconify from 'components/Iconify';
import Page from 'components/Page';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import React, { useEffect } from 'react';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { BaseAmandementRequest } from './types';
import useLocales from '../../hooks/useLocales';
import { LoadingButton } from '@mui/lab';
import ConfirmationModal from '../../components/modal-dialog/ConfirmationModal';
import axiosInstance from '../../utils/axios';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

type ValueMapper = {
  [key: string]: {
    page_name: string;
    headline: string;
    sub_headline: string;
  };
};

export default function AmandementRequest() {
  const { currentLang, translate } = useLocales();

  const { activeRole } = useAuth();

  const role = activeRole!;

  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const [open, setOpen] = React.useState(false);
  const [isLoad, setIsLoad] = React.useState(false);
  const [tmpValues, setTmpValues] = React.useState<BaseAmandementRequest>();

  const sendNotesSchema = Yup.object().shape({
    notes: Yup.string().required('Notes messages is required'),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<BaseAmandementRequest>({
    resolver: yupResolver(sendNotesSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: BaseAmandementRequest) => {
    // console.log(data.notes);
    setTmpValues(data);
    setOpen(true);
  };
  const onSubmtModal = async () => {
    const urls = location.pathname.split('/');
    const dashboardUrl = `/${urls[1]}/${urls[2]}/app`;
    if (tmpValues) {
      setIsLoad(true);
      try {
        const res = await axiosInstance.post(
          '/tender-proposal/ask-amandement-request',
          {
            proposal_id: id,
            notes: tmpValues.notes,
          },
          {
            headers: { 'x-hasura-role': activeRole! },
          }
        );
        enqueueSnackbar('Amandement request has been sent', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate(dashboardUrl);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } finally {
        setIsLoad(false);
      }
    }
  };
  return (
    <Page title={translate(`proposal_amandement.${role}.page_name`)}>
      <Container>
        <ContentStyle>
          <Box>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ padding: 2, minWidth: 35, minHeight: 35, mr: 3 }}
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
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4">
                {translate(`proposal_amandement.${role}.headline`)}
              </Typography>
              <Typography variant="subtitle1" component="p" sx={{ color: '#93A3B0' }}>
                {translate(`proposal_amandement.${role}.sub_headline`)}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <RHFTextArea
                  name="notes"
                  label={translate('account_manager.partner_details.form.amndreq_label')}
                  placeholder={translate(
                    'account_manager.partner_details.form.amndreq_placeholder'
                  )}
                  rows={6}
                  sx={{ mb: 4 }}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  spacing={2}
                  component="div"
                  sx={{ mt: 2 }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    endIcon={<Iconify icon="eva:checkmark-outline" />}
                    disabled={isSubmitting || isLoad}
                  >
                    {translate('account_manager.partner_details.btn_amndreq_send_request')}
                  </LoadingButton>
                  <Button
                    variant="contained"
                    endIcon={<Iconify icon="eva:diagonal-arrow-right-up-outline" />}
                    sx={{ backgroundColor: '#000000', ':hover': { backgroundColor: '#000' } }}
                    onClick={() => navigate(PATH_ACCOUNTS_MANAGER.infoUpdateRequest)}
                    disabled={isSubmitting || isLoad}
                  >
                    {translate('account_manager.partner_details.btn_amndreq_back')}
                  </Button>
                </Stack>
              </FormProvider>
              <ConfirmationModal
                open={open}
                message={translate('modal.confirm_amandement')}
                handleClose={() => {
                  setOpen(false);
                }}
                onSumbit={onSubmtModal}
              />
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}
