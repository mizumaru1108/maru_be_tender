import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import axiosInstance from 'utils/axios';

interface Props {
  params: string;
}

export default function PortarReportsTable({ params }: Props) {
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchingTableData = React.useCallback(async () => {
    setIsLoading(true);
    let url = `/tender-proposal/report-list`;
    if (params) {
      url = `${url}${params}`;
    }
    try {
      const res = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (res) {
        console.log('res', res.data.data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, params]);

  React.useEffect(() => {
    if (params !== '') {
      fetchingTableData();
    }
  }, [fetchingTableData, params]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return <></>;
}
