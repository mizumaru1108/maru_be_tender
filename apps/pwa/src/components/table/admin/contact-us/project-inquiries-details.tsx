import { Stack, Typography } from '@mui/material';
import { ContactUsTableData } from 'components/table/admin/contact-us/contact-support-table';
import useLocales from 'hooks/useLocales';

interface Props {
  data: ContactUsTableData;
}

export default function ProjectInquiriesDetails({ data }: Props) {
  const { translate } = useLocales();
  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography variant="h6">
          {translate('contact_support.table.headerCell.title_message')}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          {data?.title || '-'}
        </Typography>
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          {translate('contact_support.table.headerCell.message')}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          {data?.message || '-'}
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
