/* eslint-disable prefer-const */
import moment from 'moment-timezone';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import { FeedbackStatus } from '../model/Feedback';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { resetExport } from '../store/excel';
export const moveToBottomPage = () => window.scroll({ left: 0, top: document.body.scrollHeight, behavior: 'auto' });

export const isEmptyValue = (value: any) => value === '' || value === null || value === undefined;

const PRIVATE_KEY = 'GEOSYSTEMSOLUTIONVIETNAM2023';

export const hasOwnPropertyObject = (keyNeedChecks: string[], object: any, pass?: string) => {
  let hasOwn = true;
  for (let i = 0; i < keyNeedChecks.length; i++) {
    const key = keyNeedChecks[i];

    if (pass && pass === key) {
      break;
    }
    hasOwn = Object.hasOwn(object, key);
    if (!hasOwn) {
      break;
    } else if (isEmptyValue(object[key])) {
      hasOwn = false;
      break;
    }
  }

  return hasOwn;
};

export const toArrayBuffer = (buffer: any) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }

  return arrayBuffer;
};

export const hasNonNullOrUndefinedPoint = (data: any, itemName: string) => {
  return data?.some((item: any) => item[itemName] !== null && item[itemName] !== undefined && item[itemName] !== '');
};

export function isFormatDate(value: any, format: string) {
  const convertDate = moment(value, 'YYYY-MM-DD').tz('Asia/Tokyo').format(format);

  return convertDate;
}

export function urlCompanyCode() {
  const path = window.location.pathname; // Lấy đường dẫn từ URL
  const parts = path.split('/'); // Tách đường dẫn thành các phần
  const companyCode = parts?.length > 2 ? parts[2] : '';
  if (companyCode) {
    return `/company/${companyCode}`;
  } else {
    return '';
  }
}

export const setStatusColorFeedback = (status: number | undefined) => {
  let color = '';
  switch (status) {
    case FeedbackStatus.SUBMIT: {
      //2: 送信済み (submit)
      color = 'magenta';
      break;
    }
    case FeedbackStatus.APPROVAL: {
      //3: 要対応 (Duyệt - cần xử lý)
      color = 'error';
      break;
    }
    case FeedbackStatus.PENDING: {
      //4: 対応待ち (Pending - Chờ xử lý)
      color = 'warning';
      break;
    }
    case FeedbackStatus.CLOSE: {
      //5: 対応不要 (Close - Không cần xử lý)
      color = 'default';
      break;
    }
    case FeedbackStatus.IN_PROGRESS: {
      //6: 対応中 (Doing)
      color = 'processing';
      break;
    }
    case FeedbackStatus.DONE: {
      //7: 対応済み (Done)
      color = 'success';
      break;
    }
    default: {
      break;
    }
  }

  return color;
};

// [{key: '', maxLength: 120}]
export type KeyCheckMaxLengths = {
  key: string;
  maxLength: number;
};
export const hasMaxLengthArray = (keyCheckMaxLengths: KeyCheckMaxLengths[], object: any, pass?: string): boolean => {
  let hasOwn = true;
  if (keyCheckMaxLengths && keyCheckMaxLengths.length)
    for (let i = 0; i < keyCheckMaxLengths.length; i++) {
      const key = keyCheckMaxLengths[i].key;
      if (pass && pass === key) {
        break;
      }
      const maxLength = keyCheckMaxLengths[i].maxLength;

      if (object[key]?.length > maxLength) {
        hasOwn = false;
        break;
      }
    }

  return hasOwn;
};

export const compareDatePeriod = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return false;
  const dateNow = moment();
  const convertStartDate = moment(`${startDate} 00:00`, 'YYYY/MM/DD HH:mm');
  const convertEndDate = moment(`${endDate} 23:59`, 'YYYY/MM/DD HH:mm');

  return dateNow.isAfter(convertStartDate) && dateNow.isBefore(convertEndDate);
};

export const compareDateEvaluation = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return false;
  const dateNow = moment();
  const convertStartDate = moment(`${startDate} 00:00`, 'YYYY/MM/DD HH:mm');
  const convertEndDate = moment(`${endDate} 23:59`, 'YYYY/MM/DD HH:mm');

  //* trả về true nếu trong thời gian đánh giá hoặc ngày hiện tại sau ngày end của ngày đánh giá
  return (dateNow.isAfter(convertStartDate) && dateNow.isBefore(convertEndDate)) || dateNow.isAfter(convertEndDate);
};

export function toASCII(chars: string) {
  let ascii = '';
  if (chars && chars.length > 0)
    for (let i = 0, l = chars.length; i < l; i++) {
      let c = chars[i].charCodeAt(0);

      // make sure we only convert half-full width char
      if (c >= 0xff00 && c <= 0xffef) {
        // eslint-disable-next-line no-bitwise
        c = 0xff & (c + 0x20);
      }

      ascii += String.fromCharCode(c);
    }

  return ascii;
}

