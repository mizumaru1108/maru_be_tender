import Slider from 'react-slick';
import { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import { CarouselArrows, CarouselDots } from 'components/carousel';
import { makeStyles } from '@material-ui/core/styles';

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

function ClientCarousel() {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);

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

  const classes = useStyles();

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Box className="firstBox" sx={{ position: 'relative' }}>
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
          {data.map((item, index) => (
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
                  <img src={`/icons/mosque-carousel-icon.svg`} alt="" />
                </Box>
                <Stack direction="column" gap={1} justifyContent="center" flex={4}>
                  <Typography
                    className={classes.multiLineEllipsis}
                    sx={{ fontSize: '16px', textAlign: 'end', color: 'text.tertiary' }}
                    variant="h4"
                  >
                    {item.firstField}
                  </Typography>
                  <Typography
                    className={classes.multiLineEllipsis}
                    sx={{ fontSize: '16px', textAlign: 'end' }}
                    variant="h4"
                  >
                    {item.secondField}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Slider>
      </CarouselArrows>
    </Box>
  );
}

export default ClientCarousel;
