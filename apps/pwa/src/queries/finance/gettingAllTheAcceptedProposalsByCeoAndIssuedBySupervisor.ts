export const gettingAllTheAcceptedProposalsByCeoAndIssuedBySupervisor = `query MyQuery2($project_track: project_tracks_enum = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {finance_id: {_eq: "null"}, _and: {project_track: {_eq: $project_track}}}}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
