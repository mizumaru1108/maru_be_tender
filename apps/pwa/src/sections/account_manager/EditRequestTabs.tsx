import { Box, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { IEditedValues } from '../../@types/client_data';
import { ActiveTap } from '../../@types/proposal';
import DataTab from './edit-request-profile/DataTab';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: string;
  value: string;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const editedTabs = [
  {
    title: 'Previous Data',
    value: 'previous-data',
  },
  {
    title: 'New Data',
    value: 'new-data',
  },
];
type DataTabProps = {
  EditValues: {
    old_data: IEditedValues;
    new_data: IEditedValues;
    difference: IEditedValues;
  };
  // status_edit: string;
};

function EditRequestTabs({ EditValues }: DataTabProps) {
  // const { activeTap, proposal } = useSelector((state) => state.proposal);
  const [activeTap, setActiveTap] = React.useState<string>('previous-data');
  const theme = useTheme();
  const { translate } = useLocales();
  const handleChange = (event: React.SyntheticEvent, newValue: ActiveTap) => {
    // dispatch(setActiveTap(newValue));
    setActiveTap(newValue);
  };
  const [tmpDifference, setTmpDifference] = React.useState<IEditedValues>();

  React.useEffect(() => {
    if (EditValues.difference) {
      if (EditValues?.difference?.region_id || EditValues?.difference?.governorate_id) {
        let tpmLocationValue: IEditedValues = {
          ...EditValues?.difference,
        };
        if (
          EditValues?.difference?.region_id &&
          EditValues?.old_data?.region_id !== EditValues?.difference?.region_id
        ) {
          tpmLocationValue.region = EditValues?.new_data?.region;
        }
        if (
          EditValues?.difference?.governorate_id &&
          EditValues?.old_data?.governorate_id !== EditValues?.difference?.governorate_id
        ) {
          tpmLocationValue.governorate = EditValues?.new_data?.governorate;
        }
        setTmpDifference(tpmLocationValue);
      }
    }
  }, [EditValues]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Tabs
        value={activeTap}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          padding: 1.25,
        }}
      >
        {editedTabs.map((item, index) => (
          <Tab
            label={translate(item?.title)}
            value={item.value}
            key={index}
            {...a11yProps(0)}
            sx={{
              borderRadius: 0,
              px: 3,
              '&.MuiTab-root:not(:last-of-type)': {
                marginRight: 0,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: '10px',
              },
            }}
          />
        ))}
      </Tabs>
      <TabPanel value={activeTap} index="previous-data" dir={theme.direction}>
        {/* prevData */}
        <DataTab
          EditValues={EditValues.old_data}
          compareValues={tmpDifference}
          EditType={'previous-data'}
        />
      </TabPanel>
      <TabPanel value={activeTap} index="new-data" dir={theme.direction}>
        {/* oldData */}
        <DataTab
          EditValues={EditValues.new_data}
          compareValues={tmpDifference}
          EditType={'new-data'}
        />
      </TabPanel>
      {/* <TabPanel value={activeTap} index="files-change" dir={theme.direction}>
        <FilesDataTab EditValues={EditValues.difference} />
      </TabPanel> */}
    </Box>
  );
}

export default EditRequestTabs;
