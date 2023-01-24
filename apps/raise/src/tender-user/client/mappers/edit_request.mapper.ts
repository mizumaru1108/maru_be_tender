import { client_data, Prisma, user } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ClientEditRequestFieldDto } from '../dtos/requests/client-edit-request-field.dto';
import { addLog } from '../utils/add-logs';

export function CreateEditRequestMapper(
  clientData: client_data & {
    user: user;
  },
  request: ClientEditRequestFieldDto,
  logs: string,
  baseEditRequest: {
    request_id: string;
  },
) {
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
  } = request;

  // for refactor later on maybe(?) :D
  // let denactiveAccount: boolean = false; // for conditional deactivation
  // for (const [key, value] of Object.entries(newValues)) {
  //   // TODO: do logic to denactive account when some spesific field is changed
  //   // example: when email is changed / when phone number is changed, denactive the account
  //   // denactiveAccount = key === 'email' || key === 'phone_number';
  //   if (key in oldValues && value !== oldValues[key]) {
  //     const editRequest: edit_request = {
  //       id: uuidv4(),
  //       identifier: key,
  //       old_value: oldValues[key].toString(),
  //       new_value: value.toString(),
  //       ...baseEditRequest,
  //     };
  //     newEditRequest.push(editRequest);
  //     requestChangeCount++;
  //     message = message + `${key} change requested`;
  //   }
  // }

  const editRequest: Prisma.edit_request_logsUncheckedCreateInput[] = [];

  if (entity && entity !== clientData.entity) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'entity',
      old_value: clientData.entity,
      new_value: entity,
      ...baseEditRequest,
    });
    addLog('entity', logs);
  }

  if (authority && authority !== clientData.authority) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'authority',
      old_value: clientData.authority,
      new_value: authority,
      ...baseEditRequest,
    });
    addLog('authority', logs);
  }

  if (headquarters && headquarters !== clientData.headquarters) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'headquarters',
      old_value: clientData.headquarters,
      new_value: headquarters,
      ...baseEditRequest,
    });
    addLog('headquarters', logs);
  }

  if (date_of_esthablistmen) {
    let existing: string | undefined = undefined;
    if (clientData.date_of_esthablistmen) {
      existing = new Date(clientData.date_of_esthablistmen).toISOString();
    }

    if (date_of_esthablistmen.toISOString() !== existing) {
      editRequest.push({
        id: uuidv4(),
        identifier: 'date_of_esthablistmen',
        old_value: clientData.date_of_esthablistmen
          ? clientData.date_of_esthablistmen.toISOString()
          : null,
        new_value: date_of_esthablistmen.toISOString(),
        ...baseEditRequest,
      });
      addLog('date_of_esthablistmen', logs);
    }
  }

  if (
    num_of_beneficiaries &&
    num_of_beneficiaries !== clientData.num_of_beneficiaries
  ) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'num_of_beneficiaries',
      old_value: clientData.num_of_beneficiaries
        ? clientData.num_of_beneficiaries.toString()
        : null,
      new_value: num_of_beneficiaries.toString(),
      ...baseEditRequest,
    });
    addLog('num_of_beneficiaries', logs);
  }

  if (
    num_of_employed_facility &&
    num_of_employed_facility !== clientData.num_of_employed_facility
  ) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'num_of_employed_facility',
      old_value: clientData.num_of_employed_facility
        ? clientData.num_of_employed_facility.toString()
        : null,
      new_value: num_of_employed_facility.toString(),
      ...baseEditRequest,
    });
    addLog('num_of_employed_facility', logs);
  }

  if (governorate && governorate !== clientData.governorate) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'governorate',
      old_value: clientData.governorate,
      new_value: governorate,
      ...baseEditRequest,
    });
    addLog('governorate', logs);
  }

  if (region && region !== clientData.region) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'region',
      old_value: clientData.region,
      new_value: region,
      ...baseEditRequest,
    });
    addLog('region', logs);
  }

  // if (entity_mobile && entity_mobile !== clientData.entity_mobile) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'entity_mobile',
  //     old_value: clientData.entity_mobile,
  //     new_value: entity_mobile,
  //     ...baseEditRequest,
  //   });
  //   addLog('entity_mobile', logs);
  // }

  if (
    center_administration &&
    center_administration !== clientData.center_administration
  ) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'center_administration',
      old_value: clientData.center_administration,
      new_value: center_administration,
      ...baseEditRequest,
    });
    addLog('center_administration', logs);
  }

  if (twitter_acount && twitter_acount !== clientData.twitter_acount) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'twitter_acount',
      old_value: clientData.twitter_acount,
      new_value: twitter_acount,
      ...baseEditRequest,
    });
    addLog('twitter_acount', logs);
  }

  if (phone && phone !== clientData.phone) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'phone',
      old_value: clientData.phone,
      new_value: phone,
      ...baseEditRequest,
    });
    addLog('phone', logs);
  }

  if (website && website !== clientData.website) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'website',
      old_value: clientData.website,
      new_value: website,
      ...baseEditRequest,
    });
    addLog('website', logs);
  }

  // if (email && email !== clientData.user.email) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'email',
  //     old_value: clientData.user.email,
  //     new_value: email,
  //     ...baseEditRequest,
  //   });
  //   addLog('email', logs);
  // }

  // if (password) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'password',
  //     old_value: '',
  //     new_value: password,
  //     ...baseEditRequest,
  //   });
  //   addLog('password', logs);
  // }

  if (license_number && license_number !== clientData.license_number) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'license_number',
      old_value: clientData.license_number,
      new_value: license_number,
      ...baseEditRequest,
    });
    addLog('license_number', logs);
  }

  if (license_expired) {
    let existing: string | undefined = undefined;
    if (clientData.license_expired) {
      existing = new Date(clientData.license_expired).toISOString();
    }

    if (license_expired.toISOString() !== existing) {
      editRequest.push({
        id: uuidv4(),
        identifier: 'license_expired',
        old_value: clientData.license_expired
          ? clientData.license_expired.toISOString()
          : null,
        new_value: license_expired.toISOString(),
        ...baseEditRequest,
      });
      addLog('license_expired', logs);
    }
  }

  if (license_issue_date) {
    let existing: string | undefined = undefined;
    if (clientData.license_issue_date) {
      existing = new Date(clientData.license_issue_date).toISOString();
    }

    if (license_issue_date.toISOString() !== existing) {
      editRequest.push({
        id: uuidv4(),
        identifier: 'license_issue_date',
        old_value: clientData.license_issue_date
          ? clientData.license_issue_date.toISOString()
          : null,
        new_value: license_issue_date.toISOString(),
        ...baseEditRequest,
      });
      addLog('license_issue_date', logs);
    }
  }

  // if (
  //   license_file &&
  //   JSON.stringify(license_file) !== clientData.license_file
  // ) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'license_file',
  //     old_value: '',
  //     new_value: JSON.stringify(license_file),
  //     ...baseEditRequest,
  //   });
  //   addLog('license_file', logs);
  // }

  // if (
  //   board_ofdec_file &&
  //   JSON.stringify(board_ofdec_file) !== clientData.board_ofdec_file
  // ) {
  //   editRequest.push({
  //     id: uuidv4(),
  //     identifier: 'board_ofdec_file',
  //     old_value: '',
  //     new_value: JSON.stringify(board_ofdec_file),
  //     ...baseEditRequest,
  //   });
  //   addLog('board_ofdec_file', logs);
  // }

  if (ceo_mobile && ceo_mobile !== clientData.ceo_mobile) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'ceo_mobile',
      old_value: clientData.ceo_mobile,
      new_value: ceo_mobile,
      ...baseEditRequest,
    });
    addLog('ceo_mobile', logs);
  }

  if (ceo_name && ceo_name !== clientData.ceo_name) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'ceo_name',
      old_value: clientData.ceo_name,
      new_value: ceo_name,
      ...baseEditRequest,
    });
    addLog('ceo_name', logs);
  }

  if (data_entry_mobile && data_entry_mobile !== clientData.data_entry_mobile) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'data_entry_mobile',
      old_value: clientData.data_entry_mobile,
      new_value: data_entry_mobile,
      ...baseEditRequest,
    });
    addLog('data_entry_mobile', logs);
  }

  if (data_entry_name && data_entry_name !== clientData.data_entry_name) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'data_entry_name',
      old_value: clientData.data_entry_name,
      new_value: data_entry_name,
      ...baseEditRequest,
    });
    addLog('data_entry_name', logs);
  }

  if (data_entry_mail && data_entry_mail !== clientData.data_entry_mail) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'data_entry_mail',
      old_value: clientData.data_entry_mail,
      new_value: data_entry_mail,
      ...baseEditRequest,
    });
    addLog('data_entry_mail', logs);
  }

  if (client_field && client_field !== clientData.client_field) {
    editRequest.push({
      id: uuidv4(),
      identifier: 'client_field',
      old_value: clientData.client_field,
      new_value: client_field,
      ...baseEditRequest,
    });
    addLog('client_field', logs);
  }

  return {
    editRequest,
    logs,
  };
}
