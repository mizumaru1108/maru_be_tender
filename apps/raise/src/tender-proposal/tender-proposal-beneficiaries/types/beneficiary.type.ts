export interface CreateBeneficiaryProps {
  id?: string;
  name: string;
}

export class UpdateBeneficiaryProps {
  id: string;
  name?: string;
  is_deleted?: boolean;
}
