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
exports.CompanyGroupRepo = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
let CompanyGroupRepo = class CompanyGroupRepo {
    async getAllCompanyGroup() {
        return await this.companyGroupRepository.findAll({
            attributes: ['code', 'timezone', 'emailHR'],
        });
    }
    async getCompanyByRawQuery(sql, params) {
        return await this.companyGroupRepository.sequelize.query(sql, {
            replacements: params,
            type: sequelize_1.QueryTypes.SELECT,
            nest: true,
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.COMPANY_GROUP),
    __metadata("design:type", Object)
], CompanyGroupRepo.prototype, "companyGroupRepository", void 0);
CompanyGroupRepo = __decorate([
    (0, common_1.Injectable)()
], CompanyGroupRepo);
exports.CompanyGroupRepo = CompanyGroupRepo;
//# sourceMappingURL=companyGroup.repository.js.map