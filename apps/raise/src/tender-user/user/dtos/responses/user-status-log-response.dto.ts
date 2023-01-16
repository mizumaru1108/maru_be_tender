export interface IUserStatusLogResponseDto {
  data: {
    user_status: {
      id: string;
      title: string;
    };
    account_manager_detail: {
      id: string;
      mobile_number: string | null;
      email: string;
    } | null;
    user_detail: {
      id: string;
      mobile_number: string | null;
      email: string;
    };
  };
}
