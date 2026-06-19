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
exports.EvaluatorServices = void 0;
const common_1 = require("@nestjs/common");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const evaluator_repository_1 = require("../repository/evaluator.repository");
const mail_service_1 = require("./mail.service");
const user_repository_1 = require("../repository/user.repository");
const util_1 = require("../common/util");
const report_service_1 = require("./report.service");
let EvaluatorServices = class EvaluatorServices {
    async searchListUserEvaluator2(params) {
        var _a;
        const listUsers = await this.evaluatorRepo.listUserEvaluator(params);
        const counts = (_a = listUsers[0]) === null || _a === void 0 ? void 0 : _a.count;
        const arrays = [];
        const arrayIdUserList = listUsers.map((e) => e.userId);
        const listEvaluationsFull = await this.evaluatorRepo.findEvaluatorByPeriod(arrayIdUserList, params);
        arrayIdUserList.forEach((record) => {
            var _a, _b, _c, _d, _e, _f;
            const listEvaluations = listEvaluationsFull.filter((v) => v.user.id === record);
            let isHasOneEvaluation = false;
            const arrayChilds = [];
            let evaluationEnd = listEvaluations[0];
            if (listEvaluations.length > 1) {
                const lastEvaluator = evaluationEnd.evaluator.findIndex((v) => v.evaluatorId === params.evaluatorId) >= 0;
                if (lastEvaluator) {
                    listEvaluations.map((evaluation) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        arrayChilds.push({
                            userId: evaluation.userId,
                            employeeNumber: (_a = evaluation.user) === null || _a === void 0 ? void 0 : _a.employeeNumber,
                            level: evaluation.level,
                            departmentName: evaluation.departmentName,
                            divisionName: evaluation.divisionName,
                            evaluationPeriodId: evaluation.evaluationPeriodId,
                            title: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                            fullName: `${(_b = evaluation.user) === null || _b === void 0 ? void 0 : _b.employeeNumber}: ${(_c = evaluation.user) === null || _c === void 0 ? void 0 : _c.fullName}`,
                            evaluationOrder: (_d = evaluation.evaluator.find((e) => e.evaluatorId === params.evaluatorId)) === null || _d === void 0 ? void 0 : _d.evaluationOrder,
                            evaluatorId: params.evaluatorId,
                            status: evaluation.status,
                            summaryPointEvaluator2: evaluation.status === 100
                                ? evaluation.level <= 7
                                    ? evaluation.summaryPointEvaluator2 !== null
                                        ? Math.round(evaluation.summaryPointEvaluator2)
                                        : ''
                                    : ((_e = evaluation.summaryDepartment) === null || _e === void 0 ? void 0 : _e.summaryPointEvaluator2) !==
                                        null
                                        ? (Math.floor(((_f = evaluation.summaryDepartment) === null || _f === void 0 ? void 0 : _f.summaryPointEvaluator2) *
                                            10) / 10).toFixed(1)
                                        : ''
                                : '',
                            percentPoint: evaluation.percentPoint,
                            periodStart: evaluation.periodStart,
                            periodEnd: evaluation.periodEnd,
                            evaluationId: ((_g = evaluation.evaluator[0]) === null || _g === void 0 ? void 0 : _g.evaluationId) || evaluation.id,
                            dateEvaluationStartEval: evaluation.dateEvaluationStart
                                ? evaluation.dateEvaluationStart
                                : evaluation.level <= 7
                                    ? evaluation.evaluationPeriod[0].dateEvaluationStart
                                    : evaluation.evaluationPeriod[0].dateEvaluationDepartmentStart,
                            dateEvaluationEndEval: evaluation.dateEvaluationEnd
                                ? evaluation.dateEvaluationEnd
                                : evaluation.level <= 7
                                    ? evaluation.evaluationPeriod[0].dateEvaluationEnd
                                    : evaluation.evaluationPeriod[0].dateEvaluationDepartmentEnd,
                        });
                    });
                }
                else {
                    const evaluationOfEvaluator = listEvaluations.filter((evaluation) => evaluation.evaluator.some((e) => e.evaluatorId === params.evaluatorId));
                    if ((evaluationOfEvaluator === null || evaluationOfEvaluator === void 0 ? void 0 : evaluationOfEvaluator.length) <= 1) {
                        isHasOneEvaluation = true;
                        evaluationEnd = evaluationOfEvaluator[0];
                    }
                    else {
                        evaluationOfEvaluator.map((evaluation) => {
                            var _a, _b, _c, _d, _e, _f, _g;
                            arrayChilds.push({
                                userId: evaluation.userId,
                                employeeNumber: (_a = evaluation.user) === null || _a === void 0 ? void 0 : _a.employeeNumber,
                                level: evaluation.level,
                                departmentName: evaluation.departmentName,
                                divisionName: evaluation.divisionName,
                                evaluationPeriodId: evaluation.evaluationPeriodId,
                                title: `${evaluation.periodStart} ～ ${evaluation.periodEnd}`,
                                fullName: `${(_b = evaluation.user) === null || _b === void 0 ? void 0 : _b.employeeNumber}: ${(_c = evaluation.user) === null || _c === void 0 ? void 0 : _c.fullName}`,
                                evaluationOrder: (_d = evaluation.evaluator.find((e) => e.evaluatorId === params.evaluatorId)) === null || _d === void 0 ? void 0 : _d.evaluationOrder,
                                evaluatorId: params.evaluatorId,
                                status: evaluation.status,
                                summaryPointEvaluator2: evaluation.status === 100
                                    ? evaluation.level <= 7
                                        ? evaluation.summaryPointEvaluator2 !== null
                                            ? Math.round(evaluation.summaryPointEvaluator2)
                                            : ''
                                        : ((_e = evaluation.summaryDepartment) === null || _e === void 0 ? void 0 : _e.summaryPointEvaluator2) !==
                                            null
                                            ? Math.round(Number((_f = evaluation.summaryDepartment) === null || _f === void 0 ? void 0 : _f.summaryPointEvaluator2) * 10) / 10
                                            : ''
                                    : '',
                                percentPoint: evaluation.percentPoint,
                                periodStart: evaluation.periodStart,
                                periodEnd: evaluation.periodEnd,
                                evaluationId: ((_g = evaluation.evaluator[0]) === null || _g === void 0 ? void 0 : _g.evaluationId) || evaluation.id,
                                dateEvaluationStartEval: evaluation.dateEvaluationStart
                                    ? evaluation.dateEvaluationStart
                                    : evaluation.level <= 7
                                        ? evaluation.evaluationPeriod[0].dateEvaluationStart
                                        : evaluation.evaluationPeriod[0]
                                            .dateEvaluationDepartmentStart,
                                dateEvaluationEndEval: evaluation.dateEvaluationEnd
                                    ? evaluation.dateEvaluationEnd
                                    : evaluation.level <= 7
                                        ? evaluation.evaluationPeriod[0].dateEvaluationEnd
                                        : evaluation.evaluationPeriod[0].dateEvaluationDepartmentEnd,
                            });
                        });
                    }
                }
            }
            else {
                isHasOneEvaluation = true;
            }
            let totalPoint = undefined;
            if (isHasOneEvaluation) {
                totalPoint =
                    evaluationEnd.status === 100
                        ? evaluationEnd.level <= 7
                            ? evaluationEnd.summaryPointEvaluator2 !== null
                                ? Math.round(evaluationEnd.summaryPointEvaluator2)
                                : ''
                            : ((_a = evaluationEnd.summaryDepartment) === null || _a === void 0 ? void 0 : _a.summaryPointEvaluator2) !== null
                                ? Math.round(Number((_b = evaluationEnd.summaryDepartment) === null || _b === void 0 ? void 0 : _b.summaryPointEvaluator2) * 10) / 10
                                : ''
                        : '';
            }
            else if ((arrayChilds === null || arrayChilds === void 0 ? void 0 : arrayChilds.length) > 0) {
                const allStatusesAre100 = arrayChilds.every((child) => child.status === 100);
                const allLevels17 = arrayChilds.every((child) => child.level < 8);
                const allLevels810 = arrayChilds.every((child) => child.level >= 8);
                const allConditionsMet = allStatusesAre100 && (allLevels17 || allLevels810);
                if (allConditionsMet) {
                    let isHasSummaryPoint = false;
                    totalPoint = 0;
                    arrayChilds.map((v) => {
                        if (v.summaryPointEvaluator2 !== null &&
                            v.summaryPointEvaluator2 !== '') {
                            isHasSummaryPoint = true;
                            totalPoint +=
                                (Number(v.summaryPointEvaluator2) *
                                    (v.percentPoint !== null ? v.percentPoint : 100)) /
                                    100;
                        }
                    });
                    if (isHasSummaryPoint) {
                        if (allLevels17) {
                            totalPoint = Math.round(totalPoint);
                        }
                        else if (allLevels810) {
                            totalPoint = Math.round(Number(totalPoint) * 10) / 10;
                        }
                    }
                    else {
                        totalPoint = '';
                    }
                }
                else if (allStatusesAre100 && !allLevels17 && !allLevels810) {
                    totalPoint = '-';
                }
            }
            arrays.push({
                id: isHasOneEvaluation
                    ? undefined
                    : Math.random().toString(36).slice(4),
                userId: evaluationEnd.userId,
                employeeNumber: (_c = evaluationEnd.user) === null || _c === void 0 ? void 0 : _c.employeeNumber,
                level: evaluationEnd.level,
                departmentName: evaluationEnd.departmentName,
                divisionName: evaluationEnd.divisionName,
                evaluationPeriodId: evaluationEnd.evaluationPeriodId,
                title: evaluationEnd.title,
                fullName: `${(_d = evaluationEnd.user) === null || _d === void 0 ? void 0 : _d.employeeNumber}: ${(_e = evaluationEnd.user) === null || _e === void 0 ? void 0 : _e.fullName}`,
                evaluationOrder: isHasOneEvaluation
                    ? evaluationEnd.evaluator.find((v) => v.evaluatorId === params.evaluatorId).evaluationOrder
                    : null,
                evaluatorId: params.evaluatorId,
                status: evaluationEnd.status,
                summaryPointEvaluator2: totalPoint,
                percentPoint: evaluationEnd.percentPoint,
                periodStart: evaluationEnd.periodStart,
                periodEnd: evaluationEnd.periodEnd,
                evaluationId: ((_f = evaluationEnd.evaluator[0]) === null || _f === void 0 ? void 0 : _f.evaluationId) || evaluationEnd.id,
                dateEvaluationStartEval: evaluationEnd.dateEvaluationStart
                    ? evaluationEnd.dateEvaluationStart
                    : evaluationEnd.level <= 7
                        ? evaluationEnd.evaluationPeriod[0].dateEvaluationStart
                        : evaluationEnd.evaluationPeriod[0].dateEvaluationDepartmentStart,
                dateEvaluationEndEval: evaluationEnd.dateEvaluationEnd
                    ? evaluationEnd.dateEvaluationEnd
                    : evaluationEnd.level <= 7
                        ? evaluationEnd.evaluationPeriod[0].dateEvaluationEnd
                        : evaluationEnd.evaluationPeriod[0].dateEvaluationDepartmentEnd,
                childs: isHasOneEvaluation ? undefined : arrayChilds,
            });
        });
        return {
            data: arrays,
            counts: counts,
        };
    }
    findSendApproveNextPerson(evaluators, evaluationOrder) {
        const evaluator = evaluators.find((f) => {
            return evaluationOrder.some((s) => s === Number(f.evaluationOrder));
        });
        if (Number(evaluator === null || evaluator === void 0 ? void 0 : evaluator.evaluationOrder) === 1)
            return 5;
        if (Number(evaluator === null || evaluator === void 0 ? void 0 : evaluator.evaluationOrder) === 2)
            return 7;
        return 49;
    }
    async sendApproveStatus(evaluationId, comment, approverId, type, updateTime, host, companyGroupCode, timeZone) {
        const evaluationDetail = await this.evaluatorRepo.getEvaluationById(evaluationId);
        if (updateTime !== evaluationDetail.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const evaluatorDefault = await this.userRepo.getEvaluatorDefault(evaluationDetail.user.id, evaluationDetail.evaluationPeriodId);
        if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        }
        let receiverOrder = 0;
        const status = '承認';
        const evaluators = evaluationDetail.evaluator;
        const findEvaluator = evaluators.find((f) => f.evaluatorId === approverId);
        const statusEvaluationSend = evaluationDetail.status;
        if (!findEvaluator && ![49, 98].includes(evaluationDetail.status))
            throw new RuntimeException_1.RuntimeException('Not found evaluation id', 500);
        receiverOrder = findEvaluator === null || findEvaluator === void 0 ? void 0 : findEvaluator.evaluationOrder;
        if (statusEvaluationSend === 49) {
            type = 0;
            evaluationDetail.status = 50;
        }
        if (statusEvaluationSend === 98) {
            type = 1;
            evaluationDetail.status = 99;
        }
        let selectedOrder = ``;
        if ([7, 8].includes(statusEvaluationSend) && Number(receiverOrder) === 2) {
            evaluationDetail.status = 49;
        }
        if ([5, 6].includes(statusEvaluationSend) && Number(receiverOrder) === 1) {
            const statusNumber = this.findSendApproveNextPerson(evaluators, [2]);
            evaluationDetail.status = statusNumber;
            if (statusNumber === 7)
                selectedOrder = '2.0';
        }
        if ([3, 4].includes(statusEvaluationSend) &&
            Number(receiverOrder) === 0.5) {
            const statusNumber = this.findSendApproveNextPerson(evaluators, [1, 2]);
            evaluationDetail.status = statusNumber;
            if (statusNumber === 5)
                selectedOrder = '1.0';
            if (statusNumber === 7)
                selectedOrder = '2.0';
        }
        if (statusEvaluationSend === 53 && Number(receiverOrder) === 0.5) {
            evaluationDetail.status = 54;
        }
        if (statusEvaluationSend === 56 && Number(receiverOrder) === 1) {
            evaluationDetail.status = 57;
        }
        if (statusEvaluationSend === 59 && Number(receiverOrder) === 2) {
            evaluationDetail.status = 60;
        }
        const transaction = await this.evaluatorRepo.getNewTransaction();
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY/M/D H:m', timeZone));
        try {
            await this.evaluatorRepo
                .updateApprovedStatus(evaluationId, comment, approverId, null, receiverOrder, type, status, transaction)
                .then(() => evaluationDetail.save({ transaction }));
            if (evaluationDetail.status < 50 && selectedOrder) {
                const tempApprover = evaluators.filter((item) => {
                    if (item.evaluationOrder === selectedOrder)
                        return item;
                });
                await this.mailService.sendMailApproveGoalSetting(tempApprover[0].evaluatorId, evaluationDetail.userId, evaluationId, host, companyGroupCode);
            }
            else if ([7, 59].includes(evaluationDetail.status)) {
            }
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            statusNumber: evaluationDetail.status,
            updateTime: evaluationDetail.updatedTime.toISOString(),
        };
    }
    findSendRejectNextPerson(evaluators, dataInput, dataReturn) {
        for (let i = 0; i < dataInput.length; i++) {
            const element = dataInput[i];
            const evaluator = evaluators.find((f) => Number(f.evaluationOrder) === element.evaluationOrder);
            if (evaluator) {
                return {
                    statusReject: element.statusReject,
                    receiverId: evaluator.evaluatorId,
                    evaluationOrder: evaluator.evaluationOrder,
                };
            }
        }
        return dataReturn;
    }
    async sendRejectStatus(evaluationId, comment, approverId, type, statusReject, updateTime, host, companyGroupCode, timeZone) {
        const evaluationDetail = await this.evaluatorRepo.getEvaluationById(evaluationId);
        if (updateTime !== evaluationDetail.updatedTime.toISOString())
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        const evaluatorDefault = await this.userRepo.getEvaluatorDefault(evaluationDetail.user.id, evaluationDetail.evaluationPeriodId);
        if (evaluationDetail.user.active !== 1 || !evaluatorDefault) {
            throw new RuntimeException_1.RuntimeException('Evaluation is duplicate', 409);
        }
        let receiverOrder = 0;
        let receiverId = 0;
        let status = '';
        const evaluators = evaluationDetail.evaluator;
        const findEvaluator = evaluators.find((f) => f.evaluatorId === approverId);
        if (evaluationDetail.status < 50)
            type = 0;
        else
            type = 1;
        const dataRet = {
            statusReject: '2',
            receiverId: evaluationDetail.userId,
            evaluationOrder: 0,
        };
        const evaluatorObject = {
            '0.5': '仮評価者へ差戻',
            '1.0': '一次評価者へ差戻',
            '2.0': '二次評価者へ差戻',
        };
        status = '';
        if (statusReject === '2') {
            evaluationDetail.status = Number(statusReject);
            receiverId = evaluationDetail.userId;
            status = status + '被評価者へ差戻';
        }
        if (statusReject === '4') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [{ evaluationOrder: 0.5, statusReject }], Object.assign({}, dataRet));
            if (!evaluator)
                throw new RuntimeException_1.RuntimeException('Not found evaluator 0.5', 500);
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        if (statusReject === '6') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [
                { evaluationOrder: 1.0, statusReject },
                { evaluationOrder: 0.5, statusReject: '4' },
            ], Object.assign({}, dataRet));
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        if (statusReject === '8') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [
                { evaluationOrder: 2.0, statusReject },
                { evaluationOrder: 1.0, statusReject: '6' },
                { evaluationOrder: 0.5, statusReject: '4' },
            ], Object.assign({}, dataRet));
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        const dataRet2 = {
            statusReject: '2',
            receiverId: evaluationDetail.userId,
            evaluationOrder: 0,
        };
        if (statusReject === '52') {
            evaluationDetail.status = Number(statusReject);
            receiverId = evaluationDetail.userId;
            status = status + '被評価者へ差戻';
        }
        if (statusReject === '55') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [{ evaluationOrder: 0.5, statusReject }], Object.assign({}, dataRet2));
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        if (statusReject === '58') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [
                { evaluationOrder: 1.0, statusReject },
                { evaluationOrder: 0.5, statusReject: '54' },
            ], Object.assign({}, dataRet2));
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        if (statusReject === '61') {
            const evaluator = this.findSendRejectNextPerson(evaluators, [
                { evaluationOrder: 2.0, statusReject },
                { evaluationOrder: 1.0, statusReject: '58' },
                { evaluationOrder: 0.5, statusReject: '54' },
            ], Object.assign({}, dataRet2));
            evaluationDetail.status = Number(evaluator.statusReject);
            receiverId = evaluator.receiverId;
            receiverOrder = evaluator.evaluationOrder;
            status = status + evaluatorObject[evaluator.evaluationOrder];
        }
        const transaction = await this.evaluatorRepo.getNewTransaction();
        const dates = new Date((0, util_1.isFormatDate)(new Date(), 'YYYY-M-D HH:mm:ss', timeZone));
        try {
            await this.evaluatorRepo
                .updateApprovedStatus(evaluationId, comment, approverId, receiverId, receiverOrder, type, status, transaction)
                .then(() => evaluationDetail.save({ transaction }));
            const tempOrder = (findEvaluator === null || findEvaluator === void 0 ? void 0 : findEvaluator.evaluationOrder) || '3.0';
            let rejectCcList = evaluators.filter((item) => {
                if (item.evaluationOrder > receiverOrder &&
                    item.evaluationOrder < tempOrder)
                    return item;
            });
            if (rejectCcList)
                rejectCcList = rejectCcList.map((item) => {
                    return item.user.email;
                });
            await this.mailService.sendMailRejectGoalSetting(approverId, receiverId !== null && receiverId !== void 0 ? receiverId : evaluationDetail.userId, evaluationDetail.userId, evaluationId, Number(statusReject), rejectCcList, host, 'evaluation', companyGroupCode);
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            statusNumber: evaluationDetail.status,
            updateTime: evaluationDetail.updatedTime.toISOString(),
            comment,
        };
    }
    async exportHistoryEvaluationEvaluator(params, userId, companyGroupCode) {
        const { fullName, yearStart, yearEnd, yearEvaluate, periodEvaluate } = params;
        const { department = null } = params;
        const data = await this.evaluatorRepo.exportHistoryEvaluationEvaluator(department, fullName, yearStart, yearEnd, userId, companyGroupCode, yearEvaluate, periodEvaluate);
        return data;
    }
    async getListDepartmentToExportHistoryEvaluation(userId, companyGroupCode, params) {
        const data = await this.evaluatorRepo.getDivDepToExportHistoryEvaluation(userId, companyGroupCode, params);
        return data;
    }
    async listUserProSkillExpertise(params, userId, companyGroupCode) {
        const { fullName, yearStart, yearEnd, offset, limit, sortColumns, sortDirections, yearEvaluate, periodEvaluate, } = params;
        let { department = null } = params;
        if (department != null) {
            department = department === null || department === void 0 ? void 0 : department.map((dep) => dep.split(':')[1]);
        }
        const data = await this.evaluatorRepo.listUserProSkillExpertise(department, fullName, yearStart, yearEnd, userId, companyGroupCode, offset, limit, sortColumns !== null && sortColumns !== void 0 ? sortColumns : [], sortDirections !== null && sortDirections !== void 0 ? sortDirections : [], yearEvaluate, periodEvaluate);
        return data;
    }
    async getListDepartmentExpertise(userId, companyGroupCode, params) {
        const data = await this.evaluatorRepo.getListDepartmentExpertise(userId, companyGroupCode, params);
        return data;
    }
    async exportPDFProSkillExpertise(body, companyGroupCode, timeZone) {
        const year = body.year;
        const periodIndex = body.periodIndex;
        const userId = body.userId;
        const evaluationDatas = await this.evaluatorRepo.getListEvaluationToExportPDF(year, periodIndex, userId, companyGroupCode);
        if (evaluationDatas.evaluationNormal !== null ||
            evaluationDatas.evaluationException !== null) {
            if (evaluationDatas.evaluationNormal !== null) {
                const idList = [];
                idList.push(evaluationDatas.evaluationNormal.id);
                if (evaluationDatas.evaluationNormal.level < 8) {
                    const data = await this.reportService.exportReportPdfReview17(idList, userId, true, false, false, companyGroupCode, timeZone);
                    const result = {
                        dataPdf: data,
                        dataLenght: 1,
                    };
                    return result;
                }
                else {
                    const data = await this.reportService.exportReportPdfReview810(idList, userId, true, false, false, companyGroupCode, timeZone);
                    const result = {
                        dataPdf: data,
                        dataLenght: 1,
                    };
                    return result;
                }
            }
            else if (evaluationDatas.evaluationException !== null) {
                const childrenList = [];
                evaluationDatas.evaluationException.map((item) => {
                    childrenList.push({
                        evaluationId: item.id,
                        level: item.level,
                    });
                });
                if (childrenList.length > 1) {
                    const idList810 = [];
                    const idList17 = [];
                    const idList = [];
                    childrenList.map((child) => {
                        if ([8, 9, 10].includes(child.level))
                            idList810.push(child.evaluationId);
                        if (child.level <= 7)
                            idList17.push(child.evaluationId);
                        idList.push(child.evaluationId);
                    });
                    if (idList810.length === childrenList.length) {
                        const data = await this.reportService.exportReportPdfReview810(idList810, userId, true, true, true, companyGroupCode, timeZone);
                        const result = {
                            dataPdf: data,
                            dataLenght: childrenList.length,
                        };
                        return result;
                    }
                    if (idList17.length === childrenList.length) {
                        const data = await this.reportService.exportReportPdfReview17(idList17, userId, true, true, true, companyGroupCode, timeZone);
                        const result = {
                            dataPdf: data,
                            dataLenght: childrenList.length,
                        };
                        return result;
                    }
                    if (idList810.length !== childrenList.length &&
                        idList17.length !== childrenList.length) {
                        const data = await this.reportService.exportPDFMultiLevel(userId, idList17, idList810, 'admin', true, companyGroupCode, timeZone);
                        const result = {
                            dataPdf: data,
                            dataLenght: childrenList.length,
                        };
                        return result;
                    }
                }
                else if (childrenList.length === 1) {
                    const idList = [];
                    idList.push(childrenList[0].evaluationId);
                    if (childrenList[0].level < 8) {
                        const data = await this.reportService.exportReportPdfReview17(idList, userId, true, false, false, companyGroupCode, timeZone);
                        const result = {
                            dataPdf: data,
                            dataLenght: 1,
                        };
                        return result;
                    }
                    else {
                        const data = await this.reportService.exportReportPdfReview810(idList, userId, true, false, false, companyGroupCode, timeZone);
                        const result = {
                            dataPdf: data,
                            dataLenght: 1,
                        };
                        return result;
                    }
                }
            }
        }
        else {
            const result = {
                dataPdf: [],
                dataLenght: 0,
            };
            return result;
        }
    }
};
__decorate([
    (0, common_1.Inject)(evaluator_repository_1.EvaluatorRepository),
    __metadata("design:type", Object)
], EvaluatorServices.prototype, "evaluatorRepo", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], EvaluatorServices.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], EvaluatorServices.prototype, "mailService", void 0);
__decorate([
    (0, common_1.Inject)(report_service_1.ReportService),
    __metadata("design:type", report_service_1.ReportService)
], EvaluatorServices.prototype, "reportService", void 0);
EvaluatorServices = __decorate([
    (0, common_1.Injectable)()
], EvaluatorServices);
exports.EvaluatorServices = EvaluatorServices;
//# sourceMappingURL=evaluator.service.js.map