export const Taps = {
  tender_client: [
    {
      title: 'project_details.actions.main',
      value: 'main',
    },
    {
      title: 'project_details.actions.project_budget',
      value: 'project-budget',
    },
    {
      title: 'project_details.actions.follow_ups',
      value: 'follow-ups',
    },
    {
      title: 'project_details.actions.payments',
      value: 'payments',
    },
  ],
  tender_consultant: [
    {
      title: 'project_details.actions.main',
      value: 'main',
    },
    {
      title: 'project_details.actions.project_budget',
      value: 'project-budget',
    },
    {
      title: 'project_details.actions.project_path',
      value: 'project-path',
    },
    {
      title: 'project_details.actions.project_timeline',
      value: 'project-timeline',
    },
    {
      title: 'project_details.actions.follow_ups',
      value: 'follow-ups',
    },
  ],
  tender_moderator: [
    {
      title: 'main',
    },
    {
      title: 'project-path',
    },
    {
      title: 'follow-ups',
    },
  ],
} as TapsProps;

type TapsProps = Record<string, Array<Record<string, string>>>;
