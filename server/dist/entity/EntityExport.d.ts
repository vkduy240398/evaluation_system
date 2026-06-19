import { Company } from './Company';
import { EvaluationAchievementAdditional } from './EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from './EvaluationAchievementPersonal';
import { EvaluationAchievementPersonalSub } from './EvaluationAchievementPersonalSub';
import { EvaluationBasicBehavior } from './EvaluationBasicBehavior';
import { EvaluationPeriod } from './EvaluationPeriod';
import { EvaluationPro } from './EvaluationPro';
import { Evaluator } from './Evaluator';
import { HistoryApproveEvaluation } from './HistoryApproveEvaluation';
import { HistoryApproveProSkill } from './HistoryApproveProSkill';
import { ListBasicBehavior } from './ListBasicBehavior';
import { ListProSkill } from './ListProSkill';
import { Permission } from './Permission';
import { SettingFormula810 } from './SettingFormula810';
import { SettingLevel } from './SettingLevel';
import { SettingPointBasicBehaviorPro } from './SettingPointBasicBehaviorPro';
import { SettingProFormula } from './SettingProFormula';
import { SettingProFormulaSub } from './SettingProFormulaSub';
import { VersionBasicBehavior } from './VersionBasicBehavior';
import { VersionGuideEvaluation } from './VersionGuideEvaluation';
import { VersionProSkill } from './VersionProSkill';
import { VersionSetting } from './VersionSetting';
import { DivisionSubclass } from './DivisionSubclass';
import { HistoryMail } from './HistoryMail';
import { HistoryFixEvaluation } from './HistoryFixEvaluation';
import { HistoryBackupEvaluation } from './HistoryBackupEvaluation';
import { VersionNotification } from './VersionNotification';
import { SkillRole } from './SkillRole';
import { SkillGroup } from './SkillGroup';
import { HistoryUpdateDepartment } from './HistoryUpdateDepartment';
import { SummaryDepartment } from './SummaryDepartment';
import { SkillUser } from './SkillUser';
import { Feedback } from './Feedback';
import { SettingReview } from './SettingReview';
import { SettingDefaultPeriod } from './SettingDefaultPeriod';
import { CompanyGroup } from './CompanyGroup';
import { FeedbackCommnet } from './FeedbackComment';
import { UserHistoryUpdate } from './UserHistoryUpdate';
import { EvaluationPeriodDepartmentSetting } from './EvaluationPeriodDepartmentSetting';
export declare const ENTITY_MODULES: ({
    provide: string;
    useValue: typeof DivisionSubclass;
} | {
    provide: string;
    useValue: typeof Company;
} | {
    provide: string;
    useValue: typeof Permission;
} | {
    provide: string;
    useValue: typeof SkillRole;
} | {
    provide: string;
    useValue: typeof Evaluator;
} | {
    provide: string;
    useValue: typeof EvaluationBasicBehavior;
} | {
    provide: string;
    useValue: typeof EvaluationPro;
} | {
    provide: string;
    useValue: typeof EvaluationAchievementPersonal;
} | {
    provide: string;
    useValue: typeof EvaluationAchievementPersonalSub;
} | {
    provide: string;
    useValue: typeof EvaluationAchievementAdditional;
} | {
    provide: string;
    useValue: typeof EvaluationPeriod;
} | {
    provide: string;
    useValue: typeof VersionProSkill;
} | {
    provide: string;
    useValue: typeof VersionBasicBehavior;
} | {
    provide: string;
    useValue: typeof VersionSetting;
} | {
    provide: string;
    useValue: typeof VersionGuideEvaluation;
} | {
    provide: string;
    useValue: typeof HistoryApproveProSkill;
} | {
    provide: string;
    useValue: typeof HistoryApproveEvaluation;
} | {
    provide: string;
    useValue: typeof HistoryMail;
} | {
    provide: string;
    useValue: typeof ListBasicBehavior;
} | {
    provide: string;
    useValue: typeof ListProSkill;
} | {
    provide: string;
    useValue: typeof SettingPointBasicBehaviorPro;
} | {
    provide: string;
    useValue: typeof SettingProFormula;
} | {
    provide: string;
    useValue: typeof SettingProFormulaSub;
} | {
    provide: string;
    useValue: typeof SettingLevel;
} | {
    provide: string;
    useValue: typeof SettingFormula810;
} | {
    provide: string;
    useValue: typeof SkillGroup;
} | {
    provide: string;
    useValue: typeof HistoryFixEvaluation;
} | {
    provide: string;
    useValue: typeof HistoryBackupEvaluation;
} | {
    provide: string;
    useValue: typeof VersionNotification;
} | {
    provide: string;
    useValue: typeof HistoryUpdateDepartment;
} | {
    provide: string;
    useValue: typeof SummaryDepartment;
} | {
    provide: string;
    useValue: typeof SkillUser;
} | {
    provide: string;
    useValue: typeof Feedback;
} | {
    provide: string;
    useValue: typeof SettingReview;
} | {
    provide: string;
    useValue: typeof SettingDefaultPeriod;
} | {
    provide: string;
    useValue: typeof CompanyGroup;
} | {
    provide: string;
    useValue: typeof FeedbackCommnet;
} | {
    provide: string;
    useValue: typeof UserHistoryUpdate;
} | {
    provide: string;
    useValue: typeof EvaluationPeriodDepartmentSetting;
})[];
export declare const LIST_ENTITIES: (typeof Company | typeof DivisionSubclass | typeof CompanyGroup | typeof EvaluationAchievementPersonalSub | typeof EvaluationAchievementPersonal | typeof EvaluationBasicBehavior | typeof Permission | typeof ListProSkill | typeof VersionProSkill | typeof SkillRole | typeof SkillGroup | typeof SkillUser | typeof EvaluationPeriod | typeof SettingReview | typeof UserHistoryUpdate | typeof EvaluationPro | typeof Evaluator | typeof VersionGuideEvaluation | typeof HistoryApproveEvaluation | typeof SummaryDepartment | typeof EvaluationAchievementAdditional | typeof HistoryApproveProSkill | typeof VersionBasicBehavior | typeof ListBasicBehavior | typeof VersionSetting | typeof SettingFormula810 | typeof SettingLevel | typeof SettingPointBasicBehaviorPro | typeof SettingProFormulaSub | typeof SettingProFormula | typeof HistoryMail | typeof HistoryFixEvaluation | typeof HistoryBackupEvaluation | typeof VersionNotification | typeof HistoryUpdateDepartment | typeof FeedbackCommnet | typeof Feedback | typeof SettingDefaultPeriod | typeof EvaluationPeriodDepartmentSetting)[];
