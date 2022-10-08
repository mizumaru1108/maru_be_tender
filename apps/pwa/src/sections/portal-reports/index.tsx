import { ReactNode, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// material
import { Grid, Typography, TextField, Stack, Button } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// sections
import HeaderTabs from './HeaderTabs';

// -------------------------------------------------------------------------------

type Props = {
  children?: ReactNode;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
};

// -------------------------------------------------------------------------------

export default function MainPortalReports({ children, startDate, endDate }: Props) {
  const { translate } = useLocales();

  // Mock Data
  const [valueStartDate, setValueStartDate] = useState<Dayjs | null>(startDate!);
  const [valueEndDate, setValueEndDate] = useState<Dayjs | null>(endDate!);

  const handleStartDate = (newValue: Dayjs | null) => {
    setValueStartDate(newValue);
  };

  const handleEndDate = (newValue: Dayjs | null) => {
    setValueEndDate(newValue);
  };

  return (
    <>
      <Grid container spacing={3} alignItems="center" justifyContent="space-between">
        <Grid item xs={2}>
          <Typography variant="h4">
            {translate('section_portal_reports.heading.reports')}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label={translate('section_portal_reports.form.date_picker.label.start_date')}
                  inputFormat="MM/DD/YYYY"
                  value={valueStartDate}
                  onChange={handleStartDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{
                        '& > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root': {
                          color: '#212B36',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label={translate('section_portal_reports.form.date_picker.label.end_date')}
                  inputFormat="MM/DD/YYYY"
                  value={valueEndDate}
                  onChange={handleEndDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{
                        '& > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root': {
                          color: '#212B36',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => alert('Create a special reports')}>
                {translate('section_portal_reports.button.create_special_report')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={2} direction="column">
        <HeaderTabs />
      </Stack>
    </>
  );
}
