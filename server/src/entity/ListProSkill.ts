import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VersionProSkill } from './VersionProSkill';

@Table({ tableName: 'list_pro_skill_tbl', timestamps: false })
export class ListProSkill extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'item_id',
  })
  itemId: string;

  @ForeignKey(() => VersionProSkill)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'version_id',
    references: {
      model: VersionProSkill,
      key: 'id',
    },
  })
  versionId: number;

  @Column({
    type: DataTypes.STRING(51),
    field: 'job_type',
  })
  jobType: string;

  @Column({
    type: DataTypes.STRING(51),
    field: 'medium_class',
  })
  mediumClass: string;

  @Column({
    type: DataTypes.STRING(51),
    field: 'small_class',
  })
  smallClass: string;

  @Column({
    type: DataTypes.STRING(501),
  })
  content: string;

  @Column({
    type: DataTypes.SMALLINT,
  })
  difficulty: number;

  @Column({
    type: DataTypes.STRING(501),
  })
  note: string;

  @BelongsTo(() => VersionProSkill, {
    foreignKey: 'versionId',
  })
  versionProSkill: VersionProSkill;
}
