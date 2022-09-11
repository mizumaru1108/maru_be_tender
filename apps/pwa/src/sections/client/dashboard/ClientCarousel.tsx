import Slider from 'react-slick';
import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SvgIconStyle from 'components/SvgIconStyle';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { CarouselArrows, CarouselDots } from 'components/carousel';

const data = [
  {
    firstField: 'مكان مخصص للإعلانات في الجمعية لعرض النتائج مع الشركاء في مجال معين',
    secondField:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .',
    thirdField: 'عرض تفاصيل المشروع',
  },
  {
    firstField: 'مكان مخصص للإعلانات في الجمعية لعرض النتائج مع الشركاء في مجال معين',
    secondField:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .',
    thirdField: 'عرض تفاصيل المشروع',
  },
  {
    firstField: 'مكان مخصص للإعلانات في الجمعية لعرض النتائج مع الشركاء في مجال معين',
    secondField:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا .',
    thirdField: 'عرض تفاصيل المشروع',
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
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ rounded: true, zIndex: 9, top: 200, left: 450, position: 'absolute' }),
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
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                px: 1,
                textAlign: 'center',
                backgroundColor: 'rgba(147, 163, 176, 0.16)',
                height: '180px',
                borderRadius: '20px',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-around"
                sx={{ p: '10px 25px 10px 25px', w: '100%', h: '100%' }}
              >
                <Box flex={1}>
                  <img src={`/icons/mosque-carousel-icon.svg`} alt="" />
                </Box>
                <Stack direction="column" gap={3} justifyContent="end" flex={4}>
                  <Typography sx={{ fontSize: '16px', textAlign: 'end', color: 'text.tertiary' }}>
                    {item.firstField}
                  </Typography>
                  <Typography sx={{ fontSize: '16px', textAlign: 'end' }}>
                    {item.secondField}
                  </Typography>
                  <Stack justifyContent="space-between" direction="row">
                    <Box>{''}</Box>
                    <Button sx={{ color: '#1E1E1E' }}>{item.thirdField}</Button>
                  </Stack>
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
