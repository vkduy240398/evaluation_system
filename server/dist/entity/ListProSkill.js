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
exports.ListProSkill = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const VersionProSkill_1 = require("./VersionProSkill");
let ListProSkill = class ListProSkill extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], ListProSkill.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: 'item_id',
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionProSkill_1.VersionProSkill),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'version_id',
        references: {
            model: VersionProSkill_1.VersionProSkill,
            key: 'id',
        },
    }),
    __metadata("design:type", Number)
], ListProSkill.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(51),
        field: 'job_type',
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "jobType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(51),
        field: 'medium_class',
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "mediumClass", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(51),
        field: 'small_class',
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "smallClass", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], ListProSkill.prototype, "difficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], ListProSkill.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionProSkill_1.VersionProSkill, {
        foreignKey: 'versionId',
    }),
    __metadata("design:type", VersionProSkill_1.VersionProSkill)
], ListProSkill.prototype, "versionProSkill", void 0);
ListProSkill = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'list_pro_skill_tbl', timestamps: false })
], ListProSkill);
exports.ListProSkill = ListProSkill;
//# sourceMappingURL=ListProSkill.js.map