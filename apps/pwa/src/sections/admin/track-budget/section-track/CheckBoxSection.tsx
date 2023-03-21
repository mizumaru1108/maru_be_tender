import React, { useState } from 'react';
// @mui
import { Checkbox, Grid, IconButton, Stack, Typography, Box, Button } from '@mui/material';
// components
import Iconify from 'components/Iconify';
// utils
import useLocales from 'hooks/useLocales';
import { useQuery } from 'urql';
//
import { IDataTracks } from 'sections/admin/track-budget/TrackBudgetPage';

// ------------------------------------------------------------------------------------------

interface IPropsCheckbox {
  item: IDataTracks;
  state: any;
  setState: any;
}

// ------------------------------------------------------------------------------------------

export default function CheckBoxSection({ item, setState }: IPropsCheckbox) {
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
        track_ids: [item.id],
      }));
    }
  };
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
            <Checkbox
              // checked={expand}
              onChange={handleOnChange}
            />
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
        {expand && item.sections.length
          ? item.sections.map((v, i) => (
              <Typography key={i} sx={{ px: 1, py: 0.5, ml: 3.5 }} variant="body2">
                {v.name}
              </Typography>
            ))
          : null}
      </Grid>
    </Grid>
  );
}
