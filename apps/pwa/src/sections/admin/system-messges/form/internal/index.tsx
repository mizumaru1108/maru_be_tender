import React from 'react';
import { Grid } from '@mui/material';
import HeaderWithBackButton from 'sections/admin/system-messges/component/header-with-back-button';
import AdvertisingForm from 'sections/admin/system-messges/component/advertising-form';
import {
  FormInputAdvertisingForm,
  TypeAdvertisingForm,
} from 'sections/admin/system-messges/system-message.model';
import Space from '../../../../../components/space/space';
import { useNavigate } from 'react-router';
import useLocales from 'hooks/useLocales';
import dayjs from 'dayjs';
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import { role_url_map } from '../../../../../@types/commons';
import { removeEmptyKey } from '../../../../../utils/remove-empty-key';

interface Props {
  defaultvalues?: FormInputAdvertisingForm | null;
}

export default function AdvertisingInternalForm({ defaultvalues = null }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (data: FormInputAdvertisingForm) => {
    setIsLoading(true);
    const { image, showTime, ...rest } = data;
    let tmpDate = new Date();
    tmpDate.setDate(tmpDate.getDate() + 1);
    let payload: any = {
      ...rest,
      advertisement_id: defaultvalues && defaultvalues?.id ? defaultvalues?.id : undefined,
      type: defaultvalues ? undefined : 'INTERNAL',
      expired_date: dayjs(tmpDate).format('YYYY-MM-DD'),
      expired_time: dayjs(tmpDate).format('hh:mm A'),
    };
    payload = removeEmptyKey(payload);
    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    try {
      const url = defaultvalues ? '/advertisements/update' : '/advertisements/create';
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
          advertisingType={TypeAdvertisingForm.internal}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultvalues={defaultvalues}
        />
      </Grid>
    </div>
  );
}
