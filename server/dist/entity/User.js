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
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Company_1 = require("./Company");
const Department_1 = require("./Department");
const Permission_1 = require("./Permission");
const Role_1 = require("./Role");
const EvaluatorDefault_1 = require("./EvaluatorDefault");
const Evaluation_1 = require("./Evaluation");
const SkillUser_1 = require("./SkillUser");
const SettingReview_1 = require("./SettingReview");
const CompanyGroup_1 = require("./CompanyGroup");
const UserHistoryUpdate_1 = require("./UserHistoryUpdate");
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        field: 'employee_number',
    }),
    __metadata("design:type", String)
], User.prototype, "employeeNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'full_name',
    }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.STRING(50), allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, field: 'department_id' }),
    __metadata("design:type", Number)
], User.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, field: 'division_id' }),
    __metadata("design:type", Number)
], User.prototype, "divisionId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Company_1.Company),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, field: 'company_id' }),
    __metadata("design:type", Number)
], User.prototype, "companyId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT, allowNull: false }),
    __metadata("design:type", Number)
], User.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DataTypes.SMALLINT }),
    __metadata("design:type", Number)
], User.prototype, "level", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'flag_skill',
    }),
    __metadata("design:type", Number)
], User.prototype, "flagSkill", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'company_group_code',
        type: sequelize_1.DataTypes.STRING(20),
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", String)
], User.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], User.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], User.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], User.prototype, "department", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'division_id'),
    __metadata("design:type", Department_1.Department)
], User.prototype, "division", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Company_1.Company, 'company_id'),
    __metadata("design:type", Company_1.Company)
], User.prototype, "company", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], User.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.Role, () => Permission_1.Permission, 'user_id', 'role_id'),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Role_1.Role, () => Permission_1.Permission, 'user_id', 'role_id'),
    __metadata("design:type", Array)
], User.prototype, "rolesCondition", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Permission_1.Permission),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => EvaluatorDefault_1.EvaluatorDefault),
    __metadata("design:type", EvaluatorDefault_1.EvaluatorDefault)
], User.prototype, "evaluatorDefault", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Evaluation_1.Evaluation),
    __metadata("design:type", Array)
], User.prototype, "evaluations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => EvaluatorDefault_1.EvaluatorDefault),
    __metadata("design:type", Array)
], User.prototype, "evaluatorDefaults", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SkillUser_1.SkillUser),
    __metadata("design:type", Array)
], User.prototype, "skillUser", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => SettingReview_1.SettingReview),
    __metadata("design:type", Array)
], User.prototype, "settingReview", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => UserHistoryUpdate_1.UserHistoryUpdate, 'user_id'),
    __metadata("design:type", Array)
], User.prototype, "userHistoryUpdates", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'user_tbl' })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map