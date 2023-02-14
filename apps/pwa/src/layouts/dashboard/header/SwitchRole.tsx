import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useAuth from 'hooks/useAuth';
import { FusionAuthRoles, role_url_map } from '../../../@types/commons';
import { useNavigate } from 'react-router';
import useLocales from 'hooks/useLocales';

function SwitchRole() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { user, activeRole, changeActiveRole } = useAuth();
  const roles = user?.registrations[0]?.roles;
  const [role, setRole] = React.useState<FusionAuthRoles>(activeRole!);

  const handleChange = (event: SelectChangeEvent) => {
    const roleIndex = roles?.indexOf(event.target.value as FusionAuthRoles);
    localStorage.setItem('activeRoleIndex', roleIndex);
    changeActiveRole(event.target.value as FusionAuthRoles);
    setRole(event.target.value as FusionAuthRoles);
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
