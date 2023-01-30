export const isUploadFileJsonb = (payload: any): boolean => {
  if (
    payload.hasOwnProperty('url') &&
    typeof payload.url === 'string' &&
    !!payload.url &&
    payload.url.match(
      /^(http:\/\/|https:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    ) &&
    payload.hasOwnProperty('size') &&
    typeof payload.size === 'number' &&
    !!payload.size &&
    payload.hasOwnProperty('type') &&
    typeof payload.type === 'string' &&
    !!payload.type &&
    payload.type.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i)
  ) {
    return true;
  }
  return false;
};
