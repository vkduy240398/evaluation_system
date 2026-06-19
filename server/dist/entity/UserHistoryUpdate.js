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
exports.UserHistoryUpdate = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
let UserHistoryUpdate = class UserHistoryUpdate extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], UserHistoryUpdate.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'user_id',
    }),
    __metadata("design:type", Number)
], UserHistoryUpdate.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'before_update_content',
    }),
    __metadata("design:type", String)
], UserHistoryUpdate.prototype, "beforeUpdateContent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        field: 'after_update_content',
    }),
    __metadata("design:type", String)
], UserHistoryUpdate.prototype, "afterUpdateContent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], UserHistoryUpdate.prototype, "option", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'company_group_code',
    }),
    __metadata("design:type", String)
], UserHistoryUpdate.prototype, "companyGroupCode", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'creation_user_id',
    }),
    __metadata("design:type", Number)
], UserHistoryUpdate.prototype, "creationUserId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], UserHistoryUpdate.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], UserHistoryUpdate.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'user_id'),
    __metadata("design:type", User_1.User)
], UserHistoryUpdate.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'creation_user_id'),
    __metadata("design:type", User_1.User)
], UserHistoryUpdate.prototype, "creationUser", void 0);
UserHistoryUpdate = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'user_history_update' })
], UserHistoryUpdate);
exports.UserHistoryUpdate = UserHistoryUpdate;
//# sourceMappingURL=UserHistoryUpdate.js.map