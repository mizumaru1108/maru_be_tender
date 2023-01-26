const isTenderFilePayload = (payload: any): boolean => {
  if (
    payload.hasOwnProperty('base64Data') &&
    typeof payload.base64Data === 'string' &&
    !!payload.base64Data &&
    payload.hasOwnProperty('fullName') &&
    typeof payload.fullName === 'string' &&
    !!payload.fullName &&
    payload.hasOwnProperty('fileExtension') &&
    typeof payload.fileExtension === 'string' &&
    !!payload.fileExtension &&
    payload.fileExtension.match(/^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i) &&
    payload.hasOwnProperty('size') &&
    typeof payload.size === 'number'
  ) {
    return true;
  }

  return false;
};
