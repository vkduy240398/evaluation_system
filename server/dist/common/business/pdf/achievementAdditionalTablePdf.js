"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementAdditionalTablePdfBusiness = void 0;
class AchievementAdditionalTablePdfBusiness {
    static column(isDisplayEvaluator2) {
        const columns = [
            { header: 'その他特記項目', dataKey: 'titleAdditional' },
            { header: '達成/未達成', dataKey: 'achievementStatus' },
            {
                header: '理由および本人コメント',
                dataKey: 'reasonComment',
            },
        ];
        if (isDisplayEvaluator2)
            columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });
        return columns;
    }
    static dataSources(data) {
        const dataSources = data;
        if (dataSources.length > 0) {
            const length = dataSources.length;
            if (dataSources[length - 1].titleAdditional === '小計') {
                const item = dataSources[length - 1];
                dataSources[length - 1] = [
                    { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
                    item.pointEvaluator2,
                ];
            }
        }
        return dataSources;
    }
    static dataSourcesAchievementAdditional(data) {
        const dataSources = data;
        return dataSources;
    }
}
exports.AchievementAdditionalTablePdfBusiness = AchievementAdditionalTablePdfBusiness;
//# sourceMappingURL=achievementAdditionalTablePdf.js.map