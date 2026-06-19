"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTablePdfBusiness = void 0;
class BasicTablePdfBusiness {
    static column(isDisplayEvaluator2) {
        const columns = [
            { header: '評価項目', dataKey: 'title' },
            { header: '評価内容', dataKey: 'content' },
            { header: '難易度', dataKey: 'difficulty' },
        ];
        if (isDisplayEvaluator2)
            columns.push({ header: '二次評価', dataKey: 'pointEvaluator2' });
        return columns;
    }
    static dataSources(data, status) {
        const dataSources = data;
        if (dataSources.length > 0) {
            const length = dataSources.length;
            if (dataSources[length - 1].title === '小計' && status > 50) {
                const item = dataSources[length - 1];
                dataSources[length - 1] = [
                    { colSpan: 3, styles: { halign: 'center' }, content: '小計' },
                    item.pointEvaluator2,
                ];
            }
        }
        return dataSources;
    }
    static dataSourcesBasicBehavior(data, status) {
        const dataSources = data;
        return dataSources;
    }
}
exports.BasicTablePdfBusiness = BasicTablePdfBusiness;
//# sourceMappingURL=basicTablePdf.js.map