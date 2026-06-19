"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalTablePdfBusiness = void 0;
class TotalTablePdfBusiness {
    static columnTotalTable(haveSkill) {
        const columns = [
            { header: '', dataKey: 'title' },
            { header: 'スキル評価計', dataKey: 'skillTotalPoint' },
            { header: 'ウェイト', dataKey: 'skillPercent' },
            { header: '行動・情意評価計', dataKey: 'behaviorTotalPoint' },
            { header: 'ウェイト', dataKey: 'behaviorPercent' },
            { header: '成果評価計', dataKey: 'achievementPersonalTotalPoint' },
            { header: 'ウェイト', dataKey: 'achievementPercent' },
            { header: '追加目標・成果', dataKey: 'achievementAddition' },
            { header: '総計', dataKey: 'percentPoint' },
        ];
        if (!haveSkill) {
            const columns = [
                { header: '', dataKey: 'title' },
                { header: '成果評価計', dataKey: 'achievementPersonalTotalPoint' },
                { header: 'ウェイト', dataKey: 'achievementPercent' },
                { header: '行動・情意評価計	', dataKey: 'behaviorTotalPoint' },
                { header: 'ウェイト', dataKey: 'behaviorPercent' },
                { header: '追加目標・成果', dataKey: 'achievementAddition' },
                { header: '総計', dataKey: 'percentPoint' },
            ];
            return columns;
        }
        return columns;
    }
    static dataSourceTotalTable(data, isDisplayEvaluator05, isDisplayEvaluator1, isDisplayEvaluator2) {
        const { pointSettingLevel, behaviorTotalPointUser, achievementPersonalTotalPointUser, achievementAdditionalTotalPointUser, behaviorTotalPointEvaluator05, achievementAdditionalTotalPointEvaluator05, achievementPersonalTotalPointEvaluator05, behaviorTotalPointEvaluator1, achievementAdditionalTotalPointEvaluator1, achievementPersonalTotalPointEvaluator1, behaviorTotalPointEvaluator2, achievementAdditionalTotalPointEvaluator2, achievementPersonalTotalPointEvaluator2, basicProTotalPointUser, basicProTotalPointEvaluator05, basicProTotalPointEvaluator1, basicProTotalPointEvaluator2, } = data;
        const convertBasicProTotalPointUser = basicProTotalPointUser;
        const convertBehaviorTotalPointUser = behaviorTotalPointUser;
        const convertAchievementPersonalTotalPointUser = achievementPersonalTotalPointUser;
        const convertAchievementAdditionalTotalPointUser = achievementAdditionalTotalPointUser;
        const convertBasicProTotalPointEvaluator05 = basicProTotalPointEvaluator05;
        const convertBehaviorTotalPointEvaluator05 = behaviorTotalPointEvaluator05;
        const convertAchievementPersonalTotalPointEvaluator05 = achievementPersonalTotalPointEvaluator05;
        const convertAchievementAdditionalTotalPointEvaluator05 = achievementAdditionalTotalPointEvaluator05;
        const convertBasicProTotalPointEvaluator1 = basicProTotalPointEvaluator1;
        const convertBehaviorTotalPointEvaluator1 = behaviorTotalPointEvaluator1;
        const convertAchievementPersonalTotalPointEvaluator1 = achievementPersonalTotalPointEvaluator1;
        const convertAchievementAdditionalTotalPointEvaluator1 = achievementAdditionalTotalPointEvaluator1;
        const convertBasicProTotalPointEvaluator2 = basicProTotalPointEvaluator2;
        const convertBehaviorTotalPointEvaluator2 = behaviorTotalPointEvaluator2;
        const convertAchievementPersonalTotalPointEvaluator2 = achievementPersonalTotalPointEvaluator2;
        const convertAchievementAdditionalTotalPointEvaluator2 = achievementAdditionalTotalPointEvaluator2;
        const handleTotal = (total) => {
            return total !== null ? Math.round(total) : null;
        };
        const dataSources = [];
        dataSources.push(Object.assign(Object.assign({}, pointSettingLevel), { title: '本人', skillTotalPoint: convertBasicProTotalPointUser !== null
                ? Math.round(convertBasicProTotalPointUser)
                : null, behaviorTotalPoint: convertBehaviorTotalPointUser !== null
                ? Math.round(convertBehaviorTotalPointUser)
                : null, achievementPersonalTotalPoint: convertAchievementPersonalTotalPointUser !== null
                ? Math.round(convertAchievementPersonalTotalPointUser)
                : null, percentPoint: handleTotal(data.summaryPointUser), achievementAddition: convertAchievementAdditionalTotalPointUser !== null
                ? Math.round(convertAchievementAdditionalTotalPointUser)
                : null, skillPercent: `${pointSettingLevel.skillPercent}%`, behaviorPercent: `${pointSettingLevel.behaviorPercent}%`, achievementPercent: `${pointSettingLevel.achievementPercent}%` }));
        if (isDisplayEvaluator05) {
            dataSources.push(Object.assign(Object.assign({}, pointSettingLevel), { title: '仮評価', skillTotalPoint: convertBasicProTotalPointEvaluator05 !== null
                    ? Math.round(convertBasicProTotalPointEvaluator05)
                    : null, behaviorTotalPoint: convertBehaviorTotalPointEvaluator05 !== null
                    ? Math.round(convertBehaviorTotalPointEvaluator05)
                    : null, achievementPersonalTotalPoint: convertAchievementPersonalTotalPointEvaluator05 !== null
                    ? Math.round(convertAchievementPersonalTotalPointEvaluator05)
                    : null, percentPoint: handleTotal(data.summaryPointEvaluator05), achievementAddition: convertAchievementAdditionalTotalPointEvaluator05 !== null
                    ? Math.round(convertAchievementAdditionalTotalPointEvaluator05)
                    : null, skillPercent: `${pointSettingLevel.skillPercent}%`, behaviorPercent: `${pointSettingLevel.behaviorPercent}%`, achievementPercent: `${pointSettingLevel.achievementPercent}%` }));
        }
        if (isDisplayEvaluator1) {
            dataSources.push(Object.assign(Object.assign({}, pointSettingLevel), { title: '一次評価', skillTotalPoint: convertBasicProTotalPointEvaluator1 !== null
                    ? Math.round(convertBasicProTotalPointEvaluator1)
                    : null, behaviorTotalPoint: convertBehaviorTotalPointEvaluator1 !== null
                    ? Math.round(convertBehaviorTotalPointEvaluator1)
                    : null, achievementPersonalTotalPoint: convertAchievementPersonalTotalPointEvaluator1 !== null
                    ? Math.round(convertAchievementPersonalTotalPointEvaluator1)
                    : null, percentPoint: handleTotal(data.summaryPointEvaluator1), achievementAddition: convertAchievementAdditionalTotalPointEvaluator1 !== null
                    ? Math.round(convertAchievementAdditionalTotalPointEvaluator1)
                    : null, skillPercent: `${pointSettingLevel.skillPercent}%`, behaviorPercent: `${pointSettingLevel.behaviorPercent}%`, achievementPercent: `${pointSettingLevel.achievementPercent}%` }));
        }
        if (isDisplayEvaluator2) {
            dataSources.push(Object.assign(Object.assign({}, pointSettingLevel), { title: '二次評価', skillTotalPoint: convertBasicProTotalPointEvaluator2 !== null
                    ? Math.round(convertBasicProTotalPointEvaluator2)
                    : null, behaviorTotalPoint: convertBehaviorTotalPointEvaluator2 !== null
                    ? Math.round(convertBehaviorTotalPointEvaluator2)
                    : null, achievementPersonalTotalPoint: convertAchievementPersonalTotalPointEvaluator2 !== null
                    ? Math.round(convertAchievementPersonalTotalPointEvaluator2)
                    : null, percentPoint: handleTotal(data.summaryPointEvaluator2), achievementAddition: convertAchievementAdditionalTotalPointEvaluator2 !== null
                    ? Math.round(convertAchievementAdditionalTotalPointEvaluator2)
                    : null, skillPercent: `${pointSettingLevel.skillPercent}%`, behaviorPercent: `${pointSettingLevel.behaviorPercent}%`, achievementPercent: `${pointSettingLevel.achievementPercent}%` }));
        }
        return dataSources;
    }
}
exports.TotalTablePdfBusiness = TotalTablePdfBusiness;
//# sourceMappingURL=totalTablePdf.js.map