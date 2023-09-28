import { TrackEntity } from 'src/track-management/track/entities/track.entity';

export class BannerEntity {
  id: string;
  type: string; // internal / external
  title: string;
  content: string;
  track_id?: string | null;
  track?: TrackEntity;
  logo?: any; // jsonb
  expired_at: number;
  expired_date: Date;
  expired_time: string;
  created_at: Date | null = new Date();
  updated_at: Date | null = new Date();
}
