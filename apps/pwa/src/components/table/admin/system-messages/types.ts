export type InternalMessagesList = {
  id?: string;
  title: string;
  // message_content: string;
  desired_track: string;
  track_id?: string;
  content: string;
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
  track_id?: string;
  content: string;
  image?: string;
  logo?: any;
  date?: string;
  showTime?: string;
};

export interface AdevertisingTapeRow {
  row: AdvertisingTapeList;
  selected?: boolean;
  onDelete?: (id: string) => void;
  onSelectRow?: VoidFunction;
}
