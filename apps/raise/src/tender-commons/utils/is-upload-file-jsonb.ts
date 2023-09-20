export const isUploadFileJsonb = (payload: any): boolean => {
  // console.log({ payload });
  if (
    payload !== undefined &&
    payload['url'] !== undefined &&
    typeof payload.url === 'string' &&
    !!payload.url &&
    payload.url.match(
      /^(http:\/\/|https:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    ) &&
    payload['size'] !== undefined &&
    typeof payload.size === 'number' &&
    !!payload.size &&
    payload['type'] !== undefined &&
    typeof payload.type === 'string' &&
    !!payload.type &&
    payload.type.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i)
  ) {
    return true;
  }
  return false;
};
