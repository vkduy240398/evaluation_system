import * as moment from 'moment';

// const PRIVATE_KEY = 'GEOSYSTEMSOLUTIONVIETNAM2023';

export const compareDatePeriod = (
  startDate: string,
  endDate: string,
  timeZone: string,
) => {
  if (!startDate || !endDate) return false;

  const dateNow = moment().tz(timeZone);
  const convertStartDate = moment(`${startDate} 00:00`, 'YYYY/MM/DD HH:mm');
  const convertEndDate = moment(`${endDate} 23:59`, 'YYYY/MM/DD HH:mm');

  return dateNow.isAfter(convertStartDate) && dateNow.isBefore(convertEndDate);
};

export const formatNumber = (input: any): string => {
  const num = Number(input);
  if (num % 1 === 0) {
    return num.toFixed(1);
  } else {
    return num.toString();
  }
};

// export const getCurrentPeriodYear = () => {
//   const date = new Date();
//   const currentYear = date.getFullYear();
//   const firstDate = new Date(currentYear, 3, 1);
//   const currentDate = moment();
//   const endPeriodDate = moment(firstDate);

//   return currentDate.isBefore(endPeriodDate) ? currentYear - 1 : currentYear;
// };

// export const getCurrentPeriodIndex = () => {
//   const firstHalf = '上期';
//   const secondHalf = '下期';
//   const currentDate = moment().month() + 1;
//   if (currentDate >= 4 && currentDate <= 9) {
//     return firstHalf;
//   }

//   return secondHalf;
// };

// export const extractContentAfterCC = (text: string) => {
//   const ccIndex =
//     text.indexOf('CC：') !== -1
//       ? text.indexOf('CC：')
//       : text.indexOf('CC:') !== -1
//       ? text.indexOf('CC:')
//       : text.indexOf('CC :');
//   if (ccIndex === -1) {
//     return text; // Không tìm thấy "CC:", trả về nguyên văn
//   }
//   const contentAfterCC = text.slice(ccIndex + 3).trim();
//   const endOfCCIndex = contentAfterCC.indexOf('<br>');
//   if (endOfCCIndex === -1) {
//     return contentAfterCC; // Không tìm thấy "<br>", trả về nội dung sau "CC:"
//   }
//   return contentAfterCC.slice(endOfCCIndex + 4); // Lấy nội dung sau "<br>"
// };

type DateFormatType =
  | 'YYYY/M/d'
  | 'YYYY/MM/DD'
  | 'YYYY-M-d'
  | 'YYYY-MM-DD'
  | 'YYYY/M/D H:m'
  | 'YYYY/M/D H:mm'
  | 'YYYY/M/D'
  | 'YYYY/M/D HH:mm'
  | 'YYYY-M-D HH:mm:ss';
export const dateNowMoment = (timeZone: string) => {
  const format: DateFormatType = 'YYYY-MM-DD';
  const convertDate = moment().tz(timeZone).format(format);
  return convertDate;
};

