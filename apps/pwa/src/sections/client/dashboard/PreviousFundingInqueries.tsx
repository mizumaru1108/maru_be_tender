import { Container, Typography, Box, Button, Grid, Stack } from '@mui/material';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InquiryCard, { InquerieCardProps } from './shared/InquiryCard';

function PreviousFundingInqueries() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const data = [
    {
      id: '#768873',
      establishing_data1: '22.8.2022 في 15:58',
      project_state: 'في انتظار موافقة',
      project_details:
        'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      project_name: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
    },
    {
      id: '#768873',
      establishing_data1: '22.8.2022 في 15:58',
      project_state: 'في انتظار موافقة',
      project_details:
        'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      project_name: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
    },
    {
      id: '#768873',
      establishing_data1: '22.8.2022 في 15:58',
      project_state: 'في انتظار موافقة',
      project_details:
        'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      project_name: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
    },
    {
      id: '#768873',
      establishing_data1: '22.8.2022 في 15:58',
      project_state: 'في انتظار موافقة',
      project_details:
        'لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو........',
      project_name: 'مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض',
    },
  ] as InquerieCardProps[];

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
            <InquiryCard data={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PreviousFundingInqueries;
