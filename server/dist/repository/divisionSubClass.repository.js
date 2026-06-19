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
exports.DivisionSubClassRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const Department_1 = require("../entity/Department");
let DivisionSubClassRepository = class DivisionSubClassRepository {
    async getDepartmentIdByCondition(where) {
        return await this.divisionSubclassEntity.findAll({
            where: where,
            include: [
                {
                    model: Department_1.Department,
                    as: 'department',
                    attributes: ['id', 'code', 'name', 'type'],
                },
            ],
            limit: 20,
        });
    }
    async findOneDepartmentIdByCondition(where) {
        return await this.divisionSubclassEntity.findOne({
            where: where,
            include: [
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name', 'type'],
                },
            ],
        });
    }
    async getParentOfDepartment(id) {
        return await this.divisionSubclassEntity.findOne({
            where: { departmentId: id },
            include: [
                {
                    model: Department_1.Department,
                    as: 'division',
                    attributes: ['id', 'code', 'name', 'type'],
                    where: {
                        active: 1,
                    },
                },
            ],
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.DIVISION_SUBCLASS),
    __metadata("design:type", Object)
], DivisionSubClassRepository.prototype, "divisionSubclassEntity", void 0);
DivisionSubClassRepository = __decorate([
    (0, common_1.Injectable)()
], DivisionSubClassRepository);
exports.DivisionSubClassRepository = DivisionSubClassRepository;
//# sourceMappingURL=divisionSubClass.repository.js.map