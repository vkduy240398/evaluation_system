"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf810Helper2 = void 0;
class Pdf810Helper2 {
    static getHeaderDepartmentGoalTable() {
        const columns = [
            {
                header: '部門目標',
                dataKey: 'title',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '指標・水準\n（達成数値）',
                dataKey: 'achievementValue',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '手段・方法\n（どのように）',
                dataKey: 'method',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: 'ウェイト',
                dataKey: 'weight',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '本人',
                dataKey: 'difficultyUser',
                styles: { valign: 'middle', halign: 'center' },
            },
        ];
        return columns;
    }
    static getDepartmentGoalTableData(evaluation) {
        const results = [];
        evaluation.evaluationAchievementPersonals.map((el) => {
            const list = {
                title: el.title || '',
                achievementValue: el.achievementValue || '',
                method: el.method || '',
                weight: el.weight || 0,
                difficultyUser: el.difficultyUser ? el.difficultyUser.toFixed(1) : '',
            };
            results.push(list);
        });
        return results;
    }
}
exports.Pdf810Helper2 = Pdf810Helper2;
//# sourceMappingURL=Pdf810Helper2.js.map