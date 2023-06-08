import { useEffect, useState } from 'react';
// material
import {
  Container,
  styled,
  Typography,
  Button,
  Stack,
  Box,
  useTheme,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
// components
import Page from 'components/Page';
import Iconify from 'components/Iconify';
// hooks
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import useLocales from 'hooks/useLocales';
import { useQuery, useMutation } from 'urql';
import { detailsClientData, sendAmandmentNotes } from 'queries/account_manager/detailsClientData';
import { useSnackbar } from 'notistack';
import { FormProvider } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import { nanoid } from 'nanoid';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
//
import { PartnerDetailsProps } from '../../../@types/client_data';
import { PATH_ACCOUNTS_MANAGER } from 'routes/paths';

// -------------------------------------------------------------------------------

export type SendAmandmentNotesProps = {
  notes: string;
};

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

// -------------------------------------------------------------------------------

export default function AccountSendAmandementRequest() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  // console.log('masuk sini');

  // Routes
  const params = useParams();
  const navigate = useNavigate();

  // Language
  const { currentLang, translate } = useLocales();

  const [resultDetailsClient, reexecuteDetailsClient] = useQuery({
    query: detailsClientData,
    variables: {
      id: params.partnerId as string,
    },
  });

  const { data, fetching, error } = resultDetailsClient;

  // Partner Details Data
  const [partnerDetails, setPartnerDetails] = useState<PartnerDetailsProps | null>(null);

  // Activate Client
  const [amandmentNotesResult, sendNotes] = useMutation(sendAmandmentNotes);
  const [submitNotes, setSubmitNotes] = useState(false);

  const handleSendNotes = async (notes: string) => {
    setSubmitNotes(true);

    const resActivate = await sendNotes({
      object: {
        id: nanoid(),
        status: 'REVISED_ACCOUNT',
        organization_id: partnerDetails?.id,
        reviewer_id: user?.id,
        note_account_information: notes,
      },
    });

    console.log('resActivate', resActivate);

    if (resActivate) {
      setSubmitNotes(false);
      enqueueSnackbar('Amandment Is Successfully Send!', {
        variant: 'success',
      });
      navigate(PATH_ACCOUNTS_MANAGER.infoUpdateRequest);
    }
  };

  // Note Amandment Request
  const sendNotesSchema = Yup.object().shape({
    notes: Yup.string().required('Notes messages is required'),
  });

  const defaultValues = {
    notes: '',
  };

  const methods = useForm<SendAmandmentNotesProps>({
    resolver: yupResolver(sendNotesSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (values: SendAmandmentNotesProps) => {
    handleSendNotes(values.notes);
  };

  useEffect(() => {
    if (data) {
      // console.log('data sini', data?.user_by_pk);
      setPartnerDetails(data?.user_by_pk);
    }
  }, [data]);
  // console.log({ data, partnerDetails });

  return (
    // <Page title="Partner Amandement Request">
    <Page title={translate('pages.account_manager.send_amandement')}>
      <Container>
        <ContentStyle>
          {/* {fetching && <Skeleton variant="rectangular" sx={{ height: 500, borderRadius: 2 }} />} */}
          {!fetching && partnerDetails && (
            <>
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
                    <Typography variant="h4">
                      {translate('account_manager.heading.amandment_request')}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ color: '#93A3B0' }}>
                      {translate('account_manager.heading.subhead_amandment_request')}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
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
            </>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}
