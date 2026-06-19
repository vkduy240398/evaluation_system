"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillGroup = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Department_1 = require("./Department");
const sequelize_1 = require("sequelize");
const Skill_1 = require("./Skill");
let SkillGroup = class SkillGroup extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], SkillGroup.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Skill_1.Skill),
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'skill_id',
        references: {
            key: 'id',
            model: 'skill_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillGroup.prototype, "skillId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        unique: false,
        field: 'department_id',
        references: {
            key: 'id',
            model: 'department_tbl',
        },
    }),
    __metadata("design:type", Number)
], SkillGroup.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Skill_1.Skill, {
        targetKey: 'id',
        foreignKey: 'skill_id',
    }),
    __metadata("design:type", Skill_1.Skill)
], SkillGroup.prototype, "skill", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, {
        targetKey: 'id',
        foreignKey: 'department_id',
    }),
    __metadata("design:type", Department_1.Department)
], SkillGroup.prototype, "department", void 0);
SkillGroup = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'skill_group_tbl' })
], SkillGroup);
exports.SkillGroup = SkillGroup;
//# sourceMappingURL=SkillGroup.js.map