export const isInteger = (value: any): boolean => /^-?\d+$/.test(value?.toString());

export function isFloat(value: any) {
  return !(Number(value).toString() === value.toString()) || Number(value) % 1 !== 0;
}

export const getExportTime = () => {
  const thisTime = new Date();
  const hour = thisTime.getHours() > 9 ? thisTime.getHours().toString() : '0' + thisTime.getHours().toString();
  const minute = thisTime.getMinutes() > 9 ? thisTime.getMinutes().toString() : '0' + thisTime.getMinutes().toString();
  const second = thisTime.getSeconds() > 9 ? thisTime.getSeconds().toString() : '0' + thisTime.getSeconds().toString();
  const month =
    thisTime.getMonth() > 8 ? (thisTime.getMonth() + 1).toString() : '0' + (thisTime.getMonth() + 1).toString();
  const day = thisTime.getDate() > 9 ? thisTime.getDate().toString() : '0' + thisTime.getDate().toString();

  return thisTime.getFullYear() + month + day + hour + minute + second;
};
export const encrypt = (data: string, isReturn = false, dot = '.#########.') => {
  const KEY = randoms(10);
  const privates = PRIVATE_KEY;
  const str = `${KEY}${dot}${data}${dot}${privates}`;
  const encode = Buffer.from(str, 'utf-8').toString('base64');

  if (isReturn) return encode;

  return encode.replace(/[=|/]+/g, '').toString();
};
export const decrypt = (data: string, dot = '.#########.') => {
  const results = Buffer.from(data.toString(), 'base64').toString('utf-8').split(dot);
  if (results[2] === PRIVATE_KEY) {
    return results[1];
  }

  return undefined;
};
const randoms = (number: number) => {
  const characters = '1234567890qwertyuiopasdfghjklzxcvbnm';
  let result = '';
  for (let index = 0; index < number; index++) {
    result += characters[Math.floor(Math.random() * characters.length)];
  }

  return result;
};

export function dayJsFormat(
  dateTime: string | number | Date | dayjs.Dayjs | null | undefined,
  format = 'YYYY/M/D',
  isReturnDate = false,
) {
  const date = dayjs(dateTime, ['YYYY/MM/DD', 'YYYY/MM/D', 'YYYY/M/DD', 'YYYY/M/D', 'YYYY/MM', 'YYYY/M']);
  if (isReturnDate) return date;

  return date.format(format);
}

export function sliptStringToDate(str: string | undefined, splitter = ' ～ ') {
  if (!str) return null;
  const arrs = str.split(splitter);

  return { startDate: arrs[0], endDate: arrs[1] };
}

export const getIdAchievement = (key: string | number) => {
  if (typeof key === 'string') {
    const arrKeys = key.split('-');

    if (arrKeys.length === 3) {
      return arrKeys[2];
    } else {
      return '';
    }
  } else {
    return '';
  }
};

export function getByteLength(str: string): number {
  // Sử dụng TextEncoder để mã hóa chuỗi sang UTF-8 và lấy độ dài byte
  return new TextEncoder().encode(str).length;
}

export function transformCategories(categories: string[]): (string | string[])[] {
  const transformedCategories: (string | string[])[] = [];

  if (!categories) {
    return categories;
  }

  for (const category of categories) {
    const byteLength = getByteLength(category);
    if (byteLength >= 60) {
      // Chia thành 3 phần nếu độ dài >= 20
      const partLength = Math.ceil(category.length / 3);
      const part1 = category.substring(0, partLength);
      const part2 = category.substring(partLength, partLength * 2);
      const part3 = category.substring(partLength * 2);
      transformedCategories.push([part1, part2, part3]);
    } else if (byteLength >= 30) {
      // Chia thành 2 phần nếu độ dài >= 10 (nhưng < 20)
      const mid = Math.ceil(category.length / 2);
      transformedCategories.push([category.substring(0, mid), category.substring(mid)]);
    } else {
      // Giữ nguyên nếu độ dài < 10
      transformedCategories.push(category);
    }
  }

  return transformedCategories;
}

let pollingId: ReturnType<typeof setInterval> | null = null;

export const setExportPollingInterval = (id: ReturnType<typeof setInterval>) => {
  if (pollingId) clearInterval(pollingId); // clear nếu có trước đó
  pollingId = id;
};

export const cancelExportPolling = () => {
  if (pollingId) {
    clearInterval(pollingId);
    pollingId = null;
  }
};

export const dateFormatLanguge = (date: string | undefined | null, language: string) => {
  const dateFormat = language === 'ja' ? 'YYYY/M/D hh:mm' : language === 'en' ? 'M/D/YYYY hh:mm' : 'D/M/YYYY hh:mm';

  return date ? moment(date).format(dateFormat) : '';
};
