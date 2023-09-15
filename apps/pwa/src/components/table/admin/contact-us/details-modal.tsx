import { Stack, Typography } from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import { ContactUsTableData } from 'components/table/admin/contact-us/contact-support-table';
import GeneralDetails from 'components/table/admin/contact-us/general-details';
import ProjectInquiriesDetails from 'components/table/admin/contact-us/project-inquiries-details';
import VisitationDetails from 'components/table/admin/contact-us/visitation-details';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';

type Props = {
  open: boolean;
  handleClose: () => void;
  title: string;
  data: ContactUsTableData;
};

function ContactUsDetails({ open, handleClose, title, data }: Props) {
  console.log({ data });
  return (
    <ModalDialog
      maxWidth="sm"
      title={
        <Stack display="flex">
          <Typography variant="h6" fontWeight="bold" color="#000000">
            {`${title} (${formatCapitalizeText(data?.inquiry_type || '')})`}
          </Typography>
        </Stack>
      }
      content={
        <>
          {data?.inquiry_type === 'PROJECT_INQUIRIES' && <ProjectInquiriesDetails data={data} />}
          {data?.inquiry_type === 'GENERAL' && <GeneralDetails data={data} />}
          {data?.inquiry_type === 'VISITATION' && <VisitationDetails data={data} />}
        </>
      }
      showCloseIcon={true}
      isOpen={open}
      onClose={handleClose}
      styleContent={{ padding: '1em', backgroundColor: '#fff' }}
    />
  );
}

export default ContactUsDetails;
