import { FileProp } from 'components/upload';
import React from 'react';

export type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export type BankingValuesProps = {
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  card_image: FileProp;
  id?: string;
};

export type AdministrativeValuesProps = {
  agree_on: boolean;
  ceo_name: string;
  ceo_mobile: string;
  chairman_name: string;
  chairman_mobile: string;
  data_entry_name: string;
  data_entry_mobile: string;
  data_entry_mail: string;
  used_numbers?: string[];
};

export type LicenseValuesProps = {
  license_number: string;
  license_issue_date: string;
  license_expired: string;
  license_file: FileProp;
  board_ofdec_file?: FileProp | FileProp[] | any;
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
  password: string;
  used_numbers?: string[];
  // new_password?: string;
  // old_password?: string;
  // confirm_password: string;
};
export type UserInfoFormProps = {
  mobile_number: string;
  email: string;
  current_password: string;
  new_password?: string;
  old_password?: string;
  confirm_password?: string;
  employee_name?: string;
};

export type MainValuesProps = {
  client_field: string;
  entity: string;
  authority: string;
  date_of_esthablistmen: string;
  headquarters: string;
  num_of_employed_facility: number | undefined;
  num_of_beneficiaries: number | undefined;
  vat: boolean;
};

export type AccountValuesProps = {
  form1: MainValuesProps;
  form2: ConnectingValuesProps;
  form3: LicenseValuesProps;
  form4: AdministrativeValuesProps;
  form5: BankingValuesProps;
  used_numbers?: {
    form2: string[];
    form4: string[];
  };
};

export type AccountEditValuesProps = {
  form1: MainValuesProps;
  form2: ConnectingValuesProps;
  form3: LicenseValuesProps;
  form4: AdministrativeValuesProps;
  form5: Array<BankingValuesProps>;
};
