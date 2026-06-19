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
exports.Department = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const DivisionSubclass_1 = require("./DivisionSubclass");
const CompanyGroup_1 = require("./CompanyGroup");
let Department = class Department extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], Department.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Department.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Department.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Department.prototype, "class", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Department.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Department.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'company_group_code',
        type: sequelize_1.DataTypes.STRING(20),
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", String)
], Department.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], Department.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], Department.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup, 'company_group_code'),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], Department.prototype, "companyGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => DivisionSubclass_1.DivisionSubclass, 'division_id'),
    __metadata("design:type", Array)
], Department.prototype, "divisionSubclass", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => DivisionSubclass_1.DivisionSubclass, 'department_id'),
    __metadata("design:type", Object)
], Department.prototype, "departmentSubClasses", void 0);
Department = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'department_tbl' })
], Department);
exports.Department = Department;
//# sourceMappingURL=Department.js.map