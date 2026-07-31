import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 指定タイムゾーンの「現在の壁時計」を、ローカルオフセットの dayjs として返す。
 *
 * DatePicker が返す値は常にブラウザのローカルオフセットを持つため、
 * `dayjs().tz(tz)` とそのまま比較すると時差の分だけずれてしまう。
 * 一度そのタイムゾーンの文字列にしてから読み直すことで、
 * ピッカーの値と同じ土俵（壁時計同士）で比較できるようにする。
 */
export const nowInTimeZone = (timeZone: string): Dayjs => dayjs(dayjs().tz(timeZone).format('YYYY-MM-DD HH:mm:ss'));

/** 送信予定日時が過去かどうか（分単位で判定 → 現在の分ちょうどは選択可） */
export const isPastDateTime = (d: Dayjs | null | undefined, now: Dayjs): boolean => !!d && d.isBefore(now, 'minute');

/**
 * DatePicker の「現在時刻」ボタンはブラウザのローカル時刻を返すため、
 * ユーザーのタイムゾーンの現在時刻に置き換える。
 * 時差がない場合は同じ値になるので実質なにも起きない。
 */
export const applyNowButtonTimeZone = (d: Dayjs | null, timeZone: string): Dayjs | null =>
  d && Math.abs(d.diff(dayjs(), 'second')) < 1 ? nowInTimeZone(timeZone) : d;
