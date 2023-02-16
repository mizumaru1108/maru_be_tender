import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
import { IEditedValues } from '../../../../@types/client_data';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ButtonDownlaodLicense from '../../../../components/button/ButtonDownloadLicense';
import ButtonDownloadFiles from '../../../../components/button/ButtonDownloadFiles';
import BankImageComp from '../../../shared/BankImageComp';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
interface Props {
  userInfo: IEditedValues | undefined;
}

const sxPropsText = {
  fontWeight: 500,
  color: 'rgba(147, 163, 176, 0.8)',
  fontSize: '1rem',
  mb: 1,
  mt: 1,
};

function BankInformationAccording({ userInfo }: Props) {
  const { translate } = useLocales();

  return (
    <Accordion
      sx={{
        backgroundColor: 'rgba(147, 163, 176, 0.16)',
        // my: 2,
        p: 1.5,
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
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#0E8478' }}>
          {translate('project_owner_details.accordion.bank_tab.header')}
        </Typography>{' '}
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid item xs={12} md={12}>
              <Typography sx={sxPropsText}>
                {translate('project_owner_details.accordion.bank_tab.bank_cards')}
              </Typography>
              {userInfo &&
                userInfo.bank_informations &&
                userInfo.bank_informations.length > 0 &&
                userInfo.bank_informations.map((item, index) => (
                  <>
                    <Grid item xs={6} md={4}>
                      <BankImageComp
                        key={index}
                        enableButton={true}
                        bankName={`${item.bank_name}`}
                        accountNumber={`${item.bank_account_number}`}
                        bankAccountName={`${item.bank_account_name}`}
                        imageUrl={item?.card_image?.url ?? ''}
                        size={item?.card_image?.size}
                        type={item?.card_image?.type}
                        borderColor={item?.color ?? 'transparent'}
                      />
                    </Grid>
                  </>
                ))}
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default BankInformationAccording;
