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
exports.CompanyGroupService = void 0;
const common_1 = require("@nestjs/common");
const companyGroup_repository_1 = require("../repository/companyGroup.repository");
let CompanyGroupService = class CompanyGroupService {
    async getAllCompanyGroup() {
        return await this.companyGroupRepo.getAllCompanyGroup();
    }
    async getCompanyByHour(hour) {
        const sql = `SELECT code, 
                COALESCE(timezone, 'Asia/Tokyo') AS timezone, 
                EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE COALESCE(timezone, 'Asia/Tokyo'))) AS hour
          FROM company_group_tbl
          WHERE EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE COALESCE(timezone, 'Asia/Tokyo'))) IN (:hour)`;
        const params = {
            hour: hour,
        };
        return await this.companyGroupRepo.getCompanyByRawQuery(sql, params);
    }
};
__decorate([
    (0, common_1.Inject)(companyGroup_repository_1.CompanyGroupRepo),
    __metadata("design:type", companyGroup_repository_1.CompanyGroupRepo)
], CompanyGroupService.prototype, "companyGroupRepo", void 0);
CompanyGroupService = __decorate([
    (0, common_1.Injectable)()
], CompanyGroupService);
exports.CompanyGroupService = CompanyGroupService;
//# sourceMappingURL=companyGroup.service.js.map