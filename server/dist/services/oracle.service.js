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
const common_1 = require("@nestjs/common");
const oracle_repository_1 = require("../repository/oracle.repository");
let OracleService = class OracleService {
    async getUserDataOracleDb(query, companyGroupCode) {
        return await this.oracleRepo.getUserDataOracleDb(query, companyGroupCode);
    }
    async getDepartment() {
        const department = await this.oracleRepo.getDepartment();
        return department;
    }
    async getCompany() {
        const department = await this.oracleRepo.getCompany();
        return department;
    }
};
__decorate([
    (0, common_1.Inject)(oracle_repository_1.OracleRepository),
    __metadata("design:type", Object)
], OracleService.prototype, "oracleRepo", void 0);
OracleService = __decorate([
    (0, common_1.Injectable)()
], OracleService);
exports.default = OracleService;
//# sourceMappingURL=oracle.service.js.map