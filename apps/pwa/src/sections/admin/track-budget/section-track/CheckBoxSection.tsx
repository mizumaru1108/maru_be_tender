import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// @mui
import { Checkbox, Grid, IconButton, Stack, Typography, Box, Button } from '@mui/material';
// components
import Iconify from 'components/Iconify';
// utils
import useLocales from 'hooks/useLocales';
import { fCurrencyNumber } from 'utils/formatNumber';
//
import { IDataTracks } from 'sections/admin/track-budget/TrackBudgetPage';

// ------------------------------------------------------------------------------------------

interface IPropsCheckbox {
  item: IDataTracks;
  state: any;
  setState: any;
}

// ------------------------------------------------------------------------------------------

export default function CheckBoxSection({ item, state, setState }: IPropsCheckbox) {
  const params = useParams();
  const { translate } = useLocales();
  const [expand, setExpand] = useState<boolean>(false);

  const handleExpand = () => {
    setExpand(expand ? false : true);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setExpand(expand ? false : true);

    if (checked) {
      setState((prevValue: { name: string; budget: number; track_ids: string[] | [] }) => ({
        ...prevValue,
        track_ids: [...state.track_ids, item.name!],
      }));
    } else {
      setState((prevValue: { name: string; budget: number; track_ids: string[] | [] }) => ({
        ...prevValue,
        track_ids: state.track_ids.filter((v: any) => v !== item.name!),
      }));
    }
  };

  useEffect(() => {
    if (item.name === 'INITIATIVES' || item.id === params.id) {
      setExpand(expand ? false : true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={3}
          component="div"
        >
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Checkbox checked={expand} onChange={handleOnChange} />
            <Typography variant="body1" sx={{ alignSelf: 'center' }}>
              {translate(`${item.name}`)}
            </Typography>
          </Box>
          <IconButton onClick={handleExpand} color="inherit">
            {expand ? (
              <Iconify icon="eva:chevron-down-outline" width={23} height={23} />
            ) : (
              <Iconify icon="eva:chevron-right-outline" width={23} height={23} />
            )}
          </IconButton>
        </Stack>
        {expand &&
          (item.sections.length
            ? item.sections.map((v, i) => (
                <Stack
                  direction="row"
                  key={i}
                  spacing={2.5}
                  alignItems="center"
                  justifyContent="space-between"
                  component="div"
                  sx={{ pb: 1, ml: 5, mr: 2 }}
                >
                  <Typography variant="body2">{v.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} color="#0E8478">
                    {fCurrencyNumber(v.budget)}
                  </Typography>
                </Stack>
              ))
            : null)}
      </Grid>
    </Grid>
  );
}
