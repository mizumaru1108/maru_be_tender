// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  dashboard: getIcon('ic_home'),
  fundraising: getIcon('ic_heart'),
  hr: getIcon('ic_people'),
  volounteer: getIcon('ic_glove'),
  box: getIcon('ic_box'),
  building: getIcon('ic_building'),
  setting: getIcon('ic_settings')
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      { title: 'home', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'fundraising', path: PATH_DASHBOARD.fundraising, icon: ICONS.fundraising },
      {
        title: 'human resources', 
        path: PATH_DASHBOARD.hr.root, 
        icon: ICONS.hr,
        children: [
          { title: 'hr dashboard', path: PATH_DASHBOARD.hr.home },
          { 
            title: 'employee', 
            path: PATH_DASHBOARD.hr.employee.list,
            children: [
              { title: 'employe list', path: PATH_DASHBOARD.hr.employee.list },
              { title: 'employe type', path: PATH_DASHBOARD.hr.employee.type },
              { title: 'dapartement', path: PATH_DASHBOARD.hr.employee.dapartement },
              { title: 'designation', path: PATH_DASHBOARD.hr.employee.designation },
              { title: 'branch', path: PATH_DASHBOARD.hr.employee.branch }
            ] 
          },
        ]
      },
      { title: 'volounteer', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.volounteer },
      { title: 'grant application', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.box },
      { title: 'organization', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.building },
      { title: 'setting', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.setting },
    ],
  },
];

export default navConfig;
