import { CardInsight } from '../../../components/card-insight';
import useLocales from '../../../hooks/useLocales';

function Mosques() {
  const { translate } = useLocales();
  const INSIGHT_DATA = [
    { title: translate('mosques_card_insights.title.reserved_budget'), value: 400000 },
    { title: translate('mosques_card_insights.title.spent_budget'), value: 400000 },
    {
      title: translate('mosques_card_insights.title.total_budget_for_the_course'),
      value: 400000,
    },
  ];

  return (
    <CardInsight
      cardContainerSpacing={2}
      cardContainerColumns={12}
      cardItemMdBreakpoints={4}
      cardStyle={{ minHeight: { md: '160px' }, p: 2, bgcolor: 'white' }}
      headline={translate('mosques_card_insights.headline.mosques_grant_track_budget')}
      icon={'/assets/icons/currency-icon.svg'}
      iconPosition={'right'}
      data={INSIGHT_DATA}
    />
  );
}

export default Mosques;
