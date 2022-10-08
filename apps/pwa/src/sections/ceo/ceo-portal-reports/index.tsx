import BarChart from '../../../components/chart/BarChart';
import useLocales from '../../../hooks/useLocales';

function CeoPortalReport() {
  const { translate } = useLocales();

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23], //TODO: get data from API
    },
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.this_month'),
      data: [13, 33, 15, 18], //TODO: get data from API
    },
  ];

  const axisLabel: string[] = [
    translate('ceo_portal_reports.bar_chart.label.partners_need_to_active'),
    translate('ceo_portal_reports.bar_chart.label.active_partners'),
    translate('ceo_portal_reports.bar_chart.label.rejected_partners'),
    translate('ceo_portal_reports.bar_chart.label.pending_partners'),
  ];

  return (
    <BarChart
      headline={translate('ceo_portal_reports.bar_chart.headline.partners')}
      data={series}
      xAxisDatas={axisLabel}
    />
  );
}

export default CeoPortalReport;
