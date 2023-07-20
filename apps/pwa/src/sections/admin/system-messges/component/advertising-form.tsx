import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, MenuItem, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { FormProvider, RHFDatePicker, RHFSelect, RHFTextField } from 'components/hook-form';
import { CustomFile } from 'components/upload';
import dayjs, { Dayjs } from 'dayjs';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TypeAdvertisingForm } from 'sections/admin/system-messges/system-message.model';
import * as Yup from 'yup';
import BaseField from '../../../../components/hook-form/BaseField';
import { RHFUploadSingleFileBe } from '../../../../components/hook-form/RHFUploadBe';
import Space from '../../../../components/space/space';
import useAuth from '../../../../hooks/useAuth';
import { getTrackList } from '../../../../redux/slices/proposal';
import { dispatch, useSelector } from '../../../../redux/store';
import { checkFileExtension, FileType } from '../../../../utils/checkFileExtension';
import { formatCapitalizeText } from '../../../../utils/formatCapitalizeText';
import { tracks } from '../../../ceo/ceo-project-rejects';

interface FormInputAdvertisingForm {
  title: string;
  content: string;
  showTime: Date | string;
  track: string;
  // image: CustomFile | string | null;
  image: any;
}

interface Props {
  advertisingType: TypeAdvertisingForm;
}

export default function AdvertisingForm({ advertisingType }: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { loadingCount, track_list } = useSelector((state) => state.proposal);
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2018-01-01T00:00:00.000Z'));

  const validationSchema = Yup.object().shape({
    ...(advertisingType === TypeAdvertisingForm.internal && {
      title: Yup.string().required(translate('system_messages.form.errors.title')),
      content: Yup.string().required(translate('system_messages.form.errors.content')),
      track: Yup.string().required(translate('system_messages.form.errors.track')),
      // showTime: Yup.string().required(translate('system_messages.form.errors.showTime')),
    }),
    ...(advertisingType === TypeAdvertisingForm.external && {
      title: Yup.string().required(translate('system_messages.form.errors.title')),
      content: Yup.string().required(translate('system_messages.form.errors.content')),
      showTime: Yup.string().required(translate('system_messages.form.errors.showTime')),
      image: Yup.mixed()
        .test('size', translate('system_messages.form.errors.image.size'), (value) => {
          if (value) {
            const maxSize = 1024 * 1024 * 200;
            console.log('size:', value.size);
            console.log('maxSize: ', maxSize);
            if (value.size > 1024 * 1024 * 200) {
              return false;
            }
          }
          return true;
        })
        .test(
          'fileExtension',
          translate('system_messages.form.errors.image.fileExtension'),
          (value) => {
            if (value) {
              // console.log('fileExtension: ', value.fileExtension);
              if (
                value.fileExtension &&
                !checkFileExtension(value.fileExtension, FileType.image, true)
              ) {
                return false;
              } else if (value.type && !checkFileExtension(value.type, FileType.image, true)) {
                return false;
              }
            }
            return true;
          }
        ),
    }),
  });
  const defaultValues = {
    ...(advertisingType === TypeAdvertisingForm.internal && {
      title: '',
      content: '',
      showTime: '',
    }),
    ...(advertisingType === TypeAdvertisingForm.external && {
      title: '',
      content: '',
      showTime: '',
      image: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
        file: undefined,
      },
      // image: null,
    }),
  };

  const methods = useForm<FormInputAdvertisingForm>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = (formValue: FormInputAdvertisingForm) => {
    console.log({ formValue });
  };
  React.useEffect(() => {
    dispatch(getTrackList(0, activeRole! as string));
  }, [activeRole]);
  if (loadingCount) return <>{translate('pages.common.loading')}</>;
  return (
    <div>
      <Grid item md={12}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
          <Space direction="horizontal" size="small" />
          <Grid item md={12} xs={12}>
            <RHFTextField
              name="title"
              data-cy="system_messages.form.title"
              label={translate('system_messages.form.title.label')}
              placeholder={translate('system_messages.form.title.placeholder')}
            />
          </Grid>
          <Space direction="horizontal" size="small" />
          <Grid item md={8} xs={12}>
            <RHFTextField
              multiline
              rows={3}
              name="content"
              data-cy="system_messages.form.content"
              label={translate('system_messages.form.content.label')}
              placeholder={translate('system_messages.form.content.placeholder')}
            />
          </Grid>
          <Space direction="horizontal" size="small" />
          {advertisingType === TypeAdvertisingForm.internal && (
            <>
              <Grid item md={12} xs={12}>
                <RHFSelect
                  type="select"
                  name="track"
                  data-cy="system_messages.form.track"
                  label={translate('system_messages.form.track.label')}
                  placeholder={translate('system_messages.form.track.placeholder')}
                  size="small"
                >
                  {/* {track_list &&
                    track_list.length > 0 &&
                    track_list?.map((item: tracks, index: any) => (
                      <MenuItem key={index} value={item?.id}>
                        {formatCapitalizeText(item.name)}
                      </MenuItem>
                    ))} */}
                  {[...track_list]
                    .filter((item: tracks) => item.is_deleted === false)
                    .map((item: tracks, index: any) => (
                      <MenuItem
                        data-cy={`system_messages.form.track-${index}`}
                        key={index}
                        value={item?.id}
                      >
                        {formatCapitalizeText(item?.name)}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Grid>
              <Space direction="horizontal" size="small" />
            </>
          )}
          {advertisingType === TypeAdvertisingForm.external && (
            <>
              <Grid item md={4} xs={12}>
                <RHFDatePicker
                  name="showTime"
                  data-cy="system_messages.form.showTime"
                  label={translate('system_messages.form.showTime.label')}
                  placeholder={translate('system_messages.form.showTime.placeholder')}
                  InputProps={{
                    inputProps: {
                      min: new Date(new Date().setDate(new Date().getDate() + 1))
                        .toISOString()
                        .split('T')[0],
                    },
                  }}
                />
              </Grid>
              <Space direction="horizontal" size="small" />
              <Grid item md={12} xs={12}>
                <Typography variant="subtitle2" color="text.secondary" fontSize={'16px'}>
                  {/* {'test'} */}
                  {translate('system_messages.form.image.label')}
                </Typography>
                <RHFUploadSingleFileBe
                  name="image"
                  data-cy="system_messages.form.image"
                  placeholder={translate('system_messages.form.image.placeholder')}
                />
              </Grid>
              <Space direction="horizontal" size="small" />
            </>
          )}
          <Grid item md={4} xs={12} display="flex" flex="column" justifyContent="center">
            <Button
              data-cy="system_messages.button.addition"
              variant="contained"
              sx={{ width: '200px', height: '40px', fontSize: '16px' }}
              size={'medium'}
              type="submit"
            >
              {translate('system_messages.button.addition')}
            </Button>
            <Space direction="vertical" size="small" />
            <Button
              data-cy="system_messages.button.cancel"
              variant="contained"
              color="error"
              sx={{
                width: '200px',
                height: '40px',
                fontSize: '16px',
                '&:hover': { backgroundColor: '#f75c5c' },
              }}
              size={'medium'}
            >
              {translate('system_messages.button.cancel')}
            </Button>
          </Grid>
        </FormProvider>
      </Grid>
    </div>
  );
}
