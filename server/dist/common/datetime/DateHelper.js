"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateHelper = void 0;
const SPLASH = '/';
const COLON = ':';
class DateHelper {
    static convertStandardDate(origin) {
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
exports.DateHelper = DateHelper;
//# sourceMappingURL=DateHelper.js.map