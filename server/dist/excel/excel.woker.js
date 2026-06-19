"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const common_component_excel_1 = require("./common-component-excel");
const Encoding = require('encoding-japanese');
const zip = new JSZip();
function getOffsetHours(timezone) {
    const date = new Date();
    const options = { timeZone: timezone, timeZoneName: 'short' };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(date);
    const match = timeString.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/);
    if (!match)
        return 0;
    const hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    return hours + minutes / 60;
}
process.on('message', async (message) => {
    var _a, _b;
    const { jobId, datas, year, periodIndex, timezone } = message;
    const convertPeriod = (input) => {
        const [start, end] = input.split(' ～ ');
        const format = (str) => {
            const [year, month] = str.split('/');
            return `${year}${month.toString().padStart(2, '0')}`;
        };
        return `${format(start)} ～ ${format(end)}`;
    };
    try {
        const titleHeader = `${year}年${periodIndex == 1 ? '上期' : '下期'}`;
        const batchSize = 50;
        const totalBatches = Math.ceil(datas.length / batchSize);
        let fileNameExcel = '';
        const sheetNameSynthetic = '全体評価結果集計';
        let sheetNamePeriod = '';
        const nowUtc = new Date();
        const offsetHours = getOffsetHours(timezone);
        const localTime = new Date(nowUtc.getTime() + offsetHours * 60 * 60 * 1000);
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const batchData = datas.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize);
            for (let i = 0; i < batchData.length; i++) {
                const workbook = new ExcelJS.Workbook();
                const item = batchData[i];
                fileNameExcel = `【${year}年${periodIndex == 1 ? '上期' : '下期'}】${item.employeeNumber}_${item.fullName}`;
                const hasChilds = Array.isArray(item.childs) && item.childs.length > 0;
                if (hasChilds) {
                    if (item.sameLevel === '1-7' || item.sameLevel === '8-10') {
                        const sheet = workbook.addWorksheet(sheetNameSynthetic);
                        (0, common_component_excel_1.setupSheet)(sheet);
                        (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                        if (item.sameLevel === '1-7') {
                            (0, common_component_excel_1.userInfoSummary)(sheet, item, 6);
                            const lastRowBorder = (0, common_component_excel_1.summaryPersonal)(sheet, item, 6);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                        else if (item.sameLevel === '8-10') {
                            (0, common_component_excel_1.userInfoSummary)(sheet, item, 6);
                            const lastRowBorder = (0, common_component_excel_1.summaryDepartment)(sheet, item, 6);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                    }
                    item.childs.forEach((itemChilds) => {
                        sheetNamePeriod =
                            itemChilds.periodStart + ' ～ ' + itemChilds.periodEnd;
                        const sheet = workbook.addWorksheet(convertPeriod(sheetNamePeriod));
                        (0, common_component_excel_1.setupSheet)(sheet);
                        if (itemChilds.level <= 7) {
                            if (itemChilds.flagSkill == 1) {
                                (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                                const lastRowUserInfor = (0, common_component_excel_1.userInfoDefault)(sheet, itemChilds, 6);
                                (0, common_component_excel_1.totalPersonal)(sheet, '', itemChilds.flagSkill, itemChilds, 6);
                                const typeBasic = 1;
                                const lastRowBasicSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '基本スキル', typeBasic, itemChilds, lastRowUserInfor + 1);
                                const typePro = -1;
                                const lastRowProSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '専門スキル', typePro, itemChilds, lastRowBasicSkill + 1);
                                const typeBehaviorHaveSkill = 2;
                                const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorHaveSkill, itemChilds, lastRowProSkill + 1);
                                const typePersonalGoal1_7 = 1;
                                const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal1_7, itemChilds, lastRowBehaviorSkill + 1);
                                const typeAdditionalGoal1_7 = 1;
                                const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '追加目標／成果', typeAdditionalGoal1_7, itemChilds, lastRowPersonalGoal + 1);
                                const lastRowBorder = (0, common_component_excel_1.comment)(sheet, itemChilds, lastRowAddiionalGoal + 1);
                                (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                            }
                            else {
                                (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                                const lastRowUserInfor = (0, common_component_excel_1.userInfoDefault)(sheet, itemChilds, 6);
                                (0, common_component_excel_1.totalPersonal)(sheet, '', itemChilds.flagSkill, itemChilds, 6);
                                const typeBehaviorNoSkill = 3;
                                const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorNoSkill, itemChilds, lastRowUserInfor + 1);
                                const typePersonalGoal1_7 = 1;
                                const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal1_7, itemChilds, lastRowBehaviorSkill + 1);
                                const typeAdditionalGoal1_7 = 1;
                                const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '追加目標／成果', typeAdditionalGoal1_7, itemChilds, lastRowPersonalGoal + 1);
                                const lastRowBorder = (0, common_component_excel_1.comment)(sheet, itemChilds, lastRowAddiionalGoal + 1);
                                (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                            }
                        }
                        else {
                            (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                            (0, common_component_excel_1.userInfoDefault)(sheet, itemChilds, 6);
                            (0, common_component_excel_1.totalDepartment)(sheet, '部門', itemChilds, 6);
                            (0, common_component_excel_1.totalPersonal)(sheet, '個人', itemChilds.flagSkill, itemChilds, 13);
                            (0, common_component_excel_1.title)(sheet, '部門', 20);
                            const typeGoalDepartment = 3;
                            const lastRowDepartmentGoal = (0, common_component_excel_1.departmentGoal)(sheet, '部門成果', typeGoalDepartment, itemChilds, 22);
                            const typeAdditionalGoalDepartment = 3;
                            const lastRowAddtionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '部門追加目標／成果', typeAdditionalGoalDepartment, itemChilds, lastRowDepartmentGoal + 1);
                            const lastRowTitle = (0, common_component_excel_1.title)(sheet, '個人', lastRowAddtionalGoal + 1);
                            if (itemChilds.flagSkill == 1) {
                                const typeBasic = 4;
                                const lastRowBasicSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '基本スキル', typeBasic, itemChilds, lastRowTitle + 1);
                                const typePro = -1;
                                const lastRowProSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '専門スキル', typePro, itemChilds, lastRowBasicSkill + 1);
                                const typeBehaviorHaveSkill = 5;
                                const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorHaveSkill, itemChilds, lastRowProSkill + 1);
                                const typePersonalGoal = 2;
                                const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal, itemChilds, lastRowBehaviorSkill + 1);
                                const typeAdditionalGoal = 2;
                                const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '個人追加目標／成果', typeAdditionalGoal, itemChilds, lastRowPersonalGoal + 1);
                                const lastRowBorder = (0, common_component_excel_1.comment)(sheet, itemChilds, lastRowAddiionalGoal + 1);
                                (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                            }
                            else {
                                const typeBehaviorNoSkill = 6;
                                const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorNoSkill, itemChilds, lastRowTitle + 1);
                                const typePersonalGoal = 2;
                                const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal, itemChilds, lastRowBehaviorSkill + 1);
                                const typeAdditionalGoal = 2;
                                const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '個人追加目標／成果', typeAdditionalGoal, itemChilds, lastRowPersonalGoal + 1);
                                const lastRowBorder = (0, common_component_excel_1.comment)(sheet, itemChilds, lastRowAddiionalGoal + 1);
                                (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                            }
                        }
                    });
                }
                else {
                    sheetNamePeriod = item.periodStart + ' ～ ' + item.periodEnd;
                    const sheet = workbook.addWorksheet(convertPeriod(sheetNamePeriod));
                    (0, common_component_excel_1.setupSheet)(sheet);
                    if (item.level <= 7) {
                        if (item.flagSkill == 1) {
                            (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                            const lastRowUserInfor = (0, common_component_excel_1.userInfoDefault)(sheet, item, 6);
                            (0, common_component_excel_1.totalPersonal)(sheet, '', item.flagSkill, item, 6);
                            const typeBasic = 1;
                            const lastRowBasicSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '基本スキル', typeBasic, item, lastRowUserInfor + 1);
                            const typePro = -1;
                            const lastRowProSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '専門スキル', typePro, item, lastRowBasicSkill + 1);
                            const typeBehaviorHaveSkill = 2;
                            const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorHaveSkill, item, lastRowProSkill + 1);
                            const typePersonalGoal1_7 = 1;
                            const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal1_7, item, lastRowBehaviorSkill + 1);
                            const typeAdditionalGoal1_7 = 1;
                            const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '追加目標／成果', typeAdditionalGoal1_7, item, lastRowPersonalGoal + 1);
                            const lastRowBorder = (0, common_component_excel_1.comment)(sheet, item, lastRowAddiionalGoal + 1);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                        else {
                            (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                            const lastRowUserInfor = (0, common_component_excel_1.userInfoDefault)(sheet, item, 6);
                            (0, common_component_excel_1.totalPersonal)(sheet, '', item.flagSkill, item, 6);
                            const typeBehaviorNoSkill = 3;
                            const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorNoSkill, item, lastRowUserInfor + 1);
                            const typePersonalGoal1_7 = 1;
                            const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal1_7, item, lastRowBehaviorSkill + 1);
                            const typeAdditionalGoal1_7 = 1;
                            const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '追加目標／成果', typeAdditionalGoal1_7, item, lastRowPersonalGoal + 1);
                            const lastRowBorder = (0, common_component_excel_1.comment)(sheet, item, lastRowAddiionalGoal + 1);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                    }
                    else {
                        (0, common_component_excel_1.titleExcel)(sheet, titleHeader);
                        (0, common_component_excel_1.userInfoDefault)(sheet, item, 6);
                        (0, common_component_excel_1.totalDepartment)(sheet, '部門', item, 6);
                        (0, common_component_excel_1.totalPersonal)(sheet, '個人', item.flagSkill, item, 13);
                        (0, common_component_excel_1.title)(sheet, '部門', 20);
                        const typeGoalDepartment = 3;
                        const lastRowDepartmentGoal = (0, common_component_excel_1.departmentGoal)(sheet, '部門成果', typeGoalDepartment, item, 22);
                        const typeAdditionalGoalDepartment = 3;
                        const lastRowAddtionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '部門追加目標／成果', typeAdditionalGoalDepartment, item, lastRowDepartmentGoal + 1);
                        const lastRowTitle = (0, common_component_excel_1.title)(sheet, '個人', lastRowAddtionalGoal + 1);
                        if (item.flagSkill == 1) {
                            const typeBasic = 4;
                            const lastRowBasicSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '基本スキル', typeBasic, item, lastRowTitle + 1);
                            const typePro = -1;
                            const lastRowProSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '専門スキル', typePro, item, lastRowBasicSkill + 1);
                            const typeBehaviorHaveSkill = 5;
                            const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorHaveSkill, item, lastRowProSkill + 1);
                            const typePersonalGoal = 2;
                            const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal, item, lastRowBehaviorSkill + 1);
                            const typeAdditionalGoal = 2;
                            const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '個人追加目標／成果', typeAdditionalGoal, item, lastRowPersonalGoal + 1);
                            const lastRowBorder = (0, common_component_excel_1.comment)(sheet, item, lastRowAddiionalGoal + 1);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                        else {
                            const typeBehaviorNoSkill = 6;
                            const lastRowBehaviorSkill = (0, common_component_excel_1.basicBehaviorProSkill)(sheet, '行動・情意', typeBehaviorNoSkill, item, lastRowTitle + 1);
                            const typePersonalGoal = 2;
                            const lastRowPersonalGoal = (0, common_component_excel_1.personalGoal)(sheet, '個人成果', typePersonalGoal, item, lastRowBehaviorSkill + 1);
                            const typeAdditionalGoal = 2;
                            const lastRowAddiionalGoal = (0, common_component_excel_1.additionalGoal)(sheet, '個人追加目標／成果', typeAdditionalGoal, item, lastRowPersonalGoal + 1);
                            const lastRowBorder = (0, common_component_excel_1.comment)(sheet, item, lastRowAddiionalGoal + 1);
                            (0, common_component_excel_1.setThickBorder)(sheet, 2, lastRowBorder, 'A', 'AK');
                        }
                    }
                }
                const buffer = await workbook.xlsx.writeBuffer();
                zip.file(`${fileNameExcel}.xlsx`, buffer, { date: localTime });
                process.send({
                    type: 'progress',
                    jobId,
                    percent: Math.floor(((batchIndex * batchSize + i) / datas.length) * 100),
                    file: `${batchIndex * batchSize + (i + 1)} / ${datas.length}`,
                });
            }
        }
        const zipBuffer = await zip.generateAsync({
            type: 'nodebuffer',
            encodeFileName: (name) => Encoding.codeToString(Encoding.convert(name, {
                to: 'SJIS',
                from: 'UNICODE',
                type: 'array',
            })),
        });
        const fileNameZip = `temp-${jobId}.zip`;
        const tempDir = path.join(__dirname, '../../jobs');
        const filePath = path.join(tempDir, fileNameZip);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, zipBuffer);
        (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, { success: true, jobId });
        process.exit(0);
    }
    catch (err) {
        (_b = process.send) === null || _b === void 0 ? void 0 : _b.call(process, { success: false, jobId, error: err.message });
        process.exit(1);
    }
});
//# sourceMappingURL=excel.woker.js.map