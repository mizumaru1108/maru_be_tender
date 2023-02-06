import { client_data, Prisma } from '@prisma/client';
import { finalUploadFileJson } from '../types';

export function ApproveEditRequestMapper(
  oldClientData: client_data,
  newClientData: client_data,
): Prisma.client_dataUncheckedUpdateInput {
  const {
    authority,
    center_administration,
    ceo_mobile,
    ceo_name,
    chairman_mobile,
    chairman_name,
    client_field,
    data_entry_mail,
    data_entry_mobile,
    data_entry_name,
    date_of_esthablistmen,
    entity,
    governorate,
    headquarters,
    license_expired,
    license_file,
    license_issue_date,
    license_number,
    num_of_beneficiaries,
    num_of_employed_facility,
    phone,
    region,
    twitter_acount,
    website,
  } = newClientData;

  const updatePayload: Prisma.client_dataUncheckedUpdateInput = {};

  if (authority && authority !== oldClientData.authority) {
    updatePayload.authority = authority;
  }

  if (
    center_administration &&
    center_administration !== oldClientData.center_administration
  ) {
    updatePayload.center_administration = center_administration;
  }

  if (ceo_mobile && ceo_mobile !== oldClientData.ceo_mobile) {
    updatePayload.ceo_mobile = ceo_mobile;
  }

  if (ceo_name && ceo_name !== oldClientData.ceo_name) {
    updatePayload.ceo_name = ceo_name;
  }

  if (entity && entity !== oldClientData.entity) {
    updatePayload.entity = entity;
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

  if (license_file) {
    let tmpLicense: finalUploadFileJson = license_file as any;
    if (tmpLicense.hasOwnProperty('color') && tmpLicense.color === 'green') {
      updatePayload.license_file = {
        url: tmpLicense.url,
        size: tmpLicense.size,
        type: tmpLicense.type,
      };
    }
  }

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

  if (chairman_name && chairman_name !== oldClientData.chairman_name) {
    updatePayload.chairman_name = chairman_name;
  }

  if (chairman_mobile && chairman_mobile !== oldClientData.chairman_mobile) {
    updatePayload.chairman_mobile = chairman_mobile;
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
