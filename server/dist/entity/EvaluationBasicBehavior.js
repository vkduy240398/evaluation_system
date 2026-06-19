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
exports.EvaluationBasicBehavior = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
let EvaluationBasicBehavior = class EvaluationBasicBehavior extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Evaluation_1.Evaluation),
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        field: 'evaluation_id',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'item_no',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "itemNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(101),
        allowNull: false,
        field: 'item_title',
    }),
    __metadata("design:type", String)
], EvaluationBasicBehavior.prototype, "itemTitle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EvaluationBasicBehavior.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "difficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_user',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "pointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "pointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "pointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationBasicBehavior.prototype, "pointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationBasicBehavior.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationBasicBehavior.prototype, "updatedTime", void 0);
EvaluationBasicBehavior = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluation_basic_behavior_tbl' })
], EvaluationBasicBehavior);
exports.EvaluationBasicBehavior = EvaluationBasicBehavior;
//# sourceMappingURL=EvaluationBasicBehavior.js.map