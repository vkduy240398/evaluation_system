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
exports.ListBasicBehavior = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const VersionBasicBehavior_1 = require("./VersionBasicBehavior");
let ListBasicBehavior = class ListBasicBehavior extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        field: 'id_item',
    }),
    __metadata("design:type", Number)
], ListBasicBehavior.prototype, "idItem", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => VersionBasicBehavior_1.VersionBasicBehavior),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'version_id',
        references: {
            model: VersionBasicBehavior_1.VersionBasicBehavior,
            key: 'id',
        },
    }),
    __metadata("design:type", Number)
], ListBasicBehavior.prototype, "versionId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(101),
    }),
    __metadata("design:type", String)
], ListBasicBehavior.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], ListBasicBehavior.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
    }),
    __metadata("design:type", Number)
], ListBasicBehavior.prototype, "difficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => VersionBasicBehavior_1.VersionBasicBehavior, 'version_id'),
    __metadata("design:type", VersionBasicBehavior_1.VersionBasicBehavior)
], ListBasicBehavior.prototype, "versionBasicBehavior", void 0);
ListBasicBehavior = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'list_basic_behavior_tbl', timestamps: false })
], ListBasicBehavior);
exports.ListBasicBehavior = ListBasicBehavior;
//# sourceMappingURL=ListBasicBehavior.js.map