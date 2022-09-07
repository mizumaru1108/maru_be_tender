import { CustomFile } from 'components/upload';

export type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setRegisterState: React.Dispatch<React.SetStateAction<any>>;
};

export type BankingValuesProps = {
  bank_account_number: string;
  bank_account_name: string;
  bank_name: string;
  bank_account_card_image: CustomFile | string | null;
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
  license_expiry_date: string;
  license_file: CustomFile | string | null;
  resolution_file?: CustomFile | string | null;
};

export type ConnectingValuesProps = {
  region: string;
  city: string;
  center: string;
  mobile_number: string;
  phone?: string;
  twitter: string;
  website: string;
  email: string;
  password?: string;
};

export type MainValuesProps = {
  entity_area: string;
  authority: string;
  date_of_establishment: string;
  headquarters: string;
  number_of_employees: number;
  number_of_beneficiaries: number;
};

export type RegisterValues = {
  entity_area: string;
  authority: string;
  date_of_establishment: string;
  headquarters: string;
  number_of_employees: undefined;
  number_of_beneficiaries: undefined;
  region: string;
  city: string;
  phone: string;
  twitter: string;
  website: string;
  email: string;
  password: string;
  license_number: number | undefined;
  license_issue_date: string;
  license_expiry_date: string;
  license_file: CustomFile | string | null;
  resolution_file: CustomFile | string | null;
  executive_director: string;
  executive_director_mobile: string;
  entery_data_name: string;
  entery_data_phone: string;
  entery_data_email: string;
  agree_on: boolean;
  bank_account_number: number | undefined;
  bank_account_name: string;
  bank_name: string;
  bank_account_card_image: CustomFile | string | null;
};
