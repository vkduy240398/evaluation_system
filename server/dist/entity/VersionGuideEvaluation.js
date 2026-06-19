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
exports.VersionGuideEvaluation = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const CompanyGroup_1 = require("./CompanyGroup");
let VersionGuideEvaluation = class VersionGuideEvaluation extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "version", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'sub_version',
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "subVersion", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'creation_user',
    }),
    __metadata("design:type", Number)
], VersionGuideEvaluation.prototype, "creationUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "reason", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'content_evaluation_criteria',
    }),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "contentEvaluationCriteria", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        field: 'content_notes',
    }),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "contentNotes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(16),
        field: 'public_date',
    }),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "publicDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(16),
        field: 'last_updated_time',
    }),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "lastUpdatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        field: 'company_group_code',
        type: sequelize_1.DataTypes.STRING(20),
    }),
    (0, sequelize_typescript_1.ForeignKey)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", String)
], VersionGuideEvaluation.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], VersionGuideEvaluation.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], VersionGuideEvaluation.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], VersionGuideEvaluation.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => CompanyGroup_1.CompanyGroup),
    __metadata("design:type", CompanyGroup_1.CompanyGroup)
], VersionGuideEvaluation.prototype, "companyGroup", void 0);
VersionGuideEvaluation = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'version_guide_evaluation_tbl' })
], VersionGuideEvaluation);
exports.VersionGuideEvaluation = VersionGuideEvaluation;
//# sourceMappingURL=VersionGuideEvaluation.js.map