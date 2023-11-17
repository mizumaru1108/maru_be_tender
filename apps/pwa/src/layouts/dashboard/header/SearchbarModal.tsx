import React, { useEffect, useState } from 'react';
// @mui
import {
  Grid,
  IconButton,
  Box,
  Divider,
  Input,
  Stack,
  Typography,
  Link,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
} from '@mui/material';
import ModalDialog from 'components/modal-dialog';
import Iconify from 'components/Iconify';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useDispatch, useSelector } from 'redux/store';
import {
  setSort,
  setFiltered,
  setActiveOptionAccountManager,
  setOutterStatus,
  ActiveOptionsSearching,
  setActiveOptionsSearching,
} from 'redux/slices/searching';
import { useNavigate } from 'react-router';
import { role_url_map } from '../../../@types/commons';

// ----------------------------------------------------------------------

export default function SearchbarModal() {
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();

  const { filtered } = useSelector((state) => state.searching);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('asc');
  const [arrowStatus, setArrowStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [stateSearchProposal, setStateSearchProposal] = useState<ActiveOptionsSearching>({
    employee_name: true,
    outter_status: false,
    project_name: true,
    project_number: true,
    project_track: false,
  });

  const [stateStatus, setStateStatus] = useState({
    pending: true,
    canceled: true,
    completed: true,
    ongoing: true,
    revision: true,
    amandament: true,
  });

  const [stateAccManager, setStateAccManager] = React.useState({
    client_name: true,
    account_status: false,
    entity_name: true,
    entity_mobile: false,
    license_number: false,
    email: false,
  });

  // State Account Manager
  const { client_name, email, entity_mobile, license_number } = stateAccManager;
  const filteredAccManager = Object.fromEntries(
    Object.entries(stateAccManager).filter(([_, v]) => v)
  );
  const errorAccManager = Object.keys(filteredAccManager).length !== 1;

  const onChangeAccManager = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateAccManager({
      ...stateAccManager,
      [event.target.name]: event.target.checked,
    });
  };

  const { employee_name, outter_status, project_name, project_number, project_track } =
    stateSearchProposal;
  const filteredState = Object.fromEntries(
    Object.entries({
      employee_name,
      outter_status,
      project_name,
      project_number,
      project_track,
    }).filter(([_, v]) => v)
  );

  const error = Object.keys(filteredState).length !== 1;

  const handleSearchAccManager = async () => {
    navigate(`/${role_url_map[`${activeRole!}`]}/searching`);
    setShow(false);
    dispatch(setActiveOptionAccountManager(stateAccManager));
    if (filtered && filtered !== '') {
      dispatch(setFiltered(filtered));
    } else {
      dispatch(setFiltered(null));
    }
    dispatch(setSort(sortBy));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (activeRole && activeRole === 'tender_accounts_manager') {
        handleSearchAccManager();
      } else {
        handleSearch();
      }
    }
  };

  const handleClearAll = () => {
    setStateSearchProposal({
      employee_name: true,
      outter_status: false,
      project_name: true,
      project_number: true,
      project_track: false,
    });
    setSortBy('asc');
  };

  const onChangeSearchProposal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateSearchProposal({
      ...stateSearchProposal,
      [event.target.name]: event.target.checked,
    });
  };

  const { pending, canceled, completed, ongoing, revision, amandament } = stateStatus;
  const filterStatus = Object.fromEntries(
    Object.entries({ pending, canceled, completed, ongoing, revision, amandament }).filter(
      ([_, v]) => v
    )
  );
  const optionsProjectStatus = [
    {
      name: 'pending',
      checked: pending,
      label: translate('outter_status.PENDING').toLowerCase(),
    },
    {
      name: 'canceled',
      checked: canceled,
      label: translate('outter_status.CANCELED').toLowerCase(),
    },
    {
      name: 'completed',
      checked: completed,
      label: translate('outter_status.COMPLETED').toLowerCase(),
    },
    {
      name: 'ongoing',
      checked: ongoing,
      label: translate('outter_status.ONGOING').toLowerCase(),
    },
    {
      name: 'revision',
      checked: revision,
      label: translate('outter_status.ON_REVISION').toLowerCase(),
    },
    {
      name: 'amandament',
      checked: amandament,
      label: translate('outter_status.ASKED_FOR_AMANDEMENT').toLowerCase(),
    },
  ];

  const handleChangeProjectStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateStatus({
      ...stateStatus,
      [event.target.name]: event.target.checked,
    });
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy((event.target as HTMLInputElement).value);
  };

  const handleClick = (type: string) => {
    if (type === 'input') {
      setShow(!show);
    }
  };

  function handleArrow(type: string, value: boolean) {
    return (
      <Box>
        {currentLang.value === 'en' ? (
          <Iconify
            icon={'il:arrow-right'}
            sx={{
              alignItems: 'center',
              color: 'text.disabled',
              width: 20,
              height: 20,
              pt: '5px',
              mx: '8px',
              cursor: 'pointer',
              transition: '0.3s',
              transform: value ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
            onClick={() => handleClick(type)}
          />
        ) : (
          <Iconify
            icon={'il:arrow-left'}
            sx={{
              alignItems: 'center',
              color: 'text.disabled',
              width: 20,
              height: 20,
              pt: '5px',
              mx: '8px',
              cursor: 'pointer',
              transition: '0.3s',
              transform: value ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
            onClick={() => handleClick(type)}
          />
        )}
      </Box>
    );
  }

  const handleSearch = () => {
    setShow(false);
    // for status
    const currentStatus = Object.keys(filterStatus);
    const newFilterStatus = currentStatus
      .map((status) => {
        if (status === 'pending') {
          return `PENDING`;
        } else if (status === 'canceled') {
          return `CANCELED`;
        } else if (status === 'completed') {
          return `COMPLETED`;
        } else if (status === 'ongoing') {
          return `ONGOING`;
        } else if (status === 'revision') {
          return `ON_REVISION`;
        } else if (status === 'amandament') {
          return `ASKED_FOR_AMANDEMENT`;
        }
        return false;
      })
      .toString();

    dispatch(setOutterStatus(newFilterStatus));
    dispatch(setActiveOptionsSearching(stateSearchProposal));
    dispatch(setSort(sortBy));
    navigate(`/${role_url_map[`${activeRole!}`]}/searching`);

    setOpenModal(false);
  };

  useEffect(() => {
    if (stateSearchProposal.outter_status) {
      setArrowStatus(true);
    } else {
      setArrowStatus(false);
    }
  }, [stateSearchProposal]);

  return (
    <React.Fragment>
      <IconButton onClick={() => setOpenModal(true)}>
        <Iconify icon={'eva:search-outline'} width={28} height={28} color="#000" />
      </IconButton>
      <ModalDialog
        maxWidth="sm"
        isOpen={openModal}
        content={
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Input
                  sx={{ width: '100%' }}
                  disableUnderline={true}
                  value={filtered}
                  onChange={(e) => {
                    dispatch(setFiltered(e.target.value));
                  }}
                  placeholder={translate('search_component.placeholder')}
                  onKeyUp={handleKeyUp}
                  startAdornment={
                    <Iconify
                      icon={'eva:search-fill'}
                      sx={{ color: 'rgba(145, 158, 171, 0.86)', width: 25, height: 25, mr: 1 }}
                    />
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider orientation="horizontal" flexItem />
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ mt: 1, color: '#0E8478', fontWeight: 600 }}>
                  {translate('search_component.project_type')}
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleClearAll}
                  sx={{
                    mt: 1,
                    px: 2,
                    color: 'red',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {translate('notification.clear_all')}
                </Link>
              </Stack>
              {activeRole && activeRole === 'tender_accounts_manager' ? (
                <>Handle Acc Manager</>
              ) : (
                <FormControl required error={error} component="fieldset" variant="standard">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={stateSearchProposal.project_name}
                          onChange={onChangeSearchProposal}
                          name="project_name"
                        />
                      }
                      label={translate('search_component.by_project_name')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={stateSearchProposal.employee_name}
                          onChange={onChangeSearchProposal}
                          name="employee_name"
                        />
                      }
                      label={translate('search_component.by_client_name')}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={stateSearchProposal.project_number}
                          onChange={onChangeSearchProposal}
                          name="project_number"
                        />
                      }
                      label={translate('search_component.by_project_number')}
                    />
                    {advancedOptions && (
                      <Box>
                        <Stack direction="row" alignItems="center">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={stateSearchProposal.outter_status}
                                onChange={onChangeSearchProposal}
                                name="outter_status"
                              />
                            }
                            label={translate('search_component.by_project_status')}
                          />

                          {handleArrow('outter_status', arrowStatus)}
                        </Stack>
                        {arrowStatus && (
                          <Stack direction="column" sx={{ px: 2 }}>
                            {optionsProjectStatus.map((item, index) => (
                              <FormControlLabel
                                key={index}
                                control={
                                  <Checkbox
                                    checked={item.checked}
                                    onChange={handleChangeProjectStatus}
                                    name={item.name}
                                  />
                                }
                                label={item.label}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    )}
                  </FormGroup>
                </FormControl>
              )}
              <Typography sx={{ mt: 1, color: '#0E8478', fontWeight: 600 }}>
                {translate('search_component.type_order')}
              </Typography>
              <RadioGroup
                aria-labelledby="type"
                name="type"
                value={sortBy}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="asc"
                  control={<Radio />}
                  label={translate('search_component.ascending')}
                />
                <FormControlLabel
                  value="desc"
                  control={<Radio />}
                  label={translate('search_component.descending')}
                />
              </RadioGroup>
              <Link
                component="button"
                variant="body2"
                onClick={() => setAdvancedOptions(!advancedOptions)}
                sx={{
                  mt: 1,
                  px: 2,
                  color: '#0E8478',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                {advancedOptions
                  ? translate('search_component.default_options')
                  : translate('search_component.advanced_options')}
              </Link>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  sx={{ m: 2 }}
                  variant="contained"
                  onClick={
                    activeRole && activeRole === 'tender_accounts_manager'
                      ? () => handleSearchAccManager()
                      : () => handleSearch()
                  }
                >
                  {translate('search_component.search')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        }
        onClose={() => setOpenModal(false)}
        styleContent={{ padding: '1em', backgroundColor: '#fff' }}
        showCloseIcon={true}
      />
    </React.Fragment>
  );
}
