import { PickerLocale } from 'antd/es/date-picker/generatePicker';
import CalendarLocale from 'rc-picker/lib/locale/ja_JP';

// Merge into a locale object
const localeJa: PickerLocale = {
  lang: {
    placeholder: '日付を選択',
    rangePlaceholder: ['開始日付', '終了日付'],
    shortWeekDays: ['日', '月', '火', '水', '木', '金', '土'],
    shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    placeholder: '時間を選択',
    rangePlaceholder: ['開始時間', '終了時間'],
  },
};

export default localeJa;
