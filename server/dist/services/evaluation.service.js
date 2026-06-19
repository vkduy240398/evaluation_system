"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationService = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const evaluation_repository_1 = require("../repository/evaluation.repository");
const proSkill_repository_1 = require("../repository/proSkill.repository");
const mail_service_1 = require("./mail.service");
const proSkillSetting_repository_1 = require("../repository/proSkillSetting.repository");
const util_1 = require("../common/util");
const evaluationPeriod_repository_1 = require("../repository/evaluationPeriod.repository");
const divisionSubClass_repository_1 = require("../repository/divisionSubClass.repository");
const approval_repository_1 = require("../repository/approval.repository");
const sequelize_1 = require("sequelize");
const logger_service_1 = require("./logger.service");
const summaryDepartment_repository_1 = require("../repository/summaryDepartment.repository");
const user_repository_1 = require("../repository/user.repository");
const moment = require("moment");
const evaluator_repository_1 = require("../repository/evaluator.repository");
let EvaluationService = class EvaluationService {
    constructor(logger) {
        this.logger = logger;
    }
    async findOne(id, userId, role, companyGroupCode) {
        var _a, _b;
        let isDisable = false;
        let hasEvaluator2 = true;
        let hasMode1 = false;
        let hasMode2 = false;
        let hasMode3 = false;
        let allowSeeList = [];
        let maxOrder = '';
        const findRejectCondition = {
            evaluationId: id,
            type: 0,
            receiverOrder: '',
            status: '',
        };
        const userInfo = {
            id: undefined,
            department: undefined,
            division: undefined,
            evaluationLevel: undefined,
            evaluators: [],
            fiscalYear: undefined,
            periodStart: undefined,
            periodEnd: undefined,
            fullName: '',
            employeeNumber: '',
            status: 0,
            evaluationId: undefined,
            active: 1,
            rejectComment: '',
        };
        const flagSkill = (await this.userRepo.evaluationSkillCheck(id)).flagSkill;
        const results = await this.evaluationRepo.getEvaluationById(id, flagSkill, companyGroupCode);
        const evaluation = results.evaluationList;
        const evaluatorList = evaluation.evaluator || [];
        const evaluatorOrderList = [];
        let isEvaluatorException = false;
        if (role !== 'user') {
            const evaluators = evaluation.evaluator;
            const findEvaluator = evaluators.find((f) => f.evaluatorId === userId);
            if (!findEvaluator)
                isEvaluatorException = true;
        }
        evaluatorList.map((e) => {
            evaluatorOrderList.push(Number(e.evaluationOrder));
        });
        const evaluationStatus = evaluation.status;
        const listSumaryPercent = {
            achievementPercent: evaluation.achievementPercent,
            skillPercent: evaluation.skillPercent,
            behaviorPercent: evaluation.behaviorPercent,
            percentPoint: evaluation.percentPoint,
        };
        let evaluationBasicBehaviorList;
        if (evaluation.status < 1) {
            evaluationBasicBehaviorList = [
                ...(evaluation.listBasic || []),
                ...(evaluation.listBehaviorHaveSkill || []),
                ...(evaluation.listBehaviorNoSkill || []),
            ];
        }
        else {
            evaluationBasicBehaviorList = [
                ...(evaluation.evaluationBasicBehavior || []),
            ];
        }
        let customEvalutorOrderList = [];
        customEvalutorOrderList = evaluatorList.filter((item) => {
            return item.evaluatorId === userId;
        });
        if (customEvalutorOrderList && customEvalutorOrderList.length) {
            customEvalutorOrderList = customEvalutorOrderList.map((item) => item.evaluationOrder);
            maxOrder = customEvalutorOrderList[0];
            allowSeeList = evaluatorList.filter((item) => {
                return item.evaluationOrder <= maxOrder;
            });
            if ((evaluationStatus === 3 || evaluationStatus === 4) &&
                maxOrder.includes('0.5')) {
                hasMode1 = true;
            }
            else if ((evaluationStatus === 5 || evaluationStatus === 6) &&
                maxOrder.includes('1.0')) {
                hasMode1 = true;
            }
            else if ((evaluationStatus === 7 || evaluationStatus === 8) &&
                maxOrder.includes('2.0')) {
                hasMode1 = true;
            }
            if (evaluationStatus === 53 && customEvalutorOrderList.includes('0.5')) {
                hasMode2 = true;
            }
            else if (evaluationStatus === 56 &&
                customEvalutorOrderList.includes('1.0')) {
                hasMode2 = true;
            }
            else if (evaluationStatus === 59 &&
                customEvalutorOrderList.includes('2.0')) {
                hasMode2 = true;
            }
            if (customEvalutorOrderList.includes('0.5') &&
                [54, 55].includes(evaluationStatus))
                hasMode3 = true;
            else if (customEvalutorOrderList.includes('1.0') &&
                [57, 58].includes(evaluationStatus))
                hasMode3 = true;
            else if (customEvalutorOrderList.includes('2.0') &&
                [60, 61].includes(evaluationStatus))
                hasMode3 = true;
        }
        userInfo.department = evaluation.divisionName;
        userInfo.division = evaluation.divisionName;
        userInfo.evaluationLevel = evaluation === null || evaluation === void 0 ? void 0 : evaluation.level;
        userInfo.status = evaluation.status;
        userInfo.fiscalYear = evaluation === null || evaluation === void 0 ? void 0 : evaluation.title;
        userInfo.periodStart = evaluation === null || evaluation === void 0 ? void 0 : evaluation.periodStart;
        userInfo.periodEnd = evaluation === null || evaluation === void 0 ? void 0 : evaluation.periodEnd;
        userInfo.fullName = evaluation.user.fullName;
        userInfo.employeeNumber = evaluation.user.employeeNumber;
        userInfo.id = evaluation.user.id;
        userInfo.active = evaluation.user.active;
        let evaluator05Name = '仮評価: {evaluator05}';
        let evaluator1Name = '一次評価: {evaluator1}';
        let evaluator2Name = '二次評価: {evaluator2}';
        evaluatorList.map((item) => {
            if (item.evaluationOrder === '0.5')
                evaluator05Name = evaluator05Name.replace('{evaluator05}', item.user.fullName);
            if (item.evaluationOrder === '1.0')
                evaluator1Name = evaluator1Name.replace('{evaluator1}', item.user.fullName);
            if (item.evaluationOrder === '2.0')
                evaluator2Name = evaluator2Name.replace('{evaluator2}', item.user.fullName);
        });
        if (!evaluator05Name.includes('{'))
            userInfo.evaluators.push(evaluator05Name);
        if (!evaluator1Name.includes('{'))
            userInfo.evaluators.push(evaluator1Name);
        if (!evaluator2Name.includes('{'))
            userInfo.evaluators.push(evaluator2Name);
        if ([1, 2, 3, 4, 5, 6, 7].includes(evaluation.level))
            throw new RuntimeException_1.RuntimeException('level is changed', 204);
        const checkHasEvaluator2s = evaluatorList.filter((item) => {
            return item.evaluationOrder === '2.0';
        });
        hasEvaluator2 = (checkHasEvaluator2s === null || checkHasEvaluator2s === void 0 ? void 0 : checkHasEvaluator2s.length) !== 0;
        const isActiveByPeriod = await this.evaluationRepo.checkUserActiveBYPeriod(results.evaluationList.evaluationPeriod.id, results.evaluationList.userId);
        isDisable =
            (checkHasEvaluator2s === null || checkHasEvaluator2s === void 0 ? void 0 : checkHasEvaluator2s.length) === 0 ||
                isActiveByPeriod == null ||
                userInfo.active === 0;
        switch (evaluationStatus) {
            case 2: {
                findRejectCondition.type = 0;
                findRejectCondition.receiverOrder = '0.0';
                findRejectCondition.status = '被評価者へ差戻';
                break;
            }
            case 4: {
                findRejectCondition.type = 0;
                findRejectCondition.receiverOrder = '0.5';
                findRejectCondition.status = '仮評価者へ差戻';
                break;
            }
            case 6: {
                findRejectCondition.type = 0;
                findRejectCondition.receiverOrder = '1.0';
                findRejectCondition.status = '一次評価者へ差戻';
                break;
            }
            case 52: {
                findRejectCondition.type = 1;
                findRejectCondition.receiverOrder = '0.0';
                findRejectCondition.status = '被評価者へ差戻';
                break;
            }
            case 55: {
                findRejectCondition.type = 1;
                findRejectCondition.receiverOrder = '0.5';
                findRejectCondition.status = '仮評価者へ差戻';
                break;
            }
            case 58: {
                findRejectCondition.type = 1;
                findRejectCondition.receiverOrder = '1.0';
                findRejectCondition.status = '一次評価者へ差戻';
                break;
            }
            default:
                findRejectCondition.receiverOrder = '3.0';
        }
        if (findRejectCondition.receiverOrder !== '3.0') {
            const approvalList = await this.evaluationApprovalHistory.getApprovalHistory(findRejectCondition);
            const rejectComment = (_b = (_a = approvalList[0]) === null || _a === void 0 ? void 0 : _a.comment) !== null && _b !== void 0 ? _b : '';
            if (role !== 'admin') {
                if (maxOrder) {
                    if (findRejectCondition.receiverOrder <= maxOrder)
                        userInfo.rejectComment = rejectComment;
                }
                else {
                    if (findRejectCondition.receiverOrder == '0.0' && role === 'user') {
                        userInfo.rejectComment = rejectComment;
                    }
                }
            }
            if (role === 'admin') {
                userInfo.rejectComment = rejectComment;
            }
        }
        const finalData = {
            results,
            evaluationBasicBehavior: evaluationBasicBehaviorList === null || evaluationBasicBehaviorList === void 0 ? void 0 : evaluationBasicBehaviorList.sort((a, b) => {
                return a.itemNo - b.itemNo;
            }),
            hasMode1,
            hasMode2,
            allowSeeList,
            maxOrder,
            userInfo,
            isDisable,
            hasMode3,
            hasEvaluator2,
            listSumaryPercent: listSumaryPercent,
            evaluatorOrderList: evaluatorOrderList,
            isEvaluatorException: isEvaluatorException,
            flagSkill,
        };
        const stringData = JSON.stringify(finalData);
        const encode = (0, util_1.encrypt)(stringData, true);
        return encode;
    }
    async createOrUpdateEvaluation(dataSource, additionData, commentData, evaluationId, status, isDraft, listEvalutor, total, updatedTime, checkList, host, listBehaviors, listPersonalGoals, achievementPersonals, listProSkills, timeZone, userId) {
        let saveStatus = status;
        let selectedOrder = '';
        const currentEvaluation = await this.evaluationRepo.getUpdateTime(evaluationId);
        if (currentEvaluation.level < 8) {
            throw new RuntimeException_1.RuntimeException('level is changed', 204);
        }
        if (updatedTime !== currentEvaluation.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const customEvalutorOrderList = await this.evaluationRepo.listEvaluator(evaluationId);
        let minOrder = customEvalutorOrderList[0];
        for (let i = 0; i < (customEvalutorOrderList === null || customEvalutorOrderList === void 0 ? void 0 : customEvalutorOrderList.length); i++) {
            if (minOrder > customEvalutorOrderList[i])
                minOrder = customEvalutorOrderList[i];
        }
        if (!isDraft && (listEvalutor === null || listEvalutor === void 0 ? void 0 : listEvalutor.length) && [0, 1, 2].includes(status)) {
            if (minOrder === '1.0') {
                saveStatus = 5;
                selectedOrder = '1.0';
            }
            if (minOrder === '2.0') {
                saveStatus = 7;
                selectedOrder = '2.0';
            }
            if (minOrder === '0.5') {
                saveStatus = 3;
                selectedOrder = '0.5';
            }
        }
        if (!isDraft && listEvalutor.length && status > 49) {
            if ([50, 51, 52].includes(status) &&
                customEvalutorOrderList.includes('0.5')) {
                saveStatus = 53;
                selectedOrder = '0.5';
            }
            if ([50, 51, 52].includes(status) &&
                customEvalutorOrderList.includes('1.0') &&
                !customEvalutorOrderList.includes('0.5')) {
                saveStatus = 56;
                selectedOrder = '1.0';
            }
            if ([50, 51, 52].includes(status) &&
                customEvalutorOrderList.includes('2.0') &&
                !customEvalutorOrderList.includes('1.0') &&
                !customEvalutorOrderList.includes('0.5')) {
                saveStatus = 59;
                selectedOrder = '2.0';
            }
            if ([54, 55].includes(status) &&
                customEvalutorOrderList.includes('1.0')) {
                saveStatus = 56;
                selectedOrder = '1.0';
            }
            if ([54, 55].includes(status) &&
                !customEvalutorOrderList.includes('1.0') &&
                customEvalutorOrderList.includes('2.0')) {
                saveStatus = 59;
                selectedOrder = '2.0';
            }
            if ([57, 58].includes(status) &&
                customEvalutorOrderList.includes('2.0')) {
                saveStatus = 59;
                selectedOrder = '2.0';
            }
            if ([60, 61].includes(status) && customEvalutorOrderList.includes('2.0'))
                saveStatus = 98;
        }
        let summaryCharPointEvaluator05 = currentEvaluation.summaryCharPointEvaluator05;
        let summaryCharPointEvaluator1 = currentEvaluation.summaryCharPointEvaluator1;
        let summaryCharPointEvaluator2 = currentEvaluation.summaryCharPointEvaluator2;
        checkList.map((item) => {
            if ((item === null || item === void 0 ? void 0 : item.evaluator) === '仮評価') {
                summaryCharPointEvaluator05 = item.charPoint;
            }
            if ((item === null || item === void 0 ? void 0 : item.evaluator) === '一次') {
                summaryCharPointEvaluator1 = item.charPoint;
            }
            if ((item === null || item === void 0 ? void 0 : item.evaluator) === '二次') {
                summaryCharPointEvaluator2 = item.charPoint;
            }
        });
        const evaluationChange = {
            status: isDraft
                ? status === 0
                    ? 1
                    : status === 50
                        ? 51
                        : saveStatus
                : saveStatus,
            commentUser: commentData === null || commentData === void 0 ? void 0 : commentData.commentUser,
            achievementAdditionalTotalPointUser: total.summaryAchievementAdditionalTotalPointUser,
            achievementAdditionalTotalPointEvaluator05: total.summaryAchievementAdditionalTotalPointEvaluator05,
            achievementAdditionalTotalPointEvaluator1: total.summaryAchievementAdditionalTotalPointEvaluator1,
            achievementAdditionalTotalPointEvaluator2: total.summaryAchievementAdditionalTotalPointEvaluator2,
            summaryCharPointUser: total.summaryCharPointUser,
            summaryCharPointEvaluator05: summaryCharPointEvaluator05,
            summaryCharPointEvaluator1: summaryCharPointEvaluator1,
            summaryCharPointEvaluator2: summaryCharPointEvaluator2,
            summaryPointUser: total.summaryPointUsers,
            summaryPointEvaluator05: total.summaryPointEvaluator05s,
            summaryPointEvaluator1: total.summaryPointEvaluator1s,
            summaryPointEvaluator2: total.summaryPointEvaluator2s,
            behaviorTotalPointUser: total.behaviorTotalPointUser,
            behaviorTotalPointEvaluator05: total.behaviorTotalPointEvaluator05,
            behaviorTotalPointEvaluator1: total.behaviorTotalPointEvaluator1,
            behaviorTotalPointEvaluator2: total.behaviorTotalPointEvaluator2,
            achievementPersonalTotalPointUser: total.summaryAchievementPersonalTotalPointUser,
            achievementPersonalTotalPointEvaluator05: total.summaryAchievementPersonalTotalPointEvaluator05,
            achievementPersonalTotalPointEvaluator1: total.summaryAchievementPersonalTotalPointEvaluator1,
            achievementPersonalTotalPointEvaluator2: total.summaryAchievementPersonalTotalPointEvaluator2,
            basicProTotalPointUser: total.basicProTotalPointUser,
            basicProTotalPointEvaluator05: total.basicProTotalPointEvaluator05,
            basicProTotalPointEvaluator1: total.basicProTotalPointEvaluator1,
            basicProTotalPointEvaluator2: total.basicProTotalPointEvaluator2,
            basicTotalPointUser: total.basicTotalPointUser,
            basicTotalPointEvaluator05: total.basicTotalPointEvaluator05,
            basicTotalPointEvaluator1: total.basicTotalPointEvaluator1,
            basicTotalPointEvaluator2: total.basicTotalPointEvaluator2,
            proTotalPointUser: total.proTotalPointUser,
            proTotalPointEvaluator05: total.proTotalPointEvaluator05,
            proTotalPointEvaluator1: total.proTotalPointEvaluator1,
            proTotalPointEvaluator2: total.proTotalPointEvaluator2,
        };
        const summaryEvaluation = {
            summaryPointEvaluator1: total.summaryPointEvaluator1,
            summaryPointEvaluator2: total.summaryPointEvaluator2,
            summaryPointEvaluator05: total.summaryPointEvaluator05,
            summaryPointUser: total.summaryPointUser,
            achievementAdditionalTotalPointEvaluator1: total.achievementAdditionalTotalPointEvaluator1,
            achievementAdditionalTotalPointEvaluator2: total.achievementAdditionalTotalPointEvaluator2,
            achievementAdditionalTotalPointEvaluator05: total.achievementAdditionalTotalPointEvaluator05,
            achievementAdditionalTotalPointUser: total.achievementAdditionalTotalPointUser,
            achievementPersonalTotalPointEvaluator1: total.achievementPersonalTotalPointEvaluator1,
            achievementPersonalTotalPointEvaluator2: total.achievementPersonalTotalPointEvaluator2,
            achievementPersonalTotalPointEvaluator05: total.achievementPersonalTotalPointEvaluator05,
            achievementPersonalTotalPointUser: total.achievementPersonalTotalPointUser,
            summaryCharPointUser: total.summaryCharPointUser,
            summaryCharPointEvaluator05: summaryCharPointEvaluator05,
            summaryCharPointEvaluator1: summaryCharPointEvaluator1,
            summaryCharPointEvaluator2: summaryCharPointEvaluator2,
        };
        const transaction = await this.evaluationRepo.getNewTransaction();
        try {
            await this.summaryDepartmentRepository.createOrUpdate(Object.assign({ evaluationId }, summaryEvaluation));
            await this.evaluationRepo.updateEvaluation(evaluationChange, evaluationId, transaction);
            await this.evaluationRepo.deleteEvaluationAchievementPersonal(evaluationId, transaction);
            await this.evaluationRepo.deleteAdditionAchievement(evaluationId, transaction);
            await this.evaluationRepo.deleteEvaluationPro(evaluationId, transaction);
            dataSource.map((res) => {
                res.evaluationId = evaluationId;
                res.weight = (0, util_1.isNotNumber)(res.weight) ? null : res.weight;
                res.pointUser = (0, util_1.isNotNumber)(res.pointUser) ? null : res.pointUser;
                res.pointEvaluator05 = (0, util_1.isNotNumber)(res.pointEvaluator05)
                    ? null
                    : res.pointEvaluator05;
                res.pointEvaluator1 = (0, util_1.isNotNumber)(res.pointEvaluator1)
                    ? null
                    : res.pointEvaluator1;
                res.pointEvaluator2 = (0, util_1.isNotNumber)(res.pointEvaluator2)
                    ? null
                    : res.pointEvaluator2;
            });
            additionData.map((res) => {
                res.evaluationId = evaluationId;
            });
            await this.evaluationRepo.updateEvaluationAchievementPersonal(dataSource, transaction);
            await this.evaluationRepo.updateEvaluationAdditionAchievement(additionData, transaction);
            const compareProSkills = listProSkills
                ? listProSkills.filter((v) => v.isDisable === true)
                : [];
            if (listProSkills) {
                listProSkills.map((e) => (e.evaluationId = evaluationId));
                await this.evaluationRepo.updateEvaluationPro(listProSkills, transaction);
            }
            achievementPersonals.map((v, index) => {
                delete v.key;
                v.evaluationId = evaluationId;
                v.itemNo = index;
                v.type = 2;
                return v;
            });
            await this.evaluationRepo.updateEvaluationAdditionAchievement(achievementPersonals, transaction);
            await this.evaluationRepo.updateEvaluationBasicBehaviorSkill(evaluationId, transaction, listBehaviors);
            const arrayPersonalGoals = listPersonalGoals
                .map((v, index) => {
                v.evaluationId = evaluationId;
                v.itemNo = index;
                v.type = 2;
                const num = Number(v.weight);
                if (isNaN(num) || v.weight === '')
                    v.weight = null;
                const pointUser = Number(v.pointUser);
                if (isNaN(pointUser) || v.pointUser === '')
                    v.pointUser = null;
                const pointEvaluator05 = Number(v.pointEvaluator05);
                if (isNaN(pointEvaluator05) || v.pointEvaluator05 === '')
                    v.pointEvaluator05 = null;
                const pointEvaluator1 = Number(v.pointEvaluator1);
                if (isNaN(pointEvaluator1) || v.pointEvaluator1 === '')
                    v.pointEvaluator1 = null;
                const pointEvaluator2 = Number(v.pointEvaluator2);
                if (isNaN(pointEvaluator2) || v.pointEvaluator2 === '')
                    v.pointEvaluator2 = null;
                return v;
            })
                .sort((a, b) => {
                return a.itemNo - b.itemNo;
            });
            await this.evaluationRepo.updateEvaluationAchievementPersonal(arrayPersonalGoals, transaction);
            if (commentData.publicCommentAdmin2 ||
                commentData.privateCommentAdmin2 !== undefined) {
                const updateValues = {
                    commentPublic: commentData.publicCommentAdmin2,
                    commentPrivate: commentData.privateCommentAdmin2,
                };
                await this.evaluationRepo.updateEvaluatorComment(updateValues, evaluationId, '2.0', transaction);
            }
            if (commentData.publicCommentAdmin1 ||
                commentData.privateCommentAdmin1 !== undefined) {
                const updateValues = {
                    commentPublic: commentData.publicCommentAdmin1,
                    commentPrivate: commentData.privateCommentAdmin1,
                };
                await this.evaluationRepo.updateEvaluatorComment(updateValues, evaluationId, '1.0', transaction);
            }
            if (commentData.publicCommentAdmin05 ||
                commentData.privateCommentAdmin05 !== undefined) {
                const updateValues = {
                    commentPublic: commentData.publicCommentAdmin05,
                    commentPrivate: commentData.privateCommentAdmin05,
                };
                await this.evaluationRepo.updateEvaluatorComment(updateValues, evaluationId, '0.5', transaction);
            }
            const tempApprovers = listEvalutor.filter((item) => {
                if (item.evaluationOrder === selectedOrder)
                    return item;
            });
            const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:m', timeZone));
            const updateValue = {
                evaluationId: evaluationId,
                comment: null,
                approverId: Number(userId),
                receiverId: null,
                receiverOrder: 0,
                type: 1,
                status: '提出',
            };
            if (currentEvaluation.status < 50) {
                updateValue.type = 0;
            }
            if ([50, 51, 52].includes(currentEvaluation.status)) {
                updateValue.type = 1;
                updateValue.comment = `${currentEvaluation.flagSkill === 1
                    ? compareProSkills.length > 0
                        ? JSON.stringify(compareProSkills)
                        : 'MESSAGE.COMMON.IDS_PRO_SKILL_ALL_EVALUATE'
                    : ''}`;
            }
            if (status > 52) {
                updateValue.type = 1;
                updateValue.comment = '';
                updateValue.status = 'IDS_EVALUATOR_EVALUATE';
            }
            if (!isDraft) {
                await this.evaluationRepo.createHistoryApproveReject(updateValue, transaction);
            }
            if (!isDraft && selectedOrder) {
                await this.mailService.submitGoalAndEvaluation(tempApprovers[0].evaluatorId, currentEvaluation.userId, currentEvaluation, host);
            }
            await transaction.commit();
        }
        catch (error) {
            console.log(error);
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return currentEvaluation;
    }
    async getGuideEvaluationByEvaluationId(id) {
        return await this.evaluationRepo.getGuideEvaluationByEvaluationId(id);
    }
    async approveEvaluation(evaluationId, status, listEvalutor, maxOrder, content, approverId, updatedTime, host, companyGroupCode, timeZone) {
        var _a;
        let saveStatus = status;
        const currentEvaluation = await this.evaluationRepo.getUpdateTime(evaluationId);
        if (currentEvaluation.level < 8) {
            throw new RuntimeException_1.RuntimeException('level is changed', 204);
        }
        if (updatedTime !== currentEvaluation.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:m', timeZone));
        const updateValue = {
            evaluationId: evaluationId,
            comment: content,
            approverId: approverId,
            receiverId: null,
            receiverOrder: null,
            type: null,
            status: 'IDS_APPROVE',
        };
        const temps = listEvalutor.filter((item) => {
            return item.evaluationOrder > maxOrder;
        });
        let minOrder = (_a = temps[0]) === null || _a === void 0 ? void 0 : _a.evaluationOrder;
        if (minOrder) {
            const customEvalutorOrderList = temps.map((item) => item.evaluationOrder);
            for (let i = 0; i < (customEvalutorOrderList === null || customEvalutorOrderList === void 0 ? void 0 : customEvalutorOrderList.length); i++) {
                if (minOrder > customEvalutorOrderList[i])
                    minOrder = customEvalutorOrderList[i];
            }
        }
        let selectedOrder = ``;
        if (status < 50) {
            updateValue.type = 0;
            if (status === 49) {
                saveStatus = 50;
            }
            else {
                if (maxOrder === '2.0') {
                    saveStatus = 49;
                }
                else {
                    if (minOrder === '1.0') {
                        saveStatus = 5;
                        selectedOrder = '1.0';
                    }
                    if (minOrder === '2.0') {
                        saveStatus = 7;
                        selectedOrder = '2.0';
                    }
                }
            }
        }
        else {
            updateValue.type = 1;
            if (status === 98) {
                saveStatus = 99;
            }
            else {
                if (status === 53) {
                    saveStatus = 54;
                }
                if (status === 56) {
                    saveStatus = 57;
                }
                if (status === 59) {
                    saveStatus = 60;
                }
            }
        }
        const evaluationChange = {
            status: saveStatus,
        };
        const transaction = await this.evaluationRepo.getNewTransaction();
        try {
            await this.evaluationRepo.updateEvaluation(evaluationChange, evaluationId, transaction);
            await this.evaluationRepo.createHistoryApproveReject(updateValue, transaction);
            if (status < 50 && selectedOrder) {
                const tempApprovers = listEvalutor.filter((item) => {
                    if (item.evaluationOrder === selectedOrder)
                        return item;
                });
                await this.mailService.sendMailApproveGoalSetting(tempApprovers[0].evaluatorId, currentEvaluation.userId, evaluationId, host, companyGroupCode);
            }
            else if ([7, 59].includes(saveStatus)) {
            }
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return saveStatus;
    }
    async rejectEvaluation(evaluationId, status, selectedOrder, content, approverId, ownerId, listEvalutor, updatedTime, maxOrder, host, companyGroupCode, timeZone) {
        var _a, _b;
        let saveStatus = status;
        const currentEvaluation = await this.evaluationRepo.getUpdateTime(evaluationId);
        if (currentEvaluation.level < 8) {
            throw new RuntimeException_1.RuntimeException('level is changed', 204);
        }
        if (updatedTime !== currentEvaluation.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:m', timeZone));
        const updateValue = {
            evaluationId: evaluationId,
            comment: content,
            approverId: approverId,
            receiverId: null,
            receiverOrder: null,
            type: null,
            status: '',
        };
        const selectEvaluators = listEvalutor.filter((item) => {
            return item.evaluationOrder === selectedOrder;
        });
        if (status < 50) {
            updateValue.type = 0;
            if (selectedOrder === 'user') {
                saveStatus = 2;
                updateValue.receiverOrder = '0.0';
                updateValue.receiverId = ownerId;
                updateValue.status = '被評価者へ差戻';
            }
            if (selectedOrder === '0.5') {
                saveStatus = 4;
                updateValue.receiverOrder = '0.5';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '仮評価者へ差戻';
            }
            if (selectedOrder === '1.0') {
                saveStatus = 6;
                updateValue.receiverOrder = '1.0';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '一次評価者へ差戻';
            }
            if (selectedOrder === '2.0') {
                saveStatus = 8;
                updateValue.receiverOrder = '2.0';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '二次評価者へ差戻';
            }
        }
        else {
            updateValue.type = 1;
            if (selectedOrder === 'user') {
                saveStatus = 52;
                updateValue.receiverOrder = '0.0';
                updateValue.receiverId = ownerId;
                updateValue.status = '被評価者へ差戻';
            }
            if (selectedOrder === '0.5') {
                saveStatus = 55;
                updateValue.receiverOrder = '0.5';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '仮評価者へ差戻';
            }
            if (selectedOrder === '1.0') {
                saveStatus = 58;
                updateValue.receiverOrder = '1.0';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '一次評価者へ差戻';
            }
            if (selectedOrder === '2.0') {
                saveStatus = 61;
                updateValue.receiverOrder = '2.0';
                updateValue.receiverId = selectEvaluators[0].evaluatorId;
                updateValue.status = '二次評価者へ差戻';
            }
        }
        const evaluationChange = {
            status: saveStatus,
        };
        const tempOrder = [49, 98].includes(status) || !maxOrder ? '3.0' : maxOrder;
        const selectedOrderUser = selectedOrder === 'user' ? 0 : selectedOrder;
        const tempList = listEvalutor.filter((item) => {
            if (item.evaluationOrder > selectedOrderUser &&
                item.evaluationOrder < tempOrder)
                return item;
        });
        let rejectCcList = [];
        if (tempList) {
            rejectCcList = tempList.map((item) => {
                return item.user.email;
            });
        }
        const transaction = await this.evaluationRepo.getNewTransaction();
        try {
            await this.evaluationRepo.updateEvaluation(evaluationChange, evaluationId, transaction);
            await this.evaluationRepo.createHistoryApproveReject(updateValue, transaction);
            await this.mailService.sendMailRejectGoalSetting(approverId, (_b = (_a = selectEvaluators[0]) === null || _a === void 0 ? void 0 : _a.evaluatorId) !== null && _b !== void 0 ? _b : ownerId, ownerId, evaluationId, saveStatus, rejectCcList, host, 'evaluation-8-10', companyGroupCode);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return saveStatus;
    }
    async findListEvaluationItemHistory(query) {
        const versionProSkill = await this.proSkillRepository.findEvaluationItemsProSkill(query);
        return versionProSkill;
    }
    async detailProSkillById(id) {
        const childrens = await this.proSkillRepository.detailProSkill(id);
        if (childrens.length > 0) {
            const rejectComment = await this.proSkillSettingRepository.getRejectComment(id);
            const arrays = childrens.reduce((acc, current) => {
                const parents = acc.find((v) => v.versionId === current.versionProSkill.id);
                const childs = {
                    itemId: current.itemId,
                    versionId: current.versionId,
                    jobType: current.jobType,
                    mediumClass: current.mediumClass,
                    smallClass: current.smallClass,
                    content: current.content,
                    difficulty: current.difficulty,
                    note: current.note,
                    id: current.id,
                };
                const settersAndApprovers = childrens[0].versionProSkill.skill.skillRoles.reduce((acc, skillRole) => {
                    if (skillRole.role == 1) {
                        acc['setters'].push(skillRole.user.fullName);
                    }
                    else if (skillRole.role == 2) {
                        acc['approvers'].push(skillRole.user.fullName);
                    }
                    return acc;
                }, { setters: [], approvers: [] });
                if (!parents) {
                    acc.push({
                        skill: `${current.versionProSkill.skill.name}`,
                        version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
                        versionMain: current.versionProSkill.version,
                        subVersion: current.versionProSkill.subVersion,
                        status: current.versionProSkill.status,
                        publicStatus: current.versionProSkill.publicStatus,
                        creationUser: current.versionProSkill.user.fullName,
                        updatedTime: current.versionProSkill.updatedTime,
                        publicDate: current.versionProSkill.publicDate,
                        reason: current.versionProSkill.reason,
                        lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
                        childrens: [childs],
                        versionId: current.versionId,
                        settersAndApprovers: settersAndApprovers,
                        rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '',
                        dataChildrenFilter: [childs],
                        skillActive: current.versionProSkill.skill.active,
                    });
                }
                else {
                    parents.childrens.push(childs);
                    parents.dataChildrenFilter.push(childs);
                }
                return acc;
            }, []);
            return arrays[0];
        }
        else {
            const datas = await this.proSkillRepository.getProSkillById(id);
            const rejectComment = await this.proSkillSettingRepository.getRejectComment(id);
            const settersAndApprovers = datas.skill.skillRoles.reduce((acc, skillRole) => {
                if (skillRole.role == 1) {
                    acc['setters'].push(skillRole.user.fullName);
                }
                else if (skillRole.role == 2) {
                    acc['approvers'].push(skillRole.user.fullName);
                }
                return acc;
            }, { setters: [], approvers: [] });
            return Object.assign(Object.assign({}, datas.dataValues), { skill: `${datas.dataValues.skill.name}`, version: `${datas.version}.${datas.subVersion}`, versionMain: datas.version, subVersion: datas.subVersion, versionId: datas.dataValues.id, lastUpdatedTime: datas.dataValues.lastUpdatedTime, childrens: [], settersAndApprovers: settersAndApprovers, rejectComment: (rejectComment === null || rejectComment === void 0 ? void 0 : rejectComment.comment) || '', skillActive: datas.skill.active });
        }
    }
    async publicVersionService(id, body, userId, _hostname, _fullName, companyGroupCode, timeZone) {
        const findById = await this.proSkillRepository.getProSkillById(id);
        const years = moment().tz(timeZone);
        const periods = await this.evaluationPeriodRepo.getAll({
            [sequelize_1.Op.and]: [
                {
                    [sequelize_1.Op.or]: [
                        { year: years.tz(timeZone).format('YYYY') },
                        { year: years.add(-1, 'y').format('YYYY') },
                    ],
                },
                {
                    companyGroupCode: companyGroupCode,
                },
                {
                    checkFixed: { [sequelize_1.Op.ne]: 2 },
                },
            ],
        });
        for (let index = 0; index < periods.length; index++) {
            const isDuringGoalSetting = (0, util_1.compareDatePeriod)(periods[index].dateCreationGoalStart, periods[index].dateCreationGoalEnd, timeZone);
            if (isDuringGoalSetting) {
                return {
                    code: 403,
                    isDuringGoalSetting,
                    goalSettingStart: periods[index].dateCreationGoalStart,
                    goalSettingEnd: periods[index].dateCreationGoalEnd,
                    evaluationStart: periods[index].dateEvaluationStart,
                    evaluationEnd: periods[index].dateEvaluationEnd,
                };
            }
        }
        if (new Date(findById.updatedTime).getTime() ===
            new Date(body.updatedTime).getTime()) {
            const versionMax = await this.proSkillRepository.versionMax('version', {
                skillId: findById.skillId,
                companyGroupCode: companyGroupCode,
            });
            const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
            if (findById.subVersion !== 0) {
                try {
                    this.proSkillRepository.updateVersion({
                        publicStatus: 0,
                        publicDate: null,
                    }, {
                        skillId: findById.skillId,
                        publicStatus: 1,
                        companyGroupCode: companyGroupCode,
                    }, transactionVersionProSkill);
                    const dataUpdated = {
                        version: Math.floor(versionMax + 1),
                        subVersion: 0,
                        status: 4,
                        publicStatus: 1,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    };
                    const results = await this.proSkillRepository.updateVersion(dataUpdated, {
                        id: findById.id,
                    }, transactionVersionProSkill);
                    const objectHistory = {
                        versionId: findById.id,
                        comment: body.reason,
                        creationUser: userId,
                        status: '公開',
                        createdTime: new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone)),
                    };
                    await this.proSkillRepository.createHistory(objectHistory, transactionVersionProSkill);
                    await transactionVersionProSkill.commit();
                    return {
                        updatedTime: results[0].updatedTime,
                        version: `${results[0].version}.${results[0].subVersion}`,
                        publicDate: results[0].publicDate,
                        publicStatus: results[0].publicStatus,
                        versionMain: results[0].version,
                        subVersion: results[0].subVersion,
                        status: results[0].status,
                        id: results[0].id,
                    };
                }
                catch (error) {
                    await transactionVersionProSkill.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
            else {
                try {
                    await this.proSkillRepository.updateVersion({
                        publicStatus: 0,
                        publicDate: null,
                    }, {
                        skillId: findById.skillId,
                        publicStatus: 1,
                        companyGroupCode: companyGroupCode,
                    }, transactionVersionProSkill);
                    const dataUpdated = {
                        status: 4,
                        publicStatus: 1,
                        publicDate: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    };
                    const results = await this.proSkillRepository.updateVersion(dataUpdated, {
                        id: findById.id,
                    }, transactionVersionProSkill);
                    const objectHistory = {
                        versionId: findById.id,
                        comment: body.reason,
                        creationUser: userId,
                        status: '公開',
                        createdTime: new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone)),
                    };
                    await this.proSkillRepository.createHistory(objectHistory, transactionVersionProSkill);
                    await transactionVersionProSkill.commit();
                    return {
                        updatedTime: results[0].updatedTime,
                        version: `${results[0].version}.${results[0].subVersion}`,
                        publicDate: results[0].publicDate,
                        publicStatus: results[0].publicStatus,
                        versionMain: results[0].version,
                        subVersion: results[0].subVersion,
                        status: results[0].status,
                        id: results[0].id,
                    };
                }
                catch (error) {
                    await transactionVersionProSkill.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async rejectVersionService(id, body, userId, hostname, companyGroupCode, timeZone) {
        const findById = await this.proSkillRepository.getProSkillById(id);
        if (new Date(findById.updatedTime).getTime() ===
            new Date(body.updatedTime).getTime()) {
            const transactionVersionProSkill = await this.proSkillSettingRepository.getTransactionVersionProSkill();
            if (findById.subVersion !== 0) {
                try {
                    const dataUpdated = {
                        status: 5,
                        publicStatus: 0,
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    };
                    const results = await this.proSkillRepository.updateVersion(dataUpdated, {
                        id: findById.id,
                    }, transactionVersionProSkill);
                    const objectHistory = {
                        versionId: findById.id,
                        comment: body.reason,
                        creationUser: userId,
                        status: '差戻',
                        createdTime: new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone)),
                    };
                    await this.proSkillRepository.createHistory(objectHistory, transactionVersionProSkill);
                    this.mailService.sendMailRejectProSkillFromAdmin(results[0].id, userId, hostname, companyGroupCode);
                    await transactionVersionProSkill.commit();
                    return results[0];
                }
                catch (error) {
                    await transactionVersionProSkill.rollback();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
            else {
                try {
                    const dataUpdated = {
                        status: 5,
                        publicStatus: 0,
                        lastUpdatedTime: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone),
                    };
                    const results = await this.proSkillRepository.updateVersion(dataUpdated, {
                        id: findById.id,
                    }, transactionVersionProSkill);
                    const objectHistory = {
                        versionId: findById.id,
                        comment: body.reason,
                        creationUser: userId,
                        status: '差戻',
                        createdTime: new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone)),
                    };
                    await this.proSkillRepository.createHistory(objectHistory, transactionVersionProSkill);
                    this.mailService.sendMailRejectProSkillFromAdmin(results[0].id, userId, hostname, companyGroupCode);
                    await transactionVersionProSkill.commit();
                    return results[0];
                }
                catch (error) {
                    await transactionVersionProSkill.commit();
                    throw new RuntimeException_1.RuntimeException(error, 500);
                }
            }
        }
        else {
            throw new RuntimeException_1.RuntimeException('Date invalid', 409);
        }
    }
    async checkPermission(evaluationId, userId) {
        const currentEvaluation = await this.evaluationRepo.getUpdateTime(evaluationId);
        return currentEvaluation.userId == userId;
    }
    async checkEvaluatorPermission(evaluationId, userId) {
        const currentEvaluation = await this.evaluationRepo.getUpdateTime(evaluationId);
        const tempList = [];
        if (currentEvaluation && currentEvaluation.evaluator) {
            currentEvaluation.evaluator.map((item) => {
                if (item.evaluatorId == userId)
                    tempList.push(item.evaluatorId);
            });
        }
        return tempList;
    }
    async sendMailFixedGoal(data, companyGroupCode, timeZone, emailHR) {
        const transaction = await this.evaluationRepo.updateHistoryMailTransaction();
        const object = Object.assign(Object.assign({}, data), { toEmails: data.toEmails.toString(), sendTimeActual: (0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:mm', timeZone), evaluationTime: data.goalEvaluation.join(' ~ '), evaluationDepartmentTime: data.goaldepartmentEvaluation.join(' ~ ') });
        try {
            let result;
            if ((data.type === 'fixedGoal' && data.emailType === 1) ||
                (data.type === 'fixedEvaluation' && data.emailType === 3)) {
                result = await this.mailService.sendMailFixedUserEvaluator(data, object, companyGroupCode, transaction);
            }
            else if ((data.type === 'fixedGoal' && data.emailType === 9) ||
                (data.type === 'fixedEvaluation' && data.emailType === 10)) {
                result = await this.mailService.sendMailFixedEvaluator(data, object, companyGroupCode, transaction, emailHR);
            }
            else {
                result = await this.mailService.sendMailFixedGoal(data, data.toEmails, companyGroupCode);
                await this.evaluationRepo.updateHistoryMail(object, companyGroupCode, transaction);
            }
            await this.evaluationRepo.updateGoalCreationTime(data.evaluationPeriodId, data.emailType, data.type, data.goalEvaluation, data.goaldepartmentEvaluation, transaction, timeZone);
            await transaction.commit();
            return result;
        }
        catch (error) {
            console.log(error);
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error.message.toString(), 500);
        }
    }
    async sendMaiNotFixed(data, emailHR) {
        const transaction = await this.evaluationRepo.updateHistoryMailTransaction();
        try {
            const result = await this.mailService.sendMailNotFixed(data, transaction, emailHR);
            await transaction.commit();
            return result;
        }
        catch (error) {
            await transaction.rollback();
            this.logger.log(null, `Send mail remind evaluation failed * ${data.evaluationPeriodId}  * ${data.toEmails}  - ${new Date()} - ${error}`);
            throw new RuntimeException_1.RuntimeException(error, 500);
        }
    }
    async getRejectComment(versionId) {
        return await this.proSkillSettingRepository.getRejectComment(versionId);
    }
    async getEvalNotFixedGoalPeriod(year, period_index, day, companyGroupCode) {
        return await this.evaluationRepo.getAllEvalNotFixedGoalPeriodByPeriod(year, period_index, day, companyGroupCode);
    }
    async getEvalNotFixedEvalPeriod(year, period_index, day, companyGroupCode) {
        return await this.evaluationRepo.getAllEvalNotFixedEvalPeriodByPeriod(year, period_index, day, companyGroupCode);
    }
    async getAllDepartmentEvaluation(query, companyGroupCode) {
        return await this.evaluationRepo.getAllDepartmentEvaluation(query, companyGroupCode);
    }
    async getAllDepartmentEvaluationDefault(query, companyGroupCode) {
        return await this.evaluationRepo.getAllDepartmentEvaluationDefault(query, companyGroupCode);
    }
    async getDetailProfessionalExpertise(userId, yearStart, yearEnd, companyGroupCode, evaluatorId) {
        const evaluationPeriod = (await this.evaluatorRepository.getLastestPeriodIdByEvaluator(evaluatorId, companyGroupCode)).map((item) => {
            return {
                evaluationPeriodId: item.evaluationPeriodId,
            };
        });
        const datas = await this.evaluationRepo.getProfessionalExpertiseDetail(userId, yearStart, yearEnd, companyGroupCode, evaluationPeriod[0].evaluationPeriodId);
        const resultsEvaluationProList = [];
        for (let index = 0; index < datas.length; index++) {
            for (let i = 0; i < datas[index].evaluations.length; i++) {
                for (let j = 0; j < datas[index].evaluations[i].evaluationPro.length; j++) {
                    const itemTitle = datas[index].evaluations[i].evaluationPro[j].itemTitle.split('_');
                    itemTitle.pop();
                    resultsEvaluationProList.push({
                        year: datas[index].year,
                        periodIndex: datas[index].periodIndex,
                        largeClass: itemTitle[0],
                        mediumClass: itemTitle.join('_'),
                        smallClass: datas[index].evaluations[i].evaluationPro[j].itemTitle
                            .split('_')
                            .pop(),
                        difficulty: datas[index].evaluations[i].evaluationPro[j].difficulty,
                        pointEvaluator2: datas[index].evaluations[i].evaluationPro[j].pointEvaluator2,
                        evaluationId: datas[index].evaluations[i].evaluationPro[j].evaluationId,
                        jobType: datas[index].evaluations[i].evaluationPro[j].jobType,
                    });
                }
            }
        }
        const mergeObjectsJobType = resultsEvaluationProList.reduce((acc, curr) => {
            if (!acc[`${curr.jobType}`]) {
                acc[`${curr.jobType}`] = {
                    jobType: curr.jobType,
                    childrens: [],
                };
            }
            acc[`${curr.jobType}`].childrens.push({
                mediumClass: curr.mediumClass,
                largeClass: curr.largeClass,
                smallClass: curr.smallClass,
                difficulty: curr.difficulty,
                pointEvaluator2: curr.pointEvaluator2,
                evaluationId: curr.evaluationId,
                year: curr.year,
                periodIndex: curr.periodIndex,
            });
            return acc;
        }, {});
        const resultsJobByPeriod = Object.values(mergeObjectsJobType).map((v, i) => {
            const childrensByPeriod = v.childrens.reduce((acc, curr) => {
                if (!acc[`${curr.year}-${curr.periodIndex}`]) {
                    acc[`${curr.year}-${curr.periodIndex}`] = {
                        year: curr.year,
                        periodIndex: curr.periodIndex,
                        childs: [],
                    };
                }
                acc[`${curr.year}-${curr.periodIndex}`].childs.push({
                    year: curr.year,
                    periodIndex: curr.periodIndex,
                    difficulty: curr.difficulty,
                    mediumClass: curr.mediumClass,
                    largeClass: curr.largeClass,
                    smallClass: curr.smallClass,
                    pointEvaluator2: curr.pointEvaluator2,
                    evaluationId: curr.evaluationId,
                });
                return acc;
            }, {});
            v.childrens = Object.values(childrensByPeriod);
            return v;
        });
        resultsJobByPeriod.map((v) => {
            const childrens = v.childrens.map((val) => {
                const largeClassfications = val.childs.reduce((acc, curr) => {
                    const mediumClassSlice = curr.mediumClass.split('_');
                    if (!acc[curr.largeClass]) {
                        acc[curr.largeClass] = {
                            largeClass: curr.largeClass,
                            year: curr.year,
                            periodIndex: curr.periodIndex,
                            evaluationId: curr.evaluationId,
                            childrens: [],
                        };
                    }
                    acc[curr.largeClass].childrens.push({
                        difficulty: curr.difficulty,
                        mediumClass: mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                            mediumClassSlice[0],
                        smallClass: curr.smallClass,
                        pointEvaluator2: curr.pointEvaluator2,
                    });
                    return acc;
                }, []);
                const mediumClassfications = val.childs.reduce((acc, curr) => {
                    const mediumClassSlice = curr.mediumClass.split('_');
                    if (!acc[mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                        mediumClassSlice[0]]) {
                        acc[mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                            mediumClassSlice[0]] = {
                            largeClass: curr.largeClass,
                            mediumClass: mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                                mediumClassSlice[0],
                            year: curr.year,
                            periodIndex: curr.periodIndex,
                            evaluationId: curr.evaluationId,
                            childrens: [],
                        };
                    }
                    acc[mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                        mediumClassSlice[0]].childrens.push({
                        largeClass: curr.largeClass,
                        difficulty: curr.difficulty,
                        mediumClass: mediumClassSlice.slice(1).join('_').replace(/\n/g, '') ||
                            mediumClassSlice[0],
                        smallClass: curr.smallClass,
                        pointEvaluator2: curr.pointEvaluator2,
                    });
                    return acc;
                }, []);
                val.childrenLarge = Object.values(largeClassfications);
                val.childrenMedium = Object.values(mediumClassfications);
                return val;
            });
            return v;
        });
        const CaculatorJobTypeList = resultsJobByPeriod.map((v, i) => {
            const jobAnyPeriod = v.childrens.map((val, index) => {
                const totalPoint = val.childs.reduce((acc, curr) => {
                    return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
                }, 0);
                val.totalPoint = Number(Math.round(totalPoint / val.childs.length).toFixed(2));
                val.childrenMedium.map((childMe, index) => {
                    const totalPoint = childMe.childrens.reduce((acc, curr) => {
                        return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
                    }, 0);
                    childMe.totalPoint = Number(Math.round(totalPoint / childMe.childrens.length).toFixed(2));
                    return childMe;
                });
                val.childrenLarge.map((childMe, index) => {
                    const totalPoint = childMe.childrens.reduce((acc, curr) => {
                        return acc + Math.floor(curr.pointEvaluator2 * curr.difficulty);
                    }, 0);
                    childMe.totalPoint = Number(Math.round(totalPoint / childMe.childrens.length).toFixed(2));
                    return childMe;
                });
                return val;
            });
            return v;
        });
        const result = CaculatorJobTypeList.map((job) => {
            const allClassPairs = Array.from(new Set(job.childrens.flatMap((child) => child.childs.map((childItem) => `${childItem.mediumClass}::${childItem.smallClass}`)))).map((pair) => {
                const [mediumClass, smallClass] = pair.split('::');
                return { mediumClass, smallClass };
            });
            const updatedChildrens = job.childrens.map((child) => {
                const childMap = new Map(child.childs.map((childItem) => [
                    `${childItem.mediumClass}::${childItem.smallClass}`,
                    childItem,
                ]));
                const updatedChilds = allClassPairs.map(({ mediumClass, smallClass }) => {
                    if (childMap.has(`${mediumClass}::${smallClass}`)) {
                        return childMap.get(`${mediumClass}::${smallClass}`);
                    }
                    else {
                        const mediumClassSlice = mediumClass.split('_');
                        return {
                            largeClass: mediumClassSlice[0],
                            mediumClass,
                            smallClass,
                            pointEvaluator2: 0,
                            difficulty: 0,
                            periodIndex: child.periodIndex,
                            year: child.year,
                        };
                    }
                });
                return Object.assign(Object.assign({}, child), { childs: updatedChilds });
            });
            const allClassPairsMediumClass = Array.from(new Set(job.childrens.flatMap((child) => child.childrenMedium.map((childItem) => `${childItem.mediumClass}::${childItem.largeClass}`)))).map((pair) => {
                const [mediumClass, largeClass] = pair.split('::');
                return { mediumClass, largeClass };
            });
            const mediumClassChildrens = job.childrens.map((child) => {
                const childMap = new Map(child.childrenMedium.map((childItem) => [
                    `${childItem.mediumClass}`,
                    childItem,
                ]));
                const updatedChilds = allClassPairsMediumClass.map(({ mediumClass, largeClass }) => {
                    if (childMap.has(`${mediumClass}`)) {
                        return childMap.get(`${mediumClass}`);
                    }
                    else {
                        return {
                            largeClass,
                            mediumClass,
                            pointEvaluator2: 0,
                            difficulty: 0,
                            periodIndex: child.periodIndex,
                            year: child.year,
                            totalPoint: 0,
                        };
                    }
                });
                return updatedChilds;
            });
            const allClassPairsLargeClass = Array.from(new Set(job.childrens.flatMap((child) => child.childrenLarge.map((childItem) => `${childItem.largeClass}`)))).map((pair) => {
                const [largeClass] = pair.split('::');
                return { largeClass };
            });
            const largelassChildrens = job.childrens.map((child) => {
                const childMap = new Map(child.childrenLarge.map((childItem) => [
                    `${childItem.largeClass}`,
                    childItem,
                ]));
                const updatedChilds = allClassPairsLargeClass.map(({ largeClass }) => {
                    if (childMap.has(`${largeClass}`)) {
                        return childMap.get(`${largeClass}`);
                    }
                    else {
                        return {
                            largeClass,
                            pointEvaluator2: 0,
                            difficulty: 0,
                            periodIndex: child.periodIndex,
                            year: child.year,
                            totalPoint: 0,
                        };
                    }
                });
                return updatedChilds;
            });
            return Object.assign(Object.assign({}, job), { childrens: updatedChildrens, childrenMedium: mediumClassChildrens
                    .flat()
                    .sort((a, b) => a.year - b.year), childrenLarge: largelassChildrens
                    .flat()
                    .sort((a, b) => a.year - b.year) });
        });
        result.forEach((element) => {
            element.childrens.sort((a, b) => a.year - b.year);
        });
        return {
            results: result,
        };
    }
    async goalsPastEvaluation(type, year, periodIndex, userId, evaluationPeriodId) {
        return await this.evaluationPeriodRepo.goalsPastEvaluationRepo(type, year, periodIndex, userId, evaluationPeriodId);
    }
};
__decorate([
    (0, common_1.Inject)(evaluation_repository_1.EvaluationRepository),
    __metadata("design:type", Object)
], EvaluationService.prototype, "evaluationRepo", void 0);
__decorate([
    (0, common_1.Inject)(proSkill_repository_1.ProSkillRepository),
    __metadata("design:type", proSkill_repository_1.ProSkillRepository)
], EvaluationService.prototype, "proSkillRepository", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], EvaluationService.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(proSkillSetting_repository_1.ProSkillSettingRepository),
    __metadata("design:type", proSkillSetting_repository_1.ProSkillSettingRepository)
], EvaluationService.prototype, "proSkillSettingRepository", void 0);
__decorate([
    (0, common_1.Inject)(evaluationPeriod_repository_1.EvaluationPeriodRepository),
    __metadata("design:type", evaluationPeriod_repository_1.EvaluationPeriodRepository)
], EvaluationService.prototype, "evaluationPeriodRepo", void 0);
__decorate([
    (0, common_1.Inject)(divisionSubClass_repository_1.DivisionSubClassRepository),
    __metadata("design:type", divisionSubClass_repository_1.DivisionSubClassRepository)
], EvaluationService.prototype, "divisionSubClassRepository", void 0);
__decorate([
    (0, common_1.Inject)(approval_repository_1.ApprovalRepository),
    __metadata("design:type", approval_repository_1.ApprovalRepository)
], EvaluationService.prototype, "evaluationApprovalHistory", void 0);
__decorate([
    (0, common_1.Inject)(summaryDepartment_repository_1.SummaryDepartmentRepository),
    __metadata("design:type", summaryDepartment_repository_1.SummaryDepartmentRepository)
], EvaluationService.prototype, "summaryDepartmentRepository", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], EvaluationService.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(evaluator_repository_1.EvaluatorRepository),
    __metadata("design:type", evaluator_repository_1.EvaluatorRepository)
], EvaluationService.prototype, "evaluatorRepository", void 0);
EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], EvaluationService);
exports.EvaluationService = EvaluationService;
//# sourceMappingURL=evaluation.service.js.map