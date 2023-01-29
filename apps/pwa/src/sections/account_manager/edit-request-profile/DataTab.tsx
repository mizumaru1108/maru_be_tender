import { Box, Grid, Link, Stack, Typography, useTheme } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { type } from 'os';
import { useNavigate } from 'react-router';
import { useSelector } from 'redux/store';
import { IEditedValues } from '../../../@types/client_data';
import { bank_information } from '../../../@types/commons';
import BankImageComp from '../../shared/BankImageComp';

type DataTabProps = {
  EditValues: IEditedValues;
  // status_edit: string;
  compareValues?: IEditedValues;
  EditType: 'previous-data' | 'new-data' | 'difference';
};

function DataTab({ EditValues, compareValues, EditType }: DataTabProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();

  interface coloredBank extends bank_information {
    color?: string;
  }
  const BankData: coloredBank[] = [];
  for (const created of compareValues?.created_bank?.length ? compareValues?.created_bank : []) {
    const bank =
      EditValues &&
      EditValues.bank_information?.length &&
      EditValues.bank_information.find((b) => b.id === created.id);
    if (bank) {
      bank.color = 'green';
      BankData.push(bank);
    }
  }

  for (const updated of compareValues?.updated_bank?.length ? compareValues?.updated_bank : []) {
    const bank =
      EditValues &&
      EditValues.bank_information?.length &&
      EditValues.bank_information.find((b) => b.id === updated.id);
    if (bank) {
      bank.color = 'blue';
      BankData.push(bank);
    }
  }

  for (const deleted of compareValues?.deleted_bank?.length ? compareValues?.deleted_bank : []) {
    const bank =
      EditValues &&
      EditValues.bank_information?.length &&
      EditValues.bank_information.find((b) => b.id === deleted.id);
    if (bank) {
      bank.color = 'red';
      BankData.push(bank);
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        {/* Main Information */}
        <Stack spacing={2} direction="column" component="div">
          <Typography variant="h6">
            {translate('account_manager.partner_details.main_information')}
          </Typography>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.entity_name_of_partner')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('entity') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('entity') && EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.entity ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.number_of_fulltime_employees')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('num_of_employed_facility') &&
                  EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('num_of_employed_facility') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.num_of_employed_facility ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.number_of_beneficiaries')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('num_of_beneficiaries') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('num_of_beneficiaries') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.num_of_beneficiaries ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.date_of_establishment')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('date_of_esthablistmen') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('date_of_esthablistmen') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.date_of_esthablistmen?.split('T')[0] ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.headquarters')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('headquarters') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('headquarters') && EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.headquarters ?? '-'}
            </Typography>
          </Box>
        </Stack>

        {/* License Information */}
        <Stack
          spacing={2}
          direction="column"
          sx={{ backgroundColor: '#FFFFFF', width: '100%', mt: 4, p: 2, borderRadius: 1 }}
          component="div"
        >
          <Typography variant="h6">
            {translate('account_manager.partner_details.license_information')}
          </Typography>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.license_number')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('license_number') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('license_number') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.license_number ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.license_expiry_date')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('license_expired') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('license_expired') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.license_expired?.split('T')[0] ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.license_issue_date')}:
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                color:
                  compareValues?.hasOwnProperty('license_issue_date') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('license_issue_date') &&
                      EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.license_issue_date?.split('T')[0] ?? '-'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" component="p" sx={{ color: '#93A3B0' }}>
              {translate('account_manager.partner_details.license_file')}:
            </Typography>
            <Typography
              variant="h6"
              // component="p"
              component={Link}
              href={EditValues.license_file.url ?? '#'}
              target="_blank"
              sx={{
                mt: 1,
                fontWeight: theme.typography.fontWeightMedium,
                textDecoration: 'underline',
                cursor: 'pointer',
                color:
                  compareValues?.hasOwnProperty('license_file') && EditType === 'new-data'
                    ? 'green'
                    : compareValues?.hasOwnProperty('license_file') && EditType === 'previous-data'
                    ? 'red'
                    : 'black',
              }}
            >
              {EditValues.license_file.url ?? '-'}
            </Typography>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* Administrative Data */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: theme.typography.fontWeightBold }}>
          {translate('account_manager.partner_details.administrative_data')}
        </Typography>
        <Grid container spacing={{ xs: 2 }} component="div">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.ceo_name')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('ceo_name') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('ceo_name') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.ceo_name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.ceo_mobiles')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('ceo_mobile') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('ceo_mobile') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.ceo_mobile}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.data_entry_name')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('data_entry_name') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('data_entry_name') &&
                        EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.data_entry_name ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.mobile_data_entry')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('data_entry_mobile') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('data_entry_mobile') &&
                        EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.data_entry_mobile ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.data_entry_mail')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('data_entry_mail') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('data_entry_mail') &&
                        EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.data_entry_mail ?? '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Typography
          variant="subtitle1"
          sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
        >
          {translate('account_manager.partner_details.contact_information')}
        </Typography>
        <Grid container spacing={{ xs: 2 }} component="div">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.center_management')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('center_administration') &&
                    EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('center_administration') &&
                        EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.center_administration ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.governorate')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('governorate') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('governorate') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.governorate ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.region')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('region') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('region') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.region ?? '-'}
              </Typography>
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.email')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{ mt: 1, fontWeight: theme.typography.fontWeightMedium }}
              >
                {EditValues.email ?? '-'}
              </Typography>
            </Box>
          </Grid> */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.twitter_account')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('twitter_acount') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('twitter_acount') &&
                        EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues?.twitter_acount ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.website')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,
                  color:
                    compareValues?.hasOwnProperty('website') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('website') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues?.website ?? '-'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body2" component="p" sx={{ color: '#93A3B0' }}>
                {translate('account_manager.partner_details.phone')}:
              </Typography>
              <Typography
                variant="subtitle1"
                component="p"
                sx={{
                  mt: 1,
                  fontWeight: theme.typography.fontWeightMedium,

                  color:
                    compareValues?.hasOwnProperty('phone') && EditType === 'new-data'
                      ? 'green'
                      : compareValues?.hasOwnProperty('phone') && EditType === 'previous-data'
                      ? 'red'
                      : 'black',
                }}
              >
                {EditValues.phone ?? '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bank Information */}
        <Typography
          variant="subtitle1"
          sx={{ mt: 4, mb: 2, fontWeight: theme.typography.fontWeightBold }}
        >
          {translate('account_manager.partner_details.bank_information')}
        </Typography>
        <Grid container spacing={{ xs: 2 }} component="div">
          {EditValues?.bank_information && EditValues?.bank_information.length ? (
            EditValues?.bank_information.map((v: any, i: any) => (
              <Grid item xs={12} md={6} key={i}>
                <BankImageComp
                  enableButton={true}
                  bankName={`${v.bank_name}`}
                  accountNumber={`${v.bank_account_number}`}
                  bankAccountName={`${v.bank_account_name}`}
                  imageUrl={v?.card_image?.url}
                  size={v?.card_image?.size}
                  borderColor={v?.color}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12} md={6}>
              -
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DataTab;
