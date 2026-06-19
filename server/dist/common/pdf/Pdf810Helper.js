"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf810Helper = void 0;
class Pdf810Helper {
    static getHeaderSummaryTable() {
        const results = [
            [
                {
                    content: '',
                    styles: { valign: 'middle', halign: 'center' },
                },
                {
                    content: '部署評価',
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
    static getSummaryTableData(evaluation, exist05, exist1, exist2) {
        const results = [
            [],
        ];
        if (exist2)
            results.push([
                '二次',
                evaluation.summaryPointEvaluator2
                    ? evaluation.summaryPointEvaluator2.toFixed(1)
                    : '',
                evaluation.summaryCharPointEvaluator2,
            ]);
        return results;
    }
    static getHeaderDepartmentGoalTable(exist05, exist1, exist2) {
        const buffList = [];
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
                header: '二次',
                dataKey: 'difficultyEvaluator2',
                styles: { align: 'center' },
            },
        ].filter((v) => {
            if (!exist05)
                buffList.push('difficultyEvaluator05');
            if (!exist1)
                buffList.push('difficultyEvaluator1');
            if (!exist2)
                buffList.push('difficultyEvaluator2');
            return !buffList.includes(v.dataKey);
        });
        return columns;
    }
    static getDepartmentGoalTableData(evaluation) {
        const results = [];
        evaluation.evaluationAchievementPersonals.map((el) => {
            const list = {
                title: el.title || '',
                achievementValue: el.achievementValue || '',
                method: el.method || '',
                weight: el.weight || '',
                difficultyEvaluator2: el.difficultyEvaluator2
                    ? el.difficultyEvaluator2.toFixed(1)
                    : '',
            };
            results.push(list);
        });
        return results;
    }
    static getHeaderDepartmentAchievementTable(exist05, exist1, exist2) {
        const buffList2s = [];
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
                header: '二次（点数）',
                dataKey: 'pointEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            },
            {
                header: '二次（係数）',
                dataKey: 'coefficientEvaluator2',
                styles: { valign: 'middle', halign: 'center' },
            },
        ].filter((v) => {
            if (!exist2)
                buffList2s.push('pointEvaluator2', 'coefficientEvaluator2');
            return !buffList2s.includes(v.dataKey);
        });
        return results;
    }
    static getDepartmentAchievementTableData(evaluation) {
        const results = [];
        evaluation.evaluationAchievementPersonals.map((el) => {
            const list = {
                achievementStatus: el.achievementStatus || '',
                reasonComment: el.reasonComment || '',
                actionPlan: el.actionPlan || '',
                pointEvaluator2: el.pointEvaluator2 || '',
                coefficientEvaluator2: el.coefficientEvaluator2
                    ? Number(el.coefficientEvaluator2).toFixed(1)
                    : '',
            };
            results.push(list);
        });
        const lastRow = [
            {
                content: `小計`,
                colSpan: 3,
            },
            {
                content: !isNaN(Number(evaluation.achievementPersonalTotalPointEvaluator2))
                    ? Number(evaluation.achievementPersonalTotalPointEvaluator2).toFixed(2)
                    : '',
                colSpan: 2,
            },
        ];
        results.push(lastRow);
        return results;
    }
    static getHeaderAdditionalTable(exist05, exist1, exist2) {
        const buffList2s = [];
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
        ].filter((v) => {
            if (!exist2)
                buffList2s.push('pointEvaluator2');
            return !buffList2s.includes(v.dataKey);
        });
        return results;
    }
    static getAdditionalTableData(evaluation) {
        var _a;
        const results = [];
        evaluation.evaluationAchievementAdditional.map((el) => {
            const list = {
                titleAdditional: el.titleAdditional || '',
                achievementStatus: el.achievementStatus || '',
                reasonComment: el.reasonComment || '',
                pointEvaluator2: el.pointEvaluator2 || '',
            };
            results.push(list);
        });
        const lastRow = [
            {
                content: `小計`,
                colSpan: 3,
                styles: { halign: 'center' },
            },
            {
                content: (_a = Pdf810Helper.get2WithoutRound(evaluation.achievementAdditionalTotalPointEvaluator2)) !== null && _a !== void 0 ? _a : '',
                colSpan: 1,
                styles: { halign: 'center' },
            },
        ];
        results.push(lastRow);
        return results;
    }
    static getColumnTypeTotalPointAdditionalTable(exist05) {
        if (exist05) {
            return {
                0: { cellWidth: 135 },
                1: { cellWidth: 18.95 },
                2: { cellWidth: 18.95 },
                3: { cellWidth: 13.55 },
                4: { cellWidth: 13.55 },
            };
        }
        return {
            0: { cellWidth: 135 },
            1: { cellWidth: 24.38 },
            2: { cellWidth: 20.3 },
            3: { cellWidth: 20.32 },
        };
    }
    static getTotalPointAdditionalTableData(evaluation, exist05) {
        let totalSelf = 0;
        let totalRater05 = 0;
        let totalRater1 = 0;
        let totalRater2 = 0;
        evaluation.evaluationAchievementPersonals.forEach((el) => {
            totalSelf += el.pointUser;
            if (exist05) {
                totalRater05 += el.pointEvaluator05 || 0;
            }
            totalRater1 += el.pointEvaluator1;
            totalRater2 += el.pointEvaluator2;
        });
        const results = [
            {
                content: '小計',
                styles: { halign: 'center' },
            },
            {
                content: totalSelf,
                styles: { halign: 'center' },
            },
            {
                content: totalRater1,
                styles: { halign: 'center' },
            },
            {
                content: totalRater2,
                styles: { halign: 'center' },
            },
        ];
        if (exist05) {
            results.splice(3, 0, {
                content: totalRater05,
                styles: { halign: 'center' },
            });
        }
        return [results];
    }
    static getSummaryPeriodTableData(evaluations) {
        let total = 0;
        const results = [];
        evaluations.map((evaluation) => {
            const row = [
                {
                    content: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.summaryCharPointEvaluator2 || '',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.summaryPointEvaluator2
                        ? parseFloat(evaluation.summaryPointEvaluator2.toString()).toFixed(1)
                        : '',
                    styles: { halign: 'center' },
                },
            ];
            total +=
                evaluation.summaryPointEvaluator2 *
                    (Math.floor(evaluation.percentPoint === null ? 100 : evaluation.percentPoint) /
                        100);
            results.push(row);
        });
        const lastRow = [
            {
                content: `評価結果`,
                colSpan: 2,
                styles: { halign: 'center' },
            },
            {
                content: total ? Math.round(Number(total) * 10) / 10 : '',
                colSpan: 1,
                styles: { halign: 'center' },
            },
        ];
        results.push(lastRow);
        return results;
    }
    static getEvaluatorByOrder(evaluators, order) {
        const filter = evaluators.filter((el) => el.evaluationOrder.toString() === order);
        if (filter.length === 0) {
            return null;
        }
        return filter[0];
    }
    static get2WithoutRound(num) {
        let temp = '';
        if (num) {
            temp = num.toString();
            temp = temp.slice(0, temp.indexOf('.') + 3);
        }
        return Number(temp);
    }
}
exports.Pdf810Helper = Pdf810Helper;
//# sourceMappingURL=Pdf810Helper.js.map