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
exports.MailSettingRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const EntityConstant_1 = require("../constant/EntityConstant");
const EvaluationPeriod_1 = require("../entity/EvaluationPeriod");
const RuntimeException_1 = require("../model/exception/RuntimeException");
let MailSettingRepository = class MailSettingRepository {
    async saveMailTemplate(body) {
        const results = await this.historyMailEnity.create(body);
        if (!results) {
            throw new RuntimeException_1.RuntimeException(`Unable to create history with data ${body}`, 500);
        }
        return results;
    }
    async getMailHistoryList(query, req) {
        var _a, _b;
        const conditionYear = {
            year: {
                [sequelize_1.Op.between]: [query.yearStart, query.yearEnd],
            },
        };
        const results = await this.historyMailEnity.findAndCountAll({
            where: query.status != -1
                ? {
                    status: query.status,
                    companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                }
                : { companyGroupCode: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode },
            include: [
                {
                    model: EvaluationPeriod_1.EvaluationPeriod,
                    as: 'evaluationPeriod',
                    where: query.yearStart === '' && query.yearEnd === '' ? {} : conditionYear,
                    attributes: ['id', 'year', 'periodIndex'],
                },
            ],
            order: [
                [
                    (0, sequelize_1.literal)("TO_TIMESTAMP(send_time_actual, 'YYYY/MM/DD HH24:MI')"),
                    'DESC',
                ],
                [(0, sequelize_1.literal)("TO_TIMESTAMP(send_time_setting, 'YYYY/MM/DD')"), 'DESC'],
                [(0, sequelize_1.literal)('id'), 'DESC'],
            ],
            offset: query.offset,
            limit: query.limit,
            distinct: true,
        });
        const convertType = {
            1: '目標_実施期間変更なし_被評価者と評価者',
            2: '目標_実施期間変更',
            3: '評価_実施期間変更なし_被評価者と評価者',
            4: '評価_実施期間変更',
            5: '例外設定_目標設定',
            6: '例外設定_評価',
            7: '共通実施期間_目標設定',
            8: '共通実施期間_評価',
            9: '目標_実施期間変更なし_評価者',
            10: '評価_実施期間変更なし_評価者',
        };
        const tempList = [];
        results === null || results === void 0 ? void 0 : results.rows.forEach((item) => {
            tempList.push({
                contentMail: item.contentMail,
                createdTime: item.createdTime,
                cronjobId: item.cronjobId,
                evaluationId: item.evaluationId,
                evaluationPeriodId: item.evaluationPeriodId,
                evaluationTime: item.evaluationTime,
                id: item.id,
                mailTo: item.mailTo,
                sendTimeActual: item.sendTimeActual,
                sendTimeSetting: item.sendTimeSetting,
                status: item.status,
                title: item.title,
                type: convertType[item.type],
                typeNumber: item.type,
                updatedTime: item.updatedTime,
                evaluationDepartmentTime: item.evaluationDepartmentTime,
                mailCC: item.mailCC,
            });
        });
        if (!results) {
            throw new RuntimeException_1.RuntimeException(`error`, 500);
        }
        return { results: tempList, counts: results === null || results === void 0 ? void 0 : results.count };
    }
    async updateMailHistory(body, id) {
        return await this.historyMailEnity.update(body, { where: { id: id } });
    }
    async findOne(query) {
        return await this.historyMailEnity.findOne({
            where: query,
        });
    }
    async deleteMail(id, transaction) {
        return await this.historyMailEnity.destroy({
            where: { id: id },
            transaction: transaction,
        });
    }
    async transaction() {
        return await this.historyMailEnity.sequelize.transaction();
    }
    async transactionMailTemplate() {
        return await this.mailTemplateEntity.sequelize.transaction();
    }
    async getMailTemplateList(query, req) {
        var _a, _b;
        return await this.mailTemplateEntity.findAll({
            where: query.name !== ''
                ? {
                    name: { [sequelize_1.Op.like]: `%${query.name}%` },
                    companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
                }
                : { companyGroupCode: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode },
            order: [['sort', 'ASC']],
        });
    }
    async getMailTemplateListById(query, req) {
        var _a;
        return await this.mailTemplateEntity.findOne({
            where: {
                id: query.id,
                companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode,
            },
        });
    }
    async editMailTemplate(body, req) {
        var _a;
        const { id, name, subject, note, content, setting } = body;
        return await this.mailTemplateEntity.update({
            name: name,
            subject: subject,
            note: note,
            content: content,
            setting: JSON.stringify(setting),
        }, {
            where: { id: id, companyGroupCode: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode },
        });
    }
    async getMailTemplateById(object) {
        const data = await this.mailTemplateEntity.findOne({
            attributes: [
                'id',
                'type',
                'name',
                'subject',
                'content',
                'note',
                'setting',
                'companyGroupCode',
            ],
            where: object,
        });
        return data;
    }
    async getListMailTemplateById(object) {
        const data = await this.mailTemplateEntity.findAll({
            attributes: [
                'id',
                'type',
                'name',
                'subject',
                'content',
                'note',
                'setting',
                'companyGroupCode',
            ],
            where: object,
        });
        return data;
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.HISTORY_MAIL),
    __metadata("design:type", Object)
], MailSettingRepository.prototype, "historyMailEnity", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.MAIL_TEMPLATE),
    __metadata("design:type", Object)
], MailSettingRepository.prototype, "mailTemplateEntity", void 0);
MailSettingRepository = __decorate([
    (0, common_1.Injectable)()
], MailSettingRepository);
exports.MailSettingRepository = MailSettingRepository;
//# sourceMappingURL=mailSetting.repository.js.map