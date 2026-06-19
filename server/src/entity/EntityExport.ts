/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/naming-convention */

import EntityConstant from 'src/constant/EntityConstant';
import { Company } from './Company';
import { Department } from './Department';
import { EvaluationAchievementAdditional } from './EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from './EvaluationAchievementPersonal';
import { EvaluationAchievementPersonalSub } from './EvaluationAchievementPersonalSub';
import { EvaluationBasicBehavior } from './EvaluationBasicBehavior';
import { EvaluationPeriod } from './EvaluationPeriod';
import { EvaluationPro } from './EvaluationPro';
import { Evaluator } from './Evaluator';
import { EvaluatorDefault } from './EvaluatorDefault';
import { HistoryApproveEvaluation } from './HistoryApproveEvaluation';
import { HistoryApproveProSkill } from './HistoryApproveProSkill';
import { ListBasicBehavior } from './ListBasicBehavior';
import { ListProSkill } from './ListProSkill';
import { Permission } from './Permission';
import { Role } from './Role';
import { SettingAchievementAdditional } from './SettingAchievementAdditional';
import { SettingAchievementPersonal } from './SettingAchievementPersonal';
import { SettingFormula810 } from './SettingFormula810';
import { SettingLevel } from './SettingLevel';
import { SettingPointBasicBehaviorPro } from './SettingPointBasicBehaviorPro';
import { SettingProFormula } from './SettingProFormula';
import { SettingProFormulaSub } from './SettingProFormulaSub';
import { User } from './User';
import { VersionBasicBehavior } from './VersionBasicBehavior';
import { VersionGuideEvaluation } from './VersionGuideEvaluation';
import { VersionProSkill } from './VersionProSkill';
import { VersionSetting } from './VersionSetting';
import { HistoryCronJob } from './HistoryCronJob';
import { DivisionSubclass } from './DivisionSubclass';
import { HistoryMail } from './HistoryMail';
import { HistoryFixEvaluation } from './HistoryFixEvaluation';
import { HistoryBackupEvaluation } from './HistoryBackupEvaluation';
import { VersionNotification } from './VersionNotification';
import { SkillRole } from './SkillRole';
import { Skill } from './Skill';
import { SkillGroup } from './SkillGroup';
import { MailTemplate } from './MailTemplate';
import { HistoryPublicProSkill } from './HistoryPublicProSkill';
import { HistoryUpdateDepartment } from './HistoryUpdateDepartment';
import { SummaryDepartment } from './SummaryDepartment';
import { SkillUser } from './SkillUser';
import { Evaluation } from './Evaluation';
import { Feedback } from './Feedback';
import { SettingReview } from './SettingReview';
import { SettingDefaultPeriod } from './SettingDefaultPeriod';
import { CompanyGroup } from './CompanyGroup';
import { FeedbackCommnet } from './FeedbackComment';
import { UserHistoryUpdate } from './UserHistoryUpdate';
import { EvaluationPeriodDepartmentSetting } from './EvaluationPeriodDepartmentSetting';

