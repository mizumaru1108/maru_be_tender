import { useState, useEffect } from 'react';
// hooks
import useLocales from 'hooks/useLocales';
// mui
import { Box, Grid, Stack, CircularProgress, Typography, useTheme } from '@mui/material';
// components
import BarChart from 'components/chart/BarChart';
import DonutChart from 'components/chart/DonutChart';
// mock data
import { initDonatValue } from './mock-data';
//
import ProjectBenidiciaresKinds from './ProjectBenidiciaresKinds';
import ProjectBenificiares from './ProjectBenificiares';
import ProjectsNumbers from './ProjectsNumbers';
import EmptyChart from './EmptyChart';
import {
  IPropsHeaderTabs,
  IPropsProjectInfo,
  IDonutDataTracks,
  IBaseLabelValue,
  IDataMapItems,
  IMapItemKeys,
  IResultMapItems,
} from './types';

// -------------------------------------------------------------------------------

export default function ProjectsInformation({
  dataList,
  dataBeneficiaries,
  submitting,
}: IPropsProjectInfo) {
  const { translate } = useLocales();
  const theme = useTheme();

  //
  const [valueDataList, setValueDataList] = useState<IPropsHeaderTabs[] | null>(dataList);
  const [donutDataTracks, setDonutDataTracks] = useState<IDonutDataTracks[] | []>([]);
  const [donutDataRequest, setDonutDataRequest] = useState<IBaseLabelValue[] | []>([]);
  const [axisLabelAuthorities, setAxisLabelAuthorities] = useState<string[] | []>([]);
  const [axisLabelRegions, setAxisLabelRegions] = useState<string[] | []>([]);
  const [axisLabelGovernorates, setAxisLabelGovernorates] = useState<string[] | []>([]);
  const [barDataAuthorities, setBarDataAuthorities] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | []
  >([]);
  const [barRegions, setBarRegions] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries | []>(
    []
  );
  const [barGovernorates, setBarGovernorates] = useState<
    ApexAxisChartSeries | ApexNonAxisChartSeries | []
  >([]);
  const [dataTrackBeneficiaries, setDataTrackBeneficiaries] = useState<IBaseLabelValue[] | []>([]);
  const [dataTypeBeneficiaries, setDataTypeBeneficiaries] = useState<IBaseLabelValue[] | []>([]);

  const benificiaresDataKind = {
    men: {
      label: 'رجال',
      value: 150,
    },
    teen: {
      label: 'شباب',
      value: 100,
    },
    women: {
      label: 'فتيات',
      value: 150,
    },
  };

  useEffect(() => {
    if (valueDataList && valueDataList.length) {
      const findTracks = valueDataList.find((el) => el.key === 'tracks')!;
      const findAuthorities = valueDataList.find((el) => el.key === 'authorities')!;
      const findRegions = valueDataList.find((el) => el.key === 'regions')!;
      const findGovernorates = valueDataList.find((el) => el.key === 'governorates')!;

      if (findTracks && findTracks.data.length) {
        const valueDonutCharts = findTracks.data.map((el) => {
          const ongoing = el.data.reduce((acc, curr) => acc + (curr.ONGOING || 0), 0);
          const canceled = el.data.reduce((acc, curr) => acc + (curr.CANCELED || 0), 0);
          return {
            key: el.key,
            ongoing: {
              label: translate('section_portal_reports.heading.ongoing'),
              value: ongoing,
            },
            canceled: {
              label: translate('section_portal_reports.heading.canceled'),
              value: canceled,
            },
          };
        });

        const valueTotalRequest = findTracks.data.map((el) => {
          const ongoing = el.data.reduce((acc, curr) => acc + (curr.ONGOING || 0), 0);

          return {
            label: translate(el.key),
            value: ongoing,
          };
        });

        setDonutDataTracks(valueDonutCharts);
        setDonutDataRequest(valueTotalRequest);
      } else {
        setDonutDataTracks(initDonatValue);
      }

      if (findAuthorities && findAuthorities.data.length) {
        const reduceAuthorities = findAuthorities.data.map((el) => {
          const ongoing = el.data.reduce((acc, curr) => acc + (curr.ONGOING || 0), 0);
          const canceled = el.data.reduce((acc, curr) => acc + (curr.CANCELED || 0), 0);
          return {
            key: translate(el.key),
            ongoing,
            canceled,
          };
        });

        const valueAxisLabelAuthor = reduceAuthorities.map((el) => el.key);
        const valueBarAuthorities: ApexAxisChartSeries | ApexNonAxisChartSeries = [
          {
            name: translate('section_portal_reports.heading.ongoing'),
            data: reduceAuthorities.map((obj) => obj.ongoing),
          },
          {
            name: translate('section_portal_reports.heading.canceled'),
            data: reduceAuthorities.map((obj) => obj.canceled),
          },
        ].concat();

        setAxisLabelAuthorities(valueAxisLabelAuthor);
        setBarDataAuthorities(valueBarAuthorities);
      }

      if (findRegions && findRegions.data.length) {
        const valueRegions = findRegions.data.map((item: IMapItemKeys) => {
          const data: IDataMapItems[] = Object.entries(item.data[0]).map(([track, value]) => ({
            [track]: value,
          }));

          const result: IResultMapItems[] = data.map((item: IDataMapItems) => {
            const track = Object.keys(item)[0];
            const data = item[track];
            return {
              label: translate(track),
              ongoing: data.ONGOING || 0,
              canceled: data.CANCELED || 0,
            };
          });

          return {
            key: item.key,
            data: result,
          };
        });

        const valueAxisLabelRegions = valueRegions.map((el) => el.key);
        const reduceDataRegions = valueRegions.map((el) => {
          const ongoing = el.data.reduce((acc, curr) => acc + (curr.ongoing || 0), 0);
          const canceled = el.data.reduce((acc, curr) => acc + (curr.canceled || 0), 0);

          return {
            ongoing,
            canceled,
          };
        });

        const valueBarRegions: ApexAxisChartSeries | ApexNonAxisChartSeries = [
          {
            name: translate('section_portal_reports.heading.ongoing'),
            data: reduceDataRegions.map((obj) => obj.ongoing),
          },
          {
            name: translate('section_portal_reports.heading.canceled'),
            data: reduceDataRegions.map((obj) => obj.canceled),
          },
        ].concat();

        setAxisLabelRegions(valueAxisLabelRegions);
        setBarRegions(valueBarRegions);
      }

      if (findGovernorates && findGovernorates.data.length) {
        const valueGovernorates = findGovernorates.data.map((item: IMapItemKeys) => {
          const data: IDataMapItems[] = Object.entries(item.data[0]).map(([track, value]) => ({
            [track]: value,
          }));

          const result: IResultMapItems[] = data.map((item: IDataMapItems) => {
            const track = Object.keys(item)[0];
            const data = item[track];
            return {
              label: translate(track),
              ongoing: data.ONGOING || 0,
              canceled: data.CANCELED || 0,
            };
          });

          return {
            key: item.key,
            data: result,
          };
        });

        const valueAxisLabelGovernorates = valueGovernorates.map((el) => el.key);
        const reduceDataGovernorates = valueGovernorates.map((el) => {
          const ongoing = el.data.reduce((acc, curr) => acc + (curr.ongoing || 0), 0);
          const canceled = el.data.reduce((acc, curr) => acc + (curr.canceled || 0), 0);

          return {
            ongoing,
            canceled,
          };
        });

        const valueBarGovernorates: ApexAxisChartSeries | ApexNonAxisChartSeries = [
          {
            name: translate('section_portal_reports.heading.ongoing'),
            data: reduceDataGovernorates.map((obj) => obj.ongoing),
          },
          {
            name: translate('section_portal_reports.heading.canceled'),
            data: reduceDataGovernorates.map((obj) => obj.canceled),
          },
        ].concat();

        setAxisLabelGovernorates(valueAxisLabelGovernorates);
        setBarGovernorates(valueBarGovernorates);
      }
    }

    if (dataBeneficiaries) {
      const valueTrakcs = dataBeneficiaries.by_track.map((v) => ({
        label: translate(v.track),
        value: v.total_project_beneficiaries,
      }));

      const valueType = dataBeneficiaries.by_type.map((v) => ({
        label: translate(`section_portal_reports.heading.gender.${v.type.toLowerCase()}`),
        value: v.total_project_beneficiaries,
      }));

      setDataTrackBeneficiaries(valueTrakcs);
      setDataTypeBeneficiaries(valueType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueDataList, dataBeneficiaries]);

  return (
    <Box sx={{ pt: 2 }}>
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
        <Grid container direction="row" columnSpacing={3} rowSpacing={4}>
          {donutDataTracks.length
            ? donutDataTracks.map((v, i) => (
                <Grid key={i} item xs={12} md={6}>
                  <DonutChart headline={translate(v.key)} data={v} />
                </Grid>
              ))
            : null}

          {donutDataRequest.length ? (
            <Grid item md={6} xs={12}>
              <ProjectsNumbers
                title={translate('section_portal_reports.heading.total_number_of_request')}
                chartData={donutDataRequest}
                chartColors={['#0E8478', '#1E1E1E', '#93A3B0']}
              />
            </Grid>
          ) : (
            <EmptyChart
              type="donut"
              title={translate('section_portal_reports.heading.total_number_of_request')}
            />
          )}

          {barDataAuthorities.length || axisLabelAuthorities.length ? (
            <Grid item xs={12} md={12}>
              <BarChart
                headline={translate('section_portal_reports.heading.authorities_label')}
                data={barDataAuthorities}
                xAxisDatas={axisLabelAuthorities}
                barRenderBorderRadius={12}
              />
            </Grid>
          ) : null}

          {barRegions.length || axisLabelRegions.length ? (
            <Grid item xs={12} md={12}>
              <BarChart
                headline={translate('section_portal_reports.heading.by_regions')}
                data={barRegions}
                xAxisDatas={axisLabelRegions}
                barRenderBorderRadius={12}
              />
            </Grid>
          ) : (
            <EmptyChart type="bar" title={translate('section_portal_reports.heading.by_regions')} />
          )}

          {barGovernorates.length || axisLabelGovernorates.length ? (
            <Grid item xs={12} md={12}>
              <BarChart
                headline={translate('section_portal_reports.heading.by_governorate')}
                data={barGovernorates}
                xAxisDatas={axisLabelGovernorates}
                barRenderBorderRadius={12}
              />
            </Grid>
          ) : (
            <EmptyChart
              type="bar"
              title={translate('section_portal_reports.heading.by_governorate')}
            />
          )}

          {dataTrackBeneficiaries.length ? (
            <Grid item md={6} xs={12}>
              <ProjectBenificiares
                title={translate('section_portal_reports.heading.total_number_beneficiaries')}
                chartData={dataTrackBeneficiaries}
                chartColors={['#0E8478', '#FFC107', '#FF4842', '#0169DE']}
              />
            </Grid>
          ) : (
            <EmptyChart
              type="polar"
              title={translate('section_portal_reports.heading.total_number_beneficiaries')}
            />
          )}
          {dataTypeBeneficiaries.length ? (
            <Grid item xs={12} md={6}>
              <ProjectBenidiciaresKinds
                data={dataTypeBeneficiaries}
                headLine={translate('section_portal_reports.heading.type_beneficiaries_project')}
              />
            </Grid>
          ) : (
            <EmptyChart
              type="donut"
              title={translate('section_portal_reports.heading.type_beneficiaries_project')}
            />
          )}
        </Grid>
      )}
    </Box>
  );
}
