export function CatchError(error: any) {
  // const { translate } = useLocales();
  const statusCode = (error && error.statusCode) || 0;
  const message = (error && error.message) || 'pages.common.internal_server_error';
  return {
    statusCode,
    message,
  };
}
