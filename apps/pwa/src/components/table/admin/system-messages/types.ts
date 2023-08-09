export interface TrackEntity {
  id: string;
  name?: string | null;
  with_consultation?: boolean;
  created_at?: Date | null;
  is_deleted?: boolean;
}

export type InternalMessagesList = {
  id?: string;
  title: string;
  // message_content: string;
  desired_track: string;
  track_id?: string;
  content: string;
  status?: boolean;
  is_expired?: boolean;
  track?: TrackEntity;
  expired_time?: string;
  expired_date?: string;
};

export interface InternalMessagesListsRow {
  row: InternalMessagesList;
  selected?: boolean;
  onDelete?: (id: string) => void;
  onSelectRow?: VoidFunction;
}

export type AdvertisingTapeList = {
  id?: string;
  title: string;
  expired_time?: string;
  expired_date?: string;
  // message_content: string;
  desired_track: string;
  status?: boolean;
  track_id?: string;
  content: string;
  image?: string;
  logo?: {
    url?: string;
    type?: number;
    size?: string;
  }[];
  date?: string;
  showTime?: string;
  is_expired?: boolean;
  track?: TrackEntity;
};

export interface AdevertisingTapeRow {
  row: AdvertisingTapeList;
  selected?: boolean;
  onDelete?: (id: string) => void;
  onSelectRow?: VoidFunction;
}
