import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'history_fix_evaluation_tbl' })
export class HistoryFixEvaluation extends Model {
  @AllowNull(false)
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'period_id',
    allowNull: false,
  })
  periodId: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.INTEGER,
    field: 'type',
  })
  type: number;

  @Column({
    type: DataTypes.TEXT,
    field: 'note',
  })
  note: string;

  @Column({
    type: DataTypes.INTEGER,
    field: 'check_fixed',
  })
  checkFixed: number;

  @AllowNull(false)
  @CreatedAt
  @Column({ field: 'created_time' })
  createdTime: Date;

  @AllowNull(false)
  @UpdatedAt
  @Column({ field: 'updated_time' })
  updatedTime: Date;
}
