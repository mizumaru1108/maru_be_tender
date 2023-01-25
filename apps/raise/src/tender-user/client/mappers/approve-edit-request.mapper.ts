import { client_data, Prisma } from '@prisma/client';

export function ApproveEditRequestMapper(
  oldClientData: client_data,
  newClientData: client_data,
): Prisma.client_dataUncheckedUpdateInput {
  const {
    entity,
    authority,
    headquarters,
    date_of_esthablistmen,
    num_of_beneficiaries,
    num_of_employed_facility,
    governorate,
    region,
    // entity_mobile,
    center_administration,
    twitter_acount,
    phone,
    website,
    // email,
    // password,
    license_number,
    license_expired,
    license_issue_date,
    license_file,
    board_ofdec_file,
    ceo_mobile,
    ceo_name,
    data_entry_mobile,
    data_entry_name,
    data_entry_mail,
    client_field,
  } = newClientData;

  const updatePayload: Prisma.client_dataUncheckedUpdateInput = {};
  // for (const key in newClientData) {
  //   if (
  //     newClientData.hasOwnProperty(key) &&
  //     oldClientData[key as keyof client_data] !== newClientData[key]
  //   ) {
  //     updatePayload[key as keyof Prisma.client_dataUncheckedUpdateInput] =
  //       newClientData[key];
  //   }
  // }

  if (entity && entity !== oldClientData.entity) {
    updatePayload.entity = entity;
  }

  if (authority && authority !== oldClientData.authority) {
    updatePayload.authority = authority;
  }

  if (headquarters && headquarters !== oldClientData.headquarters) {
    updatePayload.headquarters = headquarters;
  }

  if (
    date_of_esthablistmen &&
    date_of_esthablistmen !== oldClientData.date_of_esthablistmen
  ) {
    updatePayload.date_of_esthablistmen = date_of_esthablistmen;
  }

  if (
    num_of_beneficiaries &&
    num_of_beneficiaries !== oldClientData.num_of_beneficiaries
  ) {
    updatePayload.num_of_beneficiaries = num_of_beneficiaries;
  }

  if (
    num_of_employed_facility &&
    num_of_employed_facility !== oldClientData.num_of_employed_facility
  ) {
    updatePayload.num_of_employed_facility = num_of_employed_facility;
  }

  if (governorate && governorate !== oldClientData.governorate) {
    updatePayload.governorate = governorate;
  }

  if (region && region !== oldClientData.region) {
    updatePayload.region = region;
  }

  if (
    center_administration &&
    center_administration !== oldClientData.center_administration
  ) {
    updatePayload.center_administration = center_administration;
  }

  if (twitter_acount && twitter_acount !== oldClientData.twitter_acount) {
    updatePayload.twitter_acount = twitter_acount;
  }

  if (phone && phone !== oldClientData.phone) {
    updatePayload.phone = phone;
  }

  if (website && website !== oldClientData.website) {
    updatePayload.website = website;
  }

  if (license_number && license_number !== oldClientData.license_number) {
    updatePayload.license_number = license_number;
  }

  if (license_expired && license_expired !== oldClientData.license_expired) {
    updatePayload.license_expired = license_expired;
  }

  if (
    license_issue_date &&
    license_issue_date !== oldClientData.license_issue_date
  ) {
    updatePayload.license_issue_date = license_issue_date;
  }

  // if (
  //   license_file &&
  //   JSON.stringify(license_file) !== oldClientData.license_file
  // ) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'license_file',
  //     old_value: '',
  //     new_value: JSON.stringify(license_file),
  //     ...baseEditRequest,
  //   });
  // }

  // if (
  //   board_ofdec_file &&
  //   JSON.stringify(board_ofdec_file) !== oldClientData.board_ofdec_file
  // ) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'board_ofdec_file',
  //     old_value: '',
  //     new_value: JSON.stringify(board_ofdec_file),
  //     ...baseEditRequest,
  //   });
  // }

  if (ceo_mobile && ceo_mobile !== oldClientData.ceo_mobile) {
    updatePayload.ceo_mobile = ceo_mobile;
  }

  if (ceo_name && ceo_name !== oldClientData.ceo_name) {
    updatePayload.ceo_name = ceo_name;
  }

  if (
    data_entry_mobile &&
    data_entry_mobile !== oldClientData.data_entry_mobile
  ) {
    updatePayload.data_entry_mobile = data_entry_mobile;
  }

  if (data_entry_name && data_entry_name !== oldClientData.data_entry_name) {
    updatePayload.data_entry_name = data_entry_name;
  }

  if (data_entry_mail && data_entry_mail !== oldClientData.data_entry_mail) {
    updatePayload.data_entry_mail = data_entry_mail;
  }

  if (client_field && client_field !== oldClientData.client_field) {
    updatePayload.client_field = client_field;
  }

  return updatePayload;
}
