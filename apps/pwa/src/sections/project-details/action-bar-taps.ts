export const Taps = {
  tender_client: [
    {
      title: 'main',
    },
    {
      title: 'project-budget',
    },
    {
      title: 'follow-ups',
    },
    {
      title: 'payments',
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
