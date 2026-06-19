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
exports.HistoryUpdateDepartment = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Department_1 = require("./Department");
const CompanyGroup_1 = require("./CompanyGroup");
let HistoryUpdateDepartment = class HistoryUpdateDepartment extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
        field: 'id',
    }),
    __metadata("design:type", Number)
], HistoryUpdateDepartment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(4),
        allowNull: false,
        field: 'year',
    }),
    __metadata("design:type", String)
], HistoryUpdateDepartment.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'period_index',
    }),
    __metadata("design:type", Number)
], HistoryUpdateDepartment.prototype, "periodIndex", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'type',
    }),
    __metadata("design:type", Number)
], HistoryUpdateDepartment.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        field: 'department_name',
    }),
    __metadata("design:type", String)
], HistoryUpdateDepartment.prototype, "departmentName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'department_id',
    }),
    __metadata("design:type", Number)
], HistoryUpdateDepartment.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryUpdateDepartment.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryUpdateDepartment.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], HistoryUpdateDepartment.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], HistoryUpdateDepartment.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], HistoryUpdateDepartment.prototype, "department", void 0);
HistoryUpdateDepartment = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_update_department_tbl' })
], HistoryUpdateDepartment);
exports.HistoryUpdateDepartment = HistoryUpdateDepartment;
//# sourceMappingURL=HistoryUpdateDepartment.js.map