import { Grid } from '@mui/material';
import { CardInsight } from '../../../components/card-insight';

function Complexity() {
  const INSIGHT_DATA = [
    { title: 'Reserved budget', value: 400000 },
    { title: 'Spent Budget', value: 400000 },
    { title: 'Total Budget for the course', value: 400000 },
  ];

  return (
    <CardInsight
      cardContainerSpacing={2}
      cardContainerColumns={12}
      cardItemMdBreakpoints={4}
      cardStyle={{ minHeight: { md: '160px' }, p: 2, bgcolor: 'white' }}
      headline="Complexity track budget"
      icon={'/assets/icons/currency-icon.svg'}
      iconPosition={'right'}
      data={INSIGHT_DATA}
    />
  );
}

export default Complexity;
