import { TrackEntity } from 'src/tender-track/track/entities/track.entity';

export class AdvertisementEntity {
  id: string;
  type: string; // internal / external
  title: string;
  content: string;
  track_id?: string | null;
  track?: TrackEntity;
  logo?: any; // jsonb
  date: Date;
  start_time: string;
  created_at: Date | null = new Date();
  updated_at: Date | null = new Date();
}
