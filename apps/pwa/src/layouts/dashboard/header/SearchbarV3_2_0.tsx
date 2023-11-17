// import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Divider,
  Input /*Slide, Button, InputAdornment, ClickAwayListener*/,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormGroup,
  FormHelperText,
  Button,
  ClickAwayListener,
  Link,
} from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
import Iconify from 'components/Iconify';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../@types/commons';
import useLocales from '../../../hooks/useLocales';
import { useDispatch, useSelector } from 'redux/store';
import {
  setSort,
  setFiltered,
  setActiveOptionAccountManager,
  setOutterStatus,
  ActiveOptionsSearching,
  setActiveOptionsSearching,
} from 'redux/slices/searching';
import axiosInstance from 'utils/axios';
import useResponsive from 'hooks/useResponsive';
import SearchbarModal from './SearchbarModal';
// ----------------------------------------------------------------------
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 25,
  // left: 0,
  zIndex: 99,
  width: '100%',
  display: 'inline-block',
  flexWrap: 'wrap',
  background: 'transparent',
  // position: 'absolute',
  position: 'relative',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  padding: theme.spacing(0, 3),
  // boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar() {
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();

  const { activeRole } = useAuth();
  const role = activeRole!;

  const isMobile = useResponsive('down', 'md');

  const dispatch = useDispatch();
  const { sort, filtered } = useSelector((state) => state.searching);

  const [show, setShow] = React.useState(false);
  const [advancedOptions, setAdvancedOptions] = React.useState(false);
  const [arrowStatus, setArrowStatus] = React.useState(false);
  const [arrowTrack, setArrowTrack] = React.useState(false);

  const [stateStatus, setStateStatus] = React.useState({
    pending: true,
    canceled: true,
    completed: true,
    ongoing: true,
    revision: true,
    amandament: true,
  });

  const [sortBy, setSortBy] = React.useState('asc');
  const [text, setText] = React.useState('');
  const [state, setState] = React.useState({
    project: true,
    client: true,
    status: false,
    track: false,
    number: true,
  });
  const [stateSearchProposal, setStateSearchProposal] = React.useState<ActiveOptionsSearching>({
    employee_name: true,
    outter_status: false,
    project_name: true,
    project_number: true,
    project_track: false,
  });
  // console.log({ stateSearchProposal });

  const onChangeSearchProposal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateSearchProposal({
      ...stateSearchProposal,
      [event.target.name]: event.target.checked,
    });
  };

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

  // State Except Account Manager
  const { project, client, status, track, number } = state;
  const filteredState = Object.fromEntries(
    Object.entries({ project, client, status, track, number }).filter(([_, v]) => v)
  );

  const error = Object.keys(filteredState).length !== 1;
  // const keys = Object.keys(filteredState);
  // const error = [project, client, status, track].filter((v) => v).length !== 1;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
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

  const handleClick = (type: string) => {
    if (type === 'input') {
      setShow(!show);
    }
    // else if (type === 'project_status') {
    //   setArrowStatus(!arrowStatus);
    // } else {
    //   setArrowTrack(!arrowTrack);
    // }
  };

  const handleClearAll = () => {
    setState({
      project: true,
      client: true,
      status: false,
      track: false,
      number: true,
    });
    // setAdvancedOptions(false);
    setArrowStatus(false);
    setSortBy('asc');
  };

  const handleClickOptions = () => {
    setState({
      ...state,
      status: false,
    });
    setStateSearchProposal({
      ...stateSearchProposal,
      outter_status: !stateSearchProposal.outter_status,
    });
    // setAdvancedOptions(!advancedOptions);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy((event.target as HTMLInputElement).value);
  };

  const handleSearch = () => {
    setShow(false);

    const filters = Object.keys(filteredState);
    const newFilters = filters.map((filter) => {
      if (filter === 'project') {
        return `project_name=${filtered}`;
      } else if (filter === 'client') {
        return `employee_name=${filtered}`;
      } else if (filter === 'track') {
        return `project_track=${filtered}`;
      } else if (filter === 'number') {
        let projectNumber: number = parseInt(filtered || '0', 10);
        if (projectNumber) {
          return `project_number=${parseInt(filtered || '0', 10)}`;
        } else return null;
      } else if (filter === 'status') {
        const currentStatus = Object.keys(filterStatus);
        const newFilterStatus = currentStatus.map((status) => {
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
        });
        // console.log({ currentStatus, newFilterStatus });
        // const joinFilterStatus = newFilterStatus.join('&');
        const setNew = newFilterStatus.map((filterStatus: any) => `outter_status=${filterStatus}`);
        const joinFilterStatus = setNew.join('&');
        return joinFilterStatus;
      }

      return false;
    });

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
    navigate(`/${role_url_map[`${role}`]}/searching`);
    // console.log({ joinFilter, filters, filteredState });
  };

  const handleSearchAccManager = async () => {
    navigate(`/${role_url_map[`${role}`]}/searching`);
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
      if (role === 'tender_accounts_manager') {
        handleSearchAccManager();
      } else {
        handleSearch();
      }
      // setText('');
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

  React.useEffect(() => {
    if (status) {
      setArrowStatus(true);
    } else {
      setArrowStatus(false);
    }
  }, [status]);

  return (
    <>
      {isMobile ? (
        <SearchbarModal />
      ) : (
        <ClickAwayListener
          onClickAway={() => {
            // dispatch(setFiltered(''));
            setShow(false);
          }}
        >
          <SearchbarStyle>
            <Box
              sx={{
                mr: 1,
                fontWeight: 400,
                border: '1px solid rgba(145, 158, 171, 0.32)',
                borderRadius: show ? '15px' : '50px',
                color: '#919EAB',
                background: '#fff',
                fontSize: '14px',
                padding: '3px 12px',
                transition: '0.3s',
                width: '350px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Iconify
                  icon={'eva:search-fill'}
                  sx={{ color: '#0E8478', width: 25, height: 25 }}
                />
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ height: 20, mx: '8px', color: '#0E8478' }}
                />
                <Input
                  // onBlur={() => {
                  //   if (show === false) {
                  //     setTimeout(() => {
                  //       dispatch(setFiltered(''));
                  //     }, 500);
                  //   }
                  // }}
                  sx={{ width: '100%' }}
                  disableUnderline={true}
                  value={filtered}
                  onChange={(e) => {
                    dispatch(setFiltered(e.target.value));
                    // setText(e.target.value);
                  }}
                  placeholder={translate('search_component.placeholder')}
                  onKeyUp={handleKeyUp}
                />
                {handleArrow('input', show)}
              </Box>
              {show ? (
                <Box
                  sx={{
                    transition: show ? '0.3s' : '0.3s',
                  }}
                >
                  <Divider orientation="horizontal" flexItem />
                  <Stack direction="column" sx={{ px: 2 }}>
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
                    {role === 'tender_accounts_manager' ? (
                      <FormControl
                        required
                        error={errorAccManager}
                        component="fieldset"
                        variant="standard"
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={client_name}
                                onChange={onChangeAccManager}
                                name="client_name"
                              />
                            }
                            label={translate('search_component.by_client_name')}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={entity_mobile}
                                onChange={onChangeAccManager}
                                name="entity_mobile"
                              />
                            }
                            label={translate('search_component.by_entity_mobile')}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={license_number}
                                onChange={onChangeAccManager}
                                name="license_number"
                              />
                            }
                            label={translate('search_component.by_license_number')}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={email}
                                onChange={onChangeAccManager}
                                name="email"
                              />
                            }
                            label={translate('search_component.by_email')}
                          />
                        </FormGroup>
                        {/* <FormHelperText>You can display an error</FormHelperText> */}
                      </FormControl>
                    ) : (
                      <FormControl required error={error} component="fieldset" variant="standard">
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={stateSearchProposal.project_name}
                                onChange={onChangeSearchProposal}
                                name="project"
                              />
                            }
                            label={translate('search_component.by_project_name')}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={stateSearchProposal.employee_name}
                                onChange={onChangeSearchProposal}
                                name="client"
                              />
                            }
                            label={translate('search_component.by_client_name')}
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={stateSearchProposal.project_number}
                                onChange={onChangeSearchProposal}
                                name="number"
                              />
                            }
                            label={translate('search_component.by_project_number')}
                          />
                          {stateSearchProposal.outter_status && (
                            <Box>
                              <Stack direction="row" alignItems="center">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={status}
                                      onChange={handleChange}
                                      name="status"
                                    />
                                  }
                                  label={translate('search_component.by_project_status')}
                                />

                                {handleArrow('project_status', arrowStatus)}
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
                          {/* <Box display="flex" alignItems="center">
                          <FormControlLabel
                            control={
                              <Checkbox checked={track} onChange={handleChange} name="track" />
                            }
                            label={translate('search_component.by_track_name')}
                          />
                          {handleArrow('track', arrowTrack)}
                        </Box> */}
                        </FormGroup>
                        {/* <FormHelperText>You can display an error</FormHelperText> */}
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
                  </Stack>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleClickOptions}
                    sx={{
                      mt: 1,
                      px: 2,
                      color: '#0E8478',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    {stateSearchProposal.outter_status
                      ? translate('search_component.default_options')
                      : translate('search_component.advanced_options')}
                  </Link>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      sx={{ m: 2 }}
                      variant="contained"
                      onClick={
                        role === 'tender_accounts_manager'
                          ? () => handleSearchAccManager()
                          : () => handleSearch()
                      }
                    >
                      {translate('search_component.search')}
                    </Button>
                  </Stack>
                </Box>
              ) : null}
            </Box>
          </SearchbarStyle>
        </ClickAwayListener>
      )}
    </>
  );
}