export function isFloat(value: any) {
  return (
    value &&
    (!(Number(value).toString() === value.toString()) ||
      Number(value) % 1 !== 0)
  );
}
export function isFormatDate(
  value,
  format: DateFormatType,
  timezone: string = 'Asia/Tokyo',
) {
  const convertDate = moment(value, 'YYYY-MM-DD').tz(timezone).format(format);
  return convertDate;
}
export const encrypt = (
  data: string,
  isReturn = false,
  dot = '.#########.',
) => {
  const KEY = randoms(10);
  const privates = process.env.PRIVATE_KEY;
  const str = `${KEY}${dot}${data}${dot}${privates}`;
  const encode = Buffer.from(str, 'utf-8').toString('base64');

  if (isReturn) return encode;
  return encode.replace(/[=|/]+/g, '').toString();
};
export const decrypt = (data: string, dot = '.#########.') => {
  const results = Buffer.from(data.toString(), 'base64')
    .toString('utf-8')
    .split(dot);
  if (results[2] === process.env.PRIVATE_KEY) {
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

export const resetEvaluationData = {
  status: 0,
  evaluationDepartmentId: null,
  commentUser: null,
  basicProTotalPointUser: null,
  basicProTotalPointEvaluator05: null,
  basicProTotalPointEvaluator1: null,
  basicProTotalPointEvaluator2: null,
  behaviorTotalPointUser: null,
  behaviorTotalPointEvaluator05: null,
  behaviorTotalPointEvaluator1: null,
  behaviorTotalPointEvaluator2: null,
  achievementPersonalTotalPointUser: null,
  achievementPersonalTotalPointEvaluator05: null,
  achievementPersonalTotalPointEvaluator1: null,
  achievementPersonalTotalPointEvaluator2: null,
  // achievementAdditionalTotalPointUser: null,
  // achievementAdditionalTotalPointEvaluator05: null,
  // achievementAdditionalTotalPointEvaluator1: null,
  // achievementAdditionalTotalPointEvaluator2: null,
  summaryPointEvaluator2: null,
  summaryCharPointUser: null,
  // dateCreationGoalStart: null,
  // dateCreationGoalEnd: null,
  // percentPoint: null,
  basicTotalPointUser: null,
  basicTotalPointEvaluator05: null,
  basicTotalPointEvaluator1: null,
  basicTotalPointEvaluator2: null,
  proTotalPointUser: null,
  proTotalPointEvaluator05: null,
  proTotalPointEvaluator1: null,
  proTotalPointEvaluator2: null,
};

export function getPeriodCurrent(time: string, timeZone: string) {
  const format = 'YYYY/M';
  const month = moment().tz(timeZone).format('M');
  const year = moment().tz(timeZone).format('YYYY');

  const periodIndexStart1 = moment(`${year}/3`, 'YYYY/M');
  const periodIndexEnd1 = moment(`${year}/10`, 'YYYY/M');

  const periodIndexStart2 = moment(`${year}/9`, 'YYYY/M');
  const periodIndexEnd2 = moment(`${Number(year) + 1}/4`, 'YYYY/M');
  const dateNow = time
    ? moment(time, format)
    : moment(`${year}/${month}`, 'YYYY/M');

  if (dateNow.isBetween(periodIndexStart1, periodIndexEnd1))
    return {
      year,
      month,
      periodIndex: 1,
    };
  else if (dateNow.isBetween(periodIndexStart2, periodIndexEnd2)) {
    return {
      year,
      month,
      periodIndex: 2,
    };
  } else {
    return {
      year: Number(year) - 1,
      month,
      periodIndex: 2,
    };
  }
}
export function isNotNumber(value: number) {
  let isNotValid = false;
  if (value === 0) {
    isNotValid = false;
  } else {
    if (!value || (value && value.toString().match(/^[0-9]*$/) === null)) {
      isNotValid = true;
    }
  }
  return isNotValid;
}
export function checkDupliateMail(userList: any, userId: number) {
  let isCheck = false;
  userList.map((user: any) => {
    if (user.evaluator) {
      user.evaluator.map((evaluator: any) => {
        if (evaluator.evaluatorId === userId) {
          isCheck = true;
        }
      });
    }
  });
  return isCheck;
}
function decimalAdjust(type, value, exp) {
  type = String(type);
  if (!['round', 'floor', 'ceil'].includes(type)) {
    throw new TypeError(
      "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.",
    );
  }
  exp = Number(exp);
  value = Number(value);
  if (exp % 1 !== 0 || Number.isNaN(value)) {
    return NaN;
  } else if (exp === 0) {
    return Math[type](value);
  }
  const [magnitude, exponent = 0] = value.toString().split('e');
  const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e');
  return Number(`${newMagnitude}e${+newExponent + exp}`);
}
export const floor10 = (value, exp) => decimalAdjust('floor', value, exp);

export const S3 = () => {
  const AWS = require('aws-sdk');
  AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    // region: 'ap-southeast-1', // Ví dụ: 'us-east-1'
  });
  const s3 = new AWS.S3();
  return s3;
};

export const latin1ToUtf8 = (s: string) =>
  Buffer.from(s, 'latin1').toString('utf8');

//* hàm sử sung cho việc tìm kiếm các skill đã bị xóa
export const findDeletedIdsSkill = (list1, list2) => {
  // Tạo một Set từ list1 để kiểm tra sự tồn tại của phần tử nhanh hơn
  const set1 = new Set(list1);

  // Lọc các phần tử trong list2 mà không có trong set1
  const deletedIds = list2.filter((id) => !set1.has(id));

  return deletedIds;
};
export function getListPeriods(startYear, startPeriod, numberOfPeriods) {
  // Tạo mảng để lưu trữ kết quả
  const periods = [];

  // Duyệt qua số kỳ cần tính
  for (let i = 0; i < numberOfPeriods; i++) {
    // Điều chỉnh năm và kỳ nếu cần
    if (startPeriod <= 1) {
      startYear--;
      startPeriod = 2;
    } else if (startPeriod >= 2) {
      startYear;
      startPeriod = 1;
    }

    periods.push({ year: startYear, periodIndex: startPeriod });
  }

  return periods;
}

export function areSortedArraysDifferent(arr1: number[], arr2: number[]) {
  const sorted1 = [...arr1].sort((a, b) => a - b);
  const sorted2 = [...arr2].sort((a, b) => a - b);

  if (sorted1.length !== sorted2.length) return true;

  for (let i = 0; i < sorted1.length; i++) {
    if (sorted1[i] !== sorted2[i]) return true;
  }

  return false;
}
