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
exports.FeedbackRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const util_1 = require("../common/util");
const EntityConstant_1 = require("../constant/EntityConstant");
const FeedbackStatus_1 = require("../enum/FeedbackStatus");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const sequelize_typescript_1 = require("sequelize-typescript");
let FeedbackRepository = class FeedbackRepository {
    constructor() {
        this.COMPARE_TIME_FORMAT = 'YYYY/MM/DD HH24:MI';
        this.COMPARE_TIME_FORMAT_YYYY_MM_DD = 'YYYY/MM/DD';
        this.SAVED_TIME_FORMAT = 'YYYY/M/D H:mm';
    }
    async getNewTransaction() {
        return await this.feedBackRepository.sequelize.transaction();
    }
    async listFeedback(params) {
        const departmentName = params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
        const user = params.user === '' ? '%%' : `%${params.user}%`;
        const sortBy = params.sortBy !== 'send_time' ? 'FB.SEND_TIME' : 'FB.SEND_TIME';
        const sortType = params.sortType !== 'ASC' ? 'ASC' : 'ASC';
        const conditions = {
            dateStart: `${params.dateStart} 00:00`,
            dateEnd: `${params.dateEnd} 23:59`,
            type: params.type,
            department: departmentName,
            status: params.status,
            user: user,
            limit: params.limit,
            offset: params.offset,
            companyGroupCode: params.companyGroupCode,
        };
        return await this.feedBackRepository.sequelize.query(`
      SELECT
        FB.ID,
        FB.SUBJECT,
        FB.TYPE,
        FB.STATUS,
        US.EMPLOYEE_NUMBER,
        US.FULL_NAME,
        US.LEVEL,
        DEP.NAME AS "department_name",
        DIV.NAME AS "division_name",
        FB.SEND_TIME,
        COUNT(*) OVER() AS "count",
        FB.ATTACH_FILES AS "attach_files"
      FROM
        PUBLIC.FEEDBACK_TBL FB
        JOIN PUBLIC.USER_TBL US ON FB.CREATION_USER = US.ID
        JOIN PUBLIC.DEPARTMENT_TBL DEP ON US.DEPARTMENT_ID = DEP.ID
        JOIN PUBLIC.DEPARTMENT_TBL DIV ON US.DIVISION_ID = DIV.ID
      WHERE
        TO_TIMESTAMP(FB.SEND_TIME, 'YYYY/MM/DD HH24:MI') BETWEEN TO_TIMESTAMP(:dateStart, 'YYYY/MM/DD HH24:MI') AND TO_TIMESTAMP(:dateEnd, 'YYYY/MM/DD HH24:MI')
        AND FB.TYPE IN (:type)
        AND (
          (US.LEVEL < 8 AND DEP.NAME LIKE :department)
            OR 
          (US.LEVEL >= 8 AND DIV.NAME LIKE :department)
        )
        AND FB.STATUS IN (:status)
        AND (
          US.FULL_NAME LIKE :user
          OR US.EMPLOYEE_NUMBER LIKE :user
          OR US.EMAIL LIKE :user
        )
        AND FB.company_group_code = :companyGroupCode
      ORDER BY TO_TIMESTAMP(FB.SEND_TIME, 'YYYY/MM/DD HH24:MI') DESC
      LIMIT :limit
      OFFSET :offset
        `, {
            replacements: {
                dateStart: conditions.dateStart,
                dateEnd: conditions.dateEnd,
                type: conditions.type,
                department: conditions.department,
                status: conditions.status,
                user: conditions.user,
                limit: conditions.limit,
                offset: conditions.offset,
                companyGroupCode: conditions.companyGroupCode,
            },
        });
    }
    async countListFeedback(params) {
        const departmentName = params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
        const user = params.user === '' ? '%%' : `%${params.user}%`;
        const conditions = {
            dateStart: `${params.dateStart} 00:00`,
            dateEnd: `${params.dateEnd} 23:59`,
            type: params.type,
            department: departmentName,
            status: params.status,
            user: user,
        };
        return await this.feedBackRepository.sequelize.query(`
      SELECT
        COUNT(FB.id)
      FROM
        PUBLIC.FEEDBACK_TBL FB
        JOIN PUBLIC.USER_TBL US ON FB.CREATION_USER = US.ID
        JOIN PUBLIC.DEPARTMENT_TBL DEP ON US.DEPARTMENT_ID = DEP.ID
        JOIN PUBLIC.DEPARTMENT_TBL DIV ON US.DIVISION_ID = DIV.ID
      WHERE
        TO_TIMESTAMP(FB.SEND_TIME, 'YYYY/MM/DD HH24:MI') BETWEEN TO_TIMESTAMP(:dateStart, 'YYYY/MM/DD HH24:MI') AND TO_TIMESTAMP(:dateEnd, 'YYYY/MM/DD HH24:MI')
        AND FB.TYPE IN (:type)
        AND (
          (US.LEVEL < 8 AND DEP.NAME LIKE :department)
            OR 
          (US.LEVEL >= 8 AND DIV.NAME LIKE :department)
        )
        AND FB.STATUS IN (:status)
        AND (
          US.FULL_NAME LIKE :user
          OR US.EMPLOYEE_NUMBER LIKE :user
          OR US.EMAIL LIKE :user
        )
    `, {
            replacements: {
                dateStart: conditions.dateStart,
                dateEnd: conditions.dateEnd,
                type: conditions.type,
                department: conditions.department,
                status: conditions.status,
                user: conditions.user,
            },
        });
    }
    async getFeedbacksForExcel(body, companyGroupCode, timeZone) {
        const { type, status, phase, dates, feature, impactScope } = body;
        try {
            const data = (await this.feedBackRepository.sequelize.query(`
            WITH all_related AS (SELECT id,
                                        role,
                                        type,
                                        phase,
                                        feature,
                                        summary,
                                        detail,
                                        impact_scope,
                                        ${companyGroupCode
                ? ''
                : `ARRAY_REMOVE(ARRAY_AGG(id) OVER (PARTITION BY "group"), id) related_feedbacks,`}
                                        status,
                                        created_time AT TIME ZONE :timeZone created_time
                                 FROM feedback_tbl
                                 WHERE company_group_code = COALESCE(:companyGroupCode, company_group_code))
            SELECT id,
                   role,
                   type,
                   phase,
                   feature,
                   summary,
                   detail,
                   impact_scope "impactScope",
                   ${companyGroupCode
                ? ''
                : 'related_feedbacks "relatedFeedbacks",'}
                   status,
                   created_time "createdTime"
            FROM all_related
            WHERE type = COALESCE(:type, type)
              AND status = COALESCE(:status, status)
              AND phase = COALESCE(:phase, phase)
              AND COALESCE(impact_scope, -1) = COALESCE(:impactScope, impact_scope, -1)
              AND (created_time::date >= :dateStart::date AND created_time::date <= :dateEnd::date)
              AND feature || ARRAY['-1']::text[] && ARRAY [:feature]::text[]
            ORDER BY created_time DESC;
          `, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: {
                    type,
                    status,
                    phase,
                    companyGroupCode: companyGroupCode || null,
                    dateStart: dates[0],
                    dateEnd: dates[1],
                    impactScope: impactScope || null,
                    feature: feature.length > 0
                        ? feature.map((v) => v.join('-'))
                        : '-1',
                    timeZone: timeZone,
                },
            }));
            return { rows: data, count: data.length || 0 };
        }
        catch (error) {
            console.log(error);
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async downloadFeedbackZIP(params, req) {
        var _a;
        const s3 = await (0, util_1.S3)();
        const params2 = {
            Bucket: process.env['S3_BUCKET_' + ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode)],
            Prefix: `${params.id}/`,
        };
        let data = await s3.listObjectsV2(params2).promise();
        const files = data.Contents;
        const filePromises = await files.map(async (file) => {
            var _a;
            const fileParams = {
                Bucket: process.env['S3_BUCKET_' + ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode)],
                Key: file.Key,
            };
            const fileData = await s3.getObject(fileParams).promise();
            return {
                name: file.Key.split('/').pop(),
                data: fileData.Body,
                contentType: fileData.ContentType,
            };
        });
        data = await Promise.all(filePromises);
        return data;
    }
    async deleteFeedback(params, transaction, companyGroupCode) {
        const listFeedbackDelete = params.selectedKeyDeleted;
        const s3 = await (0, util_1.S3)();
        listFeedbackDelete.length > 0 &&
            listFeedbackDelete.forEach(async (data) => {
                const listParams = {
                    Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                    Prefix: `${data}/`,
                };
                const listedObjects = await s3.listObjectsV2(listParams).promise();
                if (listedObjects.Contents.length === 0)
                    return;
                const deleteParams = {
                    Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                    Delete: { Objects: [] },
                };
                listedObjects.Contents.forEach(({ Key }) => {
                    deleteParams.Delete.Objects.push({ Key });
                });
                await s3.deleteObjects(deleteParams).promise();
            });
        if (listFeedbackDelete.length > 0) {
            await this.feedBackRepository.destroy({
                where: {
                    [sequelize_1.Op.and]: {
                        id: listFeedbackDelete,
                        companyGroupCode: companyGroupCode,
                    },
                },
                transaction: transaction,
            });
        }
        return true;
    }
    async detailFeedback(params, companyGroupCode) {
        return await this.feedBackRepository.sequelize.query(`
      SELECT
        FB.ID,
        FB.SUBJECT,
        FB.TYPE,
        FB.STATUS,
        US.EMPLOYEE_NUMBER,
        US.FULL_NAME,
        US.LEVEL,
        DEP.NAME AS "department_name",
        DIV.NAME AS "division_name",
        FB.SEND_TIME,
        FB.DESCRIPTION,
        FB.ATTACH_FILES as "attach_files",
        FB.UPDATED_TIME as "updated_time"
      FROM
        PUBLIC.FEEDBACK_TBL FB
        JOIN PUBLIC.USER_TBL US ON FB.CREATION_USER = US.ID
        JOIN PUBLIC.DEPARTMENT_TBL DEP ON US.DEPARTMENT_ID = DEP.ID
        JOIN PUBLIC.DEPARTMENT_TBL DIV ON US.DIVISION_ID = DIV.ID
      WHERE
        FB.ID = :id
        AND FB.company_group_code = :companyGroupCode
      `, {
            replacements: {
                id: params.feedbackId,
                companyGroupCode: companyGroupCode,
            },
        });
    }
    async updateFeedback(params, companyGroupCode, transaction) {
        return await this.feedBackRepository.update({
            type: params.type,
            status: params === null || params === void 0 ? void 0 : params.status,
            attachFiles: params === null || params === void 0 ? void 0 : params.attachFiles,
        }, {
            where: {
                id: params.id,
                companyGroupCode: companyGroupCode,
            },
            transaction: transaction,
        });
    }
    async listFeedbackExcel(params) {
        const departmentName = params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
        const user = params.user === '' ? '%%' : `%${params.user}%`;
        const conditions = {
            dateStart: `${params.dateStart} 00:00`,
            dateEnd: `${params.dateEnd} 23:59`,
            type: params.type,
            department: departmentName,
            status: params.status,
            user: user,
            companyGroupCode: params.companyGroupCode,
        };
        const datas = (await this.feedBackRepository.sequelize.query(`
      SELECT
        FB.ID,
        FB.SUBJECT,
        FB.TYPE,
        FB.STATUS,
        US.EMPLOYEE_NUMBER as "employeeNumber",
        US.FULL_NAME as "fullName",
        US.LEVEL,
        DEP.NAME AS "departmentName",
        DIV.NAME AS "divisionName",
        FB.SEND_TIME as "sendTime",
        FB.attach_files as "attachFiles",
        FB.description
      FROM
        PUBLIC.FEEDBACK_TBL FB
        JOIN PUBLIC.USER_TBL US ON FB.CREATION_USER = US.ID
        JOIN PUBLIC.DEPARTMENT_TBL DEP ON US.DEPARTMENT_ID = DEP.ID
        JOIN PUBLIC.DEPARTMENT_TBL DIV ON US.DIVISION_ID = DIV.ID
      WHERE
        TO_TIMESTAMP(FB.SEND_TIME, 'YYYY/MM/DD HH24:MI') BETWEEN TO_TIMESTAMP(:dateStart, 'YYYY/MM/DD HH24:MI') AND TO_TIMESTAMP(:dateEnd, 'YYYY/MM/DD HH24:MI')
        AND FB.TYPE IN (:type)
        AND (
          (US.LEVEL < 8 AND DEP.NAME LIKE :department)
            OR 
          (US.LEVEL >= 8 AND DIV.NAME LIKE :department)
        )
        AND FB.STATUS IN (:status)
        AND (
          US.FULL_NAME LIKE :user
          OR US.EMPLOYEE_NUMBER LIKE :user
          OR US.EMAIL LIKE :user
        )
        AND FB.COMPANY_GROUP_CODE = :companyGroupCode
      ORDER BY TO_TIMESTAMP(FB.SEND_TIME, 'YYYY/MM/DD HH24:MI') DESC
  
        `, {
            replacements: {
                dateStart: conditions.dateStart,
                dateEnd: conditions.dateEnd,
                type: conditions.type,
                department: conditions.department,
                status: conditions.status,
                user: conditions.user,
                companyGroupCode: conditions.companyGroupCode,
            },
            nest: true,
            type: sequelize_1.QueryTypes.SELECT,
        }));
        return datas;
    }
    async getFeedbacksByUserId(body, userId, companyGroupCode, timeZone) {
        var _a;
        const { limit, offset, type, status, phase, dates, feature, impactScope, keywork = '', } = body;
        try {
            const datas = (await this.feedBackRepository.sequelize.query(`select
  count(*) over() "count",
  id "key",
	type,
	phase,
	ft.feature ,
	summary,
  impact_scope "impactScope",
	status,
	TO_CHAR(created_time at TIME zone :timeZone ,
	'YYYY/FMMM/FMDD FMHH24:MI')"createdTime"
from
	feedback_tbl ft
where
	type = coalesce(:type,
	type)
	and status = coalesce(:status,
	status)
	and phase = coalesce(:phase,
	phase)
  and coalesce(impact_scope,-1) = coalesce(:impactScope,impact_scope,-1)
	and (created_time::date >= :dateStart::date and created_time::date <= :dateEnd::date)
	and  ft.feature || ARRAY['-1']::text[] &&  ARRAY[:feature]::text[]
  and user_id = coalesce(:userId,user_id)
  and company_group_code = coalesce(:companyGroupCode,company_group_code)
  and (id::varchar like :keywork or summary ilike :keywork ) 
  order by created_time desc
   limit :limit offset :offset ;`, {
                replacements: {
                    type,
                    status,
                    phase,
                    limit,
                    offset,
                    userId,
                    companyGroupCode,
                    dateStart: dates[0],
                    dateEnd: dates[1],
                    impactScope: impactScope || null,
                    feature: feature.length > 0
                        ? feature.map((v) => v.join('-'))
                        : '-1',
                    keywork: `%${keywork}%`,
                    timeZone: timeZone,
                },
                nest: true,
            }));
            return { rows: datas, count: ((_a = datas[0]) === null || _a === void 0 ? void 0 : _a.count) || 0 };
        }
        catch (error) {
            console.log(error);
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserFeedbackById(feedbackId, userId) {
        return await this.feedBackRepository.findOne({
            where: {
                id: feedbackId,
                userId: userId,
            },
        });
    }
    async getUserFeedbacksByIds(feedbackId, userId) {
        return await this.feedBackRepository.findAll({
            where: {
                id: { [sequelize_1.Op.in]: feedbackId },
                userId: userId,
            },
        });
    }
    async addFeedback(params, transaction) {
        const newFeedback = await this.feedBackRepository.create(params, {
            transaction,
        });
        return await newFeedback.update({
            group: newFeedback.id,
        }, { transaction });
    }
    async deleteUserFeedbacks(userId, feedbackIds, transaction) {
        if (feedbackIds.length > 0) {
            return await this.feedBackRepository.destroy({
                where: {
                    id: { [sequelize_1.Op.in]: feedbackIds },
                    userId: userId,
                    status: FeedbackStatus_1.FeedbackStatus.SENT,
                },
                transaction,
            });
        }
        return 0;
    }
    async downloadAttachFile(id, fileName, companyGroupCode) {
        const s3 = await (0, util_1.S3)();
        const fileParams = {
            Bucket: process.env['S3_BUCKET'],
            Key: `${companyGroupCode}/${id}/${fileName}`,
        };
        const fileData = await s3.getObject(fileParams).promise();
        return {
            name: fileName,
            data: fileData.Body,
            contentType: fileData.ContentType,
        };
    }
    async getFolderName(id) {
        const data = (await this.feedBackRepository.sequelize.query(`select concat('フィードバック_',To_char(TO_TIMESTAMP(send_time , 'YYYY-mm-dd HH24:MI'),'YYYY_FMMM_FMDD_FMHH_MI'))  as "folderName" from feedback_tbl where id=:id`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                id: id,
            },
            nest: true,
        }))[0];
        return (data === null || data === void 0 ? void 0 : data.folderName) || '';
    }
    async findOneFeedback(condition) {
        return await this.feedBackRepository.findOne({
            where: condition,
        });
    }
    async getDetailFeedback(id, timeZone) {
        const groupId = await this.feedBackRepository.findOne({
            attributes: ['group'],
            where: {
                id: id,
            },
        });
        const sql = `
          SELECT
        ID,
        TYPE,
        STATUS,
        ATTACH_FILES AS "attachFile",
        USER_ID AS "userID",
        UPDATED_TIME AS "updatedTime",
        COMPANY_GROUP_CODE AS "companyGroupCode",
        PHASE,
        ROLE,
        SUMMARY,
        DETAIL,
        IMPACT_SCOPE AS "impactScope",
        "group",
        FEATURE,
        (
          SELECT
            JSONB_BUILD_OBJECT(
              'id',
              U.ID,
              'employeeNumber',
              U.EMPLOYEE_NUMBER,
              'fullName',
              U.FULL_NAME,
              'email',
              U.EMAIL,
              'level',
              U.LEVEL,
              'department',
              (
                SELECT
                  JSONB_BUILD_OBJECT('name', DEP.NAME)
                FROM
                  DEPARTMENT_TBL DEP
                WHERE
                  DEP.ID = U.DEPARTMENT_ID
              ),
              
              'division',
              (
                SELECT
                  JSONB_BUILD_OBJECT('name', DIV.NAME)
                FROM
                  DEPARTMENT_TBL DIV
                WHERE
                  U.DIVISION_ID = DIV.ID
              ),
              
              'company',
              (
                SELECT
                  JSONB_BUILD_OBJECT('name', C.NAME)
                FROM
                  COMPANY_TBL C
                WHERE
                  U.COMPANY_ID = C.ID
              )
            )
          FROM
            USER_TBL U
          WHERE
            U.ID = F.USER_ID
        ) AS "userPost",
        
        (
          SELECT
            COALESCE(JSONB_AGG(ROW_TO_JSON(T)), '[]'::jsonb)
          FROM
            (
              SELECT
                ID,
                TYPE,
                PHASE,
                SUMMARY,
                IMPACT_SCOPE AS "impactScope",
                UPDATED_TIME AS "updatedTime",
                CREATED_TIME AT TIME ZONE :timeZone AS "createdTime",
                (
                  SELECT
                    JSONB_BUILD_OBJECT(
                      'id',
                      U2.id,
                      'email',
                      U2.email,
                      'active',
                      U2.active,
                      'employeeNumer',
                      U2.EMPLOYEE_NUMBER,
                      'fullName',
                      U2.FULL_NAME,
                      'company',
                      (
                        SELECT
                          JSONB_BUILD_OBJECT('name', C.NAME)
                        FROM
                          COMPANY_TBL C
                        WHERE
                          U2.COMPANY_ID = C.ID
                      )
                    )
                  FROM
                    USER_TBL U2
                  WHERE
                    U2.ID = F2.USER_ID
                ) AS "userInfor",
                STATUS
              FROM
                FEEDBACK_TBL F2
              WHERE
                F2.GROUP = :groupId
                AND F2.ID <> :id
              ORDER BY
                F2.CREATED_TIME DESC
            ) T
        ) AS "issuesRelated",
        
        (
          SELECT
            COALESCE(JSONB_AGG(ROW_TO_JSON(T)), '[]'::jsonb)
          FROM
            (
              SELECT
                ID,
                CASE
                    WHEN ACTIVE = 1 THEN CONTENT
                    ELSE ''
                END AS "content",
                CREATED_TIME AT TIME ZONE :timeZone AS "createTime",
                UPDATED_TIME AS "updatedTime",
                ACTIVE,
                (
                  SELECT
                    JSONB_BUILD_OBJECT(
                      'id',
                      U3.id,
                      'employeeNumer',
                      U3.EMPLOYEE_NUMBER,
                      'fullName',
                      U3.FULL_NAME,
                      'isSystemAdmin',
                      CASE
                      WHEN PS.role_id IS NOT NULL THEN true
                      ELSE false
                      END
                )
                  FROM
                    USER_TBL U3
                    LEFT JOIN PERMISSION_TBL PS
					            ON U3.id = PS.user_id AND PS.role_id = 9
                  WHERE
                    U3.ID = FC.USER_ID
                ) AS "userInfor"
              FROM
                FEEDBACK_COMMENT_TBL FC
              WHERE
                FC.FEEDBACK_ID = F.ID
              ORDER BY
                FC.CREATED_TIME DESC
            ) T
        ) AS "commentFeeback"
        
      FROM
        FEEDBACK_TBL F
      WHERE
        ID = :id
    `;
        const feedbackDetail = await this.feedBackRepository.sequelize.query(sql, {
            nest: true,
            replacements: {
                id: id,
                groupId: groupId.group,
                timeZone: timeZone,
            },
        });
        return {
            feedbackDetail: feedbackDetail[0],
        };
    }
    async cancelFeedback(id) {
        return await this.feedBackRepository.update({ status: 8 }, {
            where: {
                id: id,
            },
        });
    }
    async addComment(params) {
        return await this.feedbackCommentRepository.create({
            content: params.content,
            userId: params.userId,
            feedbackId: params.feedbackId,
            active: 1,
        });
    }
    async addCommentBulkCreate(data) {
        return await this.feedbackCommentRepository.bulkCreate(data);
    }
    async getCommentById(commentId) {
        return await this.feedbackCommentRepository.findOne({
            where: {
                id: commentId,
            },
        });
    }
    async editComment(params) {
        return await this.feedbackCommentRepository.update({ content: params.content }, { where: { id: params.id } });
    }
    async updateImpactScope(query) {
        return await this.feedBackRepository.update({ impactScope: query.impactScope }, {
            where: {
                id: query.id,
            },
        });
    }
    async updateStatus(query) {
        return await this.feedBackRepository.update({ status: query.status }, {
            where: {
                id: query.id,
            },
        });
    }
    async updateFeedbackDetail(params) {
        const permission = params.permission;
        let dataUpdate = {};
        if (permission == 'user') {
            dataUpdate = {
                role: JSON.parse(params.role).map((r) => r),
                type: params.type,
                phase: params.phase,
                feature: params.features
                    ? JSON.parse(params.features).map((feat) => feat.join('-'))
                    : [],
                summary: params.summary,
                detail: params.detail,
                attachFiles: params.attachFiles,
            };
        }
        else {
            dataUpdate = {
                role: JSON.parse(params.role).map((r) => r),
                type: params.type,
                phase: params.phase,
                feature: params.features
                    ? JSON.parse(params.features).map((feat) => feat.join('-'))
                    : [],
                summary: params.summary,
            };
        }
        return await this.feedBackRepository.update(dataUpdate, {
            where: {
                id: params.id,
            },
        });
    }
    async getUpdateTime(id) {
        return await this.feedBackRepository.findOne({
            attributes: ['updatedTime', 'userId'],
            where: {
                id: id,
            },
        });
    }
    async deleteIssueRelated(id) {
        const feedback = await this.feedBackRepository.findByPk(id);
        if (feedback.group === feedback.id) {
            await this.feedBackRepository.sequelize.query(`
            WITH other_feedbacks AS (SELECT id
                                     FROM feedback_tbl
                                     WHERE "group" = :group
                                       AND id <> :group)
            UPDATE feedback_tbl
            SET "group" = (SELECT id FROM other_feedbacks LIMIT 1)
            WHERE id IN (SELECT id FROM other_feedbacks);
          `, {
                type: sequelize_1.QueryTypes.UPDATE,
                replacements: {
                    group: feedback.group,
                },
            });
        }
        else {
            await feedback.update({
                group: feedback.id,
            });
        }
    }
    async getNonRelatedFeedbacks(originalFeedback, criteria) {
        return await this.feedBackRepository.findAndCountAll({
            where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ group: {
                    [sequelize_1.Op.ne]: originalFeedback.group,
                } }, (criteria.type === null ? {} : { type: criteria.type })), (criteria.phase === null ? {} : { phase: criteria.phase })), (criteria.features.length === 0
                ? {}
                : {
                    feature: {
                        [sequelize_1.Op.overlap]: sequelize_typescript_1.Sequelize.cast(criteria.features.map((feat) => feat.join('-')), 'text[]'),
                    },
                })), (criteria.impactScope === null
                ? {}
                : {
                    impactScope: criteria.impactScope === -1 ? null : criteria.impactScope,
                })), (criteria.status === null ? {} : { status: criteria.status })), (!criteria.keyword
                ? {}
                : {
                    [sequelize_1.Op.or]: [
                        sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.cast(sequelize_typescript_1.Sequelize.col('id'), 'varchar'), { [sequelize_1.Op.like]: `%${criteria.keyword}%` }),
                        { summary: { [sequelize_1.Op.iLike]: `%${criteria.keyword}%` } },
                    ],
                })),
            order: [['createdTime', 'DESC']],
            limit: criteria.limit,
            offset: criteria.offset,
        });
    }
    async groupFeedbacks(originalId, addedIds) {
        await this.feedBackRepository.sequelize.query(`
          UPDATE feedback_tbl
          SET "group" = (SELECT "group" FROM feedback_tbl WHERE id = :originalId)
          WHERE "group" IN (SELECT DISTINCT "group" FROM feedback_tbl WHERE id IN (:addedIds));
        `, {
            type: sequelize_1.QueryTypes.UPDATE,
            replacements: {
                originalId,
                addedIds,
            },
        });
    }
    async getUpdateTimeComment(id) {
        return await this.feedbackCommentRepository.findOne({
            attributes: ['updatedTime'],
            where: {
                id: id,
            },
        });
    }
    async deleteComment(data) {
        return await this.feedbackCommentRepository.destroy({
            where: {
                id: data.id,
            },
        });
    }
    async getUserIdByFeedbackId(id) {
        return await this.feedBackRepository.findOne({
            attributes: ['userId'],
            where: {
                id: id,
            },
        });
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.FEEDBACK_ENTITY),
    __metadata("design:type", Object)
], FeedbackRepository.prototype, "feedBackRepository", void 0);
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.FEEDBACK_COMMENT_ENTITY),
    __metadata("design:type", Object)
], FeedbackRepository.prototype, "feedbackCommentRepository", void 0);
FeedbackRepository = __decorate([
    (0, common_1.Injectable)()
], FeedbackRepository);
exports.FeedbackRepository = FeedbackRepository;
//# sourceMappingURL=feedback.repository.js.map