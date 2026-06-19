"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf17Helper = void 0;
class Pdf17Helper {
    static getHeaderSummaryTable() {
        const results = [
            {
                content: '',
                styles: { halign: 'center' },
            },
            {
                content: 'スキル評価計',
                styles: { halign: 'center' },
            },
            {
                content: 'ウェイト',
                styles: { halign: 'center' },
            },
            {
                content: '行動・情意評価計',
                styles: { halign: 'center' },
            },
            {
                content: 'ウェイト',
                styles: { halign: 'center' },
            },
            {
                content: '成果評価計',
                styles: { halign: 'center' },
            },
            {
                content: 'ウェイト',
                styles: { halign: 'center' },
            },
            {
                content: '総計（100点満点）',
                styles: { halign: 'center' },
            },
        ];
        return results;
    }
    static getSummaryData(evaluation) {
        const results = [];
        const self = [
            {
                content: '本人',
                styles: { halign: 'center' },
            },
            {
                content: evaluation.basicProTotalPointUser || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.skillPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorTotalPointUser || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPersonalTotalPointUser || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.summaryPointUser || 0,
                styles: { halign: 'center' },
            },
        ];
        const transient = [
            {
                content: '0.5次',
                styles: { halign: 'center' },
            },
            {
                content: evaluation.basicProTotalPointEvaluator05 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.skillPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorTotalPointEvaluator05 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPersonalTotalPointEvaluator05 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.summaryPointEvaluator05 || 0,
                styles: { halign: 'center' },
            },
        ];
        const rater1 = [
            {
                content: '1次',
                styles: { halign: 'center' },
            },
            {
                content: evaluation.basicProTotalPointEvaluator1 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.skillPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorTotalPointEvaluator1 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPersonalTotalPointEvaluator1 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.summaryPointEvaluator1 || 0,
                styles: { halign: 'center' },
            },
        ];
        const rater2 = [
            {
                content: '2次',
                styles: { halign: 'center' },
            },
            {
                content: evaluation.basicProTotalPointEvaluator2 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.skillPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorTotalPointEvaluator2 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.behaviorPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPersonalTotalPointEvaluator2 || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.achievementPercent || 0,
                styles: { halign: 'center' },
            },
            {
                content: evaluation.summaryPointEvaluator2 || 0,
                styles: { halign: 'center' },
            },
        ];
        results.push(self);
        if (evaluation.basicProTotalPointEvaluator05)
            results.push(transient);
        if (evaluation.basicProTotalPointEvaluator1)
            results.push(rater1);
        results.push(rater2);
        return results;
    }
    static getHeaderBasicTable(exist05) {
        if (exist05) {
            return ['評価項目', '評価内容', '難易度', '本人', '0.5次', '1次', '2次'];
        }
        return ['評価項目', '評価内容', '難易度', '本人', '1次', '2次'];
    }
    static getBasicTableData(evaluation, type, exist05) {
        const results = evaluation.evaluationBasicBehavior
            .filter((el) => el.type === type)
            .map((el) => {
            const list = [
                {
                    content: el.itemTitle || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.content || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.difficulty || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointUser * el.difficulty || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator1 * el.difficulty || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator2 * el.difficulty || 0,
                    styles: { halign: 'center' },
                },
            ];
            if (exist05) {
                list.splice(4, 0, {
                    content: el.pointEvaluator05 * el.difficulty || 0,
                    styles: { halign: 'center' },
                });
            }
            return list;
        });
        return results;
    }
    static getProTableData(evaluation, exist05) {
        const results = evaluation.evaluationPro.map((el) => {
            const list = [
                {
                    content: el.itemTitle || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.content || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.difficulty || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointUser || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator1 || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator2 || 0,
                    styles: { halign: 'center' },
                },
            ];
            if (exist05) {
                list.splice(4, 0, {
                    content: el.pointEvaluator05 || 0,
                    styles: { halign: 'center' },
                });
            }
            return list;
        });
        return results;
    }
    static getHeaderGoalTable(exist05) {
        if (exist05) {
            return [
                '個人目標',
                '指標・水準\n（達成数値）',
                'ウェイト',
                '本人',
                '0.5次',
                '1次',
                '2次',
            ];
        }
        return [
            '個人目標',
            '指標・水準\n（達成数値）',
            'ウェイト',
            '本人',
            '1次',
            '2次',
        ];
    }
    static getGoalTableData(evaluation, exist05) {
        const results = evaluation.evaluationAchievementPersonals.map((el) => {
            const list = [
                {
                    content: el.title || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.achievementValue || 0,
                    styles: { halign: 'left' },
                },
                {
                    content: el.weight || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointUser || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator1 || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator2 || 0,
                    styles: { halign: 'center' },
                },
            ];
            if (exist05) {
                list.splice(4, 0, {
                    content: el.pointEvaluator05 || 0,
                    styles: { halign: 'center' },
                });
            }
            return list;
        });
        return results;
    }
    static getColumnTypeTotalPointGoalTable(exist05) {
        if (exist05) {
            return {
                0: { cellWidth: 135 },
                1: { cellWidth: 19.7 },
                2: { cellWidth: 11.81 },
                3: { cellWidth: 13.8 },
                4: { cellWidth: 9.85 },
                5: { cellWidth: 9.85 },
            };
        }
        return {
            0: { cellWidth: 135 },
            1: { cellWidth: 25 },
            2: { cellWidth: 15 },
            3: { cellWidth: 12.5 },
            4: { cellWidth: 12.5 },
        };
    }
    static getTotalPointGoalTableData(evaluation, exist05) {
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
                content: '',
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
    static getHeaderAchievementTable(exist05) {
        if (exist05) {
            return [
                '達成 / 未達成',
                '達成理由　・　未達成理由',
                '未達成の場合の達成するためのアク\nションプラン',
                'ウェイト',
                '本人',
                '0.5次',
                '1次',
                '2次',
            ];
        }
        return [
            '達成 / 未達成',
            '達成理由　・　未達成理由',
            '未達成の場合の達成するためのアク\nションプラン',
            'ウェイト',
            '本人',
            '1次',
            '2次',
        ];
    }
    static getAchievementTableData(evaluation, exist05) {
        const results = evaluation.evaluationAchievementPersonals.map((el) => {
            const list = [
                {
                    content: el.title || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.achievementStatus || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.actionPlan || '',
                    styles: { halign: 'center' },
                },
                {
                    content: el.weight || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointUser || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator1 || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator2 || 0,
                    styles: { halign: 'center' },
                },
            ];
            if (exist05) {
                list.splice(5, 0, {
                    content: el.pointEvaluator05 || 0,
                    styles: { halign: 'center' },
                });
            }
            return list;
        });
        return results;
    }
    static getColumnTypeTotalPointAchievementTable(exist05) {
        if (exist05) {
            return {
                0: { cellWidth: 135 },
                1: { cellWidth: 19.7 },
                2: { cellWidth: 11.81 },
                3: { cellWidth: 13.8 },
                4: { cellWidth: 9.85 },
                5: { cellWidth: 9.85 },
            };
        }
        return {
            0: { cellWidth: 135 },
            1: { cellWidth: 25 },
            2: { cellWidth: 15 },
            3: { cellWidth: 12.5 },
            4: { cellWidth: 12.5 },
        };
    }
    static getTotalPointAchievementTableData(evaluation, exist05) {
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
                content: '',
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
    static getHeaderAdditionalTable(exist05) {
        if (exist05) {
            return [
                'その他特記項目',
                '達成 / 未達成',
                '理由および本人コメント',
                '評価 ',
                '0.5次',
                '1次',
                '2次',
            ];
        }
        return [
            '達成 / 未達成',
            '達成理由　・　未達成理由',
            '未達成の場合の達成するためのアク\nションプラン',
            '評価',
            '1次',
            '2次',
        ];
    }
    static getAdditionalTableData(evaluation, exist05) {
        const results = evaluation.evaluationAchievementAdditional.map((el) => {
            const list = [
                {
                    content: el.titleAdditional || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.achievementStatus || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.reasonComment || '',
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointUser || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator1 || 0,
                    styles: { halign: 'center' },
                },
                {
                    content: el.pointEvaluator2 || 0,
                    styles: { halign: 'center' },
                },
            ];
            if (exist05) {
                list.splice(5, 0, {
                    content: el.pointEvaluator05 || 0,
                    styles: { halign: 'center' },
                });
            }
            return list;
        });
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
    static getEvaluatorByOrder(evaluators, order) {
        const filter = evaluators.filter((el) => el.evaluationOrder.toString() === order);
        if (filter.length === 0) {
            return null;
        }
        return filter[0];
    }
    static getHeaderSummaryPeriodTable() {
        const results = [
            {
                content: '',
                styles: { halign: 'center' },
            },
            {
                content: 'スキル評価計',
                styles: { halign: 'center' },
            },
            {
                content: '行動・情意評価計',
                styles: { halign: 'center' },
            },
            {
                content: '成果評価計',
                styles: { halign: 'center' },
            },
            {
                content: '追加目標・成果',
                styles: { halign: 'center' },
            },
            {
                content: '総計（100点満点）',
                styles: { halign: 'center' },
            },
        ];
        return results;
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
                    content: evaluation.basicProTotalPointEvaluator2
                        ? Math.round(evaluation.basicProTotalPointEvaluator2)
                        : '',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.behaviorTotalPointEvaluator2
                        ? Math.round(evaluation.behaviorTotalPointEvaluator2)
                        : '',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.achievementPersonalTotalPointEvaluator2
                        ? Math.round(evaluation.achievementPersonalTotalPointEvaluator2)
                        : '',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.achievementAdditionalTotalPointEvaluator2
                        ? Math.round(evaluation.achievementAdditionalTotalPointEvaluator2)
                        : '',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.summaryPointEvaluator2
                        ? Math.round(evaluation.summaryPointEvaluator2)
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
                colSpan: 5,
                styles: { halign: 'center' },
            },
            {
                content: total ? Math.round(total) : '',
                colSpan: 1,
                styles: { halign: 'center' },
            },
        ];
        results.push(lastRow);
        return results;
    }
}
exports.Pdf17Helper = Pdf17Helper;
//# sourceMappingURL=Pdf17Helper.js.map