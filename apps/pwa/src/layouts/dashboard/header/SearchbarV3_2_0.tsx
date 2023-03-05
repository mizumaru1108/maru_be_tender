// import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Divider,
  Input /*Slide, Button, InputAdornment, ClickAwayListener*/,
  InputAdornment,
  MenuItem,
  Select,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
import Iconify from 'components/Iconify';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { role_url_map } from '../../../@types/commons';
// components
// import Iconify from '../../../components/Iconify';
// import { IconButtonAnimate } from '../../../components/animate';

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
  // const [isOpen, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen((prev) => !prev);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  const navigate = useNavigate();

  const { activeRole } = useAuth();
  const role = activeRole!;
  const [show, setShow] = React.useState(false);
  const [value, setValue] = React.useState('asc');
  const [text, setText] = React.useState('');
  const [projectType, setprojectType] = React.useState('');
  const [state, setState] = React.useState({
    project: true,
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
  const error = [project, client, status, track].filter((v) => v).length !== 1;

  const handleClick = () => {
    setShow(!show);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigate(`/${role_url_map[`${role}`]}/searching`);
      setShow(false);
      const getValue = {
        order: value,
        filter: text,
        type: state,
      };
      console.log(getValue);
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
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
          // width: '70%',
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
            placeholder="ex. Jane Cooper"
            onKeyUp={handleKeyUp}
          />
          <Iconify
            icon={'il:arrow-down'}
            sx={{
              alignItems: 'center',
              color: 'text.disabled',
              width: 20,
              height: 20,
              pt: 1,
              mx: '8px',
              cursor: 'pointer',
              transition: '0.3s',
              transform: show ? 'rotate(0deg)' : 'rotate(-90deg)',
            }}
            onClick={handleClick}
          />
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
                Project's Type
              </Typography>
              {/* <FormControlLabel value="project" control={<Checkbox />} label="Name of Project" />
              <FormControlLabel value="client" control={<Checkbox />} label="Name of Client" />
              <FormControlLabel value="status" control={<Checkbox />} label="Project Status" />
              <FormControlLabel value="track" control={<Checkbox />} label="Name of Track" /> */}
              <FormControl
                required
                error={error}
                component="fieldset"
                sx={{ m: 3 }}
                variant="standard"
              >
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={project} onChange={handleChange} name="project" />}
                    label="Name of Project"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={client} onChange={handleChange} name="client" />}
                    label="Name of Client"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={status} onChange={handleChange} name="status" />}
                    label="Project Status"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={track} onChange={handleChange} name="track" />}
                    label="Name of Track"
                  />
                </FormGroup>
                {/* <FormHelperText>You can display an error</FormHelperText> */}
              </FormControl>
              <Typography sx={{ mt: 1, color: '#0E8478', fontWeight: 600 }}>Type</Typography>
              {/* <FormControlLabel control={<Checkbox />} label="Ascending" /> */}
              {/* <FormControlLabel control={<Checkbox />} label="Descending" /> */}
              <RadioGroup
                aria-labelledby="type"
                name="type"
                value={value}
                onChange={handleRadioChange}
              >
                <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
                <FormControlLabel value="desc" control={<Radio />} label="Descending" />
              </RadioGroup>
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
      {/* <Button variant="contained" onClick={handleClose}>
              Search
            </Button> */}
    </SearchbarStyle>
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
