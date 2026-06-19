import moment from 'moment-timezone';

type DateFormatType =
  | 'YYYY/M/d'
  | 'YYYY/MM/DD'
  | 'YYYY-M-d'
  | 'YYYY-MM-DD'
  | 'YYYY/M/D H:m'
  | 'YYYY/M/D H:mm'
  | 'YYYY/M/D';

export class DateConvertHelper {
  public static convertToFormat(date: string, format: DateFormatType = 'YYYY-MM-DD') {
    if (date === '') {
      return '';
    }
    const convertDate = moment(date).format(format);

    return convertDate.toString();
  }
}
