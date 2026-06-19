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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const company_repository_1 = require("../repository/company.repository");
let CompanyService = class CompanyService {
    async getAllCompany() {
        return await this.companyRepo.getAllCompany();
    }
    async getOptionCompany() {
        const results = [];
        const companies = await this.companyRepo.getAllCompany();
        if (companies) {
            results.push(...companies.map((v) => ({ label: v.name, value: v.id })));
        }
        return results;
    }
};
__decorate([
    (0, common_1.Inject)(company_repository_1.CompanyRepository),
    __metadata("design:type", company_repository_1.CompanyRepository)
], CompanyService.prototype, "companyRepo", void 0);
CompanyService = __decorate([
    (0, common_1.Injectable)()
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map