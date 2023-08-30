import { client_data, Prisma } from '@prisma/client';
import { finalUploadFileJson } from '../../../tender-commons/dto/final-upload-file-jsonb.dto';

export function ApproveEditRequestMapper(
  oldClientData: client_data,
  newClientData: client_data,
) {
  const {
    authority,
    authority_id,
    center_administration,
    ceo_mobile,
    ceo_name,
    chairman_mobile,
    chairman_name,
    client_field,
    client_field_id,
    data_entry_mail,
    data_entry_mobile,
    data_entry_name,
    date_of_esthablistmen,
    entity,
    entity_mobile,
    governorate,
    governorate_id,
    headquarters,
    license_expired,
    license_file,
    license_issue_date,
    license_number,
    num_of_beneficiaries,
    num_of_employed_facility,
    phone,
    region,
    region_id,
    twitter_acount,
    website,
  } = newClientData;

  const updateClientPayload: Prisma.client_dataUncheckedUpdateInput = {};
  const updateUserPayload: Prisma.userUncheckedUpdateInput = {};

  if (authority && authority !== oldClientData.authority) {
    updateClientPayload.authority = authority;
  }

  if (authority_id && authority_id !== oldClientData.authority_id) {
    updateClientPayload.authority_id = authority_id;
  }

  if (
    center_administration &&
    center_administration !== oldClientData.center_administration
  ) {
    updateClientPayload.center_administration = center_administration;
  }

  if (ceo_mobile && ceo_mobile !== oldClientData.ceo_mobile) {
    updateClientPayload.ceo_mobile = ceo_mobile;
  }

  if (ceo_name && ceo_name !== oldClientData.ceo_name) {
    updateClientPayload.ceo_name = ceo_name;
  }

  if (entity && entity !== oldClientData.entity) {
    updateUserPayload.employee_name = entity;
    updateClientPayload.entity = entity;
  }

  if (entity_mobile && entity_mobile !== oldClientData.entity_mobile) {
    updateUserPayload.mobile_number = entity_mobile;
    updateClientPayload.entity_mobile = entity_mobile;
  }

  if (headquarters && headquarters !== oldClientData.headquarters) {
    updateClientPayload.headquarters = headquarters;
  }

  if (
    date_of_esthablistmen &&
    date_of_esthablistmen !== oldClientData.date_of_esthablistmen
  ) {
    updateClientPayload.date_of_esthablistmen = date_of_esthablistmen;
  }

  if (
    num_of_beneficiaries &&
    num_of_beneficiaries !== oldClientData.num_of_beneficiaries
  ) {
    updateClientPayload.num_of_beneficiaries = num_of_beneficiaries;
  }

  if (
    num_of_employed_facility &&
    num_of_employed_facility !== oldClientData.num_of_employed_facility
  ) {
    updateClientPayload.num_of_employed_facility = num_of_employed_facility;
  }

  if (governorate && governorate !== oldClientData.governorate) {
    updateClientPayload.governorate = governorate;
  }

  if (governorate_id && governorate_id !== oldClientData.governorate_id) {
    updateClientPayload.governorate_id = governorate_id;
  }

  if (region_id && region_id !== oldClientData.region_id) {
    updateClientPayload.region_id = region_id;
  }

  if (twitter_acount && twitter_acount !== oldClientData.twitter_acount) {
    updateClientPayload.twitter_acount = twitter_acount;
  }

  if (phone && phone !== oldClientData.phone) {
    updateClientPayload.phone = phone;
  }

  if (website && website !== oldClientData.website) {
    updateClientPayload.website = website;
  }

  if (license_number && license_number !== oldClientData.license_number) {
    updateClientPayload.license_number = license_number;
  }

  if (license_expired && license_expired !== oldClientData.license_expired) {
    updateClientPayload.license_expired = license_expired;
  }

  if (
    license_issue_date &&
    license_issue_date !== oldClientData.license_issue_date
  ) {
    updateClientPayload.license_issue_date = license_issue_date;
  }

  if (license_file) {
    const tmpLicense: finalUploadFileJson = license_file as any;
    if (tmpLicense.hasOwnProperty('color') && tmpLicense.color === 'green') {
      updateClientPayload.license_file = {
        url: tmpLicense.url,
        size: tmpLicense.size,
        type: tmpLicense.type,
      };
    }
  }

  if (chairman_name && chairman_name !== oldClientData.chairman_name) {
    updateClientPayload.chairman_name = chairman_name;
  }

  if (chairman_mobile && chairman_mobile !== oldClientData.chairman_mobile) {
    updateClientPayload.chairman_mobile = chairman_mobile;
  }

  if (
    data_entry_mobile &&
    data_entry_mobile !== oldClientData.data_entry_mobile
  ) {
    updateClientPayload.data_entry_mobile = data_entry_mobile;
  }

  if (data_entry_name && data_entry_name !== oldClientData.data_entry_name) {
    updateClientPayload.data_entry_name = data_entry_name;
  }

  if (data_entry_mail && data_entry_mail !== oldClientData.data_entry_mail) {
    updateClientPayload.data_entry_mail = data_entry_mail;
  }

  if (client_field && client_field !== oldClientData.client_field) {
    updateClientPayload.client_field = client_field;
  }

  if (client_field_id && client_field_id !== oldClientData.client_field_id) {
    updateClientPayload.client_field_id = client_field_id;
  }

  return {
    updateClientPayload,
    updateUserPayload,
  };
}
