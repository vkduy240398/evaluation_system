import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { EvaluationAchievementAdditional } from './EvaluationAchievementAdditional';
import { EvaluationAchievementPersonal } from './EvaluationAchievementPersonal';
import { EvaluationBasicBehavior } from './EvaluationBasicBehavior';
import { EvaluationPeriod } from './EvaluationPeriod';
import { EvaluationPro } from './EvaluationPro';
import { Evaluator } from './Evaluator';
import { User } from './User';
import { VersionGuideEvaluation } from './VersionGuideEvaluation';
import { HistoryApproveEvaluation } from './HistoryApproveEvaluation';
import { SummaryDepartment } from './SummaryDepartment';
import { SkillUser } from './SkillUser';
import { CompanyGroup } from './CompanyGroup';
import { Department } from './Department';

export interface EvaluationI {
  id: number;
  evaluationDepartmentId: number;
  departmentName: string;
  divisionName: string;
  companyName: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  status: number;
  level: number;
  commentUser: string;
  skillPercent: number;
  behaviorPercent: number;
  achievementPercent: number;
  basicProTotalPointUser: number;
  basicProTotalPointEvaluator05: number;
  basicProTotalPointEvaluator1: number;
  basicProTotalPointEvaluator2: number;
  behaviorTotalPointUser: number;
  behaviorTotalPointEvaluator05: number;
  behaviorTotalPointEvaluator1: number;
  behaviorTotalPointEvaluator2: number;
  achievementPersonalTotalPointUser: number;
  achievementPersonalTotalPointEvaluator05: number;
  achievementPersonalTotalPointEvaluator1: number;
  achievementPersonalTotalPointEvaluator2: number;
  achievementAdditionalTotalPointUser: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator2: number;
  summaryPointUser: number;
  summaryPointEvaluator05: number;
  summaryPointEvaluator1: number;
  summaryPointEvaluator2: number;
  summaryCharPointUser: string;
  summaryCharPointEvaluator05: string;
  summaryCharPointEvaluator1: string;
  summaryCharPointEvaluator2: string;
  dateEvaluationStart: string;
  dateEvaluationEnd: string;
  dateCreationGoalStart: string;
  dateCreationGoalEnd: string;
  percentPoint: number;
  userId: number;
  evaluationPeriodId: number;
  guideVersionId: number;
  creationUser: number;
  createdTime: Date;
  updatedTime: Date;
  evaluator: Evaluator[];
  evaluationBasicBehavior: EvaluationBasicBehavior[];
  evaluationPro: EvaluationPro[];
  evaluationAchievementPersonals: EvaluationAchievementPersonal[];
  evaluationAchievementAdditional: EvaluationAchievementAdditional[];
  createdByCronjob: number;
  flagSkill: number;
  departmentId: number;
  divisionId: number;
  companyGroupCode: string;
}

