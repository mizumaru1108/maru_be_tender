export const isTenderFilePayload = (payload: any): boolean => {
  if (
    payload !== undefined &&
    payload['base64Data'] !== undefined &&
    typeof payload.base64Data === 'string' &&
    !!payload.base64Data &&
    payload['fullName'] !== undefined &&
    typeof payload.fullName === 'string' &&
    !!payload.fullName &&
    payload['fileExtension'] !== undefined &&
    typeof payload.fileExtension === 'string' &&
    !!payload.fileExtension &&
    payload.fileExtension.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i) &&
    payload['size'] !== undefined &&
    typeof payload.size === 'number'
  ) {
    return true;
  }
  return false;
};
