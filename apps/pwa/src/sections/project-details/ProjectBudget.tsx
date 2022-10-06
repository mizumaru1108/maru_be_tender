import { Box, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const data = [
  {
    field: 'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور ',
    explanation:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .',
    cost: '2,000 ريال',
  },
  {
    field: 'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور ',
    explanation:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .',
    cost: '2,000 ريال',
  },
  {
    field: 'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور ',
    explanation:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .',
    cost: '2,000 ريال',
  },
  {
    field: 'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور ',
    explanation:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .',
    cost: '2,000 ريال',
  },
  {
    field: 'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور ',
    explanation:
      'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .',
    cost: '2,000 ريال',
  },
];

type Budget = { amount: number; clause: string; explanation: string; id: string };

type IProps = {
  data: Budget[];
  total: number;
};
function ProjectBudget({ data, total }: IProps) {
  return (
    <>
      <Box
        sx={{
          mt: '20px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'start',
          direction: 'row',
          gap: 3,
          padding: '10px',
        }}
      >
        <Typography flex={2}>البند</Typography>
        <Typography flex={3}>الشرح</Typography>
        <Typography flex={2}>المبلغ</Typography>
      </Box>
      {data.map((item: Budget, index) => (
        <>
          <Stack direction="row" key={index} gap={3}>
            <Typography flex={2} sx={{ color: '#1E1E1E' }}>
              {item.clause}
            </Typography>
            <Typography flex={3} sx={{ color: '#1E1E1E' }}>
              {item.explanation}
            </Typography>
            <Typography flex={2} sx={{ color: '#1E1E1E' }}>
              {item.amount}
            </Typography>
          </Stack>
          <Divider />
        </>
      ))}
      <Box
        sx={{
          mt: '20px',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'start',
          direction: 'row',
          gap: 3,
          padding: '10px',
        }}
      >
        <Box flex={2} />
        <Box flex={2} />
        <Typography variant="h6" flex={2.8}>
          {`المبلغ الإجمالي : ${total} ريال`}
        </Typography>
      </Box>
    </>
  );
}

export default ProjectBudget;
