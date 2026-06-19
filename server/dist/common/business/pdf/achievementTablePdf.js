"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementPersonalTablePdfBusiness = void 0;
class AchievementPersonalTablePdfBusiness {
    static column(isDisplayEvaluator2) {
        const columns = [
            { header: '達成/未達成', dataKey: 'achievementStatus' },
            { header: '達成理由・未達成理由', dataKey: 'reasonComment' },
            {
                header: '未達成の場合の達成するためのアクションプラン	',
                dataKey: 'actionPlan',
            },
        ];
        if (isDisplayEvaluator2)
            columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });
        return columns;
    }
    static column2(isDisplayEvaluator2) {
        const columns = [
            { header: '個人目標', dataKey: 'title' },
            { header: '指標・水準 (達成数値)', dataKey: 'achievementValue' },
            {
                header: '手段・方法 (どのように)',
                dataKey: 'method',
            },
            { header: 'ウェイト', dataKey: 'weight' },
        ];
        if (isDisplayEvaluator2)
            columns.push({
                header: '難易度\n(二次評価)',
                dataKey: 'difficultyEvaluator2',
            });
        return columns;
    }
    static dataSources(data) {
        const dataSources = data.map((v) => (Object.assign(Object.assign({}, v), { difficultyEvaluator2: v.difficultyEvaluator2 || 0 })));
        if (dataSources.length > 0) {
            const length = dataSources.length;
            if (dataSources[length - 1].achievementStatus === '小計') {
                dataSources.splice(-1);
            }
        }
        else {
            dataSources.push([
                {
                    content: '',
                    colSpan: 4,
                },
            ]);
        }
        return dataSources;
    }
    static dataSources2(data) {
        const dataSources = data.map((v) => (Object.assign(Object.assign({}, v), { difficultyUser: Math.floor(v.difficultyUser) })));
        if (dataSources.length > 0) {
            const length = dataSources.length;
            if (dataSources[length - 1].achievementStatus === '小計') {
                const item = dataSources[length - 1];
                dataSources[length - 1] = [
                    { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
                    item.pointEvaluator2,
                ];
            }
        }
        return dataSources;
    }
    static dataSourcesSub(data) {
        const dataSources = data === null || data === void 0 ? void 0 : data.map((v) => (Object.assign(Object.assign({}, v), { difficultyUser: Math.floor(v.difficultyUser) })));
        return dataSources;
    }
}
exports.AchievementPersonalTablePdfBusiness = AchievementPersonalTablePdfBusiness;
//# sourceMappingURL=achievementTablePdf.js.map