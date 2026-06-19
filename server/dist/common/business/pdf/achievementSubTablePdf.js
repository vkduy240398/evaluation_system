"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementPersonalSubTablePdfBusiness = void 0;
class AchievementPersonalSubTablePdfBusiness {
    static column() {
        const columns = [
            {
                header: '水準（指標がどのような状態になっているか）',
                dataKey: 'evaluationDecision',
            },
            { header: '係数', dataKey: 'coefficient' },
        ];
        return columns;
    }
}
exports.AchievementPersonalSubTablePdfBusiness = AchievementPersonalSubTablePdfBusiness;
//# sourceMappingURL=achievementSubTablePdf.js.map