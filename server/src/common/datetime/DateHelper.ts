const SPLASH = '/';
const COLON = ':';

export class DateHelper {
  public static convertStandardDate(origin: string) {
    let date = origin.split('T')[0];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    date = year + SPLASH + month + SPLASH + day;

    let time = origin.split('T')[1].split('Z')[0];
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    time = hour + COLON + minute;

    return date + ' ' + time;
  }
}
