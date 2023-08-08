import { Grid } from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../../../@types/commons';
import Space from '../../../../../components/space/space';
import useAuth from '../../../../../hooks/useAuth';
import useLocales from '../../../../../hooks/useLocales';
import axiosInstance from '../../../../../utils/axios';
import { removeEmptyKey } from '../../../../../utils/remove-empty-key';
import AdvertisingForm from '../../component/advertising-form';
import HeaderWithBackButton from '../../component/header-with-back-button';
import { FormInputAdvertisingForm, TypeAdvertisingForm } from '../../system-message.model';

interface Props {
  defaultvalues?: FormInputAdvertisingForm | null;
}

export default function AdvertisingExternalForm({ defaultvalues = null }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (data: FormInputAdvertisingForm) => {
    // console.log('data:', data);
    setIsLoading(true);
    const { image, showTime, expiredTime, ...rest } = data;
    const tmpDate = new Date();
    const tmpPayload: any = {
      ...rest,
      banner_id: defaultvalues && defaultvalues?.id ? defaultvalues?.id : undefined,
      type: defaultvalues ? undefined : 'EXTERNAL',
      expired_date: dayjs(showTime).format('YYYY-MM-DD'),
      expired_time: dayjs(expiredTime, 'HH:mm').format('hh:mm A'),
      expired_at: dayjs(
        `${dayjs(showTime).format('YYYY-MM-DD')} ${dayjs(tmpDate).format('hh:mm A')}`,
        'YYYY-MM-DD hh:mm A'
      ).valueOf(),
      // expired_at: dayjs(showTime).valueOf(), // Adding the expired_at field with the Unix timestamp
      // date: dayjs(tmpDate).format('YYYY-MM-DD'),
    };
    let payload = removeEmptyKey(tmpPayload);
    delete payload.image;
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    // console.log('test file image:', data?.image?.file[0], payload);
    if (defaultvalues) {
      if (
        defaultvalues?.logo &&
        data?.image?.file &&
        data?.image?.file.length > 0 &&
        data?.image?.file[0]
      ) {
        formData.append('deleted_logo_urls[0]', defaultvalues?.logo[0].url as string);
        formData.append('logo', data?.image?.file[0] as Blob);
      }
    } else {
      formData.append('logo', data?.image?.file[0] as Blob);
    }
    const url = defaultvalues ? '/banners/update' : '/banners/create';
    try {
      if (defaultvalues) {
        const rest = await axiosInstance.patch(url, formData, {
          headers: { 'x-hasura-role': activeRole! },
        });
        if (rest) {
          if (activeRole) {
            navigate(`/${role_url_map[`${activeRole}`]}/dashboard/system-messages`);
          }
          enqueueSnackbar(translate('system_messages.snackbar.internal_messages_success_create'), {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        }
      } else {
        const rest = await axiosInstance.post(url, formData, {
          headers: { 'x-hasura-role': activeRole! },
        });
        if (rest) {
          if (activeRole) {
            navigate(`/${role_url_map[`${activeRole}`]}/dashboard/system-messages`);
          }
          enqueueSnackbar(translate('system_messages.snackbar.internal_messages_success_create'), {
            variant: 'success',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        }
      }
    } catch (error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
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
  };
  return (
    <div>
      <Grid>
        <HeaderWithBackButton title={'system_messages.add_new_advertising'} backButton />
        <Space direction="horizontal" size="large" />
        <AdvertisingForm
          advertisingType={TypeAdvertisingForm.external}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultvalues={defaultvalues}
        />
      </Grid>
    </div>
  );
}
