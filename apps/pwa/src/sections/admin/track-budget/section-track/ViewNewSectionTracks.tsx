// react
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// @mui
import {
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
// components
import Iconify from 'components/Iconify';
// hooks
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { ExpandMore } from '../../../../components/hook-form/nested-track-budget/RHFBaseRepeater';
import { getTracksById } from '../../../../redux/slices/track';
import { dispatch, useSelector } from '../../../../redux/store';
import { fCurrencyNumber } from '../../../../utils/formatNumber';
import { TrackSection } from '../../../../@types/commons';
import { lighten } from '@mui/material/styles';
import { flattenChildTrackSections } from '../../../client/funding-project-request/forms/FormNestedTrackBudget';
import { getSectoinBudget } from '../../../../utils/getSectoinBudget';

// ------------------------------------------------------------------------------------------

export interface SectionInterface {
  id?: string;
  name?: string;
  budget?: number;
}

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// ------------------------------------------------------------------------------------------

export default function ViewNewSectionTracks() {
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const { id: track_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang, translate } = useLocales();
  const [allSectionBudget, setAllSectionBudget] = useState<TrackSection[]>([]);
  // console.log({ allSectionBudget });

  const [openItems, setOpenItems] = useState<string[]>([]);

  const { track, isLoading: load, error } = useSelector((state) => state.tracks);

  const handleToggle = (itemId?: string) => {
    if (itemId) {
      setOpenItems((prevOpenItems) => {
        const isOpen = prevOpenItems.includes(itemId);
        return isOpen
          ? prevOpenItems.filter((item) => item !== itemId)
          : [...prevOpenItems, itemId];
      });
    }
  };

  const handleSectionBudget = async () => {
    // const flatArray = flattenChildTrackSections(track?.sections || [], track?.id).filter(
    //   (item) => item.parent_section_id
    // );
    const flatArray = flattenChildTrackSections(track?.sections || [], track?.id);
    for (const item of flatArray) {
      const res = await getSectoinBudget({
        id: item?.id!,
        role: activeRole!,
      });
      if (res) {
        setAllSectionBudget((prevState) => [...prevState, { ...res }]);
      }
    }
  };

  // fetching track by id
  useEffect(() => {
    dispatch(getTracksById(activeRole!, track_id || ''));
  }, [activeRole, track_id]);

  // handle error
  useEffect(() => {
    if (!!error) {
      const statusCode = (error && error.statusCode) || 0;
      const message = (error && error.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // useEffect(() => {
  //   if (track && !load) {
  //     handleSectionBudget();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [track, load]);

  if (load) return <>{translate('pages.common.loading')}</>;

  return (
    <Container>
      <ContentStyle>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ p: 1, minWidth: 25, minHeight: 25, mr: 3 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={25}
                height={25}
              />
            </Button>
          </Grid>
          <Grid item md={12} xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography flex={1} variant="h4">
                {formatCapitalizeText(track?.name || '-')}
              </Typography>
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              disabled
              type="number"
              size="medium"
              label={translate('pages.admin.tracks_budget.form.amount.label')}
              placeholder={translate('pages.admin.tracks_budget.form.amount.placeholder')}
              value={Number(track?.total_budget) || 0}
              fullWidth
            />
          </Grid>
          <Grid item md={12} xs={12}>
            {track?.sections && track?.sections?.length > 0
              ? track.sections?.map((item: TrackSection, index: number) => (
                  <Grid key={item?.id} container columns={16}>
                    <Grid item md={16} xs={16}>
                      <Divider>
                        <Chip
                          label={
                            <Typography
                              noWrap
                              sx={{ fontSize: '14px' }}
                            >{`${item?.name}`}</Typography>
                          }
                        />
                      </Divider>
                    </Grid>
                    <Grid item md={16} xs={16}>
                      <Grid container columns={20} justifyContent={'flex-end'}>
                        <Grid
                          item
                          md={1}
                          xs={2}
                          sx={{ display: 'flex', alignItems: 'center', pr: 2 }}
                        >
                          {item?.child_track_section && item?.child_track_section?.length > 0 && (
                            <ExpandMore
                              expand={openItems.includes(item?.id!)}
                              onClick={() => handleToggle(item?.id)}
                              aria-expanded={openItems.includes(item?.id!)}
                              aria-label="show more"
                              size="small"
                            >
                              <ExpandMoreIcon fontSize="large" />
                            </ExpandMore>
                          )}
                        </Grid>
                        <Grid item md={13} xs={18} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography noWrap sx={{ fontSize: '18px', fontWeight: 600 }}>
                            {item?.name || '-'}
                          </Typography>
                        </Grid>
                        <Grid item md={2} xs={20} sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                            {translate(
                              'content.administrative.statistic.heading.totalReservedBudget'
                            )}
                          </Typography>
                          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                            {fCurrencyNumber(item?.section_spending_budget || 0)}
                          </Typography>
                        </Grid>
                        <Grid item md={2} xs={20} sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                            {translate('content.administrative.statistic.heading.totalSpendBudget')}
                          </Typography>
                          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                            {fCurrencyNumber(item?.section_reserved_budget || 0)}
                          </Typography>
                        </Grid>
                        <Grid item md={2} xs={20} sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                            {translate('content.administrative.statistic.heading.totalBudget')}
                          </Typography>
                          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                            {fCurrencyNumber(item?.budget || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* First Section Child */}
                    {openItems.includes(item?.id!) &&
                      item?.child_track_section &&
                      item?.child_track_section?.length > 0 &&
                      item?.child_track_section.map((item) => (
                        <React.Fragment key={item.id}>
                          <Grid key={item?.id} item md={16} xs={16}>
                            <Grid container columns={20} justifyContent={'flex-end'}>
                              <Grid
                                item
                                md={1}
                                xs={2}
                                sx={{ display: 'flex', alignItems: 'center', pr: 2 }}
                              >
                                {item?.child_track_section &&
                                  item?.child_track_section?.length > 0 && (
                                    <ExpandMore
                                      expand={openItems.includes(item?.id!)}
                                      onClick={() => handleToggle(item?.id)}
                                      aria-expanded={openItems.includes(item?.id!)}
                                      aria-label="show more"
                                      size="small"
                                    >
                                      <ExpandMoreIcon fontSize="large" />
                                    </ExpandMore>
                                  )}
                              </Grid>
                              <Grid
                                item
                                md={12}
                                xs={18}
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Typography noWrap sx={{ fontSize: '18px', fontWeight: 500 }}>
                                  {item?.name || '-'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                xs={20}
                                sx={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                                  {translate(
                                    'content.administrative.statistic.heading.totalReservedBudget'
                                  )}
                                </Typography>
                                <Typography sx={{ color: lighten('#000', 0.1), fontWeight: 700 }}>
                                  {fCurrencyNumber(item?.section_spending_budget || 0)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                xs={20}
                                sx={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                                  {translate(
                                    'content.administrative.statistic.heading.totalSpendBudget'
                                  )}
                                </Typography>
                                <Typography sx={{ color: lighten('#000', 0.1), fontWeight: 700 }}>
                                  {fCurrencyNumber(item?.section_reserved_budget || 0)}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                md={2}
                                xs={20}
                                sx={{ display: 'flex', flexDirection: 'column' }}
                              >
                                <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                                  {translate(
                                    'content.administrative.statistic.heading.totalBudget'
                                  )}
                                </Typography>
                                <Typography sx={{ color: lighten('#000', 0.1), fontWeight: 700 }}>
                                  {fCurrencyNumber(item?.budget || 0)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* Second Section Child */}
                          {openItems.includes(item?.id!) &&
                            item?.child_track_section &&
                            item?.child_track_section?.length > 0 &&
                            item?.child_track_section.map((item) => (
                              <React.Fragment key={item.id}>
                                <Grid key={item?.id} item md={16} xs={16}>
                                  <Grid container columns={20} justifyContent={'flex-end'}>
                                    <Grid
                                      item
                                      md={1}
                                      xs={2}
                                      sx={{ display: 'flex', alignItems: 'center', pr: 2 }}
                                    >
                                      {item?.child_track_section &&
                                        item?.child_track_section?.length > 0 && (
                                          <ExpandMore
                                            expand={openItems.includes(item?.id!)}
                                            onClick={() => handleToggle(item?.id)}
                                            aria-expanded={openItems.includes(item?.id!)}
                                            aria-label="show more"
                                            size="small"
                                          >
                                            <ExpandMoreIcon fontSize="large" />
                                          </ExpandMore>
                                        )}
                                    </Grid>
                                    <Grid
                                      item
                                      md={11}
                                      xs={18}
                                      sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                      <Typography noWrap sx={{ fontSize: '18px', fontWeight: 500 }}>
                                        {item?.name || '-'}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      md={2}
                                      xs={20}
                                      sx={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <Typography
                                        sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                      >
                                        {translate(
                                          'content.administrative.statistic.heading.totalReservedBudget'
                                        )}
                                      </Typography>
                                      <Typography
                                        sx={{ color: lighten('#000', 0.2), fontWeight: 700 }}
                                      >
                                        {fCurrencyNumber(item?.section_spending_budget || 0)}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      md={2}
                                      xs={20}
                                      sx={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <Typography
                                        sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                      >
                                        {translate(
                                          'content.administrative.statistic.heading.totalSpendBudget'
                                        )}
                                      </Typography>
                                      <Typography
                                        sx={{ color: lighten('#000', 0.2), fontWeight: 700 }}
                                      >
                                        {fCurrencyNumber(item?.section_reserved_budget || 0)}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      md={2}
                                      xs={20}
                                      sx={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                      <Typography
                                        sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                      >
                                        {translate(
                                          'content.administrative.statistic.heading.totalBudget'
                                        )}
                                      </Typography>
                                      <Typography
                                        sx={{ color: lighten('#000', 0.2), fontWeight: 700 }}
                                      >
                                        {fCurrencyNumber(item?.budget || 0)}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Child Section Third */}
                                {openItems.includes(item?.id!) &&
                                  item?.child_track_section &&
                                  item?.child_track_section?.length > 0 &&
                                  item?.child_track_section.map((item) => (
                                    <React.Fragment key={item.id}>
                                      <Grid key={item?.id} item md={16} xs={16}>
                                        <Grid container columns={20} justifyContent={'flex-end'}>
                                          <Grid
                                            item
                                            md={1}
                                            xs={2}
                                            sx={{ display: 'flex', alignItems: 'center', pr: 2 }}
                                          >
                                            {item?.child_track_section &&
                                              item?.child_track_section?.length > 0 && (
                                                <ExpandMore
                                                  expand={openItems.includes(item?.id!)}
                                                  onClick={() => handleToggle(item?.id)}
                                                  aria-expanded={openItems.includes(item?.id!)}
                                                  aria-label="show more"
                                                  size="small"
                                                >
                                                  <ExpandMoreIcon fontSize="large" />
                                                </ExpandMore>
                                              )}
                                          </Grid>
                                          <Grid
                                            item
                                            md={10}
                                            xs={18}
                                            sx={{ display: 'flex', alignItems: 'center' }}
                                          >
                                            <Typography
                                              noWrap
                                              sx={{ fontSize: '18px', fontWeight: 500 }}
                                            >
                                              {item?.name || '-'}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            md={2}
                                            xs={20}
                                            sx={{ display: 'flex', flexDirection: 'column' }}
                                          >
                                            <Typography
                                              sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                            >
                                              {translate(
                                                'content.administrative.statistic.heading.totalReservedBudget'
                                              )}
                                            </Typography>
                                            <Typography
                                              sx={{ color: lighten('#000', 0.4), fontWeight: 700 }}
                                            >
                                              {fCurrencyNumber(item?.section_spending_budget || 0)}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            md={2}
                                            xs={20}
                                            sx={{ display: 'flex', flexDirection: 'column' }}
                                          >
                                            <Typography
                                              sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                            >
                                              {translate(
                                                'content.administrative.statistic.heading.totalSpendBudget'
                                              )}
                                            </Typography>
                                            <Typography
                                              sx={{ color: lighten('#000', 0.4), fontWeight: 700 }}
                                            >
                                              {fCurrencyNumber(item?.section_reserved_budget || 0)}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            md={2}
                                            xs={20}
                                            sx={{ display: 'flex', flexDirection: 'column' }}
                                          >
                                            <Typography
                                              sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}
                                            >
                                              {translate(
                                                'content.administrative.statistic.heading.totalBudget'
                                              )}
                                            </Typography>
                                            <Typography
                                              sx={{ color: lighten('#000', 0.4), fontWeight: 700 }}
                                            >
                                              {fCurrencyNumber(item?.budget || 0)}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </React.Fragment>
                                  ))}
                              </React.Fragment>
                            ))}
                        </React.Fragment>
                      ))}
                  </Grid>
                ))
              : null}
          </Grid>
        </Grid>
      </ContentStyle>
    </Container>
  );
}
