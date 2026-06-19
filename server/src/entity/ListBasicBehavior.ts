import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VersionBasicBehavior } from './VersionBasicBehavior';

@Table({ tableName: 'list_basic_behavior_tbl', timestamps: false })
export class ListBasicBehavior extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    field: 'id_item',
  })
  idItem: number;
  
  @ForeignKey(() => VersionBasicBehavior)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'version_id',
    references: {
      model: VersionBasicBehavior,
      key: 'id',
    },
  })
  versionId: number;

  @Column({
    type: DataTypes.STRING(101),
  })
  title: string;

  @Column({
    type: DataTypes.STRING(501),
  })
  content: string;

  @Column({
    type: DataTypes.SMALLINT,
  })
  difficulty: number;

  @BelongsTo(() => VersionBasicBehavior, 'version_id')
  versionBasicBehavior: VersionBasicBehavior;
}
