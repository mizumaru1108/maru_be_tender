export const incomingRequest = `
query incomingRequest {
  proposal(where: {state: {_in: MODERATOR}, outter_status: {_in: PENDING}}) {
    id
    created_at
    project_name
    user {
      employee_name
    }
    state
  }
}

`;

export const previousRequest = `
query MyQuery {
  proposal {
    id
    created_at
    project_name
    user {
      employee_name
    }
    state
    outter_status
  }
}
`;
