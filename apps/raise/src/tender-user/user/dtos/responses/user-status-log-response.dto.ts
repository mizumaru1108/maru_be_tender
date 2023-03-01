export interface IUserStatusLogResponseDto {
  data: {
    user_status: {
      id: string;
    };
    account_manager_detail: {
      id: string;
      employee_name: string | null;
      mobile_number: string | null;
      email: string;
    } | null;
    user_detail: {
      id: string;
      employee_name: string | null;
      mobile_number: string | null;
      email: string;
    };
  };
}
