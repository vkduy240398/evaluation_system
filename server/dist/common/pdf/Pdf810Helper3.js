"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf810Helper3 = void 0;
const Pdf810Helper_1 = require("./Pdf810Helper");
const util_1 = require("../util");
class Pdf810Helper3 {
    static getHeaderSummaryTable() {
        const results = [
            [
                {
                    content: '',
                    styles: { valign: 'middle', halign: 'center' },
                },
                {
                    content: '部門成果',
                    styles: { valign: 'middle', halign: 'center' },
                },
                { content: '追加成果', styles: { valign: 'middle', halign: 'center' } },
                {
                    content: '部門評価計',
                    styles: { valign: 'middle', halign: 'center' },
                },
                {
                    content: '個人評価',
                    styles: { valign: 'middle', halign: 'center' },
                },
            ],
        ];
        return results;
    }
    static getSummaryTableData(evaluation) {
        var _a;
        const results = [
            [
                '二次評価',
                Number(evaluation.achievementPersonalTotalPointEvaluator2).toFixed(2),
                (_a = Pdf810Helper_1.Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalTotalPointEvaluator2)) !== null && _a !== void 0 ? _a : '',
                evaluation.summaryPointEvaluator2
                    ? Number(evaluation.summaryPointEvaluator2).toFixed(1)
                    : '',
                evaluation.summaryCharPointEvaluator2,
            ],
        ];
        return results;
    }
    static getHeaderDepartmentGoalTable(status) {
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
        ];
        if (status > 50) {
            columns.push({
                header: '二次評価',
                dataKey: 'difficultyEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            });
        }
        return columns;
    }
    static getDepartmentGoalTableData(evaluationAchievementPersonal) {
        const results = [];
        const list = {
            title: evaluationAchievementPersonal.title || '',
            achievementValue: evaluationAchievementPersonal.achievementValue || '',
            method: evaluationAchievementPersonal.method || '',
            weight: evaluationAchievementPersonal.weight || 0,
            difficultyEvaluator2: evaluationAchievementPersonal.difficultyEvaluator2
                ? Number(evaluationAchievementPersonal.difficultyEvaluator2).toFixed(1)
                : '',
        };
        results.push(list);
        return results;
    }
    static getSubListData(evaluationAchievementPersonal, subList) {
        const achievementPersonalsubList = subList.filter((value) => {
            return value.achievementPersonalId === evaluationAchievementPersonal.id;
        });
        const results = [];
        achievementPersonalsubList.map((el) => {
            const list = {
                coefficient: (0, util_1.formatNumber)(el.coefficient) || '',
                evaluationDecision: el.evaluationDecision || '',
            };
            results.push(list);
        });
        return results;
    }
    static getHeaderDepartmentAchievementTable() {
        const results = [
            {
                header: '達成 / 未達成',
                dataKey: 'achievementStatus',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '達成理由・未達成理由',
                dataKey: 'reasonComment',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '達成するためのアクションプラン記載・ミス発生などインシデント内容の記載',
                dataKey: 'actionPlan',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '二次評価(点数)',
                dataKey: 'pointEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '二次評価(係数)',
                dataKey: 'coefficientEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            },
        ];
        return results;
    }
    static getDepartmentAchievementTableData(evaluation) {
        const results = [];
        evaluation.evaluationAchievementPersonals.map((el) => {
            const list = {
                achievementStatus: el.achievementStatus || '',
                reasonComment: el.reasonComment || '',
                actionPlan: el.actionPlan || '',
                pointUser: el.pointUser || 0,
                coefficientUser: el.coefficientUser || 0,
                pointEvaluator05: el.pointEvaluator05 || 0,
                coefficientEvaluator05: el.coefficientEvaluator05 || 0,
                pointEvaluator1: el.pointEvaluator1 || 0,
                coefficientEvaluator1: el.coefficientEvaluator1 || 0,
                pointEvaluator2: el.pointEvaluator2 || 0,
                coefficientEvaluator2: el.coefficientEvaluator2 || 0,
            };
            results.push(list);
        });
        return results;
    }
    static getHeaderAdditionalTable() {
        const results = [
            {
                header: 'その他特記項目	',
                dataKey: 'titleAdditional',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '達成/未達成',
                dataKey: 'achievementStatus',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '理由および本人コメント',
                dataKey: 'reasonComment',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '二次',
                dataKey: 'pointEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            },
        ];
        return results;
    }
    static getAdditionalTableData(evaluation) {
        const results = [];
        evaluation.evaluationAchievementAdditional.map((el) => {
            const list = {
                titleAdditional: el.titleAdditional || '',
                achievementStatus: el.achievementStatus || '',
                reasonComment: el.reasonComment || '',
                pointUser: el.pointUser || 0,
                pointEvaluator05: el.pointEvaluator05 || 0,
                pointEvaluator1: el.pointEvaluator1 || 0,
                pointEvaluator2: el.pointEvaluator2 || 0,
            };
            results.push(list);
        });
        return results;
    }
    static getEvaluatorByOrder(evaluators, order) {
        const filter = evaluators.filter((el) => el.evaluationOrder.toString() === order);
        if (filter.length === 0) {
            return null;
        }
        return filter[0];
    }
}
exports.Pdf810Helper3 = Pdf810Helper3;
//# sourceMappingURL=Pdf810Helper3.js.map