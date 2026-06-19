"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackStatus = void 0;
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus[FeedbackStatus["SENT"] = 1] = "SENT";
    FeedbackStatus[FeedbackStatus["CONFIRMING"] = 2] = "CONFIRMING";
    FeedbackStatus[FeedbackStatus["NO_ACTION_REQUIRED"] = 3] = "NO_ACTION_REQUIRED";
    FeedbackStatus[FeedbackStatus["ACTION_REQUIRED"] = 4] = "ACTION_REQUIRED";
    FeedbackStatus[FeedbackStatus["IN_PROGRESS"] = 5] = "IN_PROGRESS";
    FeedbackStatus[FeedbackStatus["RESOLVED"] = 6] = "RESOLVED";
    FeedbackStatus[FeedbackStatus["CLOSED"] = 7] = "CLOSED";
    FeedbackStatus[FeedbackStatus["CANCELLED"] = 8] = "CANCELLED";
})(FeedbackStatus = exports.FeedbackStatus || (exports.FeedbackStatus = {}));
//# sourceMappingURL=FeedbackStatus.js.map