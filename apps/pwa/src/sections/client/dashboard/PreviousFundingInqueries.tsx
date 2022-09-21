import { Container, Typography, Box, Button, Grid, Stack } from '@mui/material';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ProjectCard } from 'components/card-table';
import { ProjectCardProps } from 'components/card-table/types';

function PreviousFundingInqueries() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // dummy data
  const data = [
    {
      title: {
        id: '768873',
      },
      content: {
        projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
        createdAt: new Date(2022, 8, 2, 15, 58),
        projectStatus: 'في انتظار موافقة',
        projectDetails:
          'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      },
      footer: {
        createdAt: new Date(2022, 8, 2, 15, 58),
      },
    },
    {
      title: {
        id: '768873',
      },
      content: {
        projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
        createdAt: new Date(2022, 8, 2, 15, 58),
        projectStatus: 'في انتظار موافقة',
        projectDetails:
          'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      },
      footer: {
        createdAt: new Date(2022, 8, 2, 15, 58),
      },
    },
    {
      title: {
        id: '768873',
      },
      content: {
        projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
        createdAt: new Date(2022, 8, 2, 15, 58),
        projectStatus: 'في انتظار موافقة',
        projectDetails:
          'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      },
      footer: {
        createdAt: new Date(2022, 8, 2, 15, 58),
      },
    },
    {
      title: {
        id: '768873',
      },
      content: {
        projectName: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
        createdAt: new Date(2022, 8, 2, 15, 58),
        projectStatus: 'في انتظار موافقة',
        projectDetails:
          'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      },
      footer: {
        createdAt: new Date(2022, 8, 2, 15, 58),
      },
    },
  ] as ProjectCardProps[];

  return (
    <Container>
      <Typography variant="h4">طلبات دعم سابقة</Typography>
      <Box sx={{ width: '50%', mb: '10px' }}>
        <Tabs
          onChange={handleChange}
          value={value}
          aria-label="Tabs where selection follows focus"
          selectionFollowsFocus
        >
          <Tab label="كل المشاريع" />
          <Tab label="مشاريع منتهية" />
          <Tab label="مشاريع معلقة" />
        </Tabs>
      </Box>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {data.map((item, index) => (
          <Grid item md={6} key={index}>
            <ProjectCard
              {...item}
              cardFooterButtonAction="show-details"
              destination="previous-funding-requests"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PreviousFundingInqueries;
