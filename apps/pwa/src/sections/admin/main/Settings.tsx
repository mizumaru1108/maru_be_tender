import { Grid, Typography } from '@mui/material';
import SettingElem from './SettingElem';

import useLocales from 'hooks/useLocales';

const data = [
  { name: 'transaction-progression', label: 'transaction_progression' },
  { name: 'tracks-budget', label: 'tracks_budget' },
  { name: 'system-messages', label: 'system_messages' },
  { name: 'client-list', label: 'client_list' },
  { name: 'users-and-permissions', label: 'users_and_permissions' },
  // { name: 'authority', label: 'authority' },
  // { name: 'entity-area', label: 'entity_area' },
  // { name: 'regions-project-location', label: 'regions_project_location' },
  // { name: 'entity-classification', label: 'entity_classification' },
  { name: 'bank-name', label: 'bank_name' },
  { name: 'beneficiaries', label: 'beneficiaries' },
];

function Settings() {
  const { translate } = useLocales();

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{translate('pages.admin.settings.label.settings')}</Typography>
      </Grid>
      {data.map((item, index) => (
        <Grid item key={index} md={2} xs={12}>
          <SettingElem {...item} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Settings;
