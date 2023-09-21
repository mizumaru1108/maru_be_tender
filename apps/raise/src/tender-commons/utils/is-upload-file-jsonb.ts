// export const isUploadFileJsonb = (payload: any): boolean => {
//   console.log('isUploadFileJsonb', { payload });
//   if (
//     payload !== undefined &&
//     payload['url'] !== undefined &&
//     typeof payload.url === 'string' &&
//     !!payload.url &&
//     payload.url.match(
//       /^(http:\/\/|https:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
//     ) &&
//     payload['size'] !== undefined &&
//     !!payload.size &&
//     typeof payload.size === 'number' &&
//     payload['type'] !== undefined &&
//     typeof payload.type === 'string' &&
//     !!payload.type &&
//     payload.type.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i)
//   ) {
//     console.log('file is json b');
//     return true;
//   }
//   console.log('file is not jsonb');
//   return false;
// };

export const isUploadFileJsonb = (payload: any): boolean => {
  if (
    payload !== undefined &&
    typeof payload === 'object' &&
    'url' in payload &&
    typeof payload.url === 'string' &&
    payload.url.trim().length > 0 && // Ensure URL is not empty
    'size' in payload &&
    typeof payload.size === 'number' &&
    'type' in payload &&
    typeof payload.type === 'string' &&
    payload.type.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i) // Check for valid MIME type
  ) {
    return true;
  }
  return false;
};
