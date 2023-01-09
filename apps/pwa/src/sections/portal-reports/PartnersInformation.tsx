import { useEffect, useState } from 'react';
// @mui
import { Box, Grid, Stack, CircularProgress } from '@mui/material';
// components
import BarChart from 'components/chart/BarChart';
import DonutChart from 'components/chart/DonutChart';
import EmptyChart from './EmptyChart';
// hooks
import useLocales from 'hooks/useLocales';
// types
import { IPropsPartnerInfo, IBaseLabelValue } from './types';

// ----------------------------------------------------------------------

export default function PartnersInformation({ partner_data, submitting }: IPropsPartnerInfo) {
  const { translate } = useLocales();

  const [monthlySeries, setMonthlySeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | []
  >([]);
  const [regionSeries, setRegionSeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | []
  >([]);
  const [governorateSeries, setGovernorateSeries] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | []
  >([]);
  const [monthlyLabelValue, setMonthlyLabelValue] = useState<string[] | []>([]);
  const [regionLabelValue, setRegionLabelValue] = useState<string[] | []>([]);
  const [governorateLabelValue, setGovernorateLabelValue] = useState<string[] | []>([]);
  const [statusPartners, setStatusPartners] = useState<IBaseLabelValue[] | []>([]);

  useEffect(() => {
    if (partner_data) {
      const findByStatus = partner_data.by_status;
      const findMonthlyData = partner_data.monthlyData;
      const findPartnerByRegion = partner_data.by_region;
      const findPartnerByGovernorate = partner_data.by_governorate;

      if (findByStatus.length) {
        const valuePartnerStatus = findByStatus.map((v) => ({
          label: `section_portal_reports.label.${v.label}`,
          value: v.value,
        }));

        setStatusPartners(valuePartnerStatus as IBaseLabelValue[]);
      }

      if (findMonthlyData) {
        const valueBarMonthly = [
          {
            name: 'section_portal_reports.label.series_name.this_month',
            data: findMonthlyData.this_month.map((obj) => obj.value),
          },
          {
            name: 'section_portal_reports.label.series_name.last_month',
            data: findMonthlyData.last_month.map((obj) => obj.value),
          },
        ].concat();

        const valueLabelAxis = findMonthlyData.this_month
          .map((el) => `section_portal_reports.label.${el.label}`)
          .concat(
            findMonthlyData.this_month.map((el) => `section_portal_reports.label.${el.label}`)
          );

        setMonthlySeries(valueBarMonthly as ApexAxisChartSeries | ApexNonAxisChartSeries);
        setMonthlyLabelValue(
          valueLabelAxis.filter((item, i) => valueLabelAxis.indexOf(item) === i)
        );
      }

      if (findPartnerByRegion.length) {
        const valueTotalList = findPartnerByRegion.map((obj) => obj.total);
        const resultToChart = [
          { name: 'section_portal_reports.label.series_name.this_month', data: valueTotalList },
        ];
        const valueLabelRegion = findPartnerByRegion.map((el) => el.label);

        setRegionSeries(resultToChart as ApexAxisChartSeries | ApexNonAxisChartSeries);
        setRegionLabelValue(valueLabelRegion);
      }

      if (findPartnerByGovernorate.length) {
        const valueTotalList = findPartnerByGovernorate.map((obj) => obj.total);
        const resultToChart = [
          { name: 'section_portal_reports.label.series_name.this_month', data: valueTotalList },
        ];
        const valueLabelGovernorate = findPartnerByGovernorate.map((el) => el.label);

        setGovernorateSeries(resultToChart as ApexAxisChartSeries | ApexNonAxisChartSeries);
        setGovernorateLabelValue(valueLabelGovernorate);
      }
    }
  }, [partner_data]);

  return (
    <Box sx={{ pt: 1 }}>
      {submitting ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50vh',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <Grid container direction="row" columnSpacing={4} rowSpacing={6}>
          {statusPartners.length ? (
            <Grid item xs={12} md={10}>
              <DonutChart
                headline={translate('section_portal_reports.heading.depending_of_partner')}
                anotherData={statusPartners}
              />
            </Grid>
          ) : (
            <EmptyChart
              type="donut"
              title={translate('section_portal_reports.heading.depending_of_partner')}
            />
          )}
          <Grid item xs={12}>
            <BarChart
              headline={translate('ceo_portal_reports.bar_chart.headline.partners')}
              data={monthlySeries}
              xAxisDatas={monthlyLabelValue}
              barRenderBorderRadius={15}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <BarChart
              headline={translate('section_portal_reports.heading.by_regions')}
              data={regionSeries}
              xAxisDatas={regionLabelValue}
              barRenderBorderRadius={20}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <BarChart
              headline={translate('section_portal_reports.heading.by_governorate')}
              data={governorateSeries}
              xAxisDatas={governorateLabelValue}
              barRenderBorderRadius={12}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
