import Slider from 'react-slick';
import React, { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import { CarouselArrows, CarouselDots } from 'components/carousel';
import { makeStyles } from '@material-ui/core/styles';
import { FEATURE_BANNER } from 'config';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { AdvertisingTapeList } from 'components/table/admin/system-messages/types';
import DetailBannerDialog from 'components/modal-dialog/DetailBannerDialog';
import { useSelector } from 'redux/store';
import dayjs from 'dayjs';

const data = [
  {
    firstField: 'رسالة ترحيبية',
    secondField: 'شكراً لاستخدامكم منصة مانح',
  },
  {
    firstField: 'رسالة ترحيبية',
    secondField: 'شكراً لاستخدامكم منصة مانح',
  },
];

const LINES_TO_SHOW = 1;

const useStyles = makeStyles({
  multiLineEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': LINES_TO_SHOW,
    '-webkit-box-orient': 'vertical',
  },
});

function ClientCarousel() {
  const classes = useStyles();
  const theme = useTheme();
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { track_list } = useSelector((state) => state.proposal);
  const carouselRef = useRef<Slider | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [carouselData, setCarouselData] = React.useState<AdvertisingTapeList[]>([]);
  const [details, setDetails] = React.useState<AdvertisingTapeList | null>(null);
  // console.log({ carouselData });
  // const currentTime = dayjs(new Date()).format('hh:mm A');
  // const lastTime = dayjs(new Date()).subtract(1, 'hour').format('hh:mm A');
  // const currentTime = dayjs('2023-08-04T06:15:58.593Z').format('hh:mm A'); // Get the current time using Day.js
  // const lastTime = dayjs().subtract(1, 'hour').format('hh:mm A');
  // console.log({ currentTime, lastTime });

  // const isFastForward = currentTime.isAfter(lastTime);
  // console.log('test fastforward: ', isFastForward);

  const settings = {
    speed: 5000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'ltr'),
    ltr: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ rounded: true, zIndex: 9 }),
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  const handleOpenDetails = (data?: AdvertisingTapeList) => {
    setOpen(true);
    if (data) {
      setDetails(data);
    }
  };
  // console.log({ open });

  const fetchingData = React.useCallback(async () => {
    setIsLoading(true);
    const currentTime = dayjs().valueOf();
    const url = `/banners/mine?current_time=${currentTime}`;
    try {
      const response = await axiosInstance.get(`${url}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log({ response });
      if (response) {
        // console.log('test response', response?.data?.data);
        setCarouselData(response?.data?.data);
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      if (message && statusCode !== 0) {
        enqueueSnackbar(err.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      } else {
        enqueueSnackbar(translate('pages.common.internal_server_error'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <>
      {FEATURE_BANNER ? (
        <Box className="firstBox" sx={{ position: 'relative', direction: 'rtl' }}>
          <DetailBannerDialog
            open={open}
            handleClose={() => setOpen(!open)}
            message={'system_messages.dialog.banner_details.external'}
            data={details}
            role="client"
          />
          <CarouselArrows
            filled
            onNext={handleNext}
            onPrevious={handlePrevious}
            sx={{
              '& .arrow button': {
                p: 0,
                width: 24,
                height: 24,
                top: 5,
              },
            }}
          >
            <Slider ref={carouselRef} {...settings}>
              {[...carouselData].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 1,
                    textAlign: 'center',
                    backgroundColor: 'rgba(147, 163, 176, 0.16)',
                    height: '100',
                    borderRadius: '20px',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    sx={{ p: '10px 25px 10px 25px', w: '100%', h: '100%' }}
                  >
                    <Box flex={1} sx={{ alignSelf: 'center' }}>
                      <img
                        src={item?.logo ? item.logo[0].url : `/icons/mosque-carousel-icon.svg`}
                        alt=""
                      />
                    </Box>
                    <Stack direction="column" gap={1} justifyContent="center" flex={4}>
                      <Typography
                        className={classes.multiLineEllipsis}
                        sx={{ fontSize: '16px', textAlign: 'end', color: 'text.tertiary' }}
                        variant="h4"
                      >
                        {/* {`${item.title} (${
                          track_list.find((track) => track.id === item.track_id)?.name || '-'
                        })`} */}
                        {`${item.title}`}
                      </Typography>
                      <Typography
                        className={classes.multiLineEllipsis}
                        sx={{ fontSize: '16px', textAlign: 'end' }}
                        variant="h4"
                      >
                        {item.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <Typography
                          className={classes.multiLineEllipsis}
                          sx={{
                            // maxWidth: '100px',
                            display: 'inline-block',
                            textAlign: 'end',
                            cursor: 'pointer',
                            '&:hover': { color: '#0E8478', textDecoration: 'underline' },
                          }}
                          variant="h6"
                          color="text.secondary"
                          onClick={() => {
                            handleOpenDetails(item);
                          }}
                        >
                          {translate('system_messages.details')}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Slider>
          </CarouselArrows>
        </Box>
      ) : null}
    </>
  );
}

export default ClientCarousel;
