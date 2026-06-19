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
exports.HistoryApproveProSkill = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const VersionProSkill_1 = require("./VersionProSkill");
let HistoryApproveProSkill = class HistoryApproveProSkill extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], HistoryApproveProSkill.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionProSkill_1.VersionProSkill),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'version_id'
    }),
    __metadata("design:type", Number)
], HistoryApproveProSkill.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(500),
    }),
    __metadata("design:type", String)
], HistoryApproveProSkill.prototype, "comment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", Number)
], HistoryApproveProSkill.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'creation_user'
    }),
    __metadata("design:type", Number)
], HistoryApproveProSkill.prototype, "creationUser", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], HistoryApproveProSkill.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], HistoryApproveProSkill.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'creation_user'),
    __metadata("design:type", User_1.User)
], HistoryApproveProSkill.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionProSkill_1.VersionProSkill, 'version_id'),
    __metadata("design:type", VersionProSkill_1.VersionProSkill)
], HistoryApproveProSkill.prototype, "versionProSkill", void 0);
HistoryApproveProSkill = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'history_approve_pro_skill_tbl' })
], HistoryApproveProSkill);
exports.HistoryApproveProSkill = HistoryApproveProSkill;
//# sourceMappingURL=HistoryApproveProSkill.js.map