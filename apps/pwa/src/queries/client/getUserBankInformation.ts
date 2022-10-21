export const getUserBankInformation = `query MyQuery($user_id: String = "") {
  bank_information(where: {user_id: {_eq: $user_id}}) {
    user {
      bank_informations {
        bank_account_name
        bank_account_number
        bank_name
        card_image
        id
      }
    }
  }
}
`;