export const ENTITY_MODULES = [
  {
    provide: EntityConstant.DEPARTMENT,
    useValue: Department,
  },
  {
    provide: EntityConstant.SKILL,
    useValue: Skill,
  },
  {
    provide: EntityConstant.DIVISION_SUBCLASS,
    useValue: DivisionSubclass,
  },
  {
    provide: EntityConstant.COMPANY,
    useValue: Company,
  },
  {
    provide: EntityConstant.ROLE,
    useValue: Role,
  },
  {
    provide: EntityConstant.USER,
    useValue: User,
  },
  {
    provide: EntityConstant.PERMISSION,
    useValue: Permission,
  },
  {
    provide: EntityConstant.SKILL_ROLE,
    useValue: SkillRole,
  },
  {
    provide: EntityConstant.EVALUATION,
    useValue: Evaluation,
  },
  {
    provide: EntityConstant.EVALUATOR,
    useValue: Evaluator,
  },
  {
    provide: EntityConstant.EVALUATION_BASIC_BEHAVIOR,
    useValue: EvaluationBasicBehavior,
  },
  {
    provide: EntityConstant.EVALUATION_PRO,
    useValue: EvaluationPro,
  },
  {
    provide: EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL,
    useValue: EvaluationAchievementPersonal,
  },
  {
    provide: EntityConstant.EVALUATION_ACHIEVEMENT_PERSONAL_SUB,
    useValue: EvaluationAchievementPersonalSub,
  },
  {
    provide: EntityConstant.EVALUATION_ACHIEVEMENT_ADDITIONAL,
    useValue: EvaluationAchievementAdditional,
  },
  {
    provide: EntityConstant.EVALUATION_PERIOD,
    useValue: EvaluationPeriod,
  },
  {
    provide: EntityConstant.EVALUATOR_DEFAULT,
    useValue: EvaluatorDefault,
  },
  {
    provide: EntityConstant.VERSION_PRO_SKILL,
    useValue: VersionProSkill,
  },
  {
    provide: EntityConstant.VERSION_BASIC_BEHAVIOR,
    useValue: VersionBasicBehavior,
  },
  {
    provide: EntityConstant.VERSION_SETTING,
    useValue: VersionSetting,
  },
  {
    provide: EntityConstant.VERSION_GUIDE_EVALUATION,
    useValue: VersionGuideEvaluation,
  },
  {
    provide: EntityConstant.HISTORY_APPROVE_PRO_SKILL,
    useValue: HistoryApproveProSkill,
  },
  {
    provide: EntityConstant.HISTORY_APPROVE_EVALUATION,
    useValue: HistoryApproveEvaluation,
  },
  {
    provide: EntityConstant.HISTORY_MAIL,
    useValue: HistoryMail,
  },
  {
    provide: EntityConstant.LIST_BASIC_BEHAVIOR,
    useValue: ListBasicBehavior,
  },
  {
    provide: EntityConstant.LIST_PRO_SKILL,
    useValue: ListProSkill,
  },
  {
    provide: EntityConstant.SETTING_POINT_BASIC_BEHAVIOR_PRO,
    useValue: SettingPointBasicBehaviorPro,
  },
  {
    provide: EntityConstant.SETTING_PRO_FORMULA,
    useValue: SettingProFormula,
  },
  {
    provide: EntityConstant.SETTING_PRO_FORMULA_SUB,
    useValue: SettingProFormulaSub,
  },
  {
    provide: EntityConstant.SETTING_ACHIEVEMENT_PERSONAL,
    useValue: SettingAchievementPersonal,
  },
  {
    provide: EntityConstant.SETTING_ACHIEVEMENT_ADDITIONAL,
    useValue: SettingAchievementAdditional,
  },
  {
    provide: EntityConstant.SETTING_LEVEL,
    useValue: SettingLevel,
  },
  {
    provide: EntityConstant.SETTING_FORMULA_8_10,
    useValue: SettingFormula810,
  },
  {
    provide: EntityConstant.ORACLE,
    useValue: null,
  },
  {
    provide: EntityConstant.HISTORY_CRON_JOB,
    useValue: HistoryCronJob,
  },
  {
    provide: EntityConstant.SKILL_GROUP,
    useValue: SkillGroup,
  },
  {
    provide: EntityConstant.HISTORY_FIX_EVALUATION,
    useValue: HistoryFixEvaluation,
  },
  {
    provide: EntityConstant.HISTORY_BACKUP_EVALUATION,
    useValue: HistoryBackupEvaluation,
  },
  {
    provide: EntityConstant.VERSION_NOTIFICATION,
    useValue: VersionNotification,
  },
  {
    provide: EntityConstant.MAIL_TEMPLATE,
    useValue: MailTemplate,
  },
  {
    provide: EntityConstant.HISTORY_PUBLIC_PRO_SKILL,
    useValue: HistoryPublicProSkill,
  },

  {
    provide: EntityConstant.HISTORY_UPDATE_DEPARTMENT,
    useValue: HistoryUpdateDepartment,
  },
  {
    provide: EntityConstant.SUMMARY_DEPARTMENT,
    useValue: SummaryDepartment,
  },
  {
    provide: EntityConstant.SKILL_USER_ENTITY,
    useValue: SkillUser,
  },
  {
    provide: EntityConstant.FEEDBACK_ENTITY,
    useValue: Feedback,
  },
  {
    provide: EntityConstant.SETTING_REVIEW,
    useValue: SettingReview,
  },
  {
    provide: EntityConstant.SETTING_DEFAULT_PERIOD_VIEWING,
    useValue: SettingDefaultPeriod,
  },
  {
    provide: EntityConstant.COMPANY_GROUP,
    useValue: CompanyGroup,
  },
  {
    provide: EntityConstant.FEEDBACK_COMMENT_ENTITY,
    useValue: FeedbackCommnet,
  },
  {
    provide: EntityConstant.USER_HISTORY_UPDATE,
    useValue: UserHistoryUpdate,
  },
  {
    provide: EntityConstant.EVALUATION_PERIOD_DEPARTMENT_SETTING,
    useValue: EvaluationPeriodDepartmentSetting,
  },
];

export const LIST_ENTITIES = [
  User,
  Role,
  Permission,
  Department,
  Skill,
  DivisionSubclass,
  SkillRole,
  Company,
  Evaluation,
  EvaluationPeriod,
  Evaluator,
  EvaluationBasicBehavior,
  EvaluationPro,
  EvaluationAchievementPersonal,
  EvaluationAchievementPersonalSub,
  EvaluationAchievementAdditional,
  EvaluatorDefault,
  VersionProSkill,
  VersionBasicBehavior,
  VersionSetting,
  VersionGuideEvaluation,
  HistoryApproveProSkill,
  HistoryApproveEvaluation,
  ListBasicBehavior,
  ListProSkill,
  SettingPointBasicBehaviorPro,
  SettingProFormula,
  SettingProFormulaSub,
  SettingAchievementPersonal,
  SettingAchievementAdditional,
  SettingLevel,
  SettingFormula810,
  HistoryCronJob,
  HistoryMail,
  SkillGroup,
  HistoryFixEvaluation,
  HistoryBackupEvaluation,
  VersionNotification,
  MailTemplate,
  HistoryPublicProSkill,
  HistoryUpdateDepartment,
  SummaryDepartment,
  SkillUser,
  Feedback,
  SettingReview,
  SettingDefaultPeriod,
  CompanyGroup,
  FeedbackCommnet,
  UserHistoryUpdate,
  EvaluationPeriodDepartmentSetting,
];
