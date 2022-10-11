import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useLocales from '../../../hooks/useLocales';
import SvgIconStyle from '../../SvgIconStyle';
import { EMPLOYEES, EMPLOYEES1, EMPLOYEES2, TRACKS } from '../mock-data';
import { NewMessageModalFormProps, NewMessageModalFormValues } from './types';

export default function NewMessageModalForm({ children, onSubmit }: NewMessageModalFormProps) {
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    limit: 6,
    offset: 0,
    order_by: { email: 'asc' },
  });
  // const { control } = useFormContext();
  const [selected, setSelected] = useState<number>();
  const [selectedTrack, setSelectedTrack] = useState<string>('Mosques Department');

  const { translate } = useLocales();
  const validationSchema = Yup.object().shape({
    trackType: Yup.string().required('Procedures is required!'),
    employeeId: Yup.string().required('Support Output is required!'),
  });

  const defaultValues = {
    trackType: '',
    employeeId: '',
  };

  const methods = useForm<NewMessageModalFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: NewMessageModalFormValues) => {
    onSubmit(data);
  };

  // It is used for the number of the pages that are rendered
  const pagesNumber = Math.ceil(EMPLOYEES.length / params.limit);
  const pagesNumber1 = Math.ceil(EMPLOYEES1.length / params.limit);
  const pagesNumber2 = Math.ceil(EMPLOYEES2.length / params.limit);

  // The data showed in a single page
  const dataSinglePage = EMPLOYEES.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );
  const dataSinglePage1 = EMPLOYEES1.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );
  const dataSinglePage2 = EMPLOYEES2.slice(
    (page - 1) * params.limit,
    (page - 1) * params.limit + params.limit
  );

  const handleChange = (event: any) => {
    setSelectedTrack(event.target.value as string);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log('selectedTrack', selectedTrack);
  }, [params, page, selectedTrack]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container>
        {/* <FormGenerator data={NewMessageFormFields} /> */}
        <Typography sx={{ mb: 2 }}>
          {translate('new_message_modal.form.label.track_type')}
        </Typography>
        <TextField
          InputLabelProps={{ shrink: true }}
          SelectProps={{ native: true }}
          select
          fullWidth
          value={selectedTrack}
          onChange={handleChange}
        >
          {TRACKS.map((item, index) => (
            <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
              {item}
            </option>
          ))}
        </TextField>
        {/* create form with label */}
        <Grid item xs={12} sx={{ mt: '10px' }}>
          {translate('new_message_modal.form.label.employees')}
          {/* grid split by 2 (6)*/}
          <Grid container rowSpacing={1} columnSpacing={2} sx={{ mt: '10px', height: '200px' }}>
            {selectedTrack === 'Mosques Department' &&
              dataSinglePage.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: '2px',
                      // mb: '10px',
                      p: '8px',
                      borderRadius: '10px',
                      color: selected === index ? '#fff' : '#000',
                      backgroundColor: selected === index ? 'background.paper' : '#EEF0F2',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: 'background.paper',
                      },
                    }}
                    justifyContent="space-between"
                    // onClick={() => methods.setValue('employeeId', item.value)}
                    onClick={() => setSelected(index)}
                  >
                    <Stack direction="row">
                      <img src="/assets/icons/users-alt-green.svg" alt="user_icons" />
                      <Box sx={{ my: 'auto', ml: 1 }}>
                        {item.label} - {item.Role}
                      </Box>
                    </Stack>
                    <SvgIconStyle
                      src={`/assets/icons/dashboard-header/message-bar.svg`}
                      sx={{ width: 25, height: 25, color: '#000' }}
                    />
                  </Stack>
                </Grid>
              ))}
            {selectedTrack === 'Facilitated Scholarship Track' &&
              dataSinglePage1.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: '2px',
                      // mb: '10px',
                      p: '8px',
                      borderRadius: '10px',
                      color: selected === index ? '#fff' : '#000',
                      backgroundColor: selected === index ? 'background.paper' : '#EEF0F2',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: 'background.paper',
                      },
                    }}
                    justifyContent="space-between"
                    // onClick={() => methods.setValue('employeeId', item.value)}
                    onClick={() => setSelected(index)}
                  >
                    <Stack direction="row">
                      <img src="/assets/icons/users-alt-green.svg" alt="user_icons" />
                      <Box sx={{ my: 'auto', ml: 1 }}>
                        {item.label} - {item.Role}
                      </Box>
                    </Stack>
                    <SvgIconStyle
                      src={`/assets/icons/dashboard-header/message-bar.svg`}
                      sx={{ width: 25, height: 25, color: '#000' }}
                    />
                  </Stack>
                </Grid>
              ))}
            {selectedTrack === 'Initiatives Track' &&
              dataSinglePage2.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: '2px',
                      // mb: '10px',
                      p: '8px',
                      borderRadius: '10px',
                      color: selected === index ? '#fff' : '#000',
                      backgroundColor: selected === index ? 'background.paper' : '#EEF0F2',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: 'background.paper',
                      },
                    }}
                    justifyContent="space-between"
                    // onClick={() => methods.setValue('employeeId', item.value)}
                    onClick={() => setSelected(index)}
                  >
                    <Stack direction="row">
                      <img src="/assets/icons/users-alt-green.svg" alt="user_icons" />
                      <Box sx={{ my: 'auto', ml: 1 }}>
                        {item.label} - {item.Role}
                      </Box>
                    </Stack>
                    <SvgIconStyle
                      src={`/assets/icons/dashboard-header/message-bar.svg`}
                      sx={{ width: 25, height: 25, color: '#000' }}
                    />
                  </Stack>
                </Grid>
              ))}
          </Grid>
          <Stack direction="row" flex={2} gap={1} justifyContent="center" sx={{ mt: '20px' }}>
            {selectedTrack === 'Mosques Department' &&
              Array.from(Array(pagesNumber).keys()).map((elem, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setPage(index + 1);
                  }}
                  sx={{
                    color: index === page - 1 ? '#fff' : 'rgba(147, 163, 176, 0.8)',
                    backgroundColor:
                      index === page - 1 ? 'background.paper' : 'rgba(147, 163, 176, 0.16)',
                    height: '30px',
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            {selectedTrack === 'Facilitated Scholarship Track' &&
              Array.from(Array(pagesNumber1).keys()).map((elem, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setPage(index + 1);
                  }}
                  sx={{
                    color: index === page - 1 ? '#fff' : 'rgba(147, 163, 176, 0.8)',
                    backgroundColor:
                      index === page - 1 ? 'background.paper' : 'rgba(147, 163, 176, 0.16)',
                    height: '30px',
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            {selectedTrack === 'Initiatives Track' &&
              Array.from(Array(pagesNumber2).keys()).map((elem, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setPage(index + 1);
                  }}
                  sx={{
                    color: index === page - 1 ? '#fff' : 'rgba(147, 163, 176, 0.8)',
                    backgroundColor:
                      index === page - 1 ? 'background.paper' : 'rgba(147, 163, 176, 0.16)',
                    height: '30px',
                  }}
                >
                  {index + 1}
                </Button>
              ))}
          </Stack>
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '20px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}
