export const getScheduleByUser = `query getScheduleByUser($id: String = "") {
  schedule(where: {user_id: {_eq: $id}}) {
    day
    end_time
    id
    start_time
  }
}`;