@Table({ tableName: 'evaluation_tbl' })
export class Evaluation extends Model<EvaluationI> {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.BIGINT,
    field: 'evaluation_department_id',
    allowNull: true,
  })
  evaluationDepartmentId: number;

  @Column({
    type: DataTypes.STRING(116),
    field: 'department_name',
  })
  departmentName: string;

  @Column({
    type: DataTypes.STRING(116),
    field: 'division_name',
  })
  divisionName: string;

  @Column({
    type: DataTypes.STRING(100),
    field: 'company_name',
  })
  companyName: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataTypes.STRING(7),
    allowNull: false,
    field: 'period_start',
  })
  periodStart: string;

  @Column({
    type: DataTypes.STRING(7),
    allowNull: false,
    field: 'period_end',
  })
  periodEnd: string;

  @Column({
    type: DataTypes.SMALLINT,
    allowNull: false,
  })
  status: number;

  @Column({
    type: DataTypes.SMALLINT,
  })
  level: number;

  @Column({
    type: DataTypes.STRING(2001),
    field: 'comment_user',
  })
  commentUser: string;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'skill_percent',
  })
  skillPercent: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_percent',
  })
  behaviorPercent: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'achievement_percent',
  })
  achievementPercent: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_pro_total_point_user',
  })
  basicProTotalPointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_pro_total_point_evaluator_0_5',
  })
  basicProTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_pro_total_point_evaluator_1',
  })
  basicProTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_pro_total_point_evaluator_2',
  })
  basicProTotalPointEvaluator2: number;
  // ===================================================
  // new
  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_total_point_user',
  })
  basicTotalPointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_total_point_evaluator_0_5',
  })
  basicTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_total_point_evaluator_1',
  })
  basicTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'basic_total_point_evaluator_2',
  })
  basicTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'pro_total_point_user',
  })
  proTotalPointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'pro_total_point_evaluator_0_5',
  })
  proTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'pro_total_point_evaluator_1',
  })
  proTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'pro_total_point_evaluator_2',
  })
  proTotalPointEvaluator2: number;

  // End new
  // ===================================================

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_total_point_user',
  })
  behaviorTotalPointUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_total_point_evaluator_0_5',
  })
  behaviorTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_total_point_evaluator_1',
  })
  behaviorTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'behavior_total_point_evaluator_2',
  })
  behaviorTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_user',
  })
  achievementPersonalTotalPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_0_5',
  })
  achievementPersonalTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_1',
  })
  achievementPersonalTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_personal_total_point_evaluator_2',
  })
  achievementPersonalTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_user',
  })
  achievementAdditionalTotalPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_0_5',
  })
  achievementAdditionalTotalPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_1',
  })
  achievementAdditionalTotalPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'achievement_additional_total_point_evaluator_2',
  })
  achievementAdditionalTotalPointEvaluator2: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_user',
  })
  summaryPointUser: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_0_5',
  })
  summaryPointEvaluator05: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_1',
  })
  summaryPointEvaluator1: number;

  @Column({
    type: DataTypes.DECIMAL(10, 2),
    field: 'summary_point_evaluator_2',
  })
  summaryPointEvaluator2: number;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_user',
  })
  summaryCharPointUser: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_0_5',
  })
  summaryCharPointEvaluator05: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_1',
  })
  summaryCharPointEvaluator1: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'summary_char_point_evaluator_2',
  })
  summaryCharPointEvaluator2: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_start',
  })
  dateCreationGoalStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_creation_goal_end',
  })
  dateCreationGoalEnd: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_start',
  })
  dateEvaluationStart: string;

  @Column({
    type: DataTypes.STRING(10),
    field: 'date_evaluation_end',
  })
  dateEvaluationEnd: string;

  @Default(1)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'flag_skill',
  })
  flagSkill: number;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail',
  // })
  // checkSendMail: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail',
  // })
  // dateSendMail: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_send_mail_evaluation',
  //   defaultValue: false,
  // })
  // checkSendMailEvaluation: boolean;

  // @Column({
  //   type: DataTypes.STRING(10),
  //   field: 'date_send_mail_evaluation',
  // })
  // dateSendMailEvaluation: string;

  // @Column({
  //   type: DataTypes.BOOLEAN,
  //   field: 'check_new',
  // })
  // checkNew: boolean;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'percent_point',
  })
  percentPoint: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => EvaluationPeriod)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'evaluation_period_id',
  })
  evaluationPeriodId: number;

  @ForeignKey(() => VersionGuideEvaluation)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'guide_version_id',
  })
  guideVersionId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'creation_user',
  })
  creationUser: number;

  @Column({
    type: DataTypes.SMALLINT,
    field: 'created_by_cronjob',
  })
  createdByCronjob: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'department_id',
  })
  departmentId: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataTypes.SMALLINT,
    field: 'division_id',
  })
  divisionId: number;

  @Column({
    field: 'company_group_code',
    type: DataTypes.STRING(20),
  })
  @ForeignKey(() => CompanyGroup)
  companyGroupCode: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;

  @BelongsTo(() => CompanyGroup, 'company_group_code')
  companyGroup: CompanyGroup;

  @HasMany(() => Evaluator)
  evaluator: Evaluator[];
  getEvaluator: () => Promise<Evaluator[]>;
  setEvaluator: (arg: any) => Promise<void>;
  createEvaluator: (arg: Evaluator | any) => Promise<void>;
  removeEvaluator: (arg: any) => Promise<void>;

  @HasMany(() => EvaluationBasicBehavior)
  evaluationBasicBehavior: EvaluationBasicBehavior[];

  @HasMany(() => EvaluationPro)
  evaluationPro: EvaluationPro[];

  @HasMany(() => EvaluationAchievementPersonal)
  evaluationAchievementPersonals: EvaluationAchievementPersonal[];

  @HasMany(() => EvaluationAchievementAdditional)
  evaluationAchievementAdditional: EvaluationAchievementAdditional[];

  @HasMany(() => EvaluationAchievementPersonal)
  evaluationAchievementPersonalsNew: EvaluationAchievementPersonal[];

  @HasMany(() => EvaluationAchievementAdditional)
  evaluationAchievementAdditionalNew: EvaluationAchievementAdditional[];

  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => EvaluationPeriod, 'evaluation_period_id')
  evaluationPeriod: EvaluationPeriod;

  @BelongsTo(() => VersionGuideEvaluation, 'guide_version_id')
  versionGuideEvaluation: VersionGuideEvaluation;

  @BelongsTo(() => User, 'creation_user')
  creationUserFK: User;

  @HasMany(() => HistoryApproveEvaluation)
  historyApproveEvaluations: HistoryApproveEvaluation[];

  @HasOne(() => HistoryApproveEvaluation)
  historyApproveEvaluation: HistoryApproveEvaluation;

  @HasOne(() => SummaryDepartment)
  summaryDepartment: SummaryDepartment;
  @HasMany(() => SkillUser)
  skillUser: SkillUser[];

  @BelongsTo(() => Department, 'department_id')
  department: Department;

  @BelongsTo(() => Department, 'division_id')
  division: Department;
}
