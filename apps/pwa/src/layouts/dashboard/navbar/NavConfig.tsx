// routes
import { PATH_CLIENT, PATH_MANAGER } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

/**
 * navConfig looks like this
 * {
 *  role : must be included[client, admin, CTO, .... etc]
 * }
 *  And inside everyone of those roles we have array of items, which the one of them includes
 *  1- title: the translation key in the i18n files.
 *  2- path: which goes the Paths file.
 *  3- icone: the Icone for this tap/button.
 *
 *  In the conclusion, when ever you want to add a new route just follow these steps :
 *  1- alter the route file.
 *  2- alter the pathes file.
 *  3- alter this file if it needs.
 *
 *  You may go through another situation, so it depends on the situation itself.
 */

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/dashboard-navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  main: getIcon('main'),
  project_fund_request: getIcon('request-for-project'),
  drafts: getIcon('draft-request'),
  previous_funding_requests: getIcon('previous-request'),
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
          path: PATH_CLIENT.app,
          icon: ICONS.main,
        },
        {
          title: 'request_project_funding',
          path: PATH_CLIENT.funding_project_request,
          icon: ICONS.project_fund_request,
        },

        {
          title: 'drafts',
          path: PATH_CLIENT.drafts,
          icon: ICONS.drafts,
        },
        {
          title: 'previous_funding_requests',
          path: PATH_CLIENT.previous_funding_requests,
          icon: ICONS.previous_funding_requests,
        },
        {
          title: 'messages',
          path: PATH_CLIENT.messages,
          icon: ICONS.messages,
        },
        {
          title: 'contact_support',
          path: PATH_CLIENT.contact_support,
          icon: ICONS.support,
        },
      ],
    },
  ],
  manager: [
    {
      subheader: '',
      items: [
        {
          title: 'main',
          path: PATH_MANAGER.app,
          icon: ICONS.main,
        },
        {
          title: 'new_join_request',
          path: PATH_MANAGER.newJoinRequest,
          icon: ICONS.project_fund_request,
        },

        {
          title: 'information_update_request',
          path: PATH_MANAGER.infoUpdateRequest,
          icon: ICONS.drafts,
        },
        {
          title: 'partner_management',
          path: PATH_MANAGER.partnerManagement,
          icon: ICONS.previous_funding_requests,
        },
        {
          title: 'portal_reports',
          path: PATH_MANAGER.portalReports,
          icon: ICONS.support,
        },
        {
          title: 'messages',
          path: PATH_MANAGER.messages,
          icon: ICONS.messages,
        },
      ],
    },
  ],
  // client: [],
  // common: [],
};

export default navConfig;
