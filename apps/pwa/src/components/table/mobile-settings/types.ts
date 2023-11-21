import { MobileSettingEntity } from '../../../redux/slices/mobile-settings';

export interface MobileSettingsRow {
  row: MobileSettingEntity;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
