import * as moment from 'moment-timezone';

const FIRST_HALF = '上期';
const SECOND_HALF = '下期';

export class EvaluationPeriodHelper {
  public static getCurrentPeriodYear(timeZone: string | 'Asia/Tokyo') {
    const now = moment.tz(timeZone.toString()); // Lấy thời gian hiện tại theo múi giờ

    const currentYear = now.year(); // Lấy năm hiện tại
    const firstDate = moment.tz([currentYear, 3, 1], timeZone.toString()); // Ngày 1 tháng 4 năm hiện tại
    const endPeriodDate = moment.tz(firstDate, timeZone.toString());

    return now.isBefore(endPeriodDate) ? currentYear - 1 : currentYear;
  }

  public static getCurrentPeriodIndex(timeZone: string | 'Asia/Tokyo') {
    const currentMoment = moment.tz(timeZone.toString());
    const currentDate = currentMoment.month() + 1;
    if (currentDate >= 4 && currentDate <= 9) {
      return FIRST_HALF;
    }

    return SECOND_HALF;
  }
}
