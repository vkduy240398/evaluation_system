"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setThickBorder = exports.summaryDepartment = exports.summaryPersonal = exports.userInfoSummary = exports.totalDepartment = exports.title = exports.totalPersonal = exports.comment = exports.additionalGoal = exports.departmentGoal = exports.personalGoal = exports.basicBehaviorProSkill = exports.userInfoDefault = exports.titleExcel = exports.setupSheet = void 0;
const setupSheet = (sheet) => {
    for (let i = 1; i <= 37; i++) {
        sheet.getColumn(i).width = 4;
    }
    for (let i = 38; i <= 16384; i++) {
        sheet.getColumn(i).hidden = true;
    }
    sheet.pageSetup.printArea = 'A1:AK50';
};
exports.setupSheet = setupSheet;
const titleExcel = (sheet, title) => {
    sheet.mergeCells('K3:Y4');
    const titleCell = sheet.getCell('K3');
    titleCell.value = `【${title}評価結果】`;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
        name: 'ＭＳ ゴシック',
    };
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '000000' },
    };
};
exports.titleExcel = titleExcel;
const userInfoDefault = (sheet, data, startRow) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const getAccurateRowHeight = (text, totalWidth, fontSize = 11) => {
        if (!text || typeof text !== 'string')
            return 15;
        const pixelsPerCol = totalWidth * 7;
        const lineHeight = fontSize + 4;
        let totalLines = 0;
        for (const line of text.split('\n')) {
            const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
            const pixelsNeeded = visualLength * (fontSize * 0.6);
            const estLines = Math.ceil(pixelsNeeded / pixelsPerCol);
            totalLines += estLines || 1;
        }
        return Math.max(15, totalLines * lineHeight * 0.75);
    };
    const infoMaps = [
        ['社員番号', (_a = data === null || data === void 0 ? void 0 : data.employeeNumber) === null || _a === void 0 ? void 0 : _a.trim()],
        ['氏名', (_b = data === null || data === void 0 ? void 0 : data.fullName) === null || _b === void 0 ? void 0 : _b.trim()],
        ['部署（部）', (_c = data === null || data === void 0 ? void 0 : data.divisionName) === null || _c === void 0 ? void 0 : _c.trim()],
        ['部署（課）', (_d = data === null || data === void 0 ? void 0 : data.departmentName) === null || _d === void 0 ? void 0 : _d.trim()],
        ['等級', data === null || data === void 0 ? void 0 : data.level],
        ['評価対象期間', (data === null || data === void 0 ? void 0 : data.periodStart) + ' ～ ' + (data === null || data === void 0 ? void 0 : data.periodEnd)],
        ['仮評価者', (data === null || data === void 0 ? void 0 : data.evaluator05) ? (_e = data === null || data === void 0 ? void 0 : data.evaluator05) === null || _e === void 0 ? void 0 : _e.fullName : ''],
        ['一次評価者', (data === null || data === void 0 ? void 0 : data.evaluator1) ? (_f = data === null || data === void 0 ? void 0 : data.evaluator1) === null || _f === void 0 ? void 0 : _f.fullName : ''],
        ['二次評価者', (data === null || data === void 0 ? void 0 : data.evaluator2) ? (_g = data === null || data === void 0 ? void 0 : data.evaluator2) === null || _g === void 0 ? void 0 : _g.fullName : ''],
    ];
    const fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    const border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    };
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 5) {
            row.font = { name: 'ＭＳ ゴシック', size: 11 };
        }
    });
    sheet.views = [{ state: 'normal', zoomScale: 100 }];
    let currentRow = startRow;
    for (let i = 0; i < infoMaps.length; i++) {
        const row = startRow + i;
        const [label, value] = infoMaps[i];
        sheet.mergeCells(`B${row}:E${row}`);
        sheet.mergeCells(`F${row}:L${row}`);
        const labelCell = sheet.getCell(`B${row}`);
        const valueCell = sheet.getCell(`F${row}`);
        labelCell.value = label;
        labelCell.fill = fill;
        labelCell.border = border;
        labelCell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true,
        };
        labelCell.font = { name: 'ＭＳ ゴシック', size: 11 };
        valueCell.value = value;
        valueCell.border = border;
        valueCell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true,
        };
        valueCell.font = { name: 'ＭＳ ゴシック', size: 11 };
        let totalWidth = 0;
        for (let col = 6; col <= 12; col++) {
            const colWidth = (_h = sheet.getColumn(col).width) !== null && _h !== void 0 ? _h : 8.43;
            totalWidth += colWidth;
        }
        const valueText = typeof value === 'string' ? value : (_k = (_j = value === null || value === void 0 ? void 0 : value.toString) === null || _j === void 0 ? void 0 : _j.call(value)) !== null && _k !== void 0 ? _k : '';
        const rowHeight = getAccurateRowHeight(valueText, totalWidth, 11);
        sheet.getRow(row).height = rowHeight;
        currentRow++;
    }
    return currentRow;
};
exports.userInfoDefault = userInfoDefault;
const basicBehaviorProSkill = (sheet, title, type, data, startRow) => {
    var _a;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    const listDatas = type == -1
        ? (data === null || data === void 0 ? void 0 : data.listProSKill) || []
        : ((_a = data === null || data === void 0 ? void 0 : data.listBasicBehaviorSkill) === null || _a === void 0 ? void 0 : _a.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === type)) ||
            [];
    const colMap = {
        itemTitle: { start: 2, end: 5 },
        content: { start: 6, end: 22 },
        difficulty: { start: 23, end: 24 },
        pointUser: { start: 25, end: 27 },
        pointEvaluator05: { start: 28, end: 30 },
        pointEvaluator1: { start: 31, end: 33 },
        pointEvaluator2: { start: 34, end: 36 },
        totalLabel: { start: 2, end: 24 },
    };
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const fillHeader = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    const LINE_HEIGHT_PT = 15;
    const getAccurateRowHeight = (text, charPerLine = 40) => {
        if (!text || typeof text !== 'string')
            return LINE_HEIGHT_PT;
        const lines = text.split('\n');
        let totalLines = 0;
        lines.forEach((line) => {
            const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
            const estimatedLines = Math.ceil(visualLength / charPerLine);
            totalLines += estimatedLines;
        });
        return Math.max(LINE_HEIGHT_PT, totalLines * LINE_HEIGHT_PT);
    };
    const setMergedValue = (row, field, value, isLeftAlign = false) => {
        const col = colMap[field];
        if (!col)
            return;
        sheet.mergeCells(row, col.start, row, col.end);
        const cell = sheet.getCell(row, col.start);
        cell.value = value !== null && value !== void 0 ? value : '';
        cell.alignment = {
            vertical: 'middle',
            horizontal: isLeftAlign ? 'left' : 'center',
            wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
    };
    const setSingleMergedValue = (row, colStart, colEnd, value, isLeftAlign = false) => {
        sheet.mergeCells(row, colStart, row, colEnd);
        const cell = sheet.getCell(row, colStart);
        cell.value = value !== null && value !== void 0 ? value : '';
        cell.alignment = {
            vertical: 'middle',
            horizontal: isLeftAlign ? 'left' : 'center',
            wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
    };
    let currentRow = startRow;
    sheet.mergeCells(currentRow, 2, currentRow, 4);
    const titleCell = sheet.getCell(currentRow, 2);
    titleCell.value = title;
    titleCell.fill = fillHeader;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.border = borderAll;
    titleCell.font = defaultFont;
    currentRow++;
    sheet.mergeCells(currentRow, 2, currentRow, 5);
    sheet.mergeCells(currentRow, 6, currentRow, 22);
    sheet.mergeCells(currentRow, 23, currentRow, 24);
    sheet.mergeCells(currentRow, 25, currentRow, 27);
    sheet.mergeCells(currentRow, 28, currentRow, 30);
    sheet.mergeCells(currentRow, 31, currentRow, 33);
    sheet.mergeCells(currentRow, 34, currentRow, 36);
    const headers = [
        { label: '評価項目', col: 2 },
        { label: '評価内容', col: 6 },
        { label: '難易度', col: 23 },
        { label: '本人', col: 25 },
        { label: '仮', col: 28 },
        { label: '一次', col: 31 },
        { label: '二次', col: 34 },
    ];
    headers.forEach((h) => {
        const cell = sheet.getCell(currentRow, h.col);
        cell.value = h.label;
        cell.fill = fillHeader;
        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
        };
        cell.border = borderAll;
        cell.font = defaultFont;
    });
    currentRow++;
    if ((listDatas === null || listDatas === void 0 ? void 0 : listDatas.length) > 0) {
        if (title == '基本スキル' || title == '行動・情意') {
            listDatas.forEach((item) => {
                var _a, _b, _c, _d;
                const title = (_b = (_a = item === null || item === void 0 ? void 0 : item.itemTitle) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
                const content = (_d = (_c = item === null || item === void 0 ? void 0 : item.content) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
                const titleCharPerLine = (colMap.itemTitle.end - colMap.itemTitle.start + 1) * 5.5;
                const contentCharPerLine = (colMap.content.end - colMap.content.start + 1) * 5.5;
                const titleHeight = getAccurateRowHeight(title, titleCharPerLine);
                const contentHeight = getAccurateRowHeight(content, contentCharPerLine);
                sheet.getRow(currentRow).height =
                    Math.max(titleHeight, contentHeight) * 2;
                setMergedValue(currentRow, 'itemTitle', title, true);
                setMergedValue(currentRow, 'content', content, true);
                setMergedValue(currentRow, 'difficulty', item === null || item === void 0 ? void 0 : item.difficulty);
                setMergedValue(currentRow, 'pointUser', (item === null || item === void 0 ? void 0 : item.pointUser) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointUser) +
                        `${' (' +
                            Number((item === null || item === void 0 ? void 0 : item.pointUser) || 0) * Number((item === null || item === void 0 ? void 0 : item.difficulty) || 0) +
                            ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator05', (item === null || item === void 0 ? void 0 : item.pointEvaluator05) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator05) +
                        `${' (' +
                            Number((item === null || item === void 0 ? void 0 : item.pointEvaluator05) || 0) *
                                Number((item === null || item === void 0 ? void 0 : item.difficulty) || 0) +
                            ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator1', (item === null || item === void 0 ? void 0 : item.pointEvaluator1) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator1) +
                        `${' (' +
                            Number((item === null || item === void 0 ? void 0 : item.pointEvaluator1) || 0) *
                                Number((item === null || item === void 0 ? void 0 : item.difficulty) || 0) +
                            ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator2', (item === null || item === void 0 ? void 0 : item.pointEvaluator2) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator2) +
                        `${' (' +
                            Number((item === null || item === void 0 ? void 0 : item.pointEvaluator2) || 0) *
                                Number((item === null || item === void 0 ? void 0 : item.difficulty) || 0) +
                            ')'}`
                    : '');
                currentRow += 1;
            });
        }
        else if (title == '専門スキル') {
            listDatas.forEach((item) => {
                var _a, _b, _c, _d;
                const title = (_b = (_a = item === null || item === void 0 ? void 0 : item.itemTitle) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
                const content = (_d = (_c = item === null || item === void 0 ? void 0 : item.content) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
                const titleCharPerLine = (colMap.itemTitle.end - colMap.itemTitle.start + 1) * 5.5;
                const contentCharPerLine = (colMap.content.end - colMap.content.start + 1) * 5.5;
                const titleHeight = getAccurateRowHeight(title, titleCharPerLine);
                const contentHeight = getAccurateRowHeight(content, contentCharPerLine);
                sheet.getRow(currentRow).height =
                    Math.max(titleHeight, contentHeight) * 2;
                setMergedValue(currentRow, 'itemTitle', title, true);
                setMergedValue(currentRow, 'content', content, true);
                setMergedValue(currentRow, 'difficulty', item === null || item === void 0 ? void 0 : item.difficulty);
                setMergedValue(currentRow, 'pointUser', (item === null || item === void 0 ? void 0 : item.totalPointUser) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointUser) + `${' (' + (item === null || item === void 0 ? void 0 : item.totalPointUser) + ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator05', (item === null || item === void 0 ? void 0 : item.totalPointEvaluator05) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator05) +
                        `${' (' + (item === null || item === void 0 ? void 0 : item.totalPointEvaluator05) + ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator1', (item === null || item === void 0 ? void 0 : item.totalPointEvaluator1) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator1) +
                        `${' (' + (item === null || item === void 0 ? void 0 : item.totalPointEvaluator1) + ')'}`
                    : '');
                setMergedValue(currentRow, 'pointEvaluator2', (item === null || item === void 0 ? void 0 : item.totalPointEvaluator2) !== null
                    ? (item === null || item === void 0 ? void 0 : item.pointEvaluator2) +
                        `${' (' + (item === null || item === void 0 ? void 0 : item.totalPointEvaluator2) + ')'}`
                    : '');
                currentRow += 1;
            });
        }
        if (title == '基本スキル') {
            setSingleMergedValue(currentRow, 2, 24, '小計');
            setSingleMergedValue(currentRow, 25, 27, data === null || data === void 0 ? void 0 : data.basicTotalPointUser);
            setSingleMergedValue(currentRow, 28, 30, (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? data === null || data === void 0 ? void 0 : data.basicTotalPointEvaluator05 : '');
            setSingleMergedValue(currentRow, 31, 33, (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? data === null || data === void 0 ? void 0 : data.basicTotalPointEvaluator1 : '');
            setSingleMergedValue(currentRow, 34, 36, (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? data === null || data === void 0 ? void 0 : data.basicTotalPointEvaluator2 : '');
        }
        else if (title == '行動・情意') {
            setSingleMergedValue(currentRow, 2, 24, '小計');
            setSingleMergedValue(currentRow, 25, 27, data === null || data === void 0 ? void 0 : data.behaviorTotalPointUser);
            setSingleMergedValue(currentRow, 28, 30, (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? data === null || data === void 0 ? void 0 : data.behaviorTotalPointEvaluator05 : '');
            setSingleMergedValue(currentRow, 31, 33, (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? data === null || data === void 0 ? void 0 : data.behaviorTotalPointEvaluator1 : '');
            setSingleMergedValue(currentRow, 34, 36, (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? data === null || data === void 0 ? void 0 : data.behaviorTotalPointEvaluator2 : '');
        }
        else if (title == '専門スキル') {
            setSingleMergedValue(currentRow, 2, 24, '小計');
            setSingleMergedValue(currentRow, 25, 27, data === null || data === void 0 ? void 0 : data.proTotalPointUser);
            setSingleMergedValue(currentRow, 28, 30, (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? data === null || data === void 0 ? void 0 : data.proTotalPointEvaluator05 : '');
            setSingleMergedValue(currentRow, 31, 33, (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? data === null || data === void 0 ? void 0 : data.proTotalPointEvaluator1 : '');
            setSingleMergedValue(currentRow, 34, 36, (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? data === null || data === void 0 ? void 0 : data.proTotalPointEvaluator2 : '');
        }
    }
    else {
        setSingleMergedValue(currentRow, 2, 36, '該当データがありません');
    }
    return currentRow + 1;
};
exports.basicBehaviorProSkill = basicBehaviorProSkill;
const personalGoal = (sheet, title, type, data, startRow) => {
    var _a;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    let currentRow = startRow;
    const listGoals = ((_a = data === null || data === void 0 ? void 0 : data.listGoal) === null || _a === void 0 ? void 0 : _a.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === type)) || [];
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const getRowHeight = (text, charPerLine = 50) => {
        if (!text || typeof text !== 'string')
            return 15;
        const lines = text.split('\n');
        const height = lines.reduce((sum, line) => {
            return sum + Math.ceil(line.length / charPerLine);
        }, 0);
        return height * 15;
    };
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    const titleCell = sheet.getCell(`B${currentRow}`);
    titleCell.value = title;
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    titleCell.border = borderAll;
    titleCell.font = defaultFont;
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    sheet.getRow(currentRow).height = getRowHeight(title);
    currentRow += 1;
    if (!listGoals || listGoals.length === 0) {
        sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
        sheet.getCell(`B${currentRow}`).value = '個人目標';
        sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
        sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
        sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
        sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
        sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
        sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
        sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '難易度';
        sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
        sheet.getCell(`AC${currentRow + 1}`).value = '本人';
        sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
        sheet.getCell(`AE${currentRow + 1}`).value = '仮';
        sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
        sheet.getCell(`AG${currentRow + 1}`).value = '一次';
        sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
        sheet.getCell(`AI${currentRow + 1}`).value = '二次';
        for (let row = currentRow; row <= currentRow + 1; row++) {
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(row, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E2EFDA' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
        }
        currentRow += 2;
        sheet.mergeCells(`B${currentRow}:AJ${currentRow}`);
        const cell = sheet.getCell(`B${currentRow}`);
        cell.value = '該当データがありません';
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderAll;
        cell.font = defaultFont;
        return currentRow + 1;
    }
    listGoals.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f;
        sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
        sheet.getCell(`B${currentRow}`).value = `個人目標（${index + 1}）`;
        sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
        sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
        sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
        sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
        sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
        sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
        sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '難易度';
        sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
        sheet.getCell(`AC${currentRow + 1}`).value = '本人';
        sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
        sheet.getCell(`AE${currentRow + 1}`).value = '仮';
        sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
        sheet.getCell(`AG${currentRow + 1}`).value = '一次';
        sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
        sheet.getCell(`AI${currentRow + 1}`).value = '二次';
        for (let row = currentRow; row <= currentRow + 1; row++) {
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(row, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E2EFDA' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
        }
        currentRow += 2;
        const endRow = currentRow;
        const mergeMap = {
            B: { end: 'G', value: (_a = item.title) === null || _a === void 0 ? void 0 : _a.trim() },
            H: { end: 'M', value: (_b = item.achievementValue) === null || _b === void 0 ? void 0 : _b.trim() },
            N: { end: 'Z', value: (_c = item.method) === null || _c === void 0 ? void 0 : _c.trim() },
            AA: { end: 'AB', value: item.weight },
            AC: {
                end: 'AD',
                value: item.difficultyUser ? Number(item.difficultyUser) : '',
            },
            AE: {
                end: 'AF',
                value: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? item.difficultyEvaluator05
                        ? Number(item.difficultyEvaluator05)
                        : ''
                    : '',
            },
            AG: {
                end: 'AH',
                value: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? item.difficultyEvaluator1
                        ? Number(item.difficultyEvaluator1)
                        : ''
                    : '',
            },
            AI: {
                end: 'AJ',
                value: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? item.difficultyEvaluator2
                        ? Number(item.difficultyEvaluator2)
                        : ''
                    : '',
            },
        };
        Object.entries(mergeMap).forEach(([start, { end, value }]) => {
            sheet.mergeCells(`${start}${currentRow}:${end}${endRow}`);
            const cell = sheet.getCell(`${start}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: ['AA', 'AC', 'AE', 'AG', 'AI'].includes(start)
                    ? 'center'
                    : 'left',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
            if (['AC', 'AE', 'AG', 'AI'].includes(start) &&
                typeof value === 'number') {
                cell.numFmt = '0.0';
            }
        });
        sheet.getRow(currentRow).height = getRowHeight(Object.values(mergeMap)
            .map((m) => m.value)
            .join('\n'));
        currentRow = endRow + 1;
        if (item.goalSub && item.goalSub.length > 0) {
            sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
            sheet.getCell(`B${currentRow}`).value =
                '水準（指標がどのような状態になっているか）';
            sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
            sheet.getCell(`AG${currentRow}`).value = '程度（度合）';
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(currentRow, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'b8d8a5' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
            currentRow += 1;
            item.goalSub.forEach((sub) => {
                var _a, _b;
                sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
                sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
                const cellNote = sheet.getCell(`B${currentRow}`);
                const cellDegree = sheet.getCell(`AG${currentRow}`);
                cellNote.value = (_a = sub.evaluationDecision) === null || _a === void 0 ? void 0 : _a.trim();
                cellNote.alignment = {
                    vertical: 'middle',
                    horizontal: 'left',
                    wrapText: true,
                };
                const degreeNumber = Number(sub.degree);
                const isNumber = !isNaN(degreeNumber) && sub.degree.trim() !== '';
                if (isNumber) {
                    cellDegree.value = degreeNumber;
                    cellDegree.numFmt = '0.0';
                }
                else {
                    cellDegree.value = (_b = sub.degree) === null || _b === void 0 ? void 0 : _b.trim();
                }
                cellDegree.alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true,
                };
                cellNote.border = borderAll;
                cellDegree.border = borderAll;
                cellNote.font = defaultFont;
                cellDegree.font = defaultFont;
                sheet.getRow(currentRow).height = getRowHeight(sub.evaluationDecision);
                currentRow += 1;
            });
        }
        sheet.mergeCells(`B${currentRow}:D${currentRow}`);
        sheet.getCell(`B${currentRow}`).value = `達成・未達成（${index + 1}）`;
        sheet.mergeCells(`E${currentRow}:N${currentRow}`);
        sheet.getCell(`E${currentRow}`).value = '達成理由／未達成理由';
        sheet.mergeCells(`O${currentRow}:AB${currentRow}`);
        sheet.getCell(`O${currentRow}`).value =
            '未達成の場合の達成するためのアクションプラン';
        sheet.mergeCells(`AC${currentRow}:AD${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '本人';
        sheet.mergeCells(`AE${currentRow}:AF${currentRow}`);
        sheet.getCell(`AE${currentRow}`).value = '仮';
        sheet.mergeCells(`AG${currentRow}:AH${currentRow}`);
        sheet.getCell(`AG${currentRow}`).value = '一次';
        sheet.mergeCells(`AI${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AI${currentRow}`).value = '二次';
        for (let col = 2; col <= 36; col++) {
            const cell = sheet.getCell(currentRow, col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'b8d8a5' },
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
        }
        const getHeaderRowHeight = (text, charPerLine = 50) => {
            const visualLength = text.replace(/[^\x00-\xff]/g, 'aa').length;
            const lines = Math.ceil(visualLength / charPerLine);
            return Math.max(15, lines * 15);
        };
        const longestHeaderText = '未達成の場合の達成するためのアクションプラン';
        sheet.getRow(currentRow).height = getHeaderRowHeight(longestHeaderText, 40);
        currentRow += 1;
        const t3End = currentRow;
        const table3Map = {
            B: { end: 'D', value: (_d = item.achievementStatus) === null || _d === void 0 ? void 0 : _d.trim() },
            E: { end: 'N', value: (_e = item.reasonComment) === null || _e === void 0 ? void 0 : _e.trim() },
            O: { end: 'AB', value: (_f = item.actionPlan) === null || _f === void 0 ? void 0 : _f.trim() },
            AC: { end: 'AD', value: item.pointUser },
            AE: {
                end: 'AF',
                value: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? item.pointEvaluator05 : '',
            },
            AG: {
                end: 'AH',
                value: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? item.pointEvaluator1 : '',
            },
            AI: {
                end: 'AJ',
                value: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? item.pointEvaluator2 : '',
            },
        };
        Object.entries(table3Map).forEach(([start, { end, value }]) => {
            sheet.mergeCells(`${start}${currentRow}:${end}${t3End}`);
            const cell = sheet.getCell(`${start}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: ['AC', 'AE', 'AG', 'AI'].includes(start)
                    ? 'center'
                    : 'left',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
        });
        sheet.getRow(currentRow).height = getRowHeight(Object.values(table3Map)
            .map((m) => m.value)
            .join('\n'));
        currentRow = t3End + 1;
    });
    sheet.mergeCells(`B${currentRow}:AB${currentRow}`);
    const subtotalCell = sheet.getCell(`B${currentRow}`);
    subtotalCell.value = '小計';
    subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalCell.border = borderAll;
    subtotalCell.font = defaultFont;
    const subtotalValues = {
        AC: data.achievementPersonalTotalPointUser !== null
            ? Math.round(data.achievementPersonalTotalPointUser)
            : '',
        AE: data.achievementPersonalTotalPointEvaluator05 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator05)
            : '',
        AG: data.achievementPersonalTotalPointEvaluator1 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator1)
            : '',
        AI: data.achievementPersonalTotalPointEvaluator2 !== null
            ? Math.round(data.achievementPersonalTotalPointEvaluator2)
            : '',
    };
    Object.entries(subtotalValues).forEach(([startCol, value]) => {
        const endCol = {
            AC: 'AD',
            AE: 'AF',
            AG: 'AH',
            AI: 'AJ',
        }[startCol];
        sheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
        const cell = sheet.getCell(`${startCol}${currentRow}`);
        cell.value = value;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderAll;
        cell.font = defaultFont;
    });
    return currentRow + 1;
};
exports.personalGoal = personalGoal;
const departmentGoal = (sheet, title, type, data, startRow) => {
    var _a;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    let currentRow = startRow;
    const listGoals = ((_a = data === null || data === void 0 ? void 0 : data.listGoal) === null || _a === void 0 ? void 0 : _a.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === type)) || [];
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const getRowHeight = (text, charPerLine = 50) => {
        if (!text || typeof text !== 'string')
            return 15;
        const lines = text.split('\n');
        const height = lines.reduce((sum, line) => {
            return sum + Math.ceil(line.length / charPerLine);
        }, 0);
        return height * 16;
    };
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    const titleCell = sheet.getCell(`B${currentRow}`);
    titleCell.value = title;
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    titleCell.border = borderAll;
    titleCell.font = defaultFont;
    titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    sheet.getRow(currentRow).height = getRowHeight(title);
    currentRow += 1;
    if (!listGoals || listGoals.length === 0) {
        sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
        sheet.getCell(`B${currentRow}`).value = '部門目標';
        sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
        sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
        sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
        sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
        sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
        sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
        sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '難易度';
        sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
        sheet.getCell(`AC${currentRow + 1}`).value = '本人';
        sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
        sheet.getCell(`AE${currentRow + 1}`).value = '仮';
        sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
        sheet.getCell(`AG${currentRow + 1}`).value = '一次';
        sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
        sheet.getCell(`AI${currentRow + 1}`).value = '二次';
        for (let row = currentRow; row <= currentRow + 1; row++) {
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(row, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E2EFDA' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
        }
        currentRow += 2;
        sheet.mergeCells(`B${currentRow}:AJ${currentRow}`);
        const cell = sheet.getCell(`B${currentRow}`);
        cell.value = '該当データがありません';
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderAll;
        cell.font = defaultFont;
        return currentRow + 1;
    }
    listGoals.forEach((item, index) => {
        var _a, _b, _c, _d, _e, _f;
        sheet.mergeCells(`B${currentRow}:G${currentRow + 1}`);
        sheet.getCell(`B${currentRow}`).value = `部門目標（${index + 1}）`;
        sheet.mergeCells(`H${currentRow}:M${currentRow + 1}`);
        sheet.getCell(`H${currentRow}`).value = '指標・水準（達成数値）';
        sheet.mergeCells(`N${currentRow}:Z${currentRow + 1}`);
        sheet.getCell(`N${currentRow}`).value = '手段・方法（どのように）';
        sheet.mergeCells(`AA${currentRow}:AB${currentRow + 1}`);
        sheet.getCell(`AA${currentRow}`).value = 'ウェイト';
        sheet.mergeCells(`AC${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '難易度';
        sheet.mergeCells(`AC${currentRow + 1}:AD${currentRow + 1}`);
        sheet.getCell(`AC${currentRow + 1}`).value = '本人';
        sheet.mergeCells(`AE${currentRow + 1}:AF${currentRow + 1}`);
        sheet.getCell(`AE${currentRow + 1}`).value = '仮';
        sheet.mergeCells(`AG${currentRow + 1}:AH${currentRow + 1}`);
        sheet.getCell(`AG${currentRow + 1}`).value = '一次';
        sheet.mergeCells(`AI${currentRow + 1}:AJ${currentRow + 1}`);
        sheet.getCell(`AI${currentRow + 1}`).value = '二次';
        for (let row = currentRow; row <= currentRow + 1; row++) {
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(row, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E2EFDA' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
        }
        currentRow += 2;
        const endRow = currentRow;
        const mergeMap = {
            B: { end: 'G', value: (_a = item.title) === null || _a === void 0 ? void 0 : _a.trim() },
            H: { end: 'M', value: (_b = item.achievementValue) === null || _b === void 0 ? void 0 : _b.trim() },
            N: { end: 'Z', value: (_c = item.method) === null || _c === void 0 ? void 0 : _c.trim() },
            AA: { end: 'AB', value: item.weight },
            AC: {
                end: 'AD',
                value: item.difficultyUser ? item.difficultyUser : '',
            },
            AE: {
                end: 'AF',
                value: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? item.difficultyEvaluator05
                        ? item.difficultyEvaluator05
                        : ''
                    : '',
            },
            AG: {
                end: 'AH',
                value: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? item.difficultyEvaluator1
                        ? item.difficultyEvaluator1
                        : ''
                    : '',
            },
            AI: {
                end: 'AJ',
                value: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? item.difficultyEvaluator2
                        ? item.difficultyEvaluator2
                        : ''
                    : '',
            },
        };
        Object.entries(mergeMap).forEach(([start, { end, value }]) => {
            sheet.mergeCells(`${start}${currentRow}:${end}${endRow}`);
            const cell = sheet.getCell(`${start}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: ['AA', 'AC', 'AE', 'AG', 'AI'].includes(start)
                    ? 'center'
                    : 'left',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
            if (['AC', 'AE', 'AG', 'AI'].includes(start) &&
                typeof value === 'number') {
                cell.numFmt = '0.0';
            }
        });
        sheet.getRow(currentRow).height = getRowHeight(Object.values(mergeMap)
            .map((m) => m.value)
            .join('\n'));
        currentRow = endRow + 1;
        if (item.goalSub && item.goalSub.length > 0) {
            sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
            sheet.getCell(`B${currentRow}`).value =
                '水準（指標がどのような状態になっているか）';
            sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
            sheet.getCell(`AG${currentRow}`).value = '係数';
            for (let col = 2; col <= 36; col++) {
                const cell = sheet.getCell(currentRow, col);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'b8d8a5' },
                };
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.border = borderAll;
                cell.font = defaultFont;
            }
            currentRow += 1;
            item.goalSub.forEach((sub) => {
                var _a, _b;
                sheet.mergeCells(`B${currentRow}:AF${currentRow}`);
                sheet.mergeCells(`AG${currentRow}:AJ${currentRow}`);
                const cellNote = sheet.getCell(`B${currentRow}`);
                const cellDegree = sheet.getCell(`AG${currentRow}`);
                cellNote.value = (_a = sub.evaluationDecision) === null || _a === void 0 ? void 0 : _a.trim();
                cellNote.alignment = {
                    vertical: 'middle',
                    horizontal: 'left',
                    wrapText: true,
                };
                const degreeNumber = Number(sub.coefficient);
                const isNumber = !isNaN(degreeNumber) && sub.coefficient.trim() !== '';
                if (isNumber) {
                    cellDegree.value = degreeNumber;
                    cellDegree.numFmt = '0.0';
                }
                else {
                    cellDegree.value = (_b = sub.degree) === null || _b === void 0 ? void 0 : _b.trim();
                }
                cellDegree.alignment = {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true,
                };
                cellNote.border = borderAll;
                cellDegree.border = borderAll;
                cellNote.font = defaultFont;
                cellDegree.font = defaultFont;
                sheet.getRow(currentRow).height = getRowHeight(sub.evaluationDecision);
                currentRow += 1;
            });
        }
        sheet.mergeCells(`B${currentRow}:D${currentRow}`);
        sheet.getCell(`B${currentRow}`).value = `達成・未達成（${index + 1}）`;
        sheet.mergeCells(`E${currentRow}:L${currentRow}`);
        sheet.getCell(`E${currentRow}`).value = '達成理由／未達成理由';
        sheet.mergeCells(`M${currentRow}:T${currentRow}`);
        sheet.getCell(`M${currentRow}`).value =
            '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載';
        sheet.mergeCells(`U${currentRow}:V${currentRow}`);
        sheet.getCell(`U${currentRow}`).value = '本人\n(点数)';
        sheet.mergeCells(`W${currentRow}:X${currentRow}`);
        sheet.getCell(`W${currentRow}`).value = '本人\n(係数)';
        sheet.mergeCells(`Y${currentRow}:Z${currentRow}`);
        sheet.getCell(`Y${currentRow}`).value = '仮\n(点数)';
        sheet.mergeCells(`AA${currentRow}:AB${currentRow}`);
        sheet.getCell(`AA${currentRow}`).value = '仮\n(係数)';
        sheet.mergeCells(`AC${currentRow}:AD${currentRow}`);
        sheet.getCell(`AC${currentRow}`).value = '一次\n(点数)';
        sheet.mergeCells(`AE${currentRow}:AF${currentRow}`);
        sheet.getCell(`AE${currentRow}`).value = '一次\n(係数)';
        sheet.mergeCells(`AG${currentRow}:AH${currentRow}`);
        sheet.getCell(`AG${currentRow}`).value = '二次\n(点数)';
        sheet.mergeCells(`AI${currentRow}:AJ${currentRow}`);
        sheet.getCell(`AI${currentRow}`).value = '二次\n(係数)';
        for (let col = 2; col <= 36; col++) {
            const cell = sheet.getCell(currentRow, col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'b8d8a5' },
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
        }
        const getHeaderRowHeight = (text, charPerLine = 30) => {
            const visualLength = text.replace(/[^\x00-\xff]/g, 'aa').length;
            const lines = Math.ceil(visualLength / charPerLine);
            return Math.max(40, lines * 18);
        };
        const longestHeaderText = '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載';
        sheet.getRow(currentRow).height = getHeaderRowHeight(longestHeaderText, 30);
        currentRow += 1;
        const t3End = currentRow;
        const table3Map = {
            B: { end: 'D', value: (_d = item.achievementStatus) === null || _d === void 0 ? void 0 : _d.trim() },
            E: { end: 'L', value: (_e = item.reasonComment) === null || _e === void 0 ? void 0 : _e.trim() },
            M: { end: 'T', value: (_f = item.actionPlan) === null || _f === void 0 ? void 0 : _f.trim() },
            U: { end: 'V', value: item.pointUser },
            W: {
                end: 'X',
                value: item.coefficientUser ? item.coefficientUser : '',
            },
            Y: {
                end: 'Z',
                value: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? item.pointEvaluator05 : '',
            },
            AA: {
                end: 'AB',
                value: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? item.coefficientEvaluator05
                        ? item.coefficientEvaluator05
                        : ''
                    : '',
            },
            AC: {
                end: 'AD',
                value: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? item.pointEvaluator1 : '',
            },
            AE: {
                end: 'AF',
                value: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? item.coefficientEvaluator1
                        ? item.coefficientEvaluator1
                        : ''
                    : '',
            },
            AG: {
                end: 'AH',
                value: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? item.pointEvaluator2 : '',
            },
            AI: {
                end: 'AJ',
                value: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? item.coefficientEvaluator2
                        ? item.coefficientEvaluator2
                        : ''
                    : '',
            },
        };
        Object.entries(table3Map).forEach(([start, { end, value }]) => {
            sheet.mergeCells(`${start}${currentRow}:${end}${t3End}`);
            const cell = sheet.getCell(`${start}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: ['U', 'W', 'Y', 'AA', 'AC', 'AE', 'AG', 'AI'].includes(start)
                    ? 'center'
                    : 'left',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
            if (['W', 'AA', 'AE', 'AI'].includes(start) &&
                typeof value === 'number') {
                cell.numFmt = '0.0';
            }
        });
        sheet.getRow(currentRow).height = getRowHeight(Object.values(table3Map)
            .map((m) => m.value)
            .join('\n'));
        currentRow = t3End + 1;
    });
    sheet.mergeCells(`B${currentRow}:T${currentRow}`);
    const subtotalCell = sheet.getCell(`B${currentRow}`);
    subtotalCell.value = '小計';
    subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subtotalCell.border = borderAll;
    subtotalCell.font = defaultFont;
    const columnPairs = {
        U: 'V',
        W: 'X',
        Y: 'Z',
        AA: 'AB',
        AC: 'AD',
        AE: 'AF',
        AG: 'AH',
        AI: 'AJ',
    };
    const subtotalValues = {
        U: '',
        W: data.summaryDepartment !== null
            ? data.summaryDepartment.achievementPersonalTotalPointUser
                ? data.summaryDepartment.achievementPersonalTotalPointUser
                : ''
            : '',
        Y: '',
        AA: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
            ? data.summaryDepartment !== null
                ? data.summaryDepartment.achievementPersonalTotalPointEvaluator05
                    ? data.summaryDepartment.achievementPersonalTotalPointEvaluator05
                    : ''
                : ''
            : '',
        AC: '',
        AE: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
            ? data.summaryDepartment !== null
                ? data.summaryDepartment.achievementPersonalTotalPointEvaluator1
                    ? data.summaryDepartment.achievementPersonalTotalPointEvaluator1
                    : ''
                : ''
            : '',
        AG: '',
        AI: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
            ? data.summaryDepartment !== null
                ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2
                    ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2
                    : ''
                : ''
            : '',
    };
    Object.keys(subtotalValues).forEach((startCol) => {
        const endCol = columnPairs[startCol];
        sheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
        const cell = sheet.getCell(`${startCol}${currentRow}`);
        cell.value = subtotalValues[startCol];
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderAll;
        cell.font = defaultFont;
    });
    return currentRow + 1;
};
exports.departmentGoal = departmentGoal;
const additionalGoal = (sheet, title, type, data, startRow) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    const listGoals = ((_a = data === null || data === void 0 ? void 0 : data.listGoalAdditional) === null || _a === void 0 ? void 0 : _a.filter((f) => (f === null || f === void 0 ? void 0 : f.type) === type)) || [];
    const estimateLineCount = (text, widthCols) => {
        if (!text || typeof text !== 'string')
            return 1;
        const lines = text.split('\n');
        const charPerLine = widthCols * 2.2;
        let total = 0;
        for (const line of lines) {
            const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
            total += Math.ceil(visualLength / charPerLine);
        }
        return Math.max(1, total);
    };
    const headerFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    const border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    sheet.mergeCells(`B${startRow}:G${startRow}`);
    const titleCell = sheet.getCell(`B${startRow}`);
    titleCell.value = title;
    titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
    titleCell.fill = headerFill;
    titleCell.border = border;
    titleCell.font = defaultFont;
    startRow++;
    const headerRow = startRow;
    sheet.mergeCells(`B${headerRow}:G${headerRow}`);
    sheet.mergeCells(`H${headerRow}:J${headerRow}`);
    sheet.mergeCells(`K${headerRow}:AB${headerRow}`);
    sheet.mergeCells(`AC${headerRow}:AD${headerRow}`);
    sheet.mergeCells(`AE${headerRow}:AF${headerRow}`);
    sheet.mergeCells(`AG${headerRow}:AH${headerRow}`);
    sheet.mergeCells(`AI${headerRow}:AJ${headerRow}`);
    const headers = [
        ['B', 'その他特記事項'],
        ['H', '達成／未達成'],
        ['K', '理由および本人コメント'],
        ['AC', '本人'],
        ['AE', '仮'],
        ['AG', '一次'],
        ['AI', '二次'],
    ];
    for (const [col, label] of headers) {
        const cell = sheet.getCell(`${col}${headerRow}`);
        cell.value = label;
        cell.fill = headerFill;
        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
        };
        cell.border = border;
        cell.font = defaultFont;
    }
    startRow++;
    if (!listGoals || listGoals.length === 0) {
        sheet.mergeCells(`B${startRow}:AJ${startRow}`);
        const cell = sheet.getCell(`B${startRow}`);
        cell.value = '該当データがありません';
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = border;
        cell.font = defaultFont;
        return startRow + 1;
    }
    for (const row of listGoals) {
        sheet.mergeCells(`B${startRow}:G${startRow}`);
        sheet.mergeCells(`H${startRow}:J${startRow}`);
        sheet.mergeCells(`K${startRow}:AB${startRow}`);
        sheet.mergeCells(`AC${startRow}:AD${startRow}`);
        sheet.mergeCells(`AE${startRow}:AF${startRow}`);
        sheet.mergeCells(`AG${startRow}:AH${startRow}`);
        sheet.mergeCells(`AI${startRow}:AJ${startRow}`);
        const setCell = (col, value, align) => {
            const cell = sheet.getCell(`${col}${startRow}`);
            cell.value = value || '';
            cell.alignment = {
                horizontal: align,
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = border;
            cell.font = defaultFont;
        };
        setCell('B', (_b = row.titleAdditional) === null || _b === void 0 ? void 0 : _b.trim(), 'left');
        setCell('H', (_c = row.achievementStatus) === null || _c === void 0 ? void 0 : _c.trim(), 'center');
        setCell('K', (_d = row.reasonComment) === null || _d === void 0 ? void 0 : _d.trim(), 'left');
        setCell('AC', row.pointUser, 'center');
        setCell('AE', (data === null || data === void 0 ? void 0 : data.evaluator05) !== null ? row.pointEvaluator05 : '', 'center');
        setCell('AG', (data === null || data === void 0 ? void 0 : data.evaluator1) !== null ? row.pointEvaluator1 : '', 'center');
        setCell('AI', (data === null || data === void 0 ? void 0 : data.evaluator2) !== null ? row.pointEvaluator2 : '', 'center');
        const linesB = estimateLineCount(row.titleAdditional || '', 6);
        const linesK = estimateLineCount(row.reasonComment || '', 18);
        const maxLines = Math.max(linesB, linesK);
        sheet.getRow(startRow).height = Math.min(120, maxLines * 15);
        startRow++;
    }
    if (type === 1 || type === 2) {
        sheet.mergeCells(`B${startRow}:AB${startRow}`);
        const subtotalCell = sheet.getCell(`B${startRow}`);
        subtotalCell.value = '小計';
        subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
        subtotalCell.border = border;
        subtotalCell.font = defaultFont;
        const subtotalMergeMap = {
            AC: 'AD',
            AE: 'AF',
            AG: 'AH',
            AI: 'AJ',
        };
        const subtotalValues = {
            AC: data.achievementAdditionalTotalPointUser !== null
                ? Math.floor(data.achievementAdditionalTotalPointUser)
                : '',
            AE: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                ? data.achievementAdditionalTotalPointEvaluator05 !== null
                    ? Math.floor(data.achievementAdditionalTotalPointEvaluator05)
                    : ''
                : '',
            AG: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                ? data.achievementAdditionalTotalPointEvaluator1 !== null
                    ? Math.floor(data.achievementAdditionalTotalPointEvaluator1)
                    : ''
                : '',
            AI: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                ? data.achievementAdditionalTotalPointEvaluator2 !== null
                    ? Math.floor(data.achievementAdditionalTotalPointEvaluator2)
                    : ''
                : '',
        };
        for (const col in subtotalValues) {
            const toCol = subtotalMergeMap[col];
            sheet.mergeCells(`${col}${startRow}:${toCol}${startRow}`);
            const cell = sheet.getCell(`${col}${startRow}`);
            cell.value = subtotalValues[col];
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = border;
            cell.font = defaultFont;
        }
    }
    else if (type === 3) {
        const get2WithoutRound = (num) => {
            let temp = '';
            if (num) {
                temp = num.toString();
                temp = temp.slice(0, temp.indexOf('.') + 3);
            }
            return Number(temp);
        };
        sheet.mergeCells(`B${startRow}:AB${startRow}`);
        const subtotalCell = sheet.getCell(`B${startRow}`);
        subtotalCell.value = '小計';
        subtotalCell.alignment = { horizontal: 'center', vertical: 'middle' };
        subtotalCell.border = border;
        subtotalCell.font = defaultFont;
        const subtotalMergeMap = {
            AC: 'AD',
            AE: 'AF',
            AG: 'AH',
            AI: 'AJ',
        };
        const subtotalValues = {
            AC: data.summaryDepartment !== null
                ? ((_e = data.summaryDepartment) === null || _e === void 0 ? void 0 : _e.achievementAdditionalTotalPointUser) !== null
                    ? get2WithoutRound((_f = data.summaryDepartment) === null || _f === void 0 ? void 0 : _f.achievementAdditionalTotalPointUser)
                    : ''
                : '',
            AE: data.summaryDepartment !== null
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? ((_g = data.summaryDepartment) === null || _g === void 0 ? void 0 : _g.achievementAdditionalTotalPointEvaluator05) !== null
                        ? get2WithoutRound((_h = data.summaryDepartment) === null || _h === void 0 ? void 0 : _h.achievementAdditionalTotalPointEvaluator05)
                        : ''
                    : ''
                : '',
            AG: data.summaryDepartment !== null
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? ((_j = data.summaryDepartment) === null || _j === void 0 ? void 0 : _j.achievementAdditionalTotalPointEvaluator1) !== null
                        ? get2WithoutRound((_k = data.summaryDepartment) === null || _k === void 0 ? void 0 : _k.achievementAdditionalTotalPointEvaluator1)
                        : ''
                    : ''
                : '',
            AI: data.summaryDepartment !== null
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? ((_l = data.summaryDepartment) === null || _l === void 0 ? void 0 : _l.achievementAdditionalTotalPointEvaluator2) !== null
                        ? get2WithoutRound((_m = data.summaryDepartment) === null || _m === void 0 ? void 0 : _m.achievementAdditionalTotalPointEvaluator2)
                        : ''
                    : ''
                : '',
        };
        for (const col in subtotalValues) {
            const toCol = subtotalMergeMap[col];
            sheet.mergeCells(`${col}${startRow}:${toCol}${startRow}`);
            const cell = sheet.getCell(`${col}${startRow}`);
            cell.value = subtotalValues[col];
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = border;
            cell.font = defaultFont;
        }
    }
    return startRow + 1;
};
exports.additionalGoal = additionalGoal;
const comment = (sheet, data, startRow) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    const user = { comment: ((_a = data.commentUser) === null || _a === void 0 ? void 0 : _a.trim()) || '' };
    const evaluator05 = {
        comment: ((_c = (_b = data === null || data === void 0 ? void 0 : data.evaluator05) === null || _b === void 0 ? void 0 : _b.commentPublic) === null || _c === void 0 ? void 0 : _c.trim()) || '',
    };
    const evaluator1 = { comment: ((_e = (_d = data === null || data === void 0 ? void 0 : data.evaluator1) === null || _d === void 0 ? void 0 : _d.commentPublic) === null || _e === void 0 ? void 0 : _e.trim()) || '' };
    const evaluator2 = { comment: ((_g = (_f = data === null || data === void 0 ? void 0 : data.evaluator2) === null || _f === void 0 ? void 0 : _f.commentPublic) === null || _g === void 0 ? void 0 : _g.trim()) || '' };
    const headerFill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    const border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    };
    const alignLeftWrap = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true,
    };
    const blocks = [
        { title: '本人コメント', value: user === null || user === void 0 ? void 0 : user.comment },
        { title: '仮コメント', value: evaluator05 === null || evaluator05 === void 0 ? void 0 : evaluator05.comment },
        { title: '一次コメント', value: evaluator1 === null || evaluator1 === void 0 ? void 0 : evaluator1.comment },
        { title: '二次コメント', value: evaluator2 === null || evaluator2 === void 0 ? void 0 : evaluator2.comment },
    ];
    const estimateHeight = (text, colCount = 35) => {
        if (!text || typeof text !== 'string')
            return 15;
        const lines = text.split('\n');
        let totalLines = 0;
        const charPerLine = colCount * 2;
        for (const line of lines) {
            const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
            totalLines += Math.ceil(visualLength / charPerLine);
        }
        return Math.max(15, totalLines * 15);
    };
    for (const block of blocks) {
        const titleRange = `B${startRow}:E${startRow}`;
        sheet.mergeCells(titleRange);
        const titleCell = sheet.getCell(`B${startRow}`);
        titleCell.value = block.title;
        titleCell.fill = headerFill;
        titleCell.alignment = alignLeftWrap;
        titleCell.border = border;
        titleCell.font = defaultFont;
        const contentRow = startRow + 1;
        const contentRange = `B${contentRow}:AJ${contentRow}`;
        sheet.mergeCells(contentRange);
        const contentCell = sheet.getCell(`B${contentRow}`);
        if ((_h = block.value) === null || _h === void 0 ? void 0 : _h.trim()) {
            contentCell.value = block.value;
        }
        else {
            contentCell.value = '該当データがありません';
        }
        contentCell.alignment = alignLeftWrap;
        contentCell.border = border;
        contentCell.font = defaultFont;
        sheet.getRow(contentRow).height = estimateHeight(contentCell.value, 50);
        startRow += 2;
    }
    return startRow;
};
exports.comment = comment;
const totalPersonal = (sheet, title, flagSkill, data, startRow) => {
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    const handleTotal = (total) => {
        return total !== null ? Math.round(total) : null;
    };
    const skillPercent = (data === null || data === void 0 ? void 0 : data.skillPercent) || 0;
    const behaviorPercent = (data === null || data === void 0 ? void 0 : data.behaviorPercent) || 0;
    const achievementPercent = (data === null || data === void 0 ? void 0 : data.achievementPercent) || 0;
    const percent100 = parseInt(skillPercent) +
        parseInt(behaviorPercent) +
        parseInt(achievementPercent);
    const isDisplayData = percent100 == 100 ? true : false;
    const listPoints = [
        {
            title: '本人',
            skillPoint: isDisplayData
                ? data.basicProTotalPointUser !== null
                    ? Math.round(data.basicProTotalPointUser)
                    : null
                : '',
            skillPecent: isDisplayData ? `${data === null || data === void 0 ? void 0 : data.skillPercent}%` : '',
            behaviorPoint: isDisplayData
                ? data.behaviorTotalPointUser !== null
                    ? Math.round(data.behaviorTotalPointUser)
                    : null
                : '',
            behaviorPecent: isDisplayData ? `${data === null || data === void 0 ? void 0 : data.behaviorPercent}%` : '',
            personalPoint: isDisplayData
                ? data.achievementPersonalTotalPointUser !== null
                    ? Math.round(data.achievementPersonalTotalPointUser)
                    : null
                : '',
            personalPecent: isDisplayData ? `${data === null || data === void 0 ? void 0 : data.achievementPercent}%` : '',
            additionPoint: isDisplayData
                ? data.achievementAdditionalTotalPointUser !== null
                    ? Math.round(data.achievementAdditionalTotalPointUser)
                    : null
                : '',
            totalPoint: isDisplayData ? handleTotal(data.summaryPointUser) : '',
        },
        {
            title: '仮',
            skillPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? data.basicProTotalPointEvaluator05 !== null
                        ? Math.round(data.basicProTotalPointEvaluator05)
                        : null
                    : ''
                : '',
            skillPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.skillPercent}%`
                    : ''
                : '',
            behaviorPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? data.behaviorTotalPointEvaluator05 !== null
                        ? Math.round(data.behaviorTotalPointEvaluator05)
                        : null
                    : ''
                : '',
            behaviorPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.behaviorPercent}%`
                    : ''
                : '',
            personalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? data.achievementPersonalTotalPointEvaluator05 !== null
                        ? Math.round(data.achievementPersonalTotalPointEvaluator05)
                        : null
                    : ''
                : '',
            personalPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.achievementPercent}%`
                    : ''
                : '',
            additionPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? data.achievementAdditionalTotalPointEvaluator05 !== null
                        ? Math.round(data.achievementAdditionalTotalPointEvaluator05)
                        : null
                    : ''
                : '',
            totalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                    ? handleTotal(data.summaryPointEvaluator05)
                    : ''
                : '',
        },
        {
            title: '一次',
            skillPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? data.basicProTotalPointEvaluator1 !== null
                        ? Math.round(data.basicProTotalPointEvaluator1)
                        : null
                    : ''
                : '',
            skillPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.skillPercent}%`
                    : ''
                : '',
            behaviorPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? data.behaviorTotalPointEvaluator1 !== null
                        ? Math.round(data.behaviorTotalPointEvaluator1)
                        : null
                    : ''
                : '',
            behaviorPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.behaviorPercent}%`
                    : ''
                : '',
            personalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? data.achievementPersonalTotalPointEvaluator1 !== null
                        ? Math.round(data.achievementPersonalTotalPointEvaluator1)
                        : null
                    : ''
                : '',
            personalPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.achievementPercent}%`
                    : ''
                : '',
            additionPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? data.achievementAdditionalTotalPointEvaluator1 !== null
                        ? Math.round(data.achievementAdditionalTotalPointEvaluator1)
                        : null
                    : ''
                : '',
            totalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                    ? handleTotal(data.summaryPointEvaluator1)
                    : ''
                : '',
        },
        {
            title: '二次',
            skillPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? data.basicProTotalPointEvaluator2 !== null
                        ? Math.round(data.basicProTotalPointEvaluator2)
                        : null
                    : ''
                : '',
            skillPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.skillPercent}%`
                    : ''
                : '',
            behaviorPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? data.behaviorTotalPointEvaluator2 !== null
                        ? Math.round(data.behaviorTotalPointEvaluator2)
                        : null
                    : ''
                : '',
            behaviorPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.behaviorPercent}%`
                    : ''
                : '',
            personalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? data.achievementPersonalTotalPointEvaluator2 !== null
                        ? Math.round(data.achievementPersonalTotalPointEvaluator2)
                        : null
                    : ''
                : '',
            personalPecent: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? `${data === null || data === void 0 ? void 0 : data.achievementPercent}%`
                    : ''
                : '',
            additionPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? data.achievementAdditionalTotalPointEvaluator2 !== null
                        ? Math.round(data.achievementAdditionalTotalPointEvaluator2)
                        : null
                    : ''
                : '',
            totalPoint: isDisplayData
                ? (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                    ? handleTotal(data.summaryPointEvaluator2)
                    : ''
                : '',
        },
    ];
    const getRowHeight = (text, charPerLine = 10) => {
        if (!text || typeof text !== 'string')
            return 15;
        const lines = text.split('\n');
        const height = lines.reduce((sum, line) => {
            return sum + Math.ceil(line.length / charPerLine);
        }, 0);
        return Math.max(height, 1) * 15;
    };
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const fillHeader = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' },
    };
    const headerRow = startRow;
    if (flagSkill == 1) {
        const headers = [
            { label: title, start: 'N', end: 'O' },
            { label: 'スキル評価計', start: 'P', end: 'R' },
            { label: 'ウェイト', start: 'S', end: 'T' },
            { label: '行動・情意評価計', start: 'U', end: 'W' },
            { label: 'ウェイト', start: 'X', end: 'Y' },
            { label: '成果評価計', start: 'Z', end: 'AB' },
            { label: 'ウェイト', start: 'AC', end: 'AD' },
            { label: '追加目標・成果', start: 'AE', end: 'AG' },
            { label: '総計', start: 'AH', end: 'AJ' },
        ];
        headers.forEach(({ label, start, end }) => {
            sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
            const cell = sheet.getCell(`${start}${headerRow}`);
            cell.value = label;
            cell.fill = fillHeader;
            cell.border = borderAll;
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.font = defaultFont;
        });
        let row = headerRow + 2;
        listPoints.forEach((item) => {
            var _a;
            const rowHeight = getRowHeight(item.title);
            sheet.mergeCells(`N${row}:O${row}`);
            const cellSS = sheet.getCell(`N${row}`);
            cellSS.value = (_a = item.title) === null || _a === void 0 ? void 0 : _a.trim();
            cellSS.fill = fillHeader;
            cellSS.border = borderAll;
            cellSS.font = defaultFont;
            cellSS.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            const cellsMap = [
                { value: item.skillPoint, range: `P${row}:R${row}` },
                { value: item.skillPecent, range: `S${row}:T${row}` },
                { value: item.behaviorPoint, range: `U${row}:W${row}` },
                { value: item.behaviorPecent, range: `X${row}:Y${row}` },
                { value: item.personalPoint, range: `Z${row}:AB${row}` },
                { value: item.personalPecent, range: `AC${row}:AD${row}` },
                { value: item.additionPoint, range: `AE${row}:AG${row}` },
                { value: item.totalPoint, range: `AH${row}:AJ${row}` },
            ];
            cellsMap.forEach(({ value, range }) => {
                sheet.mergeCells(range);
                const cell = sheet.getCell(range.split(':')[0]);
                if (typeof value === 'string' && value.includes('%')) {
                    const numeric = parseFloat(value.replace('%', '')) / 100;
                    cell.value = numeric;
                    cell.numFmt = '0%';
                }
                else {
                    cell.value = value;
                }
                cell.border = borderAll;
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.font = defaultFont;
            });
            sheet.getRow(row).height = rowHeight;
            row += 1;
        });
        return row;
    }
    else {
        const headers = [
            { label: title, start: 'N', end: 'O' },
            { label: '行動・情意評価計', start: 'P', end: 'S' },
            { label: 'ウェイト', start: 'T', end: 'V' },
            { label: '成果評価計', start: 'W', end: 'Z' },
            { label: 'ウェイト', start: 'AA', end: 'AC' },
            { label: '追加目標・成果', start: 'AD', end: 'AG' },
            { label: '総計', start: 'AH', end: 'AJ' },
        ];
        headers.forEach(({ label, start, end }) => {
            sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
            const cell = sheet.getCell(`${start}${headerRow}`);
            cell.value = label;
            cell.fill = fillHeader;
            cell.border = borderAll;
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.font = defaultFont;
        });
        let row = headerRow + 2;
        listPoints.forEach((item) => {
            const rowHeight = getRowHeight(item.title);
            sheet.mergeCells(`N${row}:O${row}`);
            const cellSS = sheet.getCell(`N${row}`);
            cellSS.value = item.title;
            cellSS.fill = fillHeader;
            cellSS.border = borderAll;
            cellSS.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cellSS.font = defaultFont;
            const cellsMap = [
                { value: item.behaviorPoint, range: `P${row}:S${row}` },
                { value: item.behaviorPecent, range: `T${row}:V${row}` },
                { value: item.personalPoint, range: `W${row}:Z${row}` },
                { value: item.personalPecent, range: `AA${row}:AC${row}` },
                { value: item.additionPoint, range: `AD${row}:AG${row}` },
                { value: item.totalPoint, range: `AH${row}:AJ${row}` },
            ];
            cellsMap.forEach(({ value, range }) => {
                sheet.mergeCells(range);
                const cell = sheet.getCell(range.split(':')[0]);
                if (typeof value === 'string' && value.includes('%')) {
                    const numeric = parseFloat(value.replace('%', '')) / 100;
                    cell.value = numeric;
                    cell.numFmt = '0%';
                }
                else {
                    cell.value = value;
                }
                cell.border = borderAll;
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true,
                };
                cell.font = defaultFont;
            });
            sheet.getRow(row).height = rowHeight;
            row += 1;
        });
        return row;
    }
};
exports.totalPersonal = totalPersonal;
const title = (sheet, title, startRow) => {
    const titleCell = sheet.getCell(`B${startRow}`);
    titleCell.value = title;
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.font = {
        bold: true,
        color: { argb: 'FF00703C' },
        size: 16,
        name: 'ＭＳ ゴシック',
    };
    return startRow + 1;
};
exports.title = title;
const totalDepartment = (sheet, title, data, startRow) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    const get2WithoutRound = (num) => {
        let temp = '';
        if (num) {
            temp = num.toString();
            temp = temp.slice(0, temp.indexOf('.') + 3);
        }
        return Number(temp);
    };
    const listPoints = [
        {
            title: '本人',
            achievementPersonalTotalPoint: data.summaryDepartment !== null
                ? ((_a = data.summaryDepartment) === null || _a === void 0 ? void 0 : _a.achievementPersonalTotalPointUser) !== null
                    ? Number((_b = data.summaryDepartment) === null || _b === void 0 ? void 0 : _b.achievementPersonalTotalPointUser).toFixed(2)
                    : ''
                : '',
            achievementAdditionalTotalPoint: data.summaryDepartment !== null
                ? ((_c = data.summaryDepartment) === null || _c === void 0 ? void 0 : _c.achievementAdditionalTotalPointUser) !== null
                    ? get2WithoutRound((_d = data.summaryDepartment) === null || _d === void 0 ? void 0 : _d.achievementAdditionalTotalPointUser)
                    : ''
                : '',
            summaryPoint: data.summaryDepartment !== null
                ? ((_e = data.summaryDepartment) === null || _e === void 0 ? void 0 : _e.summaryPointUser) !== null
                    ? (_f = data.summaryDepartment) === null || _f === void 0 ? void 0 : _f.summaryPointUser
                    : ''
                : '',
            summaryCharPoint: data.summaryDepartment !== null
                ? ((_g = data.summaryDepartment) === null || _g === void 0 ? void 0 : _g.summaryCharPointUser) !== null
                    ? (_h = data.summaryDepartment) === null || _h === void 0 ? void 0 : _h.summaryCharPointUser
                    : ''
                : '',
        },
        {
            title: '仮',
            achievementPersonalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                ? data.summaryDepartment !== null
                    ? ((_j = data.summaryDepartment) === null || _j === void 0 ? void 0 : _j.achievementPersonalTotalPointEvaluator05) !== null
                        ? Number((_k = data.summaryDepartment) === null || _k === void 0 ? void 0 : _k.achievementPersonalTotalPointEvaluator05).toFixed(2)
                        : ''
                    : ''
                : '',
            achievementAdditionalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                ? data.summaryDepartment !== null
                    ? ((_l = data.summaryDepartment) === null || _l === void 0 ? void 0 : _l.achievementAdditionalTotalPointEvaluator05) !== null
                        ? get2WithoutRound((_m = data.summaryDepartment) === null || _m === void 0 ? void 0 : _m.achievementAdditionalTotalPointEvaluator05)
                        : ''
                    : ''
                : '',
            summaryPoint: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                ? data.summaryDepartment !== null
                    ? ((_o = data.summaryDepartment) === null || _o === void 0 ? void 0 : _o.summaryPointEvaluator05) !== null
                        ? (_p = data.summaryDepartment) === null || _p === void 0 ? void 0 : _p.summaryPointEvaluator05
                        : ''
                    : ''
                : '',
            summaryCharPoint: (data === null || data === void 0 ? void 0 : data.evaluator05) !== null
                ? data.summaryDepartment !== null
                    ? ((_q = data.summaryDepartment) === null || _q === void 0 ? void 0 : _q.summaryCharPointEvaluator05) !== null
                        ? (_r = data.summaryDepartment) === null || _r === void 0 ? void 0 : _r.summaryCharPointEvaluator05
                        : ''
                    : ''
                : '',
        },
        {
            title: '一次',
            achievementPersonalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                ? data.summaryDepartment !== null
                    ? ((_s = data.summaryDepartment) === null || _s === void 0 ? void 0 : _s.achievementPersonalTotalPointEvaluator1) !== null
                        ? Number((_t = data.summaryDepartment) === null || _t === void 0 ? void 0 : _t.achievementPersonalTotalPointEvaluator1).toFixed(2)
                        : ''
                    : ''
                : '',
            achievementAdditionalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                ? data.summaryDepartment !== null
                    ? ((_u = data.summaryDepartment) === null || _u === void 0 ? void 0 : _u.achievementAdditionalTotalPointEvaluator1) !== null
                        ? get2WithoutRound((_v = data.summaryDepartment) === null || _v === void 0 ? void 0 : _v.achievementAdditionalTotalPointEvaluator1)
                        : ''
                    : ''
                : '',
            summaryPoint: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                ? data.summaryDepartment !== null
                    ? ((_w = data.summaryDepartment) === null || _w === void 0 ? void 0 : _w.summaryPointEvaluator1) !== null
                        ? (_x = data.summaryDepartment) === null || _x === void 0 ? void 0 : _x.summaryPointEvaluator1
                        : ''
                    : ''
                : '',
            summaryCharPoint: (data === null || data === void 0 ? void 0 : data.evaluator1) !== null
                ? data.summaryDepartment !== null
                    ? ((_y = data.summaryDepartment) === null || _y === void 0 ? void 0 : _y.summaryCharPointEvaluator1) !== null
                        ? (_z = data.summaryDepartment) === null || _z === void 0 ? void 0 : _z.summaryCharPointEvaluator1
                        : ''
                    : ''
                : '',
        },
        {
            title: '二次',
            achievementPersonalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                ? data.summaryDepartment !== null
                    ? data.summaryDepartment.achievementPersonalTotalPointEvaluator2 !==
                        null
                        ? Number(data.summaryDepartment
                            .achievementPersonalTotalPointEvaluator2).toFixed(2)
                        : ''
                    : ''
                : '',
            achievementAdditionalTotalPoint: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                ? data.summaryDepartment !== null
                    ? ((_0 = data.summaryDepartment) === null || _0 === void 0 ? void 0 : _0.achievementAdditionalTotalPointEvaluator2) !== null
                        ? get2WithoutRound((_1 = data.summaryDepartment) === null || _1 === void 0 ? void 0 : _1.achievementAdditionalTotalPointEvaluator2)
                        : ''
                    : ''
                : '',
            summaryPoint: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                ? data.summaryDepartment !== null
                    ? ((_2 = data.summaryDepartment) === null || _2 === void 0 ? void 0 : _2.summaryPointEvaluator2) !== null
                        ? (_3 = data.summaryDepartment) === null || _3 === void 0 ? void 0 : _3.summaryPointEvaluator2
                        : ''
                    : ''
                : '',
            summaryCharPoint: (data === null || data === void 0 ? void 0 : data.evaluator2) !== null
                ? data.summaryDepartment !== null
                    ? ((_4 = data.summaryDepartment) === null || _4 === void 0 ? void 0 : _4.summaryCharPointEvaluator2) !== null
                        ? (_5 = data.summaryDepartment) === null || _5 === void 0 ? void 0 : _5.summaryCharPointEvaluator2
                        : ''
                    : ''
                : '',
        },
    ];
    const getRowHeight = (text, charPerLine = 10) => {
        if (!text || typeof text !== 'string')
            return 15;
        const lines = text.split('\n');
        const height = lines.reduce((sum, line) => {
            return sum + Math.ceil(line.length / charPerLine);
        }, 0);
        return Math.max(height, 1) * 15;
    };
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const fillHeader = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' },
    };
    const headerRow = startRow;
    const headers = [
        { label: title, start: 'N', end: 'P' },
        { label: '部門成果', start: 'Q', end: 'U' },
        { label: '追加目標・成果', start: 'V', end: 'Z' },
        { label: '部門評価計', start: 'AA', end: 'AE' },
        { label: '個人評価', start: 'AF', end: 'AJ' },
    ];
    headers.forEach(({ label, start, end }) => {
        sheet.mergeCells(`${start}${headerRow}:${end}${headerRow + 1}`);
        const cell = sheet.getCell(`${start}${headerRow}`);
        cell.value = label;
        cell.fill = fillHeader;
        cell.border = borderAll;
        cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
        };
        cell.font = defaultFont;
    });
    let row = headerRow + 2;
    listPoints.forEach((item) => {
        const rowHeight = getRowHeight(item.title);
        sheet.mergeCells(`N${row}:P${row}`);
        const cellSS = sheet.getCell(`N${row}`);
        cellSS.value = item.title;
        cellSS.fill = fillHeader;
        cellSS.border = borderAll;
        cellSS.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
        };
        cellSS.font = defaultFont;
        const cellsMap = [
            {
                key: 'achievementPersonalTotalPoint',
                value: item.achievementPersonalTotalPoint,
                range: `Q${row}:U${row}`,
            },
            {
                key: 'achievementAdditionalTotalPoint',
                value: item.achievementAdditionalTotalPoint,
                range: `V${row}:Z${row}`,
            },
            {
                key: 'summaryPoint',
                value: item.summaryPoint,
                range: `AA${row}:AE${row}`,
            },
            {
                key: 'summaryCharPoint',
                value: item.summaryCharPoint,
                range: `AF${row}:AJ${row}`,
            },
        ];
        cellsMap.forEach(({ key, value, range }) => {
            sheet.mergeCells(range);
            const cell = sheet.getCell(range.split(':')[0]);
            if (key === 'achievementPersonalTotalPoint') {
                const num = Number(value);
                if (!isNaN(num) && value !== '') {
                    cell.value = num;
                    cell.numFmt = '0.00';
                }
                else {
                    cell.value = value;
                }
            }
            else if (key === 'summaryPoint') {
                const num = Number(value);
                if (!isNaN(num) && value !== '') {
                    cell.value = num;
                    cell.numFmt = '0.0';
                }
                else {
                    cell.value = value;
                }
            }
            else {
                cell.value = value;
            }
            cell.border = borderAll;
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.font = defaultFont;
        });
        sheet.getRow(row).height = rowHeight;
        row += 1;
    });
    return row;
};
exports.totalDepartment = totalDepartment;
const userInfoSummary = (sheet, data, startRow) => {
    var _a, _b, _c, _d, _e;
    const getAccurateRowHeight = (text, totalWidth, fontSize = 11) => {
        if (!text || typeof text !== 'string')
            return 15;
        const pixelsPerCol = totalWidth * 7;
        const lineHeight = fontSize + 4;
        let totalLines = 0;
        for (const line of text.split('\n')) {
            const visualLength = line.replace(/[^\x00-\xff]/g, 'aa').length;
            const pixelsNeeded = visualLength * (fontSize * 0.6);
            const estLines = Math.ceil(pixelsNeeded / pixelsPerCol);
            totalLines += estLines || 1;
        }
        return Math.max(15, totalLines * lineHeight * 0.75);
    };
    const infoMaps = [
        ['社員番号', (_a = data === null || data === void 0 ? void 0 : data.employeeNumber) === null || _a === void 0 ? void 0 : _a.trim()],
        ['氏名', (_b = data === null || data === void 0 ? void 0 : data.fullName) === null || _b === void 0 ? void 0 : _b.trim()],
    ];
    const fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E2EFDA' },
    };
    const border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
    };
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 5) {
            row.font = { name: 'ＭＳ ゴシック', size: 11 };
        }
    });
    sheet.views = [{ state: 'normal', zoomScale: 100 }];
    let currentRow = startRow;
    for (let i = 0; i < infoMaps.length; i++) {
        const row = startRow + i;
        const [label, value] = infoMaps[i];
        sheet.mergeCells(`B${row}:E${row}`);
        sheet.mergeCells(`F${row}:L${row}`);
        const labelCell = sheet.getCell(`B${row}`);
        const valueCell = sheet.getCell(`F${row}`);
        labelCell.value = label;
        labelCell.fill = fill;
        labelCell.border = border;
        labelCell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true,
        };
        labelCell.font = { name: 'ＭＳ ゴシック', size: 11 };
        valueCell.value = value;
        valueCell.border = border;
        valueCell.alignment = {
            vertical: 'middle',
            horizontal: 'left',
            wrapText: true,
        };
        valueCell.font = { name: 'ＭＳ ゴシック', size: 11 };
        let totalWidth = 0;
        for (let col = 6; col <= 12; col++) {
            const colWidth = (_c = sheet.getColumn(col).width) !== null && _c !== void 0 ? _c : 8.43;
            totalWidth += colWidth;
        }
        const valueText = typeof value === 'string' ? value : (_e = (_d = value === null || value === void 0 ? void 0 : value.toString) === null || _d === void 0 ? void 0 : _d.call(value)) !== null && _e !== void 0 ? _e : '';
        const rowHeight = getAccurateRowHeight(valueText, totalWidth, 11);
        sheet.getRow(row).height = rowHeight;
        currentRow++;
    }
    return currentRow;
};
exports.userInfoSummary = userInfoSummary;
const summaryPersonal = (sheet, data, startRow) => {
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    let total = 0;
    const results = [];
    const sortData = data.childs.sort((a, b) => {
        const dateA = new Date(a.periodStart);
        const dateB = new Date(b.periodStart);
        if (dateA < dateB) {
            return 1;
        }
        if (dateA > dateB) {
            return -1;
        }
        return 0;
    });
    sortData.map((evaluation) => {
        results.push({
            periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
            basicProTotalPointEvaluator: evaluation.basicProTotalPointEvaluator2 !== null
                ? Math.round(evaluation.basicProTotalPointEvaluator2)
                : null,
            behaviorTotalPointEvaluator: evaluation.behaviorTotalPointEvaluator2 !== null
                ? Math.round(evaluation.behaviorTotalPointEvaluator2)
                : null,
            achievementPersonalTotalPointEvaluator: evaluation.achievementPersonalTotalPointEvaluator2 !== null
                ? Math.round(evaluation.achievementPersonalTotalPointEvaluator2)
                : null,
            achievementAdditionalTotalPointEvaluator: evaluation.achievementAdditionalTotalPointEvaluator2 !== null
                ? Math.round(evaluation.achievementAdditionalTotalPointEvaluator2)
                : null,
            summaryPointEvaluator: evaluation.summaryPointEvaluator2 !== null
                ? Math.round(evaluation.summaryPointEvaluator2)
                : null,
        });
        total +=
            evaluation.summaryPointEvaluator2 *
                (evaluation.percentPoint === null ? 1 : evaluation.percentPoint / 100);
    });
    results.push({
        periodTime: '評価結果',
        basicProTotalPointEvaluator: '',
        behaviorTotalPointEvaluator: '',
        achievementPersonalTotalPointEvaluator: '',
        achievementAdditionalTotalPointEvaluator: '',
        summaryPointEvaluator: total ? Math.round(total) : '',
    });
    let currentRow = startRow;
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const headerBgColor = 'FFE2EFDA';
    sheet.mergeCells(`N${currentRow}:Q${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '';
    sheet.mergeCells(`R${currentRow}:U${currentRow + 1}`);
    sheet.getCell(`R${currentRow}`).value = 'スキル評価計';
    sheet.mergeCells(`V${currentRow}:Y${currentRow + 1}`);
    sheet.getCell(`V${currentRow}`).value = '行動・情意評価計';
    sheet.mergeCells(`Z${currentRow}:AC${currentRow + 1}`);
    sheet.getCell(`Z${currentRow}`).value = '成果評価計';
    sheet.mergeCells(`AD${currentRow}:AG${currentRow + 1}`);
    sheet.getCell(`AD${currentRow}`).value = '追加目標・成果';
    sheet.mergeCells(`AH${currentRow}:AJ${currentRow + 1}`);
    sheet.getCell(`AH${currentRow}`).value = '総計';
    for (let row = currentRow; row <= currentRow + 1; row++) {
        for (let col = 14; col <= 36; col++) {
            const cell = sheet.getCell(row, col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: headerBgColor },
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
        }
    }
    currentRow += 2;
    results.forEach((item) => {
        var _a;
        const titleValue = ((_a = item.periodTime) === null || _a === void 0 ? void 0 : _a.includes('～')) && !item.periodTime.includes('\n')
            ? item.periodTime.replace('～', '～\n')
            : item.periodTime;
        const map = {
            N: { end: 'Q', value: titleValue },
            R: { end: 'U', value: item.basicProTotalPointEvaluator },
            V: { end: 'Y', value: item.behaviorTotalPointEvaluator },
            Z: { end: 'AC', value: item.achievementPersonalTotalPointEvaluator },
            AD: { end: 'AG', value: item.achievementAdditionalTotalPointEvaluator },
            AH: { end: 'AJ', value: item.summaryPointEvaluator },
        };
        Object.entries(map).forEach(([startCol, { end, value }]) => {
            sheet.mergeCells(`${startCol}${currentRow}:${end}${currentRow}`);
            const cell = sheet.getCell(`${startCol}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: startCol === 'N',
            };
            cell.border = borderAll;
            cell.font = defaultFont;
            if (startCol === 'N') {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: headerBgColor },
                };
                cell.font = defaultFont;
            }
        });
        const lines = String(titleValue).split('\n').length;
        sheet.getRow(currentRow).height = 15 * lines;
        currentRow += 1;
    });
    return currentRow;
};
exports.summaryPersonal = summaryPersonal;
const summaryDepartment = (sheet, data, startRow) => {
    const defaultFont = { name: 'ＭＳ ゴシック', size: 11 };
    let total = 0;
    const results = [];
    const sortData = data.childs.sort((a, b) => {
        const dateA = new Date(a.periodStart);
        const dateB = new Date(b.periodStart);
        if (dateA < dateB) {
            return 1;
        }
        if (dateA > dateB) {
            return -1;
        }
        return 0;
    });
    sortData.map((evaluation) => {
        var _a, _b, _c;
        results.push({
            periodTime: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
            summaryCharPointEvaluator: evaluation.summaryDepartment == null
                ? null
                : (_a = evaluation.summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryCharPointEvaluator2,
            summaryPointEvaluator: evaluation.summaryDepartment == null
                ? null
                : (_b = evaluation.summaryDepartment) === null || _b === void 0 ? void 0 : _b.summaryPointEvaluator2,
        });
        total +=
            ((_c = evaluation.summaryDepartment) === null || _c === void 0 ? void 0 : _c.summaryPointEvaluator2) *
                (evaluation.percentPoint === null ? 1 : evaluation.percentPoint / 100);
    });
    results.push({
        periodTime: '評価結果',
        summaryCharPointEvaluator: '',
        summaryPointEvaluator: total
            ? Number((Math.round(Number(total) * 10) / 10).toFixed(1))
            : '',
    });
    let currentRow = startRow;
    const borderAll = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    const headerBgColor = 'FFE2EFDA';
    sheet.mergeCells(`N${currentRow}:U${currentRow + 1}`);
    sheet.getCell(`N${currentRow}`).value = '';
    sheet.mergeCells(`V${currentRow}:AC${currentRow + 1}`);
    sheet.getCell(`V${currentRow}`).value = '部門評価計';
    sheet.mergeCells(`AD${currentRow}:AJ${currentRow + 1}`);
    sheet.getCell(`AD${currentRow}`).value = '個人評価';
    for (let row = currentRow; row <= currentRow + 1; row++) {
        for (let col = 14; col <= 36; col++) {
            const cell = sheet.getCell(row, col);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: headerBgColor },
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true,
            };
            cell.border = borderAll;
            cell.font = defaultFont;
        }
    }
    currentRow += 2;
    results.forEach((item) => {
        const titleValue = item.periodTime;
        const map = {
            N: { end: 'U', value: titleValue },
            V: { end: 'AC', value: item.summaryPointEvaluator },
            AD: { end: 'AJ', value: item.summaryCharPointEvaluator },
        };
        Object.entries(map).forEach(([startCol, { end, value }]) => {
            sheet.mergeCells(`${startCol}${currentRow}:${end}${currentRow}`);
            const cell = sheet.getCell(`${startCol}${currentRow}`);
            cell.value = value !== null && value !== void 0 ? value : '';
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: startCol === 'N',
            };
            cell.font = defaultFont;
            cell.border = borderAll;
            if (startCol === 'N') {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: headerBgColor },
                };
            }
            if (startCol === 'V') {
                cell.numFmt = '0.0';
            }
        });
        const lines = String(titleValue).split('\n').length;
        sheet.getRow(currentRow).height = 15 * lines;
        currentRow += 1;
    });
    return currentRow;
};
exports.summaryDepartment = summaryDepartment;
const setThickBorder = (sheet, startRow, endRow, startColLetter, endColLetter) => {
    const colLetterToNumber = (letter) => {
        let colNum = 0;
        for (let i = 0; i < letter.length; i++) {
            colNum = colNum * 26 + (letter.charCodeAt(i) - 64);
        }
        return colNum;
    };
    const startCol = colLetterToNumber(startColLetter);
    const endCol = colLetterToNumber(endColLetter);
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const cell = sheet.getCell(row, col);
            let border = cell.border || {};
            if (row === startRow) {
                border.top = { style: 'thick', color: { argb: '000000' } };
            }
            if (row === endRow) {
                border.bottom = { style: 'thick', color: { argb: '000000' } };
            }
            if (col === startCol) {
                border.left = { style: 'thick', color: { argb: '000000' } };
            }
            if (col === endCol) {
                border.right = { style: 'thick', color: { argb: '000000' } };
            }
            cell.border = border;
        }
    }
};
exports.setThickBorder = setThickBorder;
//# sourceMappingURL=common-component-excel.js.map