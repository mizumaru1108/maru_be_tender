export const Taps = {
  client: [
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
} as TapsProps;

type TapsProps = Record<string, Array<Record<string, string>>>;
