import { Grid, Typography } from '@mui/material';
import SettingElem from './SettingElem';

const data = [
  { name: 'transaction-progression', title: 'سير المعاملات' },
  { name: 'tracks-budget', title: 'ميزانية المسارات' },
  { name: 'gregorian-year', title: 'السنة الميلادية' },
  { name: 'application-and-admission-settings', title: 'إعدادات التقديم والقبول' },
  { name: 'mobile-settings', title: 'إعدادات الجوال' },
  { name: 'system-messages', title: 'رسائل النظام' },
  { name: 'client-list', title: 'قائمة العملاء' },
  { name: 'users-and-permissions', title: 'المستخدمين والصلاحيات' },
  { name: 'authority', title: 'الجهة المشرفة' },
  { name: 'entity-area', title: 'مجال الجهة' },
  { name: 'regions-project-location', title: 'المناطق - مكان المشروع' },
  { name: 'system-configuration', title: 'إعدادات النظام' },
  { name: 'entity-classification', title: 'تصنيف الجهة' },
  { name: 'bank-name', title: 'اسم البنك' },
  { name: 'beneficiaries', title: 'المستفيدين' },
];
function Settings() {
  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">الإعدادات</Typography>
      </Grid>
      {data.map((item, index) => (
        <Grid item key={index} md={2} xs={12}>
          <SettingElem {...item} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Settings;
