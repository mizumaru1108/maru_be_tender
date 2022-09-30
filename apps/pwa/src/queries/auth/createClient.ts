export const createClient = `
mutation MyMutation($object: user_insert_input = {}) {
  insert_user_one(object: $object) {
    id
  }
}`;
