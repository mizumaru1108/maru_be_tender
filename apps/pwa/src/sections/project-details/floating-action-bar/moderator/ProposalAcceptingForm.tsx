import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Button, Stack, MenuItem } from '@mui/material';
import { FormProvider, RHFSelect } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
import ModalDialog from 'components/modal-dialog';
import useLocales from 'hooks/useLocales';
import { getAllSupervisorsForSpecificTrack } from 'queries/Moderator/getAllSupervisorsForSpecificTrack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'urql';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useAuth from '../../../../hooks/useAuth';
import axiosInstance from '../../../../utils/axios';
import { dispatch, useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { REOPEN_TMRA_45c1040caab9450dbdf64cb94c50bb7d } from 'config';
import { tracks } from '../../../ceo/ceo-project-rejects';
import { getTrackList } from 'redux/slices/proposal';

interface FormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  loading?: boolean;
}

interface ProposalModeratorApprovePayload {
  path: string;
  track_id?: string;
  supervisors: string;
  notes: string;
}

interface IEmployeeByTrack {
  id: string;
  employee_name: string;
}

function ProposalAcceptingForm({ onSubmit, onClose, loading }: FormProps) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { track_list } = useSelector((state) => state.proposal);
  console.log({ track_list });
  const { enqueueSnackbar } = useSnackbar();
  const [employeeByPath, setEmployeeByPath] = React.useState<IEmployeeByTrack[]>([]);
  // console.log({ employeeByPath });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // const;

  const validationSchema = Yup.object().shape({
    path: Yup.string().required(translate('errors.cre_proposal.path.required')),
    // supervisors: Yup.string().required('Supervisors is required!'),
    notes: Yup.string(),
  });

  const defaultValues = {
    path: '',
    // supervisors: '',
    notes: '',
  };

  const methods = useForm<ProposalModeratorApprovePayload>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    resetField,
  } = methods;

  const onSubmitForm = async (data: ProposalModeratorApprovePayload) => {
    let newData: any = {
      ...data,
    };
    newData.track_id = data.path;
    delete newData.path;

    // console.log({ newData });
    onSubmit(newData);
  };
  const path = watch('path');
  // console.log({ path });
  // const path = track_list.find((item) => item.id === watch('path'))?.name ?? '';

  const shouldPause = path === '';

  const [result, mutate] = useQuery({
    query: getAllSupervisorsForSpecificTrack,
    variables: { track_id: path },
    pause: shouldPause,
  });

  const { data, fetching, error } = result;
  const handleChangeTrack = React.useCallback(
    async (track_id: string) => {
      setIsLoading(true);
      try {
        const rest = await axiosInstance.get(
          `/tender-user/find-users?hide_external=1&track_id=${track_id}&user_type_id=PROJECT_SUPERVISOR`,
          {
            headers: { 'x-hasura-role': activeRole! },
          }
        );
        // console.log(rest.data.data);
        if (rest) {
          setEmployeeByPath(rest.data.data);
        }
        // console.log('rest', rest.data.data);
      } catch (err) {
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
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRole, enqueueSnackbar, path, translate]
  );

  // React.useEffect(() => {
  //   handleChangeTrack();
  // }, [handleChangeTrack]);
  // useEffect(() => {
  //   resetField('supervisors');
  // }, [resetField]);

  // console.log('TracksData', tracksData);

  React.useEffect(() => {
    // dispatch(getProposal(id as string, role as string));
    dispatch(getTrackList(0, activeRole as string, 0));
  }, [activeRole]);

  return (
    <FormProvider methods={methods}>
      <ModalDialog
        onClose={onClose}
        isOpen={true}
        showCloseIcon={true}
        title={translate('account_manager.accept_project')}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        content={
          <Grid container rowSpacing={3} columnSpacing={7} sx={{ mt: '10px' }}>
            <Grid item md={6} xs={12}>
              <RHFSelect
                type="select"
                name="path"
                label={translate('path')}
                placeholder={translate('path')}
                disabled={isLoading}
                size="small"
                onChange={(e) => {
                  if (REOPEN_TMRA_45c1040caab9450dbdf64cb94c50bb7d) {
                    handleChangeTrack(e.target.value);
                  }
                  setValue('path', e.target.value);
                  // console.log('test on select data:', e.target.value);
                }}
                SelectProps={{
                  MenuProps: { PaperProps: { style: { maxHeight: 300 } } },
                }}
              >
                {track_list &&
                  track_list
                    .filter((item: tracks) => item.is_deleted === false)
                    .map((item: tracks, index: any) => (
                      <MenuItem key={index} value={item?.id}>
                        {formatCapitalizeText(item.name)}
                      </MenuItem>
                    ))}
              </RHFSelect>
            </Grid>
            <Grid item md={6} xs={12}>
              <RHFSelect
                type="select"
                name="supervisors"
                label={translate('supervisors')}
                placeholder={translate('select_supervisor')}
                size="small"
                disabled={isLoading}
              >
                <MenuItem value="all">{translate('all_supervisor')}</MenuItem>
                {!REOPEN_TMRA_45c1040caab9450dbdf64cb94c50bb7d &&
                  data?.users &&
                  data.users.map((item: any, index: any) => (
                    <MenuItem key={index} value={item?.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                {REOPEN_TMRA_45c1040caab9450dbdf64cb94c50bb7d &&
                  employeeByPath.length > 0 &&
                  [...employeeByPath].map((item: IEmployeeByTrack, index: any) => (
                    <MenuItem key={index} value={item?.id}>
                      {item?.employee_name}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="textArea"
                name="notes"
                label={translate('notes')}
                placeholder={translate('notes_label')}
              />
            </Grid>
          </Grid>
        }
        actionBtn={
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={onClose}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                ':hover': { backgroundColor: '#efefef' },
              }}
            >
              {translate('close')}
            </Button>
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(onSubmitForm)}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: 'background.paper',
                color: '#fff',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
                '&:hover': { backgroundColor: '#13B2A2' },
              }}
            >
              {translate('accept')}
            </LoadingButton>
          </Stack>
        }
      />
    </FormProvider>
  );
}

export default ProposalAcceptingForm;
