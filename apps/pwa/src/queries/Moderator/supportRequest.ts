export const incomingRequest = `
query incomingRequest {
  proposal(where: {state: {_in: MODERATOR}, outter_status: {_in: PENDING}, inner_status: {_in: [ACCEPTED, REVISED]}}) {
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
  }
}
`;
