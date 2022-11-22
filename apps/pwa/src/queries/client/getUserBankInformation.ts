export const getUserBankInformation = `query getUserBankInformation($user_id: String = "") {
  bank_information(where: {user_id: {_eq: $user_id}}) {
    id
    card_image
    bank_name
    bank_account_number
    bank_account_name
  }
}

`;
