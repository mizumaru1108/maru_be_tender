export const insertSupervisor = `mutation MyMutation($supervisorAcceptance: [supervisor_insert_input!] = {}) {
  insert_supervisor(objects: $supervisorAcceptance) {
    affected_rows
  }
}
`;
