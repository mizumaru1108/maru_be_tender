import { Grid, Stack } from '@mui/material';
import PathStats, { PathStatsProps } from './PathStats';
import Settings from './Settings';

const data = [
  {
    title: 'ميزانية مسار المساجد',
    totalBudget: '1.000.000',
    spentBudget: '400.000',
    reservedBudget: '400.000',
  },
  {
    title: 'ميزانية مسار المنح الميسر',
    totalBudget: '1.000.000',
    spentBudget: '400.000',
    reservedBudget: '400.000',
  },
  {
    title: 'ميزانية مسار المبادرات',
    totalBudget: '1.000.000',
    spentBudget: '400.000',
    reservedBudget: '400.000',
  },
  {
    title: 'ميزانية مسار التعميدات',
    totalBudget: '1.000.000',
    spentBudget: '400.000',
    reservedBudget: '400.000',
  },
] as PathStatsProps[];
function Main() {
  return (
    <Stack direction="column" gap={5}>
      <Grid container spacing={6}>
        {data.map((item, index) => (
          <Grid key={index} item md={6} xs={12}>
            <PathStats {...item} />
          </Grid>
        ))}
      </Grid>
      <Settings />
    </Stack>
  );
}

export default Main;
