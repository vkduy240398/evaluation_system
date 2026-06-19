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
exports.DivisionSubclass = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const Department_1 = require("./Department");
let DivisionSubclass = class DivisionSubclass extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
    }),
    __metadata("design:type", Number)
], DivisionSubclass.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'division_id',
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DivisionSubclass.prototype, "divisionId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Department_1.Department),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.DataTypes.SMALLINT,
        field: 'department_id',
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DivisionSubclass.prototype, "departmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'division_id'),
    __metadata("design:type", Department_1.Department)
], DivisionSubclass.prototype, "division", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Department_1.Department, 'department_id'),
    __metadata("design:type", Department_1.Department)
], DivisionSubclass.prototype, "department", void 0);
DivisionSubclass = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'division_subclass_tbl', timestamps: false })
], DivisionSubclass);
exports.DivisionSubclass = DivisionSubclass;
//# sourceMappingURL=DivisionSubclass.js.map