import { Checkbox, Grid, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';

function CheckBoxSection({ item, state, setState }: any) {
  const [expand, setExpand] = React.useState<boolean>(false);
  const handleExpand = () => {
    setExpand(expand ? false : true);
  };
  const handleOnChange = () => {
    setState((prevValue: any) => ({
      ...prevValue,
      section_id: item.id,
      ...(item.section_id === '' && { budget: 0 }),
    }));
  };
  return (
    <Grid container spacing={2} sx={{ paddingInlineStart: '15px' }}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" flex={1}>
          <IconButton onClick={handleExpand}>
            {expand ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8805 9.2925L12.0005 13.1725L8.12047 9.2925C7.73047 8.9025 7.10047 8.9025 6.71047 9.2925C6.32047 9.6825 6.32047 10.3125 6.71047 10.7025L11.3005 15.2925C11.6905 15.6825 12.3205 15.6825 12.7105 15.2925L17.3005 10.7025C17.6905 10.3125 17.6905 9.6825 17.3005 9.2925C16.9105 8.9125 16.2705 8.9025 15.8805 9.2925Z"
                  fill="#1E1E1E"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.7095 15.8766L10.8295 11.9966L14.7095 8.11656C15.0995 7.72656 15.0995 7.09656 14.7095 6.70656C14.3195 6.31656 13.6895 6.31656 13.2995 6.70656L8.70945 11.2966C8.31945 11.6866 8.31945 12.3166 8.70945 12.7066L13.2995 17.2966C13.6895 17.6866 14.3195 17.6866 14.7095 17.2966C15.0895 16.9066 15.0995 16.2666 14.7095 15.8766Z"
                  fill="#1E1E1E"
                />
              </svg>
            )}
          </IconButton>
          <Checkbox
            checked={item.id === state.section_id ? true : false}
            onChange={handleOnChange}
          />
          <Typography variant="h6" sx={{ alignSelf: 'center' }}>
            {item.name}
          </Typography>
        </Stack>
      </Grid>
      {expand &&
        item.children.length !== 0 &&
        item.children.map((item: any, index: any) => (
          <Grid item key={index} md={12} xs={12}>
            <CheckBoxSection key={index} item={item} state={state} setState={setState} />
          </Grid>
        ))}
    </Grid>
  );
}

export default CheckBoxSection;
