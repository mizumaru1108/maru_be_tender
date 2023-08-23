import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Proposal } from '../../../@types/proposal';
import BaseField from '../../../components/hook-form/BaseField';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import { ContactUsInquiry } from './types';

interface ProjectSelect {
  project_name: string;
  proposal_id: string;
}

interface Props {
  children?: React.ReactNode;
  defaultValuesForm?: ContactUsInquiry;
  onSubmitForm: (data: ContactUsInquiry) => void;
  loading: boolean;
}

const ProjectIncuiryForm = ({ onSubmitForm, defaultValuesForm, children, loading }: Props) => {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const tmpUser: any = { ...user };
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [hasNextPage, setHasNextPage] = React.useState(false);
  const [hasPreviousPage, setHasPreviousPage] = React.useState(false);
  const [proposalOption, setProposalOption] = React.useState<ProjectSelect[]>([]);
  const [notFound, setNotFound] = React.useState(false);

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const url = `/tender-proposal/mine?page=${page}&limit=${limit}`;
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      const tmpData: ProjectSelect[] = response.data.data
        .filter((item: Proposal) => item.id)
        .map((item: Proposal) => ({
          project_name: item.project_name,
          proposal_id: item.id,
        }));
      // console.log('test data:', tmpData);
      setHasNextPage(response.data.hasNextPage);
      setHasPreviousPage(response.data.hasPrevPage);
      setProposalOption(tmpData);
      setTotal(response.data.total);
    } catch (err) {
      setNotFound(true);
      setError(true);
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, page, limit]);

  const handleScrollPagination = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    // console.log('test:', e.target);
    const selectElement = e.target as HTMLDivElement;
    const isAtBottom =
      selectElement.scrollTop + selectElement.clientHeight === selectElement.scrollHeight;

    // Check if the scroll position is at the top
    const isAtTop = selectElement.scrollTop === 0;
    const totalCheck = total > limit ? true : false;
    if (!isLoading && totalCheck && isAtBottom && hasNextPage) {
      setPage(page + 1);
      // Do something when scrolling to the bottom
      // console.log('Scrolled to the bottom');
    }

    if (!isLoading && totalCheck && isAtTop && hasPreviousPage) {
      setPage(page - 1);
      // Do something when scrolling to the top
      // console.log('Scrolled to the top');
    }
  };
  // console.log({ page, hasNextPage, hasPreviousPage });

  const supportSchema = Yup.object().shape({
    proposal_id: Yup.string().required(
      translate('contact_support_form.errors.proposal_id.required')
    ),
    title: Yup.string().required(translate('contact_support_form.errors.title.required')),
    message: Yup.string().required(translate('contact_support_form.errors.message.required')),
  });

  const defaultValues = {
    title: defaultValuesForm?.title || '',
    message: defaultValuesForm?.message || '',
    proposal_id: defaultValuesForm?.proposal_id || '',
  };
  const methods = useForm<ContactUsInquiry>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  // const inquiry_type = watch('inquiry_type');
  const onSubmit = async (data: ContactUsInquiry) => {
    // console.log('data', data);
    onSubmitForm(data);
  };

  React.useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  // if (isLoading) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{translate('pages.common.error')}</>;

  // console.log('formType', formType);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={6} xs={12}>
            {/* <RHFSelect
              name="proposal_id"
              label={translate('contact_support_form.project_name.label')}
            >
              <option value="" disabled selected>
                {translate('contact_support_form.project_name.placeholder')}
              </option>
            </RHFSelect> */}
            <RHFSelect
              // disabled={loading || isLoading}
              name="proposal_id"
              label={translate('contact_support_form.proposal.label')}
              data-cy="contact_support_form.proposal"
              placeholder={translate('contact_support_form.proposal.placeholder')}
              sx={{ overflow: 'auto' }}
              onChange={(e) => {
                setValue('proposal_id', e.target.value);
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: { style: { maxHeight: 500 }, onScroll: handleScrollPagination },
                },
              }}
            >
              {!loading && !isLoading && proposalOption.length > 0
                ? proposalOption.map((option, i) => (
                    <MenuItem key={i} value={option.proposal_id}>
                      {option.project_name}
                    </MenuItem>
                  ))
                : null}
              {(loading || isLoading) && (
                <MenuItem value="" disabled>
                  <CircularProgress size={20} sx={{ color: 'white' }} thickness={4} />
                  {translate('pages.common.loading')}
                </MenuItem>
              )}
              {/* <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              </Box> */}
            </RHFSelect>
          </Grid>
          <Grid item md={6} xs={12}>
            <BaseField
              type="textField"
              name="title"
              label={translate('contact_support_form.message_title.label')}
              data-cy="contact_support_form.message_title"
              placeholder={translate('contact_support_form.message_title.placeholder')}
              disabled={loading || isLoading}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <BaseField
              type="textArea"
              name="message"
              label={translate('contact_support_form.message.label')}
              data-cy="contact_support_form.message"
              placeholder={translate('contact_support_form.message.placeholder')}
              disabled={loading || isLoading}
            />
          </Grid>
          {children}
        </Grid>
      </FormProvider>
    </>
  );
};

export default ProjectIncuiryForm;
