export const addNewBankInformation = `mutation MyMutation($payload: bank_information_insert_input = {}) {
  insert_bank_information_one(object: $payload) {
    id
  }
}
`;
