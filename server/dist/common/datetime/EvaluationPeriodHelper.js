"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationPeriodHelper = void 0;
const moment = require("moment-timezone");
const FIRST_HALF = '上期';
const SECOND_HALF = '下期';
class EvaluationPeriodHelper {
    static getCurrentPeriodYear(timeZone) {
        const now = moment.tz(timeZone.toString());
        const currentYear = now.year();
        const firstDate = moment.tz([currentYear, 3, 1], timeZone.toString());
        const endPeriodDate = moment.tz(firstDate, timeZone.toString());
        return now.isBefore(endPeriodDate) ? currentYear - 1 : currentYear;
    }
    static getCurrentPeriodIndex(timeZone) {
        const currentMoment = moment.tz(timeZone.toString());
        const currentDate = currentMoment.month() + 1;
        if (currentDate >= 4 && currentDate <= 9) {
            return FIRST_HALF;
        }
        return SECOND_HALF;
    }
}
exports.EvaluationPeriodHelper = EvaluationPeriodHelper;
//# sourceMappingURL=EvaluationPeriodHelper.js.map