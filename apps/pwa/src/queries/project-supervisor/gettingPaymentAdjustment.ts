export const gettingPaymentAdjustment = `query MyQuery2($supervisor_id: String = "", $project_track: project_tracks_enum = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {supervisor_id: {_eq: $supervisor_id}, _and: {project_track: {_eq: $project_track}}}}) {
    id
    project_name
    payments {
      id
    }
    created_at
  }
}
`;
