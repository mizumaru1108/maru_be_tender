import Slider from 'react-slick';
import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIconStyle from 'components/SvgIconStyle';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { CarouselArrows, CarouselDots } from 'components/carousel';

function ClientCarousel() {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);

  const settings = {
    speed: 1500,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ rounded: true, zIndex: 9, top: 160, left: 450, position: 'absolute' }),
  };

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
          <Box
            className="innerBox"
            sx={{
              backgroundColor: 'rgba(147, 163, 176, 0.16)',
              height: '150px',
              borderRadius: '20px',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ p: '10px 25px 10px 25px', w: '100%', h: '100%' }}
            >
              <img src={`/icons/mosque-carousel-icon.svg`} alt="" />
              <Stack direction="column" gap={3} justifyContent="end">
                <Typography variant="h6">
                  مكان مخصص للإعلانات في الجمعية لعرض النتائج مع الشركاء في مجال معين
                </Typography>
                <Typography variant="h6">
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .
                </Typography>
                <Button>عرض تفاصيل المشروع</Button>
              </Stack>
            </Stack>
          </Box>
          <Box
            className="innerBox"
            sx={{
              backgroundColor: 'rgba(147, 163, 176, 0.16)',
              height: '150px',
              borderRadius: '20px',
            }}
          >
            <Stack direction="row" justifyContent="space-between" sx={{ p: '10px 25px 10px 25px' }}>
              <img src={`/icons/mosque-carousel-icon.svg`} alt="" />
              <Stack direction="column" gap={3} justifyContent="end">
                <Typography variant="h6">
                  مكان مخصص للإعلانات في الجمعية لعرض النتائج مع الشركاء في مجال معين
                </Typography>
                <Typography variant="h6">
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .
                </Typography>
                <Button>عرض تفاصيل المشروع</Button>
              </Stack>
            </Stack>
          </Box>
        </Slider>
      </CarouselArrows>
    </Box>
  );
}

export default ClientCarousel;
