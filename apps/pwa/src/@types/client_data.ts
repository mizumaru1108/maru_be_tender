import { bank_information, UploadFilesJsonbDto } from './commons';

export type PartnerDetailsProps = {
  id?: string | null;
  board_ofdec_file?: string | null;
  center_administration?: string | null;
  ceo_mobile?: string | null;
  ceo_name?: string | null;
  created_at?: string | null;
  data_entry_mail?: string | null;
  data_entry_name?: string | null;
  date_of_esthablistmen?: string | null;
  email?: string | null;
  entity?: string | null;
  entity_mobile?: string | null;
  governorate?: string | null;
  headquarters?: string | null;
  license_expired?: string | null;
  license_file?: string | null;
  license_issue_date?: string | null;
  license_number?: string | null;
  data_entry_mobile?: string | null;
  num_of_beneficiaries?: string | null;
  num_of_employed_facility?: string | null;
  phone?: string | null;
  region?: string | null;
  twitter_acount?: string | null;
  updated_at?: string | null;
  website?: string | null;
  status?: string | null;
  user?: {
    bank_informations?: {
      bank_account_name?: string | null;
      bank_account_number?: string | null;
      bank_name?: string | null;
      card_image?: string | null;
      id?: string | null;
      proposal_id?: string | null;
      user_id?: string | null;
    }[];
  };
};

// for editedValues edit request client profile

export interface IEditedValues {
  email?: string | null;
  entity?: string | null;
  authority?: string | null;
  headquarters?: string | null;
  date_of_esthablistmen?: string | null;
  num_of_beneficiaries?: number | null;
  num_of_employed_facility?: number | null;
  bank_information?: bank_information[] | [];
  governorate?: string | null;
  region?: string | null;
  entity_mobile?: string | null;
  center_administration?: string | null;
  twitter_acount?: string | null;
  phone?: string | null;
  website?: string | null;
  password?: string | null;
  license_number?: string;
  license_expired?: string | null;
  license_issue_date?: string | null;
  ceo_mobile?: string | null;
  ceo_name?: string | null;
  data_entry_mobile?: string | null;
  data_entry_name?: string | null;
  data_entry_mail?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  client_field?: string | null;
  user_id?: string;
  license_file: UploadFilesJsonbDto;
  board_ofdec_file?: UploadFilesJsonbDto;
  chairman_name?: string | null;
  chairman_mobile?: string | null;
  updated_bank?: bank_information[] | [];
  deleted_bank?: bank_information[] | [];
  created_bank?: bank_information[] | [];
}
