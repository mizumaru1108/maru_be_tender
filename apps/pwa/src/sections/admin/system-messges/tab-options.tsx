import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
import React from 'react';

interface Props {
  tabsValue: number;
  onReturnValue: (value: number) => void;
}

export default function TabOptionSystemMessages({ onReturnValue, tabsValue = 0 }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();

  // const [value, setValue] = React.useState(tabsValue);
  const value = tabsValue;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // setValue(newValue);
    onReturnValue(newValue);
  };

  return (
    <React.Fragment>
      <Tabs
        data-cy="tabs_appointments_with_organization"
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          bgcolor: '#93A3B029',
          borderRadius: 2,
          // flex: 0.3,
        }}
      >
        <Tab
          data-cy="tabs_appointments"
          label={
            <Typography>{translate('system_messages.tab.options.internal_messages')} </Typography>
          }
          sx={{
            width: '50%',
            borderRadius: '10px',
            px: 3,
            '&.MuiTab-root:not(:last-of-type)': {
              marginRight: 0,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        />
        <Tab
          data-cy="tabs_appointments"
          label={
            <Typography>{translate('system_messages.tab.options.advertising_tape')} </Typography>
          }
          sx={{
            width: '50%',
            borderRadius: '10px',
            px: 3,
            '&.MuiTab-root:not(:last-of-type)': {
              marginRight: 0,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}
