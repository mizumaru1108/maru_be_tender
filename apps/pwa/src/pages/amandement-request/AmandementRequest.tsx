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
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import { useEffect } from 'react';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';
import { BaseAmandementRequest } from './types';
import useLocales from '../../hooks/useLocales';

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

// export default function AmandementRequest({ onSubmit, children }: AmandementRequestProps) {
export default function AmandementRequest() {
  const { currentLang, translate } = useLocales();

  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as string;

  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  // Routes
  const { id } = useParams();
  const navigate = useNavigate();

  // Note Amandment Request
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

  // use effect to list params
  useEffect(() => {
    console.log('params', id);
    console.log('role', role);
  }, [id, role]);

  const valueMapper: ValueMapper = {
    cluster_admin: {
      page_name: 'Amandement Request',
      headline: 'Amandement Request',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_accounts_manager: {
      page_name: 'Tender Accounts Manager',
      headline: 'Tender Accounts Manager',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_admin: {
      page_name: 'Tender Admin',
      headline: 'Tender Admin',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_ceo: {
      page_name: translate('proposal_amandement.ceo.page_name'),
      headline: translate('proposal_amandement.ceo.headline'),
      sub_headline: translate('proposal_amandement.ceo.sub_headline'),
    },
    tender_cashier: {
      page_name: 'Tender Cashier',
      headline: 'Tender Cashier',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_client: {
      page_name: 'Tender Client',
      headline: 'Tender Client',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_consultant: {
      page_name: 'Tender Consultant',
      headline: 'Tender Consultant',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_finance: {
      page_name: translate('proposal_amandement.moderator.headline'),
      headline: translate('proposal_amandement.moderator.headline'),
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_moderator: {
      page_name: translate('proposal_amandement.moderator.page_name'),
      headline: translate('proposal_amandement.moderator.headline'),
      sub_headline: translate('proposal_amandement.moderator.sub_headline'),
    },
    tender_project_manager: {
      page_name: 'Tender Project Manager',
      headline: 'Tender Project Manager',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
    tender_project_supervisor: {
      page_name: 'Tender Project Supervisor',
      headline: 'Tender Project Supervisor',
      sub_headline: translate('proposal_amandement.moderator.headline'),
    },
  };

  return (
    <Page title={valueMapper[role].page_name}>
      <Container>
        <ContentStyle>
          <Stack
            spacing={4}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            component="div"
            sx={{ width: '100%' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Button
                color="inherit"
                variant="contained"
                onClick={() => navigate(-1)}
                sx={{ padding: 1, minWidth: 25, minHeight: 25, mr: 3 }}
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
              <Box>
                <Typography variant="h4">{valueMapper[role].headline}</Typography>
                <Typography variant="subtitle1" component="p" sx={{ color: '#93A3B0' }}>
                  {valueMapper[role].sub_headline}
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormProvider methods={methods}>
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
                >
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Iconify icon="eva:checkmark-outline" />}
                    disabled={isSubmitting}
                  >
                    {translate('account_manager.partner_details.btn_amndreq_send_request')}
                  </Button>
                  <Button
                    variant="contained"
                    endIcon={<Iconify icon="eva:diagonal-arrow-right-up-outline" />}
                    sx={{ backgroundColor: '#000000' }}
                    onClick={() => navigate(PATH_ACCOUNTS_MANAGER.infoUpdateRequest)}
                  >
                    {translate('account_manager.partner_details.btn_amndreq_back')}
                  </Button>
                </Stack>
              </FormProvider>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}
