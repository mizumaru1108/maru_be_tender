import React from 'react';

export type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export type AccountValuesProps = {
  form1: {
    client_field: string;
    entity: string;
    authority: string;
    date_of_esthablistmen: string;
    headquarters: string;
    num_of_employed_facility: number | undefined;
    num_of_beneficiaries: number | undefined;
  };
  form2: {
    region: string;
    governorate: string;
    center_administration: string;
    entity_mobile: string;
    phone?: string;
    twitter_acount: string;
    website: string;
    email: string;
    password: string;
  };
  form3: {
    license_number: string;
    license_issue_date: string;
    license_expired: string;
    license_file: string;
    board_ofdec_file?: string;
  };
  form4: {
    agree_on: boolean;
    ceo_name: string;
    ceo_mobile: string;
    data_entry_name: string;
    data_entry_mobile: string;
    data_entry_mail: string;
  };
  form5: {
    bank_account_number: string;
    bank_account_name: string;
    bank_name: string;
    card_image: string;
  };
};
export type BankingValuesProps = {
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  card_image: string;
};

export type AdministrativeValuesProps = {
  agree_on: boolean;
  ceo_name: string;
  ceo_mobile: string;
  data_entry_name: string;
  data_entry_mobile: string;
  data_entry_mail: string;
};

export type LicenseValuesProps = {
  license_number: string;
  license_issue_date: string;
  license_expired: string;
  license_file: string;
  board_ofdec_file?: string;
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
};

export type MainValuesProps = {
  client_field: string;
  entity: string;
  authority: string;
  date_of_esthablistmen: string;
  headquarters: string;
  num_of_employed_facility: number | undefined;
  num_of_beneficiaries: number | undefined;
};
