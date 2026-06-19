import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
  } from 'sequelize-typescript';
  import { Department } from './Department';
  import { DataTypes } from 'sequelize';
import { Skill } from './Skill';
  
  @Table({ tableName: 'skill_group_tbl' })
  export class SkillGroup extends Model {
    @Column({
      primaryKey: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
    })
    id: number;
  
    @ForeignKey(() => Skill)
    @Column({
      primaryKey: true,
      type: DataTypes.SMALLINT,
      field: 'skill_id',
      references: {
        key: 'id',
        model: 'skill_tbl',
      },
    })
    skillId: number;
  
    @ForeignKey(() => Department)
    @Column({
      primaryKey: true,
      type: DataTypes.SMALLINT,
      unique: false,
      field: 'department_id',
      references: {
        key: 'id',
        model: 'department_tbl',
      },
    })
    departmentId: number;
  
    @BelongsTo(() => Skill, {
      targetKey: 'id',
      foreignKey: 'skill_id',
    })
    skill: Skill;
  
    @BelongsTo(() => Department, {
      targetKey: 'id',
      foreignKey: 'department_id',
    })
    department: Department;
  }
  