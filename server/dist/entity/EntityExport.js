"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIST_ENTITIES = exports.ENTITY_MODULES = void 0;
const EntityConstant_1 = require("../constant/EntityConstant");
const Company_1 = require("./Company");
const Department_1 = require("./Department");
const EvaluationAchievementAdditional_1 = require("./EvaluationAchievementAdditional");
const EvaluationAchievementPersonal_1 = require("./EvaluationAchievementPersonal");
const EvaluationAchievementPersonalSub_1 = require("./EvaluationAchievementPersonalSub");
const EvaluationBasicBehavior_1 = require("./EvaluationBasicBehavior");
const EvaluationPeriod_1 = require("./EvaluationPeriod");
const EvaluationPro_1 = require("./EvaluationPro");
const Evaluator_1 = require("./Evaluator");
const EvaluatorDefault_1 = require("./EvaluatorDefault");
const HistoryApproveEvaluation_1 = require("./HistoryApproveEvaluation");
const HistoryApproveProSkill_1 = require("./HistoryApproveProSkill");
const ListBasicBehavior_1 = require("./ListBasicBehavior");
const ListProSkill_1 = require("./ListProSkill");
const Permission_1 = require("./Permission");
const Role_1 = require("./Role");
const SettingAchievementAdditional_1 = require("./SettingAchievementAdditional");
const SettingAchievementPersonal_1 = require("./SettingAchievementPersonal");
const SettingFormula810_1 = require("./SettingFormula810");
const SettingLevel_1 = require("./SettingLevel");
const SettingPointBasicBehaviorPro_1 = require("./SettingPointBasicBehaviorPro");
const SettingProFormula_1 = require("./SettingProFormula");
const SettingProFormulaSub_1 = require("./SettingProFormulaSub");
const User_1 = require("./User");
const VersionBasicBehavior_1 = require("./VersionBasicBehavior");
const VersionGuideEvaluation_1 = require("./VersionGuideEvaluation");
const VersionProSkill_1 = require("./VersionProSkill");
const VersionSetting_1 = require("./VersionSetting");
const HistoryCronJob_1 = require("./HistoryCronJob");
const DivisionSubclass_1 = require("./DivisionSubclass");
const HistoryMail_1 = require("./HistoryMail");
const HistoryFixEvaluation_1 = require("./HistoryFixEvaluation");
const HistoryBackupEvaluation_1 = require("./HistoryBackupEvaluation");
const VersionNotification_1 = require("./VersionNotification");
const SkillRole_1 = require("./SkillRole");
const Skill_1 = require("./Skill");
const SkillGroup_1 = require("./SkillGroup");
const MailTemplate_1 = require("./MailTemplate");
const HistoryPublicProSkill_1 = require("./HistoryPublicProSkill");
const HistoryUpdateDepartment_1 = require("./HistoryUpdateDepartment");
const SummaryDepartment_1 = require("./SummaryDepartment");
const SkillUser_1 = require("./SkillUser");
const Evaluation_1 = require("./Evaluation");
const Feedback_1 = require("./Feedback");
const SettingReview_1 = require("./SettingReview");
const SettingDefaultPeriod_1 = require("./SettingDefaultPeriod");
const CompanyGroup_1 = require("./CompanyGroup");
const FeedbackComment_1 = require("./FeedbackComment");
const UserHistoryUpdate_1 = require("./UserHistoryUpdate");
const EvaluationPeriodDepartmentSetting_1 = require("./EvaluationPeriodDepartmentSetting");
exports.ENTITY_MODULES = [
    {
        provide: EntityConstant_1.default.DEPARTMENT,
        useValue: Department_1.Department,
    },
    {
        provide: EntityConstant_1.default.SKILL,
        useValue: Skill_1.Skill,
    },
    {
        provide: EntityConstant_1.default.DIVISION_SUBCLASS,
        useValue: DivisionSubclass_1.DivisionSubclass,
    },
    {
        provide: EntityConstant_1.default.COMPANY,
        useValue: Company_1.Company,
    },
    {
        provide: EntityConstant_1.default.ROLE,
        useValue: Role_1.Role,
    },
    {
        provide: EntityConstant_1.default.USER,
        useValue: User_1.User,
    },
    {
        provide: EntityConstant_1.default.PERMISSION,
        useValue: Permission_1.Permission,
    },
    {
        provide: EntityConstant_1.default.SKILL_ROLE,
        useValue: SkillRole_1.SkillRole,
    },
    {
        provide: EntityConstant_1.default.EVALUATION,
        useValue: Evaluation_1.Evaluation,
    },
    {
        provide: EntityConstant_1.default.EVALUATOR,
        useValue: Evaluator_1.Evaluator,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_BASIC_BEHAVIOR,
        useValue: EvaluationBasicBehavior_1.EvaluationBasicBehavior,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_PRO,
        useValue: EvaluationPro_1.EvaluationPro,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL,
        useValue: EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_ACHIEVEMENT_PERSONAL_SUB,
        useValue: EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_ACHIEVEMENT_ADDITIONAL,
        useValue: EvaluationAchievementAdditional_1.EvaluationAchievementAdditional,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_PERIOD,
        useValue: EvaluationPeriod_1.EvaluationPeriod,
    },
    {
        provide: EntityConstant_1.default.EVALUATOR_DEFAULT,
        useValue: EvaluatorDefault_1.EvaluatorDefault,
    },
    {
        provide: EntityConstant_1.default.VERSION_PRO_SKILL,
        useValue: VersionProSkill_1.VersionProSkill,
    },
    {
        provide: EntityConstant_1.default.VERSION_BASIC_BEHAVIOR,
        useValue: VersionBasicBehavior_1.VersionBasicBehavior,
    },
    {
        provide: EntityConstant_1.default.VERSION_SETTING,
        useValue: VersionSetting_1.VersionSetting,
    },
    {
        provide: EntityConstant_1.default.VERSION_GUIDE_EVALUATION,
        useValue: VersionGuideEvaluation_1.VersionGuideEvaluation,
    },
    {
        provide: EntityConstant_1.default.HISTORY_APPROVE_PRO_SKILL,
        useValue: HistoryApproveProSkill_1.HistoryApproveProSkill,
    },
    {
        provide: EntityConstant_1.default.HISTORY_APPROVE_EVALUATION,
        useValue: HistoryApproveEvaluation_1.HistoryApproveEvaluation,
    },
    {
        provide: EntityConstant_1.default.HISTORY_MAIL,
        useValue: HistoryMail_1.HistoryMail,
    },
    {
        provide: EntityConstant_1.default.LIST_BASIC_BEHAVIOR,
        useValue: ListBasicBehavior_1.ListBasicBehavior,
    },
    {
        provide: EntityConstant_1.default.LIST_PRO_SKILL,
        useValue: ListProSkill_1.ListProSkill,
    },
    {
        provide: EntityConstant_1.default.SETTING_POINT_BASIC_BEHAVIOR_PRO,
        useValue: SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro,
    },
    {
        provide: EntityConstant_1.default.SETTING_PRO_FORMULA,
        useValue: SettingProFormula_1.SettingProFormula,
    },
    {
        provide: EntityConstant_1.default.SETTING_PRO_FORMULA_SUB,
        useValue: SettingProFormulaSub_1.SettingProFormulaSub,
    },
    {
        provide: EntityConstant_1.default.SETTING_ACHIEVEMENT_PERSONAL,
        useValue: SettingAchievementPersonal_1.SettingAchievementPersonal,
    },
    {
        provide: EntityConstant_1.default.SETTING_ACHIEVEMENT_ADDITIONAL,
        useValue: SettingAchievementAdditional_1.SettingAchievementAdditional,
    },
    {
        provide: EntityConstant_1.default.SETTING_LEVEL,
        useValue: SettingLevel_1.SettingLevel,
    },
    {
        provide: EntityConstant_1.default.SETTING_FORMULA_8_10,
        useValue: SettingFormula810_1.SettingFormula810,
    },
    {
        provide: EntityConstant_1.default.ORACLE,
        useValue: null,
    },
    {
        provide: EntityConstant_1.default.HISTORY_CRON_JOB,
        useValue: HistoryCronJob_1.HistoryCronJob,
    },
    {
        provide: EntityConstant_1.default.SKILL_GROUP,
        useValue: SkillGroup_1.SkillGroup,
    },
    {
        provide: EntityConstant_1.default.HISTORY_FIX_EVALUATION,
        useValue: HistoryFixEvaluation_1.HistoryFixEvaluation,
    },
    {
        provide: EntityConstant_1.default.HISTORY_BACKUP_EVALUATION,
        useValue: HistoryBackupEvaluation_1.HistoryBackupEvaluation,
    },
    {
        provide: EntityConstant_1.default.VERSION_NOTIFICATION,
        useValue: VersionNotification_1.VersionNotification,
    },
    {
        provide: EntityConstant_1.default.MAIL_TEMPLATE,
        useValue: MailTemplate_1.MailTemplate,
    },
    {
        provide: EntityConstant_1.default.HISTORY_PUBLIC_PRO_SKILL,
        useValue: HistoryPublicProSkill_1.HistoryPublicProSkill,
    },
    {
        provide: EntityConstant_1.default.HISTORY_UPDATE_DEPARTMENT,
        useValue: HistoryUpdateDepartment_1.HistoryUpdateDepartment,
    },
    {
        provide: EntityConstant_1.default.SUMMARY_DEPARTMENT,
        useValue: SummaryDepartment_1.SummaryDepartment,
    },
    {
        provide: EntityConstant_1.default.SKILL_USER_ENTITY,
        useValue: SkillUser_1.SkillUser,
    },
    {
        provide: EntityConstant_1.default.FEEDBACK_ENTITY,
        useValue: Feedback_1.Feedback,
    },
    {
        provide: EntityConstant_1.default.SETTING_REVIEW,
        useValue: SettingReview_1.SettingReview,
    },
    {
        provide: EntityConstant_1.default.SETTING_DEFAULT_PERIOD_VIEWING,
        useValue: SettingDefaultPeriod_1.SettingDefaultPeriod,
    },
    {
        provide: EntityConstant_1.default.COMPANY_GROUP,
        useValue: CompanyGroup_1.CompanyGroup,
    },
    {
        provide: EntityConstant_1.default.FEEDBACK_COMMENT_ENTITY,
        useValue: FeedbackComment_1.FeedbackCommnet,
    },
    {
        provide: EntityConstant_1.default.USER_HISTORY_UPDATE,
        useValue: UserHistoryUpdate_1.UserHistoryUpdate,
    },
    {
        provide: EntityConstant_1.default.EVALUATION_PERIOD_DEPARTMENT_SETTING,
        useValue: EvaluationPeriodDepartmentSetting_1.EvaluationPeriodDepartmentSetting,
    },
];
exports.LIST_ENTITIES = [
    User_1.User,
    Role_1.Role,
    Permission_1.Permission,
    Department_1.Department,
    Skill_1.Skill,
    DivisionSubclass_1.DivisionSubclass,
    SkillRole_1.SkillRole,
    Company_1.Company,
    Evaluation_1.Evaluation,
    EvaluationPeriod_1.EvaluationPeriod,
    Evaluator_1.Evaluator,
    EvaluationBasicBehavior_1.EvaluationBasicBehavior,
    EvaluationPro_1.EvaluationPro,
    EvaluationAchievementPersonal_1.EvaluationAchievementPersonal,
    EvaluationAchievementPersonalSub_1.EvaluationAchievementPersonalSub,
    EvaluationAchievementAdditional_1.EvaluationAchievementAdditional,
    EvaluatorDefault_1.EvaluatorDefault,
    VersionProSkill_1.VersionProSkill,
    VersionBasicBehavior_1.VersionBasicBehavior,
    VersionSetting_1.VersionSetting,
    VersionGuideEvaluation_1.VersionGuideEvaluation,
    HistoryApproveProSkill_1.HistoryApproveProSkill,
    HistoryApproveEvaluation_1.HistoryApproveEvaluation,
    ListBasicBehavior_1.ListBasicBehavior,
    ListProSkill_1.ListProSkill,
    SettingPointBasicBehaviorPro_1.SettingPointBasicBehaviorPro,
    SettingProFormula_1.SettingProFormula,
    SettingProFormulaSub_1.SettingProFormulaSub,
    SettingAchievementPersonal_1.SettingAchievementPersonal,
    SettingAchievementAdditional_1.SettingAchievementAdditional,
    SettingLevel_1.SettingLevel,
    SettingFormula810_1.SettingFormula810,
    HistoryCronJob_1.HistoryCronJob,
    HistoryMail_1.HistoryMail,
    SkillGroup_1.SkillGroup,
    HistoryFixEvaluation_1.HistoryFixEvaluation,
    HistoryBackupEvaluation_1.HistoryBackupEvaluation,
    VersionNotification_1.VersionNotification,
    MailTemplate_1.MailTemplate,
    HistoryPublicProSkill_1.HistoryPublicProSkill,
    HistoryUpdateDepartment_1.HistoryUpdateDepartment,
    SummaryDepartment_1.SummaryDepartment,
    SkillUser_1.SkillUser,
    Feedback_1.Feedback,
    SettingReview_1.SettingReview,
    SettingDefaultPeriod_1.SettingDefaultPeriod,
    CompanyGroup_1.CompanyGroup,
    FeedbackComment_1.FeedbackCommnet,
    UserHistoryUpdate_1.UserHistoryUpdate,
    EvaluationPeriodDepartmentSetting_1.EvaluationPeriodDepartmentSetting,
];
//# sourceMappingURL=EntityExport.js.map