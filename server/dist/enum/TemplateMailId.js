"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.day = exports.EmailType = exports.EmailTypeFixed = exports.TemplateMailId = void 0;
var TemplateMailId;
(function (TemplateMailId) {
    TemplateMailId[TemplateMailId["REQUEST_PRO_SKILL_APPROVE"] = 1] = "REQUEST_PRO_SKILL_APPROVE";
    TemplateMailId[TemplateMailId["REJECT_PRO_SKILL_VERSION"] = 2] = "REJECT_PRO_SKILL_VERSION";
    TemplateMailId[TemplateMailId["APPROVE_PRO_SKILL_VERSION_TO_ADMIN"] = 3] = "APPROVE_PRO_SKILL_VERSION_TO_ADMIN";
    TemplateMailId[TemplateMailId["APPROVE_PRO_SKILL_VERSION_TO_OTHER"] = 4] = "APPROVE_PRO_SKILL_VERSION_TO_OTHER";
    TemplateMailId[TemplateMailId["COMMON_GOAL_SETTING"] = 5] = "COMMON_GOAL_SETTING";
    TemplateMailId[TemplateMailId["EXCEPTION_GOAL_SETTING"] = 6] = "EXCEPTION_GOAL_SETTING";
    TemplateMailId[TemplateMailId["GOAL_USER_AND_EVALUATOR_WITHOUT_TIME"] = 7] = "GOAL_USER_AND_EVALUATOR_WITHOUT_TIME";
    TemplateMailId[TemplateMailId["GOAL_EVALUATOR_WITHOUT_TIME"] = 8] = "GOAL_EVALUATOR_WITHOUT_TIME";
    TemplateMailId[TemplateMailId["GOAL_USER_AND_EVALUATOR"] = 9] = "GOAL_USER_AND_EVALUATOR";
    TemplateMailId[TemplateMailId["EVAL_APPROVE_GOAL_SETTING"] = 10] = "EVAL_APPROVE_GOAL_SETTING";
    TemplateMailId[TemplateMailId["EVALUATOR_REJECTING"] = 11] = "EVALUATOR_REJECTING";
    TemplateMailId[TemplateMailId["COMMON_EVALUATION_SETTING"] = 12] = "COMMON_EVALUATION_SETTING";
    TemplateMailId[TemplateMailId["EXCEPTION_EVALUATION_SETTING"] = 13] = "EXCEPTION_EVALUATION_SETTING";
    TemplateMailId[TemplateMailId["EVAL_USER_AND_EVALUATOR_WITHOUT_TIME"] = 14] = "EVAL_USER_AND_EVALUATOR_WITHOUT_TIME";
    TemplateMailId[TemplateMailId["EVAL_EVALUATOR_WITHOUT_TIME"] = 15] = "EVAL_EVALUATOR_WITHOUT_TIME";
    TemplateMailId[TemplateMailId["EVAL_USER_AND_EVALUATOR"] = 16] = "EVAL_USER_AND_EVALUATOR";
    TemplateMailId[TemplateMailId["SUBMIT_GOAL_AND_EVALUATION"] = 17] = "SUBMIT_GOAL_AND_EVALUATION";
    TemplateMailId[TemplateMailId["ADMIN_PUBLIC_EVALUATION"] = 18] = "ADMIN_PUBLIC_EVALUATION";
    TemplateMailId[TemplateMailId["SEND_MAIL_REMIND_AUTO_GOAL"] = 19] = "SEND_MAIL_REMIND_AUTO_GOAL";
    TemplateMailId[TemplateMailId["SEND_MAIL_REMIND_AUTO_EVAL"] = 20] = "SEND_MAIL_REMIND_AUTO_EVAL";
    TemplateMailId[TemplateMailId["FEEDBACK_CREATE"] = 21] = "FEEDBACK_CREATE";
    TemplateMailId[TemplateMailId["FEEDBACK_UPDATE_STATUS"] = 22] = "FEEDBACK_UPDATE_STATUS";
    TemplateMailId[TemplateMailId["FEEDBACK_ADD_COMMENT"] = 23] = "FEEDBACK_ADD_COMMENT";
    TemplateMailId[TemplateMailId["FEEDBACK_DELETE_COMMENT"] = 24] = "FEEDBACK_DELETE_COMMENT";
    TemplateMailId[TemplateMailId["ERROR_SETTING"] = -1] = "ERROR_SETTING";
})(TemplateMailId = exports.TemplateMailId || (exports.TemplateMailId = {}));
var EmailTypeFixed;
(function (EmailTypeFixed) {
    EmailTypeFixed["GOAL_USER_AND_EVALUATOR_WITHOUT_TIME"] = "1";
    EmailTypeFixed["GOAL_EVALUATOR_WITHOUT_TIME"] = "2";
    EmailTypeFixed["GOAL_USER_AND_EVALUATOR"] = "3";
    EmailTypeFixed["GOAL_EVALUATOR_WITHOUT_TIME_STATUS"] = "4";
    EmailTypeFixed["EVAL_USER_AND_EVALUATOR_WITHOUT_TIME"] = "5";
    EmailTypeFixed["EVAL_EVALUATOR_WITHOUT_TIME"] = "6";
    EmailTypeFixed["EVAL_USER_AND_EVALUATOR"] = "7";
    EmailTypeFixed["EVAL_EVALUATOR_WITHOUT_TIME_STATUS"] = "8";
})(EmailTypeFixed = exports.EmailTypeFixed || (exports.EmailTypeFixed = {}));
var EmailType;
(function (EmailType) {
    EmailType["USER_GOAL_SETTING_PERIOD"] = "7";
    EmailType["USER_EVALUATION_PERIOD"] = "8";
    EmailType["EXCEPTION_GOAL_SETTING_PERIOD"] = "5";
    EmailType["EXCEPTION_EVALUATION_PERIOD"] = "6";
})(EmailType = exports.EmailType || (exports.EmailType = {}));
exports.day = {
    0: '日',
    1: '月',
    2: '火',
    3: '水',
    4: '木',
    5: '金',
    6: '土',
};
//# sourceMappingURL=TemplateMailId.js.map