export type InternalMessagesList = {
  id?: string;
  title: string;
  message_content: string;
  desired_track: string;
};

export interface InternalMessagesListsRow {
  row: InternalMessagesList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}

export type AdvertisingTapeList = {
  id?: string;
  image?: string | File;
  title: string;
  message_content: string;
  the_lenght_show: number | string;
  track: string;
};

export interface AdevertisingTapeRow {
  row: AdvertisingTapeList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
