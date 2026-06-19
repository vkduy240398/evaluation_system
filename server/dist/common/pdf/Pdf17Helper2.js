"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pdf17Helper2 = void 0;
class Pdf17Helper2 {
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
        const results = [
            [
                {
                    content: '本人',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.basicProTotalPointUser || '',
                    styles: { halign: 'center' },
                },
                {
                    content: (evaluation.skillPercent || 0) + '%',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.behaviorTotalPointUser || '',
                    styles: { halign: 'center' },
                },
                {
                    content: (evaluation.behaviorPercent || 0) + '%',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.achievementPersonalTotalPointUser || '',
                    styles: { halign: 'center' },
                },
                {
                    content: (evaluation.achievementPercent || 0) + '%',
                    styles: { halign: 'center' },
                },
                {
                    content: evaluation.summaryPointUser || '',
                    styles: { halign: 'center' },
                },
            ],
        ];
        return results;
    }
    static getHeaderBasicTable() {
        const results = [
            {
                content: '評価項目',
                styles: { halign: 'center' },
            },
            {
                content: '評価内容',
                styles: { halign: 'center' },
            },
            {
                content: '難易度',
                styles: { halign: 'center' },
            },
            {
                content: '本人',
                styles: { halign: 'center' },
            },
        ];
        return results;
    }
    static getBasicTableData(evaluation, type) {
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
                    content: el.pointUser * el.difficulty || '',
                    styles: { halign: 'center' },
                },
            ];
            return list;
        });
        return results;
    }
    static getProTableData(evaluation) {
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
            ];
            return list;
        });
        return results;
    }
    static getHeaderGoalTable() {
        const results = [
            {
                content: '個人目標',
                styles: { halign: 'center' },
            },
            {
                content: '指標・水準\n（達成数値）',
                styles: { halign: 'center' },
            },
            {
                content: 'ウェイト',
                styles: { halign: 'center' },
            },
            {
                content: '本人',
                styles: { halign: 'center' },
            },
        ];
        return results;
    }
    static getGoalTableData(evaluation) {
        const results = evaluation.evaluationAchievementPersonals.map((el) => {
            const list = [
                {
                    content: el.title || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.achievementValue || '',
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
            ];
            return list;
        });
        return results;
    }
    static getHeaderAchievementTable() {
        const results = [
            {
                content: '達成 / 未達成',
                styles: { halign: 'center' },
            },
            {
                content: '達成理由・未達成理由',
                styles: { halign: 'center' },
            },
            {
                content: '未達成の場合の達成するためのアク\nションプラン',
                styles: { halign: 'center' },
            },
            {
                content: 'ウェイト',
                styles: { halign: 'center' },
            },
            {
                content: '本人',
                styles: { halign: 'center' },
            },
        ];
        return results;
    }
    static getAchievementTableData(evaluation) {
        const results = evaluation.evaluationAchievementPersonals.map((el) => {
            const list = [
                {
                    content: el.achievementStatus || '',
                    styles: { halign: 'left' },
                },
                {
                    content: el.reasonComment || '',
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
            ];
            return list;
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
exports.Pdf17Helper2 = Pdf17Helper2;
//# sourceMappingURL=Pdf17Helper2.js.map