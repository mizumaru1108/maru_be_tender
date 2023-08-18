import { Grid, Typography } from '@mui/material';
import SettingElem from './SettingElem';

import useLocales from 'hooks/useLocales';
import {
  FEATURE_MENU_ADMIN_ADD_AUTHORITY,
  FEATURE_MENU_ADMIN_ENTITY_AREA,
  FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION,
  FEATURE_MENU_ADMIN_REGIONS,
} from 'config';

interface Setting {
  name?: string;
  label?: string;
}

function Settings() {
  const { translate } = useLocales();

  const data: Setting[] = [
    { name: 'transaction-progression', label: 'transaction_progression' },
    { name: 'tracks-budget', label: 'tracks_budget' },
    { name: 'system-messages', label: 'system_messages' },
    { name: 'client-list', label: 'client_list' },
    { name: 'users-and-permissions', label: 'users_and_permissions' },
    // { name: 'authority', label: 'authority' },
    {
      ...(FEATURE_MENU_ADMIN_ADD_AUTHORITY && { name: 'authority', label: 'authority' }),
    },
    // FEATURE_MENU_ADMIN_ENTITY_AREA && {
    //   name: 'entity-area',
    //   label: 'entity_area',
    // },
    {
      ...(FEATURE_MENU_ADMIN_ENTITY_AREA && {
        name: 'entity-area',
        label: 'entity_area',
      }),
    },
    // FEATURE_MENU_ADMIN_REGIONS && {
    //   name: 'regions-project-location',
    //   label: 'regions_project_location',
    // },
    {
      ...(FEATURE_MENU_ADMIN_REGIONS && {
        name: 'regions-project-location',
        label: 'regions_project_location',
      }),
    },
    // FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION && {
    //   name: 'entity-classification',
    //   label: 'entity_classification',
    // },
    {
      ...(FEATURE_MENU_ADMIN_ENTITY_CLASSIFICATION && {
        name: 'entity-classification',
        label: 'entity_classification',
      }),
    },
    { name: 'bank-name', label: 'bank_name' },
    { name: 'beneficiaries', label: 'beneficiaries' },
  ];
  // console.log({ data });
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">{translate('pages.admin.settings.label.settings')}</Typography>
      </Grid>
      {[...data]
        .filter((item: Setting) => item.name)
        .map((item, index) => (
          <Grid item key={index} md={2} xs={12}>
            <SettingElem {...item} />
          </Grid>
        ))}
    </Grid>
  );
}

export default Settings;
