import { Container, styled } from '@mui/material';
import Page from 'components/Page';
import { FEATURE_BANNER } from 'config';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useParams } from 'react-router';
import useAuth from '../../../../hooks/useAuth';
import { getTrackList } from '../../../../redux/slices/proposal';
import { dispatch } from '../../../../redux/store';
import AdvertisingExternalForm from '../../../../sections/admin/system-messges/form/external';
import { FormInputAdvertisingForm } from '../../../../sections/admin/system-messges/system-message.model';
import axiosInstance from '../../../../utils/axios';

function AdvertisingExternalPage() {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const id: string | null = params?.id ? (params?.id as string) : null;

  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState<FormInputAdvertisingForm | null>(null);
  const [error, setError] = React.useState<any | null>(null);
  // console.log({ value, error, id });

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 40,
  }));

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    // const url = `advertisements`;
    const url = `/advertisements`;
    try {
      const response = await axiosInstance.get(`${url}/${id}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log({ response });
      if (response) {
        // console.log('test response', response?.data?.data);
        setValue(response?.data?.data);
      }
    } catch (err) {
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
        setError(err.message);
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
        setError(translate('pages.common.internal_server_error'));
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    dispatch(getTrackList(0, activeRole! as string));
  }, [activeRole]);

  React.useEffect(() => {
    if (id !== null) {
      // console.log('test id:', id);
      fetchingData();
    }
  }, [id, fetchingData]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;
  if (error !== null) return <>{error}</>;

  return (
    // <Page title="System Messages">
    <Page title={translate('pages.admin.advertising_external_form')}>
      <Container>
        <ContentStyle>
          {FEATURE_BANNER && <AdvertisingExternalForm defaultvalues={value} />}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default AdvertisingExternalPage;
