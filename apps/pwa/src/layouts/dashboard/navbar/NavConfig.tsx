// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/dashboard-navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
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
  client: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_DASHBOARD.general.app,
          icon: ICONS.main,
        },
        {
          title: 'request_project_funding',
          path: PATH_DASHBOARD.funding_project_request,
          icon: ICONS.project_fund_request,
        },
        // {
        //   title: 'drafts',
        //   path: PATH_DASHBOARD.general.app,
        //   icon: ICONS.draft_project_requests,
        // },
        // {
        //   title: 'previous_funding_requests',
        //   path: PATH_DASHBOARD.general.app,
        //   icon: ICONS.previous_project_requests,
        // },
        // { title: 'messages', path: PATH_DASHBOARD.general.app, icon: ICONS.messages },
        // { title: 'contact_support', path: PATH_DASHBOARD.general.app, icon: ICONS.support },
      ],
    },
  ],
  // client: [],
  // common: [],
};

export default navConfig;
