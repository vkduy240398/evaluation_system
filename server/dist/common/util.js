"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areSortedArraysDifferent = exports.getListPeriods = exports.findDeletedIdsSkill = exports.latin1ToUtf8 = exports.S3 = exports.floor10 = exports.checkDupliateMail = exports.isNotNumber = exports.getPeriodCurrent = exports.resetEvaluationData = exports.decrypt = exports.encrypt = exports.isFormatDate = exports.isFloat = exports.dateNowMoment = exports.formatNumber = exports.compareDatePeriod = void 0;
const moment = require("moment");
const compareDatePeriod = (startDate, endDate, timeZone) => {
    if (!startDate || !endDate)
        return false;
    const dateNow = moment().tz(timeZone);
    const convertStartDate = moment(`${startDate} 00:00`, 'YYYY/MM/DD HH:mm');
    const convertEndDate = moment(`${endDate} 23:59`, 'YYYY/MM/DD HH:mm');
    return dateNow.isAfter(convertStartDate) && dateNow.isBefore(convertEndDate);
};
exports.compareDatePeriod = compareDatePeriod;
const formatNumber = (input) => {
    const num = Number(input);
    if (num % 1 === 0) {
        return num.toFixed(1);
    }
    else {
        return num.toString();
    }
};
exports.formatNumber = formatNumber;
const dateNowMoment = (timeZone) => {
    const format = 'YYYY-MM-DD';
    const convertDate = moment().tz(timeZone).format(format);
    return convertDate;
};
exports.dateNowMoment = dateNowMoment;
function isFloat(value) {
    return (value &&
        (!(Number(value).toString() === value.toString()) ||
            Number(value) % 1 !== 0));
}
exports.isFloat = isFloat;
function isFormatDate(value, format, timezone = 'Asia/Tokyo') {
    const convertDate = moment(value, 'YYYY-MM-DD').tz(timezone).format(format);
    return convertDate;
}
exports.isFormatDate = isFormatDate;
const encrypt = (data, isReturn = false, dot = '.#########.') => {
    const KEY = randoms(10);
    const privates = process.env.PRIVATE_KEY;
    const str = `${KEY}${dot}${data}${dot}${privates}`;
    const encode = Buffer.from(str, 'utf-8').toString('base64');
    if (isReturn)
        return encode;
    return encode.replace(/[=|/]+/g, '').toString();
};
exports.encrypt = encrypt;
const decrypt = (data, dot = '.#########.') => {
    const results = Buffer.from(data.toString(), 'base64')
        .toString('utf-8')
        .split(dot);
    if (results[2] === process.env.PRIVATE_KEY) {
        return results[1];
    }
    return undefined;
};
exports.decrypt = decrypt;
const randoms = (number) => {
    const characters = '1234567890qwertyuiopasdfghjklzxcvbnm';
    let result = '';
    for (let index = 0; index < number; index++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
};
exports.resetEvaluationData = {
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
    summaryPointEvaluator2: null,
    summaryCharPointUser: null,
    basicTotalPointUser: null,
    basicTotalPointEvaluator05: null,
    basicTotalPointEvaluator1: null,
    basicTotalPointEvaluator2: null,
    proTotalPointUser: null,
    proTotalPointEvaluator05: null,
    proTotalPointEvaluator1: null,
    proTotalPointEvaluator2: null,
};
function getPeriodCurrent(time, timeZone) {
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
    }
    else {
        return {
            year: Number(year) - 1,
            month,
            periodIndex: 2,
        };
    }
}
exports.getPeriodCurrent = getPeriodCurrent;
function isNotNumber(value) {
    let isNotValid = false;
    if (value === 0) {
        isNotValid = false;
    }
    else {
        if (!value || (value && value.toString().match(/^[0-9]*$/) === null)) {
            isNotValid = true;
        }
    }
    return isNotValid;
}
exports.isNotNumber = isNotNumber;
function checkDupliateMail(userList, userId) {
    let isCheck = false;
    userList.map((user) => {
        if (user.evaluator) {
            user.evaluator.map((evaluator) => {
                if (evaluator.evaluatorId === userId) {
                    isCheck = true;
                }
            });
        }
    });
    return isCheck;
}
exports.checkDupliateMail = checkDupliateMail;
function decimalAdjust(type, value, exp) {
    type = String(type);
    if (!['round', 'floor', 'ceil'].includes(type)) {
        throw new TypeError("The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'.");
    }
    exp = Number(exp);
    value = Number(value);
    if (exp % 1 !== 0 || Number.isNaN(value)) {
        return NaN;
    }
    else if (exp === 0) {
        return Math[type](value);
    }
    const [magnitude, exponent = 0] = value.toString().split('e');
    const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
    const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e');
    return Number(`${newMagnitude}e${+newExponent + exp}`);
}
const floor10 = (value, exp) => decimalAdjust('floor', value, exp);
exports.floor10 = floor10;
const S3 = () => {
    const AWS = require('aws-sdk');
    AWS.config.update({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
    const s3 = new AWS.S3();
    return s3;
};
exports.S3 = S3;
const latin1ToUtf8 = (s) => Buffer.from(s, 'latin1').toString('utf8');
exports.latin1ToUtf8 = latin1ToUtf8;
const findDeletedIdsSkill = (list1, list2) => {
    const set1 = new Set(list1);
    const deletedIds = list2.filter((id) => !set1.has(id));
    return deletedIds;
};
exports.findDeletedIdsSkill = findDeletedIdsSkill;
function getListPeriods(startYear, startPeriod, numberOfPeriods) {
    const periods = [];
    for (let i = 0; i < numberOfPeriods; i++) {
        if (startPeriod <= 1) {
            startYear--;
            startPeriod = 2;
        }
        else if (startPeriod >= 2) {
            startYear;
            startPeriod = 1;
        }
        periods.push({ year: startYear, periodIndex: startPeriod });
    }
    return periods;
}
exports.getListPeriods = getListPeriods;
function areSortedArraysDifferent(arr1, arr2) {
    const sorted1 = [...arr1].sort((a, b) => a - b);
    const sorted2 = [...arr2].sort((a, b) => a - b);
    if (sorted1.length !== sorted2.length)
        return true;
    for (let i = 0; i < sorted1.length; i++) {
        if (sorted1[i] !== sorted2[i])
            return true;
    }
    return false;
}
exports.areSortedArraysDifferent = areSortedArraysDifferent;
//# sourceMappingURL=util.js.map