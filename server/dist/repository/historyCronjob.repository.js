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
exports.HistoryCronJobRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
let HistoryCronJobRepository = class HistoryCronJobRepository {
    async add(object) {
        const checkes = await this.historyCronJobRepository.findOne({
            where: {
                name: object.name,
                companyGroupCode: object.companyGroupCode
            },
        });
        if (checkes) {
            await checkes.update(object);
            return checkes;
        }
        else {
            return await this.historyCronJobRepository.findOrCreate({
                where: {
                    name: object.name,
                    companyGroupCode: object.companyGroupCode
                },
                defaults: object,
            });
        }
    }
    async getAllByCondition(condition) {
        return await this.historyCronJobRepository.findAll({ where: condition });
    }
    async deleteHistory(condition, transaction) {
        return await this.historyCronJobRepository.destroy({
            where: condition,
            transaction: transaction,
        });
    }
    async updateHistory(object, condition) {
        return await this.historyCronJobRepository.update(object, {
            where: condition,
        });
    }
    async addNews(object) {
        return await this.historyCronJobRepository.create(object, {
            returning: true,
        });
    }
    async findOneByCondition(condition) {
        return await this.historyCronJobRepository.findOne({ where: condition });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_CRON_JOB),
    __metadata("design:type", Object)
], HistoryCronJobRepository.prototype, "historyCronJobRepository", void 0);
HistoryCronJobRepository = __decorate([
    (0, common_1.Injectable)()
], HistoryCronJobRepository);
exports.HistoryCronJobRepository = HistoryCronJobRepository;
//# sourceMappingURL=historyCronjob.repository.js.map