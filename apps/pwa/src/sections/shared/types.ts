import { CustomFile } from 'components/upload';
import React from 'react';

export type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export type AccountValuesProps = {
  agree_on: boolean;
  entity: string;
  authority: string;
  date_of_esthablistmen: string;
  headquarters: string;
  num_of_employed_facility: number | undefined;
  num_of_beneficiaries: number | undefined;
  region: string;
  governorate: string;
  center_administration: string;
  entity_mobile: string;
  phone: string;
  twitter_acount: string;
  website: string;
  email: string;
  password: string;
  license_number: number | undefined;
  license_issue_date: string;
  license_expired: string;
  license_file: string | null;
  board_ofdec_file: string | null;
  ceo_name: string;
  ceo_mobile: string;
  data_entry_name: string;
  data_entry_mobile: string;
  data_entry_mail: string;
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  card_image: string | null;
};
export type BankingValuesProps = {
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  card_image: CustomFile | string | null;
};

export type AdministrativeValuesProps = {
  executive_director: string;
  executive_director_mobile: string;
  entery_data_name: string;
  entery_data_phone: string;
  entery_data_email?: string;
  agree_on: boolean;
};

export type LicenseValuesProps = {
  license_number: string;
  license_issue_date: string;
  license_expired: string;
  license_file: CustomFile | string | null;
  board_ofdec_file?: CustomFile | string | null;
};

export type ConnectingValuesProps = {
  region: string;
  governorate: string;
  center_administration: string;
  entity_mobile: string;
  phone?: string;
  twitter_acount: string;
  website: string;
  email: string;
  password?: string;
};

export type MainValuesProps = {
  client_field: string;
  entity: string;
  authority: string;
  date_of_esthablistmen: string;
  headquarters: string;
  num_of_employed_facility: number;
  num_of_beneficiaries: number;
};
