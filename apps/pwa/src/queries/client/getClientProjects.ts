export const getClientProjects = `query getClientProjects {
  pending_client_projects: proposal(where: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
  completed_client_projects:proposal(where: {outter_status: {_eq: COMPLETED}, _and: {step: {_eq: ZERO}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
}

`;
