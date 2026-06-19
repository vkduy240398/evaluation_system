import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'history_backup_evaluation_tbl' })
export class HistoryBackupEvaluation extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.BIGINT,
    field: 'evaluation_id',
    allowNull: false,
  })
  evaluationId: number;

  @Column({
    type: DataTypes.TEXT,
    field: 'evaluation_record',
  })
  evaluationRecord: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'evaluation_pro',
  })
  evaluationPro: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'evaluation_basic_behavior',
  })
  evaluationBasicBehavior: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'evaluator',
  })
  evaluator: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'history_approve_evaluation',
  })
  historyApproveEvaluation: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'skill_user',
  })
  skillUser: string;

  @Column({
    type: DataTypes.TEXT,
    field: 'evaluation_achievement_personal',
  })
  evaluationAchievementPersonal: string;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
