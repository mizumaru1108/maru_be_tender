import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useAuth from 'hooks/useAuth';
import { FusionAuthRoles, role_url_map } from '../../../@types/commons';
import { useNavigate } from 'react-router';
import useLocales from 'hooks/useLocales';
import { dispatch } from 'redux/store';
import { setFiltered } from 'redux/slices/searching';

function SwitchRole() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { user, activeRole, changeActiveRole } = useAuth();
  const roles = user?.registrations[0]?.roles;
  const [role, setRole] = React.useState<FusionAuthRoles>(activeRole!);

  const handleChange = (event: SelectChangeEvent) => {
    localStorage.removeItem('filter_project_name');
    localStorage.removeItem('filter_client_name');
    localStorage.removeItem('filter_project_status');
    localStorage.removeItem('filter_project_track');
    localStorage.removeItem('filter_sorting_field');
    localStorage.removeItem('filter_sort');
    localStorage.removeItem('filter_range_end_date');
    localStorage.removeItem('filter_range_start_date');

    const roleIndex = roles?.indexOf(event.target.value as FusionAuthRoles);
    localStorage.setItem('activeRoleIndex', roleIndex);
    changeActiveRole(event.target.value as FusionAuthRoles);
    setRole(event.target.value as FusionAuthRoles);
    dispatch(setFiltered(''));
    navigate(`/${role_url_map[`${event.target.value as FusionAuthRoles}`]}/dashboard/app`);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">
          {translate('account_permission')}
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={role}
          onChange={handleChange}
          label="Age"
        >
          {roles.map((item: any, index: any) => (
            <MenuItem key={index} value={item}>
              {translate(item)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default SwitchRole;
