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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("../common/mail/util");
const util_2 = require("../common/util");
const Roles_1 = require("../enum/Roles");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const feedback_repository_1 = require("../repository/feedback.repository");
const user_repository_1 = require("../repository/user.repository");
const FeedbackStatus_1 = require("../enum/FeedbackStatus");
const logger_service_1 = require("./logger.service");
const mail_service_1 = require("./mail.service");
let FeedbackService = class FeedbackService {
    constructor(logger) {
        this.logger = logger;
        this.STATUS_ADD_COMMENT = [1, 2, 4, 5];
    }
    async listFeedback(params) {
        var _a;
        const dataRaw = await this.feedbackRepository.listFeedback(params);
        const data = dataRaw[0];
        const counts = (_a = dataRaw[0][0]) === null || _a === void 0 ? void 0 : _a.count;
        return await { data: data, counts: counts };
    }
    async deleteFeedback(params, companyGroupCode) {
        const transaction = await this.feedbackRepository.getNewTransaction();
        const result = await this.feedbackRepository.deleteFeedback(params, transaction, companyGroupCode);
        await transaction.commit();
        return result;
    }
    async detailFeedback(params, companyGroupCode) {
        const dataRaw = await this.feedbackRepository.detailFeedback(params, companyGroupCode);
        return dataRaw[0][0];
    }
    async getZipFeedback(params, req) {
        return await this.feedbackRepository.downloadFeedbackZIP(params, req);
    }
    async updateFeedback(params, companyGroupCode, files) {
        const transaction = await this.feedbackRepository.getNewTransaction();
        try {
            const feedback = await this.feedbackRepository.findOneFeedback({
                id: params.id,
                companyGroupCode: companyGroupCode,
            });
            if (params.updatedTime &&
                params.updatedTime.toString() !== feedback.updatedTime.toISOString()) {
                throw new RuntimeException_1.RuntimeException('Update conflict', common_1.HttpStatus.CONFLICT);
            }
            else {
                const result = await this.feedbackRepository.updateFeedback(params, companyGroupCode, transaction);
                await transaction.commit();
                return true;
            }
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateFeedbackWithFiles(params, companyGroupCode, userId, files) {
        const currentFeedback = await this.feedbackRepository.getUserFeedbackById(params.id, userId);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(params.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const transaction = await this.feedbackRepository.getNewTransaction();
        let result;
        try {
            result = await this.feedbackRepository.updateFeedback(params, companyGroupCode, transaction);
            const s3 = await (0, util_2.S3)();
            if (params.listFilesDeleted) {
                for (const fileName of params === null || params === void 0 ? void 0 : params.listFilesDeleted) {
                    const deleteParams = {
                        Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                        Key: `${params.id}/${fileName}`,
                    };
                    await s3.deleteObject(deleteParams).promise();
                }
            }
            if (files) {
                const uploadPromises = files.map((f) => s3
                    .upload({
                    Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                    Key: `${params.id}/${(0, util_2.latin1ToUtf8)(f.originalname)}`,
                    Body: f.buffer,
                    ContentType: f.mimetype,
                })
                    .promise());
                await Promise.all(uploadPromises);
            }
            await transaction.commit();
            return result;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadExcel(params) {
        const dataRaws = await this.feedbackRepository.listFeedbackExcel(params);
        const dataLinks = dataRaws.map((v) => (Object.assign(Object.assign({}, v), { link: v.attachFiles
                ? `${process.env.HOSTNAME_}/company/${params.companyGroupCode}/download-feedback/${(0, util_2.encrypt)(v.id.toString())}`
                : null })));
        return dataLinks;
    }
    async getUserFeedbacks(body, userId, companyGroupCode, timeZone) {
        return await this.feedbackRepository.getFeedbacksByUserId(body, userId, companyGroupCode, timeZone);
    }
    async getUserFeedbackById(feedbackId, userId) {
        return await this.feedbackRepository.getUserFeedbackById(feedbackId, userId);
    }
    async createFeedback(userId, params, files, companyGroupCode, timeZone) {
        const transaction = await this.feedbackRepository.getNewTransaction();
        try {
            const newFeedback = {
                role: JSON.parse(params.roles).map((r) => +r),
                type: +params.type,
                phase: +params.phase,
                feature: params.features
                    ? JSON.parse(params.features).map((feat) => feat.join('-'))
                    : [],
                summary: params.summary,
                detail: params.detail,
                attachFiles: files.map((f) => (0, util_2.latin1ToUtf8)(f.originalname)).join('|') || undefined,
                status: FeedbackStatus_1.FeedbackStatus.SENT,
                userId,
                companyGroupCode,
            };
            const createdFeedback = await this.feedbackRepository.addFeedback(newFeedback, transaction);
            const s3 = await (0, util_2.S3)();
            const uploadPromises = files.map((f) => s3
                .upload({
                Bucket: process.env['S3_BUCKET'],
                Key: `${companyGroupCode}/${createdFeedback.id}/${(0, util_2.latin1ToUtf8)(f.originalname)}`,
                Body: f.buffer,
                ContentType: f.mimetype,
            })
                .promise());
            await Promise.all(uploadPromises);
            await transaction.commit();
            void this.sendEmailOnFeedbackCreated(createdFeedback);
            return createdFeedback;
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendEmailOnFeedbackCreated(createdFeedback) {
        try {
            const sentUser = await this.userRepository.getUserInforById(createdFeedback.userId);
            const f9Users = await this.userRepository.getListUserWithRole(Roles_1.Roles.F9);
            const { title, content } = await this.mailService.getSendMailCreateFeedback({
                feedbackId: createdFeedback.id,
                userName: sentUser.fullName,
                companyName: sentUser.company.name,
                departmentName: sentUser.level >= 8
                    ? sentUser.division.name
                    : sentUser.department.name,
                typeFeedback: createdFeedback.type,
                overview: createdFeedback.summary,
            }, createdFeedback.companyGroupCode);
            (0, util_1.sendEmailsWith)(f9Users.map((value) => value.email), [], title, content);
        }
        catch (e) {
            this.logger.error(undefined, `Send mail create feedback failed at ${new Date()}:\n${e}`);
        }
    }
    async deleteUserFeedbacks(userId, feedbackIds, companyGroupCode) {
        const transaction = await this.feedbackRepository.getNewTransaction();
        try {
            const filteredId = (await this.feedbackRepository.getUserFeedbacksByIds(feedbackIds, userId)).map((f) => f.id);
            await this.feedbackRepository.deleteUserFeedbacks(userId, filteredId, transaction);
            const s3 = await (0, util_2.S3)();
            const promises = filteredId.map((id) => s3
                .listObjectsV2({
                Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                Prefix: `${id}/`,
            })
                .promise());
            const keys = (await Promise.all(promises)).flatMap((l) => l.Contents.map((o) => ({ Key: o.Key })));
            if (keys.length > 0)
                await s3
                    .deleteObjects({
                    Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                    Delete: { Objects: keys },
                })
                    .promise();
            await transaction.commit();
        }
        catch (error) {
            await transaction.rollback();
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadAttachFile(id, fileName, companyGroupCode) {
        return await this.feedbackRepository.downloadAttachFile(id, fileName, companyGroupCode ||
            (await this.feedbackRepository.findOneFeedback({ id })).companyGroupCode);
    }
    async downloadFileFromExcel(id, companyGroupCode) {
        const s3 = await (0, util_2.S3)();
        const fileParams = {
            Bucket: process.env['S3_BUCKET_' + companyGroupCode],
            Prefix: `${id}/`,
        };
        const data = await s3.listObjectsV2(fileParams).promise();
        const files = data.Contents;
        const filePromises = await files.map(async (file) => {
            const fileParams = {
                Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                Key: file.Key,
            };
            const fileData = await s3.getObject(fileParams).promise();
            return {
                name: file.Key.split('/').pop(),
                data: fileData.Body,
                contentType: fileData.ContentType,
            };
        });
        const folderName = await this.feedbackRepository.getFolderName(id);
        const datas = await Promise.all(filePromises);
        return { data: datas, folderName: folderName };
    }
    async getDetailFeedback(id, timeZone) {
        return await this.feedbackRepository.getDetailFeedback(id, timeZone);
    }
    async cancelFeedback(query) {
        const id = query.id;
        const currentFeedback = await this.feedbackRepository.getUpdateTime(id);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(query.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        return await this.feedbackRepository.cancelFeedback(id);
    }
    async addComment(params, typeAddComment, timeZone) {
        const currentFeedback = await this.feedbackRepository.getUpdateTime(params.feedbackId);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(params.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const result = await this.feedbackRepository.addComment(params);
        if (result) {
            const getFeedbackInfo = await this.feedbackRepository.getDetailFeedback(params.feedbackId, timeZone);
            if (typeAddComment === 1) {
                if (this.STATUS_ADD_COMMENT.includes(getFeedbackInfo.feedbackDetail.status)) {
                    const getListEmailSystemAdmin = await this.userRepository.getListUserWithRole(Roles_1.Roles.F9);
                    const data = {
                        feedbackId: params.feedbackId,
                        listFullName: getListEmailSystemAdmin.map((value) => value.fullName),
                        typeFeedback: getFeedbackInfo.feedbackDetail.type,
                        overview: getFeedbackInfo.feedbackDetail.summary,
                    };
                    const { title, content } = await this.mailService.getSendMailCommentFeedback(data, getFeedbackInfo.feedbackDetail.companyGroupCode, 1);
                    (0, util_1.sendEmailsWith)(getListEmailSystemAdmin.map((value) => value.email), [], title, content);
                }
            }
            else if (typeAddComment === 2) {
                if (this.STATUS_ADD_COMMENT.includes(getFeedbackInfo.feedbackDetail.status)) {
                    const getUserCreatedFeedback = await this.userRepository.getUserInforById(getFeedbackInfo.feedbackDetail.userID);
                    if (getUserCreatedFeedback.active === 1) {
                        const data = {
                            feedbackId: params.feedbackId,
                            listFullName: [getUserCreatedFeedback.fullName],
                            typeFeedback: getFeedbackInfo.feedbackDetail.type,
                            overview: getFeedbackInfo.feedbackDetail.summary,
                        };
                        const { title, content } = await this.mailService.getSendMailCommentFeedback(data, getFeedbackInfo.feedbackDetail.companyGroupCode, 2);
                        (0, util_1.sendEmailsWith)([getUserCreatedFeedback.email], [], title, content);
                    }
                }
            }
            return {
                code: 200,
            };
        }
    }
    async addCommentAllRelated(params, timeZone) {
        await this.addComment(params, 2, timeZone);
        const getFeedbackInfo = await this.feedbackRepository.getDetailFeedback(params.feedbackId, timeZone);
        const listRelatedIssues = getFeedbackInfo.feedbackDetail.issuesRelated.filter((item) => this.STATUS_ADD_COMMENT.includes(item.status));
        const listDataBulkCreate = listRelatedIssues.map((i) => {
            return {
                content: params.content,
                feedbackId: i.id,
                userId: params.userId,
                active: 1,
            };
        });
        const result = await this.feedbackRepository.addCommentBulkCreate(listDataBulkCreate);
        if (result) {
            for (const issue of listRelatedIssues) {
                if (issue.userInfor.active === 1) {
                    const data = {
                        feedbackId: issue.id,
                        listFullName: [issue.userInfor.fullName],
                        typeFeedback: issue.type,
                        overview: issue.summary,
                    };
                    const { title, content } = await this.mailService.getSendMailCommentFeedback(data, getFeedbackInfo.feedbackDetail.companyGroupCode, 2);
                    (0, util_1.sendEmailsWith)([issue.userInfor.email], [], title, content);
                }
            }
        }
        return {
            code: 200,
        };
    }
    async updateImpactScope(query) {
        const currentFeedback = await this.feedbackRepository.getUpdateTime(query.id);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(query.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        return await this.feedbackRepository.updateImpactScope(query);
    }
    async updateStatus(query, companyGroupCode, timeZone) {
        const currentFeedback = await this.feedbackRepository.getUpdateTime(query.id);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(query.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const userInfor = await this.userRepository.getUserInforById(currentFeedback.userId);
        const feedbackInfo = await this.feedbackRepository.getDetailFeedback(query.id, timeZone);
        if (userInfor.active === 1) {
            const data = {
                userName: userInfor.fullName,
                feedbackId: query.id,
                status: query.status,
                overview: feedbackInfo.feedbackDetail.summary,
            };
            const { title, content } = await this.mailService.getSendMailUpdateFeedback(data, companyGroupCode);
            (0, util_1.sendEmailsWith)([userInfor.email], [], title, content);
        }
        return await this.feedbackRepository.updateStatus(query);
    }
    async updateFeedbackDetail(params, companyGroupCode, files) {
        const currentFeedback = await this.feedbackRepository.getUpdateTime(params.id);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(params.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        const result = await this.feedbackRepository.updateFeedbackDetail(params);
        if (params.permission == 'user') {
            const s3 = await (0, util_2.S3)();
            if (params.listFilesDeleted) {
                for (const fileName of params === null || params === void 0 ? void 0 : params.listFilesDeleted) {
                    const deleteParams = {
                        Bucket: process.env['S3_BUCKET'],
                        Key: `${companyGroupCode}/${params.id}/${fileName}`,
                    };
                    await s3.deleteObject(deleteParams).promise();
                }
            }
            if (files) {
                const uploadPromises = files.map((f) => s3
                    .upload({
                    Bucket: process.env['S3_BUCKET'],
                    Key: `${companyGroupCode}/${params.id}/${(0, util_2.latin1ToUtf8)(f.originalname)}`,
                    Body: f.buffer,
                    ContentType: f.mimetype,
                })
                    .promise());
                await Promise.all(uploadPromises);
            }
        }
        return result;
    }
    async deleteIssueRelated(query) {
        const currentFeedback = await this.feedbackRepository.getUpdateTime(query.id);
        if (new Date(currentFeedback.updatedTime).getTime() !==
            new Date(query.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        return await this.feedbackRepository.deleteIssueRelated(query.id);
    }
    async getNonRelatedFeedbacks(criteria) {
        const feedback = await this.feedbackRepository.findOneFeedback({
            id: criteria.originalFeedbackId,
        });
        if (!feedback)
            throw new RuntimeException_1.RuntimeException(`Feedback ${criteria.originalFeedbackId} not found`, common_1.HttpStatus.NOT_FOUND);
        return await this.feedbackRepository.getNonRelatedFeedbacks(feedback, criteria);
    }
    async addRelatedFeedbacks(originalId, addedIds) {
        await this.feedbackRepository.groupFeedbacks(originalId, addedIds);
    }
    async getFeedbacksForExcel(param, companyGroupCode, timeZone) {
        return await this.feedbackRepository.getFeedbacksForExcel(param, companyGroupCode, timeZone);
    }
    async deleteComment(data) {
        const currentComment = await this.feedbackRepository.getUpdateTimeComment(data.id);
        if (new Date(currentComment.updatedTime).getTime() !==
            new Date(data.updatedTime).getTime()) {
            throw new RuntimeException_1.RuntimeException('Invalid time', 409);
        }
        return await this.feedbackRepository.deleteComment(data);
    }
    async getUserIdByFeedbackId(id) {
        return await this.feedbackRepository.getUserIdByFeedbackId(id);
    }
};
__decorate([
    (0, common_1.Inject)(feedback_repository_1.FeedbackRepository),
    __metadata("design:type", Object)
], FeedbackService.prototype, "feedbackRepository", void 0);
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", Object)
], FeedbackService.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)(mail_service_1.MailService),
    __metadata("design:type", mail_service_1.MailService)
], FeedbackService.prototype, "mailService", void 0);
FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.CustomLogger])
], FeedbackService);
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map