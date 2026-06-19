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
exports.SettingDefaultPeriodRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let SettingDefaultPeriodRepository = class SettingDefaultPeriodRepository {
    async findOneSettingDefault(companyGroupCode) {
        return await this.settingDefaultPeriodEnity.findOne({
            where: { companyGroupCode },
        });
    }
    async updateSettingDefaultPeriod(defaultPeriod, companyGroupCode) {
        const data = await this.settingDefaultPeriodEnity
            .findOne({
            where: { companyGroupCode },
        })
            .then((values) => {
            if (values) {
                return values
                    .update({
                    companyGroupCode: companyGroupCode,
                    number: defaultPeriod,
                })
                    .then((updateRecord) => {
                    return updateRecord;
                });
            }
            else {
                return this.settingDefaultPeriodEnity
                    .create({ companyGroupCode: companyGroupCode, number: defaultPeriod }, {
                    logging: true,
                })
                    .then((record) => record);
            }
        })
            .catch((error) => {
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) ||
                (error === null || error === void 0 ? void 0 : error.statusCode) ||
                common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        });
        return data;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.SETTING_DEFAULT_PERIOD_VIEWING),
    __metadata("design:type", Object)
], SettingDefaultPeriodRepository.prototype, "settingDefaultPeriodEnity", void 0);
SettingDefaultPeriodRepository = __decorate([
    (0, common_1.Injectable)()
], SettingDefaultPeriodRepository);
exports.SettingDefaultPeriodRepository = SettingDefaultPeriodRepository;
//# sourceMappingURL=settingDefaultPeriod.repository.js.map