import { client_data, edit_request, user } from '@prisma/client';
import { nanoid } from 'nanoid';
import { ClientEditRequestDto } from '../dtos/requests/client-edit-request.dto';

export function CreateEditRequestMapper(
  userId: string,
  clientData: client_data & {
    user: user;
  },
  request: ClientEditRequestDto,
) {
  // destruct newValues.entity as entity from request
  const {
    newValues: {
      entity,
      authority,
      headquarters,
      date_of_esthablistmen,
      num_of_beneficiaries,
      num_of_employed_facility,
      governorate,
      region,
      entity_mobile,
      center_administration,
      twitter_acount,
      phone,
      website,
      email,
      password,
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
    },
  } = request;
  const editRequest: edit_request[] = [];

  const baseEditRequest = {
    approval_status: 'WAITING_FOR_APPROVAL',
    user_id: userId,
  };

  let log: string;
  let changeCount: number = 0;

  const addLog = (fieldName: string) => {
    log += `${fieldName}, has been asked for change`;
    changeCount++;
  };

  if (entity) {
    editRequest.push({
      id: nanoid(),
      field_name: 'entity',
      old_value: clientData.entity,
      new_value: entity,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('entity');
  }

  if (authority) {
    editRequest.push({
      id: nanoid(),
      field_name: 'authority',
      old_value: clientData.authority,
      new_value: authority,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('authority');
  }

  if (headquarters) {
    editRequest.push({
      id: nanoid(),
      field_name: 'headquarters',
      old_value: clientData.headquarters,
      new_value: headquarters,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('headquarters');
  }

  if (date_of_esthablistmen) {
    editRequest.push({
      id: nanoid(),
      field_name: 'date_of_esthablistmen',
      old_value: clientData.date_of_esthablistmen
        ? clientData.date_of_esthablistmen.toISOString()
        : null,
      new_value: date_of_esthablistmen.toISOString(),
      field_type: 'date',
      ...baseEditRequest,
    });
    addLog('date_of_esthablistmen');
  }

  if (num_of_beneficiaries) {
    editRequest.push({
      id: nanoid(),
      field_name: 'num_of_beneficiaries',
      old_value: clientData.num_of_beneficiaries
        ? clientData.num_of_beneficiaries.toString()
        : null,
      new_value: num_of_beneficiaries.toString(),
      field_type: 'number',
      ...baseEditRequest,
    });
    addLog('num_of_beneficiaries');
  }

  if (num_of_employed_facility) {
    editRequest.push({
      id: nanoid(),
      field_name: 'num_of_employed_facility',
      old_value: clientData.num_of_employed_facility
        ? clientData.num_of_employed_facility.toString()
        : null,
      new_value: num_of_employed_facility.toString(),
      field_type: 'number',
      ...baseEditRequest,
    });
    addLog('num_of_employed_facility');
  }

  if (governorate) {
    editRequest.push({
      id: nanoid(),
      field_name: 'governorate',
      old_value: clientData.governorate,
      new_value: governorate,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('governorate');
  }

  if (region) {
    editRequest.push({
      id: nanoid(),
      field_name: 'region',
      old_value: clientData.region,
      new_value: region,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('region');
  }

  if (entity_mobile) {
    editRequest.push({
      id: nanoid(),
      field_name: 'entity_mobile',
      old_value: clientData.entity_mobile,
      new_value: entity_mobile,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('entity_mobile');
  }

  if (center_administration) {
    editRequest.push({
      id: nanoid(),
      field_name: 'center_administration',
      old_value: clientData.center_administration,
      new_value: center_administration,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('center_administration');
  }

  if (twitter_acount) {
    editRequest.push({
      id: nanoid(),
      field_name: 'twitter_acount',
      old_value: clientData.twitter_acount,
      new_value: twitter_acount,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('twitter_acount');
  }

  if (phone) {
    editRequest.push({
      id: nanoid(),
      field_name: 'phone',
      old_value: clientData.phone,
      new_value: phone,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('phone');
  }

  if (website) {
    editRequest.push({
      id: nanoid(),
      field_name: 'website',
      old_value: clientData.website,
      new_value: website,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('website');
  }

  if (email) {
    editRequest.push({
      id: nanoid(),
      field_name: 'email',
      old_value: clientData.user.email,
      new_value: email,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('email');
  }

  if (password) {
    editRequest.push({
      id: nanoid(),
      field_name: 'password',
      old_value: '',
      new_value: password,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('password');
  }

  if (license_number) {
    editRequest.push({
      id: nanoid(),
      field_name: 'license_number',
      old_value: clientData.license_number,
      new_value: license_number,
      field_type: 'string',
      ...baseEditRequest,
    });
    addLog('license_number');
  }

  if (license_expired) {
    editRequest.push({
      id: nanoid(),
      field_name: 'license_expired',
      old_value: clientData.license_expired
        ? clientData.license_expired.toISOString()
        : null,
      new_value: license_expired.toISOString(),
      field_type: 'date',
      ...baseEditRequest,
    });
    addLog('license_expired');
  }

  if (license_issue_date) {
    editRequest.push({
      id: nanoid(),
      field_name: 'license_issue_date',
      old_value: clientData.license_issue_date
        ? clientData.license_issue_date.toISOString()
        : null,
      new_value: license_issue_date.toISOString(),
      field_type: 'date',
      ...baseEditRequest,
    });
  }

  if (license_file) {
    editRequest.push({
      id: nanoid(),
      field_name: 'license_file',
      old_value: '',
      new_value: JSON.stringify(license_file),
      field_type: 'file',
      ...baseEditRequest,
    });
  }

  if (board_ofdec_file) {
    editRequest.push({
      id: nanoid(),
      field_name: 'board_ofdec_file',
      old_value: '',
      new_value: JSON.stringify(board_ofdec_file),
      field_type: 'file',
      ...baseEditRequest,
    });
  }

  if (ceo_mobile) {
    editRequest.push({
      id: nanoid(),
      field_name: 'ceo_mobile',
      old_value: clientData.ceo_mobile,
      new_value: ceo_mobile,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  if (ceo_name) {
    editRequest.push({
      id: nanoid(),
      field_name: 'ceo_name',
      old_value: clientData.ceo_name,
      new_value: ceo_name,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  if (data_entry_mobile) {
    editRequest.push({
      id: nanoid(),
      field_name: 'data_entry_mobile',
      old_value: clientData.data_entry_mobile,
      new_value: data_entry_mobile,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  if (data_entry_name) {
    editRequest.push({
      id: nanoid(),
      field_name: 'data_entry_name',
      old_value: clientData.data_entry_name,
      new_value: data_entry_name,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  if (data_entry_mail) {
    editRequest.push({
      id: nanoid(),
      field_name: 'data_entry_mail',
      old_value: clientData.data_entry_mail,
      new_value: data_entry_mail,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  if (client_field) {
    editRequest.push({
      id: nanoid(),
      field_name: 'client_field',
      old_value: clientData.client_field,
      new_value: client_field,
      field_type: 'string',
      ...baseEditRequest,
    });
  }

  return editRequest;
}
