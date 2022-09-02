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
  main: getIcon('main'),
  project_fund_request: getIcon('request-for-project'),
  draft_project_requests: getIcon('draft-request'),
  previous_project_requests: getIcon('previous-request'),
  messages: getIcon('message-bar'),
  support: getIcon('contact-us'),
};

const navConfig = {
  // GENERAL
  // ----------------------------------------------------------------------
  admin: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_DASHBOARD.general.app,
          icon: ICONS.main,
        },
        {
          title: 'طلب دعم مشروع',
          path: PATH_DASHBOARD.fundraising,
          icon: ICONS.project_fund_request,
        },
        {
          title: 'طلبات دعم مسودة',
          path: PATH_DASHBOARD.hr.root,
          icon: ICONS.draft_project_requests,
        },
        {
          title: 'طلبات دعم سابقة',
          path: PATH_DASHBOARD.general.ecommerce,
          icon: ICONS.previous_project_requests,
        },
        { title: 'الرسائل', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.messages },
        { title: 'نواصل مع الدعم', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.support },
      ],
    },
  ],
  client: [],
  common: [],
};

export default navConfig;
