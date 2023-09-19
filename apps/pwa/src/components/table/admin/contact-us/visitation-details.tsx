import { Stack, Typography } from '@mui/material';
import { ContactUsTableData } from 'components/table/admin/contact-us/contact-support-table';
import dayjs from 'dayjs';
import useLocales from 'hooks/useLocales';

interface Props {
  data: ContactUsTableData;
}

export default function VisitationDetails({ data }: Props) {
  const { translate } = useLocales();
  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography variant="h6">
          {translate('contact_support.table.headerCell.date_of_visit')}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          {(data?.date_of_visit && dayjs(data?.date_of_visit).format('YYYY-MM-DD')) || '-'}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          {translate('contact_support.table.headerCell.reason_of_visit')}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          {data?.visit_reason || '-'}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          {translate('contact_support.table.headerCell.employee_name')}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          {data?.user?.employee_name || '-'}
        </Typography>
      </Stack>
    </>
  );
}
