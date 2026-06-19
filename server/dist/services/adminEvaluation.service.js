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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEvaluationService = void 0;
const common_1 = require("@nestjs/common");
const adminEvaluation_repository_1 = require("../repository/adminEvaluation.repository");
const user_repository_1 = require("../repository/user.repository");
const mail_service_1 = require("./mail.service");
const sequelize_1 = require("sequelize");
const exceljs_1 = require("exceljs");
const statusEvaluation_1 = require("../constant/statusEvaluation");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const moment = require("moment");
let AdminEvaluationService = class AdminEvaluationService {
    constructor() {
        this.findStringStatus = (dataList) => {
            let stringStatus;
            if (dataList.status !== 50) {
                stringStatus = statusEvaluation_1.statusEvaluation[dataList.status];
            }
            else {
                const today = moment().format('YYYY/MM/DD');
                if (dataList.evaluationPeriod) {
                    if (dataList.level < 8) {
                        if (today >=
                            moment(dataList.evaluationPeriod.dateEvaluationStart).format('YYYY/MM/DD') &&
                            today <=
                                moment(dataList.evaluationPeriod.dateEvaluationEnd).format('YYYY/MM/DD')) {
                            stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[1];
                        }
                        else
                            stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
                    }
                    else {
                        if (today >=
                            moment(dataList.evaluationPeriod.dateEvaluationDepartmentStart).format('YYYY/MM/DD') &&
                            today <=
                                moment(dataList.evaluationPeriod.dateEvaluationDepartmentEnd).format('YYYY/MM/DD')) {
                            stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[1];
                        }
                        else
                            stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
                    }
                }
                else
                    stringStatus = statusEvaluation_1.statusEvaluation[dataList.status].split('/')[0];
            }
            return stringStatus;
        };
    }
    async goalConfirm(body, companyGroupCode) {
        var _a, e_1, _b, _c;
        const { periodId, checkFixed } = body;
        const listEvaluations = await this.adminEvaluationRepo.getListEvaluationConfirm(body, companyGroupCode);
        if (listEvaluations && listEvaluations.length > 0) {
            let string = ``;
            try {
                for (var _d = true, listEvaluations_1 = __asyncValues(listEvaluations), listEvaluations_1_1; listEvaluations_1_1 = await listEvaluations_1.next(), _a = listEvaluations_1_1.done, !_a;) {
                    _c = listEvaluations_1_1.value;
                    _d = false;
                    try {
                        const e = _c;
                        string += `${e.id}:${e.status} `;
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = listEvaluations_1.return)) await _b.call(listEvaluations_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            await this.adminEvaluationRepo.goalConfirm(periodId, companyGroupCode);
            const jsonStr = '{"' +
                string
                    .substring(0, string.length - 1)
                    .replace(/ /g, '", "')
                    .replace(/:/g, '": "') +
                '"}';
            await this.adminEvaluationRepo.addHistoryFixEvaluation(periodId, jsonStr, 1, checkFixed);
        }
        return 1;
    }
    async listUserEvaluation(params, companyGroupCode, timeZone) {
        return await this.adminEvaluationRepo.listUserEvaluation(params, companyGroupCode, timeZone);
    }
    async listUserEvaluationPeriod(params, companyGroupCode) {
        const data = await this.adminEvaluationRepo.listUserEvaluationPeriod(params, companyGroupCode);
        const period = await this.adminEvaluationRepo.checkDatePeriod(params.periodId);
        return { data: data, period: period };
    }
    async exportCSV(params, companyGroupCode) {
        const datas = await this.adminEvaluationRepo.exportCSV(params, companyGroupCode);
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet();
        worksheet.columns = [
            { header: '社員番号', key: '社員番号' },
            { header: '氏名', key: '氏名' },
            { header: '部署名', key: '部署名' },
            { header: '課名', key: '課名' },
            { header: '等級', key: '等級' },
            { header: '評価期間', key: '評価期間' },
            { header: '状態', key: '状態' },
            { header: '一次評価', key: '一次評価' },
            { header: '二次評価', key: '二次評価' },
            { header: '評価結果', key: '評価結果' },
            { header: '個人評価', key: '評価結果' },
            { header: '【公開】\n一次評価者コメント', key: '一次評価者コメント' },
            { header: '【非公開】\n一次評価者コメント', key: '一次評価者コメント' },
            { header: '【公開】\n二次評価者コメント', key: '二次評価者コメント' },
            { header: '【非公開】\n二次評価者コメント', key: '二次評価者コメント' },
            { header: '備考', key: '備考' },
        ];
        for (let i = 1; i <= worksheet.columnCount; i++) {
            worksheet.getCell(1, i).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ff91d2ff' },
            };
        }
        worksheet.getRow(1).font = {
            bold: true,
        };
        worksheet.getCell('A1').border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        worksheet.columns[0].width = 10;
        worksheet.columns[1].width = 20;
        worksheet.columns[2].width = 30;
        worksheet.columns[3].width = 30;
        worksheet.columns[4].width = 5;
        worksheet.columns[5].width = 20;
        worksheet.columns[6].width = 18;
        worksheet.columns[7].width = 20;
        worksheet.columns[8].width = 20;
        worksheet.columns[9].width = 5;
        worksheet.columns[10].width = 5;
        worksheet.columns[11].width = 30;
        worksheet.columns[12].width = 30;
        worksheet.columns[13].width = 30;
        worksheet.columns[14].width = 30;
        worksheet.columns[15].width = 50;
        const createOuterBorder = (worksheet, start = { row: 1, col: 1 }, end = { row: 1, col: 1 }, borderWidth = 'thin') => {
            const borderStyle = {
                style: borderWidth,
            };
            for (let i = start.row; i <= end.row; i++) {
                for (let j = start.col; j <= end.col; j++) {
                    const leftBorderCell = worksheet.getCell(i, j);
                    leftBorderCell.border = Object.assign(Object.assign({}, leftBorderCell.border), { left: borderStyle, right: borderStyle, top: borderStyle, bottom: borderStyle });
                }
            }
        };
        datas.data.forEach((item, _index) => {
            worksheet.addRow([
                item.employee_number,
                item.full_name,
                item.division,
                item.department,
                item.level,
                item.period,
                item.status,
                item.evaluator_1,
                item.evaluator_2,
                item.statusno > 61 ? item.point : '',
                item.summary_char_point_evaluator_2,
                item.comment_public_evaluator_1,
                item.comment_private_evaluator_1,
                item.comment_public_evaluator_2,
                item.comment_private_evaluator_2,
                item.note,
            ]);
            let rowIndex = 1;
            for (rowIndex; rowIndex <= worksheet.rowCount; rowIndex++) {
                worksheet.getRow(rowIndex).alignment = {
                    wrapText: true,
                    vertical: 'middle',
                };
            }
            worksheet.getRow(1).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
            worksheet.getColumn(5).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
            worksheet.getColumn(10).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
            worksheet.getColumn(11).alignment = {
                wrapText: true,
                horizontal: 'center',
                vertical: 'middle',
            };
        });
        createOuterBorder(worksheet, { row: 1, col: 1 }, { row: worksheet.rowCount, col: worksheet.columnCount });
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    async evaluationConfirm(body, companyGroupCode) {
        var _a, e_2, _b, _c;
        const listEvaluation = await this.adminEvaluationRepo.evaluationConfirm(body, companyGroupCode);
        let string = ``;
        try {
            for (var _d = true, listEvaluation_1 = __asyncValues(listEvaluation), listEvaluation_1_1; listEvaluation_1_1 = await listEvaluation_1.next(), _a = listEvaluation_1_1.done, !_a;) {
                _c = listEvaluation_1_1.value;
                _d = false;
                try {
                    const e = _c;
                    string += `${e.id}:${e.status} `;
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = listEvaluation_1.return)) await _b.call(listEvaluation_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        const jsonStr = '{"' +
            string
                .substring(0, string.length - 1)
                .replace(/ /g, '", "')
                .replace(/:/g, '": "') +
            '"}';
        await this.adminEvaluationRepo.addHistoryFixEvaluation(body.periodId, jsonStr, 2, body.checkFixed);
        return 1;
    }
    async publicEvaluation(body, host, companyGroupCode) {
        const listUser = await this.adminEvaluationRepo.getListUser(body.periodId, companyGroupCode);
        const condition = {
            [sequelize_1.Op.and]: [
                { status: { [sequelize_1.Op.lt]: 100 } },
                { status: { [sequelize_1.Op.gte]: 50 } },
                { evaluationPeriodId: body.periodId },
                { userId: { [sequelize_1.Op.in]: listUser.map((e) => e.userId) } },
                { companyGroupCode: companyGroupCode },
            ],
        };
        const sendMailList = await this.adminEvaluationRepo.getAllEvaluation(condition);
        const result = await this.adminEvaluationRepo.publicEvaluation(body, companyGroupCode);
        if (sendMailList) {
            this.mailService.sendMailPublicAllEvaluationForUser(sendMailList, host, companyGroupCode);
            this.mailService.sendMailPublicAllEvaluationForEvaluator(sendMailList, host, companyGroupCode);
        }
        return result;
    }
    async evaluationFixed(query, companyGroupCode) {
        const { yearStart, yearEnd } = query;
        const data = await this.adminEvaluationRepo.evaluationFixed(yearStart, yearEnd);
        for (let i = 0; i < data.length; i++) {
            const goalRecord = await this.adminEvaluationRepo.countEvaluationFixed('goal', data[i].id, companyGroupCode);
            const evaluationRecord = await this.adminEvaluationRepo.countEvaluationFixed('evaluation', data[i].id, companyGroupCode);
            const evaluationConfirmRecord = await this.adminEvaluationRepo.countEvaluationFixed('evaluationConfirm', data[i].id, companyGroupCode);
            const totalRecord = await this.adminEvaluationRepo.totalEvaluation(data[i].id, '', companyGroupCode);
            const goalFixedRecord = await this.adminEvaluationRepo.totalEvaluation(data[i].id, 'goal', companyGroupCode);
            const evaluationFixedRecord = await this.adminEvaluationRepo.totalEvaluation(data[i].id, 'evaluation', companyGroupCode);
            const evaluationConfirmFixedRecord = await this.adminEvaluationRepo.totalEvaluation(data[i].id, 'evaluationConfirm', companyGroupCode);
            data[i] = {
                id: data[i].id,
                year: data[i].year,
                periodIndex: data[i].periodIndex,
                goalRecord: goalRecord,
                evaluationRecord: evaluationRecord,
                evaluationConfirmRecord: evaluationConfirmRecord,
                checkFixed: data[i].checkFixed,
                totalRecord: totalRecord,
                goalFixedRecord: goalFixedRecord,
                evaluationFixedRecord: evaluationFixedRecord,
                evaluationConfirmFixedRecord: evaluationConfirmFixedRecord,
                goals: `${data[i].dateCreationGoalStart} ~ ${data[i].dateCreationGoalEnd}`,
                departmentGoals: `${data[i].dateCreationGoalDepartmentStart} ~ ${data[i].dateCreationGoalDepartmentEnd}`,
            };
        }
        return data;
    }
    async undoFixEvaluation(body) {
        const { periodId, type } = body;
        const data = await this.adminEvaluationRepo.findHistoryFixEvaluation(periodId, type);
        if (!data)
            throw new RuntimeException_1.RuntimeException('No data undo', 200);
        const note = data.note === '{""}' ? {} : JSON.parse(data.note);
        const t = await this.adminEvaluationRepo.transactionUndo();
        try {
            await this.adminEvaluationRepo.updateEvaluationPeriod(data.checkFixed, periodId, t);
            if (type === 1) {
                await this.adminEvaluationRepo.undoGoal(note, t);
            }
            if (type === 2) {
                await this.adminEvaluationRepo.undoEvaluation(note, t);
            }
            await this.adminEvaluationRepo.deleteHistoryEvaluationFixed(periodId, t);
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw new RuntimeException_1.RuntimeException('faild', 500);
        }
        return 1;
    }
    async getAllDepartmentsWithSubClass(companyGroupCode) {
        return await this.adminEvaluationRepo.getAllDepartmentsWithSubClass(companyGroupCode);
    }
    async addProSkill(payload, companyGroupCode) {
        return await this.adminEvaluationRepo.addProSkill(payload, companyGroupCode);
    }
    async editProSkill(skillId, payload, companyGroupCode) {
        return await this.adminEvaluationRepo.editProSkill(skillId, payload, companyGroupCode);
    }
    async exportHistoryEvaluation(params, companyGroupCode) {
        const { division = null, department = null, userInfo = null, status = null, yearStart, yearEnd, } = params;
        return await this.adminEvaluationRepo.exportHistoryEvaluation(division, department, userInfo, status, yearStart, yearEnd, companyGroupCode);
    }
    async getDataExcel(params, companyGroupCode, timeZone) {
        return await this.adminEvaluationRepo.getDataExcel(params, companyGroupCode, timeZone);
    }
};
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], AdminEvaluationService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(adminEvaluation_repository_1.AdminEvaluationRepository),
    __metadata("design:type", Object)
], AdminEvaluationService.prototype, "adminEvaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], AdminEvaluationService.prototype, "mailService", void 0);
AdminEvaluationService = __decorate([
    (0, common_1.Injectable)()
], AdminEvaluationService);
exports.AdminEvaluationService = AdminEvaluationService;
//# sourceMappingURL=adminEvaluation.service.js.map