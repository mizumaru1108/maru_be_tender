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
import { setSort, setFiltered } from 'redux/slices/searching';
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

  const dispatch = useDispatch();
  const { sort, filtered } = useSelector((state) => state.searching);
  const [show, setShow] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('asc');
  const [text, setText] = React.useState('');
  const [state, setState] = React.useState({
    project: false,
    client: false,
    status: false,
    track: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { project, client, status, track } = state;
  const filteredState = Object.fromEntries(
    Object.entries({ project, client, status, track }).filter(([_, v]) => v)
  );
  const error = Object.keys(filteredState).length !== 1;
  // const keys = Object.keys(filteredState);
  // const error = [project, client, status, track].filter((v) => v).length !== 1;
  const handleClick = () => {
    setShow(!show);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate(`/${role_url_map[`${role}`]}/searching`);
      setShow(false);
      // Object.keys(filteredState).forEach((key) => {
      //   switch (key) {
      //     case 'project':
      //       // console.log('ada dari project');
      //       dispatch(setProjectName(`project_name=${text}`));
      //       break;
      //     case 'client':
      //       // console.log('ada dari client');
      //       dispatch(setClientName(`client_name=${text}`));
      //       break;
      //     case 'status':
      //       // console.log('ada dari status');
      //       dispatch(setProjectStatus(`project_status=${text}`));
      //       break;
      //     case 'track':
      //       // console.log('ada dari track');
      //       dispatch(setTrackName(`project_track=${text}`));
      //       break;
      //     default:
      //       break;
      //   }

      // });

      const filters = Object.keys(filteredState);
      const newFilters = filters.map((filter) => {
        if (filter === 'project') {
          return `project_name=${text}`;
        } else if (filter === 'client') {
          return `client_name=${text}`;
        } else if (filter === 'status') {
          return `project_status=${text}`;
        } else if (filter === 'track') {
          return `project_track=${text}`;
        }
        return false;
      });
      const joinFilter = newFilters.join('&');
      if (text) {
        dispatch(setFiltered(joinFilter));
      } else {
        dispatch(setFiltered(null));
      }
      dispatch(setSort(sortBy));
    }
  };

  const handleSearch = () => {
    navigate(`/${role_url_map[`${role}`]}/searching`);
    setShow(false);
    // Object.keys(filteredState).forEach((key) => {
    //   switch (key) {
    //     case 'project':
    //       // console.log('ada dari project');
    //       dispatch(setProjectName(`project_name=${text}`));
    //       break;
    //     case 'client':
    //       // console.log('ada dari client');
    //       dispatch(setClientName(`client_name=${text}`));
    //       break;
    //     case 'status':
    //       // console.log('ada dari status');
    //       dispatch(setProjectStatus(`project_status=${text}`));
    //       break;
    //     case 'track':
    //       // console.log('ada dari track');
    //       dispatch(setTrackName(`project_track=${text}`));
    //       break;
    //     default:
    //       break;
    //   }
    // });

    const filters = Object.keys(filteredState);
    const newFilters = filters.map((filter) => {
      if (filter === 'project') {
        return `project_name=${text}`;
      } else if (filter === 'client') {
        return `employee_name=${text}`;
      } else if (filter === 'status') {
        return `outter_status=${text}`;
      } else if (filter === 'track') {
        return `project_track=${text}`;
      }
      return false;
    });

    const joinFilter = newFilters.join('&');
    if (text) {
      dispatch(setFiltered(joinFilter));
    } else {
      dispatch(setFiltered(null));
    }
    dispatch(setSort(sortBy));
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy((event.target as HTMLInputElement).value);
  };

  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
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
            width: '250px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <Iconify icon={'eva:search-fill'} sx={{ color: '#0E8478', width: 25, height: 25 }} />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ height: 20, mx: '8px', color: '#0E8478' }}
            />
            <Input
              sx={{ width: '100%' }}
              disableUnderline={true}
              onChange={(e) => setText(e.target.value)}
              placeholder={translate('search_component.placeholder')}
              onKeyUp={handleKeyUp}
            />
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
                  transform: show ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
                onClick={handleClick}
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
                  transform: show ? 'rotate(-90deg)' : 'rotate(0deg)',
                }}
                onClick={handleClick}
              />
            )}
          </Box>
          {show ? (
            <Box
              sx={{
                transition: show ? '0.3s' : '0.3s',
              }}
            >
              <Divider orientation="horizontal" flexItem />
              <Stack direction="column">
                <Typography sx={{ mt: 1, color: '#0E8478', fontWeight: 600 }}>
                  {translate('search_component.project_type')}
                </Typography>
                {/* <FormControlLabel value="project" control={<Checkbox />} label="Name of Project" />
              <FormControlLabel value="client" control={<Checkbox />} label="Name of Client" />
              <FormControlLabel value="status" control={<Checkbox />} label="Project Status" />
              <FormControlLabel value="track" control={<Checkbox />} label="Name of Track" /> */}
                <FormControl required error={error} component="fieldset" variant="standard">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={project} onChange={handleChange} name="project" />
                      }
                      label={translate('search_component.by_project_name')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={client} onChange={handleChange} name="client" />}
                      label={translate('search_component.by_client_name')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={status} onChange={handleChange} name="status" />}
                      label={translate('search_component.by_project_status')}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={track} onChange={handleChange} name="track" />}
                      label={translate('search_component.by_track_name')}
                    />
                  </FormGroup>
                  {/* <FormHelperText>You can display an error</FormHelperText> */}
                </FormControl>
                <Typography sx={{ mt: 1, color: '#0E8478', fontWeight: 600 }}>
                  {translate('search_component.type_order')}
                </Typography>
                {/* <FormControlLabel control={<Checkbox />} label="Ascending" /> */}
                {/* <FormControlLabel control={<Checkbox />} label="Descending" /> */}
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

              <Stack direction="row" justifyContent="flex-end">
                <Button sx={{ my: 2 }} variant="contained" onClick={() => handleSearch()}>
                  {translate('search_component.search')}
                </Button>
              </Stack>
            </Box>
          ) : null}
        </Box>
        {/* <Input
        autoFocus
        fullWidth
        disableUnderline
        placeholder="ex. Client Name"
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon={'eva:search-fill'}
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
        endAdornment={
          <Select sx={{ border: 'none', height: 20 }}>
            <MenuItem>test</MenuItem>
          </Select>
        }
        sx={{
          mr: 1,
          fontWeight: 400,
          border: '1px solid rgba(145, 158, 171, 0.32)',
          borderRadius: '50px',
          color: '#919EAB',
          fontSize: '14px',
          padding: '8px 12px',
        }}
      /> */}
      </SearchbarStyle>
    </ClickAwayListener>
    // <ClickAwayListener onClickAway={handleClose}>
    //   <div>
    //     {!isOpen && (
    //       <IconButtonAnimate onClick={handleOpen}>
    //         <Iconify icon={'eva:search-fill'} width={20} height={20} />
    //       </IconButtonAnimate>
    //     )}

    //     <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
    //       <SearchbarStyle>
    //         <Input
    //           autoFocus
    //           fullWidth
    //           disableUnderline
    //           placeholder="Search…"
    //           startAdornment={
    //             <InputAdornment position="start">
    //               <Iconify
    //                 icon={'eva:search-fill'}
    //                 sx={{ color: 'text.disabled', width: 20, height: 20 }}
    //               />
    //             </InputAdornment>
    //           }
    //           sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
    //         />
    //         <Button variant="contained" onClick={handleClose}>
    //           Search
    //         </Button>
    //       </SearchbarStyle>
    //     </Slide>
    //   </div>
    // </ClickAwayListener>
  );
}
