export class GetRawTrackAverageTransaction {
  data: {
    created_at: Date;
    proposal_id: string;
    response_time: number | null;
    proposal: {
      project_track: string | null;
    };
  }[];
}
