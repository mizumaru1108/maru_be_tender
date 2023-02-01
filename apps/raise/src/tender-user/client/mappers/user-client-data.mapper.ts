import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { RegisterTenderDto } from '../../../tender-auth/dtos/requests/register-tender.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';

export function UserClientDataMapper(
  prevCreateInput: Prisma.userCreateInput,
  request: RegisterTenderDto,
  lisceneFileObj: UploadFilesJsonbDto | undefined,
  ofdecObj: UploadFilesJsonbDto[] | undefined,
) {
  const userCreatePayload = prevCreateInput;

  // client data
  userCreatePayload.client_data = {
    create: {
      id: nanoid(),
      license_number: request.data.license_number,
      authority: request.data.authority,
      // board_ofdec_file: {
      //   url: request.data.board_ofdec_file.url,
      //   type: request.data.board_ofdec_file.type,
      //   size: request.data.board_ofdec_file.size,
      // },
      board_ofdec_file: ofdecObj && (ofdecObj as any),
      center_administration: request.data.center_administration || null,
      ceo_mobile: request.data.ceo_mobile,
      chairman_name: request.data.chairman_name,
      chairman_mobile: request.data.chairman_mobile,
      data_entry_mail: request.data.data_entry_mail,
      data_entry_name: request.data.data_entry_name,
      data_entry_mobile: request.data.data_entry_mobile,
      ceo_name: request.data.ceo_name,
      entity_mobile: request.data.entity_mobile,
      governorate: request.data.governorate,
      region: request.data.region,
      headquarters: request.data.headquarters,
      entity: request.data.entity,
      license_file: lisceneFileObj && {
        ...lisceneFileObj,
      },
      // license_file: {
      //   url: request.data.license_file.url,
      //   type: request.data.license_file.type,
      //   size: request.data.license_file.size,
      // },
      date_of_esthablistmen: request.data.date_of_esthablistmen,
      license_expired: request.data.license_expired,
      license_issue_date: request.data.license_issue_date,
      num_of_beneficiaries: request.data.num_of_beneficiaries,
      website: request.data.website,
      twitter_acount: request.data.twitter_acount,
      num_of_employed_facility: request.data.num_of_employed_facility,
      phone: request.data.phone,
      client_field: request.data.client_field,
    },
  };

  return userCreatePayload;
}
