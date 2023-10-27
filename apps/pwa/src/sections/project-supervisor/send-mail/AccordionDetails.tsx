import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  darken,
  Grid,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { IEditedValues } from '../../../@types/client_data';
import { EmailToClient } from '../../../components/table/send-email/types';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
interface Props {
  emailData: EmailToClient;
}

const sxPropsText: SxProps<Theme> = {
  fontWeight: 500,
  color: 'rgba(147, 163, 176, 0.8)',
  fontSize: '1rem',
  mb: 1,
  mt: 1,
};

function AccordionEmailDetail(props: Props) {
  const { translate } = useLocales();

  return (
    <Accordion
      sx={{
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        border: '1px solid rgba(147, 163, 176, 0.16)',
        borderRadius: 1,
        boxShadow: '0 8px 16px 0 rgb(145 158 171 / 24%)',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDownRoundedIcon fontSize="large" color="primary" />}
        aria-controls={`panel1main_information`}
        id={`panel1main_information_header`}
        sx={{
          '& > .MuiAccordionSummary-content': {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0E8478' }}>
              {props?.emailData?.title || '-'}
            </Typography>
            <Typography sx={{ color: darken('#93A3B0', 0.3), fontSize: '16px', fontWeight: 600 }}>
              {props?.emailData?.sender?.employee_name || '-'}
            </Typography>
          </Stack>
          <Typography sx={{ color: darken('#93A3B0', 0.3), fontSize: '14px', marginRight: 2 }}>
            {props?.emailData?.created_at
              ? dayjs(props?.emailData?.created_at).format('YYYY-MM-DD')
              : '-'}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: '#fff', borderRadius: '0 0 8px 8px' }}>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item md={12} xs={12}>
              <Typography sx={{ color: darken('#93A3B0', 0.3), fontSize: '16px', fontWeight: 700 }}>
                {`To : ${props?.emailData?.receiver_name || '-'} `}
                <span
                  style={{ color: darken('#93A3B0', 0.3), fontSize: '14px', fontWeight: 500 }}
                >{` (${props?.emailData?.receiver_email || '-'})`}</span>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              {props?.emailData?.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: props?.emailData?.content }}
                  style={{ color: darken('#93A3B0', 0.3), fontSize: '16px', fontWeight: 500 }}
                />
              ) : (
                '-'
              )}
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default AccordionEmailDetail;
