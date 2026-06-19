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
exports.EvaluationPro = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Evaluation_1 = require("./Evaluation");
let EvaluationPro = class EvaluationPro extends sequelize_typescript_1.Model {
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
], EvaluationPro.prototype, "evaluationId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(101),
        field: 'job_type',
    }),
    __metadata("design:type", String)
], EvaluationPro.prototype, "jobType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        field: 'item_id',
    }),
    __metadata("design:type", String)
], EvaluationPro.prototype, "itemId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        field: 'item_no',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "itemNo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(101),
        allowNull: false,
        field: 'item_title',
    }),
    __metadata("design:type", String)
], EvaluationPro.prototype, "itemTitle", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
        allowNull: false,
    }),
    __metadata("design:type", String)
], EvaluationPro.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.STRING(501),
    }),
    __metadata("design:type", String)
], EvaluationPro.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "difficulty", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_user',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "pointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'total_point_user',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "totalPointUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "pointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'total_point_evaluator_0_5',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "totalPointEvaluator05", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "pointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'total_point_evaluator_1',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "totalPointEvaluator1", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'point_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "pointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'total_point_evaluator_2',
    }),
    __metadata("design:type", Number)
], EvaluationPro.prototype, "totalPointEvaluator2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_disable',
    }),
    __metadata("design:type", Boolean)
], EvaluationPro.prototype, "isDisable", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'created_time' }),
    __metadata("design:type", Date)
], EvaluationPro.prototype, "createdTime", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ field: 'updated_time' }),
    __metadata("design:type", Date)
], EvaluationPro.prototype, "updatedTime", void 0);
EvaluationPro = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'evaluation_pro_tbl' })
], EvaluationPro);
exports.EvaluationPro = EvaluationPro;
//# sourceMappingURL=EvaluationPro.js.map