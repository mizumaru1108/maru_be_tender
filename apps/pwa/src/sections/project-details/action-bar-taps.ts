export const Taps = {
  client: [
    {
      title: 'main',
    },
    {
      title: 'project-budget',
    },
  ],
} as TapsProps;

type TapsProps = Record<string, Array<Record<string, string>>>;
