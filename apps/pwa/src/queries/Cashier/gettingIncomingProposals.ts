export const gettingIncomingProposals = `query MyQuery2($project_track: project_tracks_enum = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {cashier_id: {_eq: "null"}, _and: {project_track: {_eq: $project_track}}}}) {
    id
    project_name
    project_idea
    created_at
    payments {
      id
    }
  }
}
`;
