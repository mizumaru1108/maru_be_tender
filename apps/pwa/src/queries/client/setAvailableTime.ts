export const setAvailableTime = `mutation MyMutation($setAvailableTimePayload: [schedule_insert_input!] = {}) {
  insert_schedule(objects: $setAvailableTimePayload) {
    returning {
      id
      day
      start_time
      end_time
    }
  }
}`;
