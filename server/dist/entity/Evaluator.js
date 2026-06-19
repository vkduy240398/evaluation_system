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
exports.Evaluator = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
const User_1 = require("./User");
let Evaluator = class Evaluator extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        field: 'evaluation_id',
        references: {
            model: Evaluation_1.Evaluation,
            key: 'id',
        },
    }),
    __metadata("design:type", Number)
], Evaluator.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'evaluator_id',
    }),
    __metadata("design:type", Number)
], Evaluator.prototype, "evaluatorId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.DECIMAL(2, 1),
        allowNull: false,
        field: 'evaluation_order',
    }),
    __metadata("design:type", Number)
], Evaluator.prototype, "evaluationOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(2001),
        field: 'comment_public',
    }),
    __metadata("design:type", String)
], Evaluator.prototype, "commentPublic", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(2001),
        field: 'comment_private',
    }),
    __metadata("design:type", String)
], Evaluator.prototype, "commentPrivate", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], Evaluator.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], Evaluator.prototype, "updatedTime", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'evaluator_id'),
    __metadata("design:type", User_1.User)
], Evaluator.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Evaluation_1.Evaluation, 'id'),
    __metadata("design:type", Evaluation_1.Evaluation)
], Evaluator.prototype, "evaluation", void 0);
Evaluator = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluator_tbl' })
], Evaluator);
exports.Evaluator = Evaluator;
//# sourceMappingURL=Evaluator.js.map