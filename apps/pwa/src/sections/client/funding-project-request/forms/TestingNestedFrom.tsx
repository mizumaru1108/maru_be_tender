import { Button, Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import RHFBaseRepeater from 'components/hook-form/nested-repeater/RHFBaseRepeater';
import { useForm } from 'react-hook-form';

const defaultValues = {
  detail_project_budgets: [
    {
      clause: 'Name Testing 1',
      explanation: 'Clause Testing 1',
      amount: '100',
      level_one: [
        {
          clause: 'Name Testing 2',
          explanation: 'Clause Testing 2',
          amount: '100',
          level_two: [
            {
              clause: 'Name Testing 3',
              explanation: 'Clause Testing 3',
              amount: '100',
              level_three: [
                { clause: 'Name Testing 4', explanation: 'Clause Testing 4', amount: '100' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default function RHFNestedRepeater() {
  const methods = useForm({
    defaultValues,
  });
  const { control, register, handleSubmit, getValues, reset, setValue, watch } = methods;
  const onSubmit = (data: any) => console.log('data', data);
  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid md={12}>
          <RHFBaseRepeater {...{ control, register, defaultValues, getValues, setValue, watch }} />
        </Grid>

        <Grid md={12} sx={{ backgroundColor: 'red' }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
          {/* <Button type="button" variant="contained" onClick={() => reset(defaultValues)}>
            Reset
          </Button> */}
        </Grid>
      </Grid>
    </FormProvider>
    // </form>
  );
}
