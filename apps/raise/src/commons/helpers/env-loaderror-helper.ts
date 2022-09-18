export const envLoadErrorHelper = (envName: string) => {
  throw new Error(
    `${envName} is not loaded properly!, please check your environment variables!`,
  );
};
