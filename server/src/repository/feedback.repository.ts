/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { S3 } from 'src/common/util';
import EntityConstant from 'src/constant/EntityConstant';
import { Feedback } from 'src/entity/Feedback';
import { FeedbackRepositoryI } from 'src/interfaces/repository/feedback.repository.interface';
import { FeedbackStatus } from '../enum/FeedbackStatus';
import {
  NonRelatedFeedbackSearchDto,
  UserFeedbackSearchDto,
} from '../model/request/FeedbackRequestDto';
import { Request } from 'express';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { FeedbackCommnet } from 'src/entity/FeedbackComment';
import { Sequelize } from 'sequelize-typescript';

export interface DataExcel {
  id: number;
  subject: string;
  type: number;
  status: number;
  employeeNumber: number;
  fullName: string;
  level: number;
  departmentName: string;
  divisionName: string;
  sendTime: string;
  attachFiles: string;
  description: string;
}

@Injectable()
export class FeedbackRepository implements FeedbackRepositoryI {
  private readonly COMPARE_TIME_FORMAT = 'YYYY/MM/DD HH24:MI';
  private readonly COMPARE_TIME_FORMAT_YYYY_MM_DD = 'YYYY/MM/DD';
  private readonly SAVED_TIME_FORMAT = 'YYYY/M/D H:mm';

  @Inject(EntityConstant.FEEDBACK_ENTITY)
  private feedBackRepository: typeof Feedback;

  @Inject(EntityConstant.FEEDBACK_COMMENT_ENTITY)
  private feedbackCommentRepository: typeof FeedbackCommnet;

  async getNewTransaction(): Promise<Transaction> {
    return await this.feedBackRepository.sequelize.transaction();
  }

  async listFeedback(params: any): Promise<any> {
    const departmentName =
      params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
    const user = params.user === '' ? '%%' : `%${params.user}%`;
    const sortBy =
      params.sortBy !== 'send_time' ? 'FB.SEND_TIME' : 'FB.SEND_TIME';
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
      // orderBy: `${sortBy} ${sortType}`,
    };

    return await this.feedBackRepository.sequelize.query(
      `
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
        `,
      {
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
          // orderBy: conditions.orderBy,
        },
      },
    );
  }

  async countListFeedback(params: any) {
    const departmentName =
      params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
    const user = params.user === '' ? '%%' : `%${params.user}%`;

    const conditions = {
      dateStart: `${params.dateStart} 00:00`,
      dateEnd: `${params.dateEnd} 23:59`,
      type: params.type,
      department: departmentName,
      status: params.status,
      user: user,
    };

    return await this.feedBackRepository.sequelize.query(
      `
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
    `,
      {
        replacements: {
          dateStart: conditions.dateStart,
          dateEnd: conditions.dateEnd,
          type: conditions.type,
          department: conditions.department,
          status: conditions.status,
          user: conditions.user,
        },
      },
    );
  }

  async getFeedbacksForExcel(
    body: UserFeedbackSearchDto,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<{ rows: Feedback[]; count: number }> {
    const { type, status, phase, dates, feature, impactScope } = body;

    try {
      const data = (await this.feedBackRepository.sequelize.query(
        `
            WITH all_related AS (SELECT id,
                                        role,
                                        type,
                                        phase,
                                        feature,
                                        summary,
                                        detail,
                                        impact_scope,
                                        ${
                                          companyGroupCode
                                            ? ''
                                            : `ARRAY_REMOVE(ARRAY_AGG(id) OVER (PARTITION BY "group"), id) related_feedbacks,`
                                        }
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
                   ${
                     companyGroupCode
                       ? ''
                       : 'related_feedbacks "relatedFeedbacks",'
                   }
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
          `,
        {
          type: QueryTypes.SELECT,
          replacements: {
            type,
            status,
            phase,
            companyGroupCode: companyGroupCode || null,
            dateStart: dates[0],
            dateEnd: dates[1],
            impactScope: impactScope || null,
            feature:
              feature.length > 0
                ? feature.map((v: string[]) => v.join('-'))
                : '-1',
            timeZone: timeZone,
          },
        },
      )) as any;

      return { rows: data, count: data.length || 0 };
    } catch (error) {
      console.log(error);
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadFeedbackZIP(params: any, req: Request): Promise<any> {
    const s3 = await S3();

    const params2 = {
      Bucket: process.env['S3_BUCKET_' + req?.user?.companyGroupCode],
      Prefix: `${params.id}/`, // The folder name (prefix)
    };
    let data = await s3.listObjectsV2(params2).promise();
    const files = data.Contents;
    // Fetch each file's data
    const filePromises = await files.map(async (file) => {
      const fileParams = {
        Bucket: process.env['S3_BUCKET_' + req?.user?.companyGroupCode],
        Key: file.Key,
      };
      const fileData = await s3.getObject(fileParams).promise();
      return {
        name: file.Key.split('/').pop(), // Get the file name
        data: fileData.Body, // File data as Buffer
        contentType: fileData.ContentType, // Content type
      };
    });
    data = await Promise.all(filePromises);

    return data;
  }

  async deleteFeedback(
    params: any,
    transaction: Transaction,
    companyGroupCode: string,
  ): Promise<any> {
    const listFeedbackDelete: [] = params.selectedKeyDeleted;
    const s3 = await S3();

    //delete aws
    listFeedbackDelete.length > 0 &&
      listFeedbackDelete.forEach(async (data: number) => {
        const listParams = {
          Bucket: process.env['S3_BUCKET_' + companyGroupCode],
          Prefix: `${data}/`, //tên folder
        };
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        if (listedObjects.Contents.length === 0) return;
        const deleteParams = {
          Bucket: process.env['S3_BUCKET_' + companyGroupCode],
          Delete: { Objects: [] },
        };
        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });
        await s3.deleteObjects(deleteParams).promise();
      });

    // delete db
    if (listFeedbackDelete.length > 0) {
      await this.feedBackRepository.destroy({
        where: {
          [Op.and]: {
            id: listFeedbackDelete,
            companyGroupCode: companyGroupCode,
          },
        },
        transaction: transaction,
      });
    }

    return true;
  }

  async detailFeedback(params: any, companyGroupCode: string): Promise<any> {
    return await this.feedBackRepository.sequelize.query(
      `
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
      `,
      {
        replacements: {
          id: params.feedbackId,
          companyGroupCode: companyGroupCode,
        },
      },
    );
  }

  async updateFeedback(
    params: any,
    companyGroupCode: string,
    transaction?: Transaction,
  ): Promise<any> {
    return await this.feedBackRepository.update(
      {
        // subject: params.subject,
        type: params.type,
        status: params?.status,
        // description: params.description,
        attachFiles: params?.attachFiles,
      },
      {
        where: {
          id: params.id,
          companyGroupCode: companyGroupCode,
        },
        transaction: transaction,
      },
    );
  }

  async listFeedbackExcel(params: {
    department: string;
    user: string;
    dateStart: string;
    dateEnd: string;
    type: string[];
    status: string[];
    companyGroupCode: string;
  }): Promise<DataExcel[]> {
    const departmentName =
      params.department === 'すべて' ? '%%' : `${params.department[0].trim()}`;
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

    const datas = (await this.feedBackRepository.sequelize.query(
      `
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
  
        `,
      {
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
        type: QueryTypes.SELECT,
      },
    )) as DataExcel[];
    return datas;
  }

  async getFeedbacksByUserId(
    body: UserFeedbackSearchDto,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<{ rows: Feedback[]; count: number }> {
    const {
      limit,
      offset,
      type,
      status,
      phase,
      dates,
      feature,
      impactScope,
      keywork = '',
    } = body;

    // return await this.feedBackRepository.findAndCountAll({
    //   limit,
    //   offset,
    // });
    try {
      const datas = (await this.feedBackRepository.sequelize.query(
        `select
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
   limit :limit offset :offset ;`,
        {
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
            feature:
              feature.length > 0
                ? feature.map((v: string[]) => v.join('-'))
                : '-1',
            keywork: `%${keywork}%`,
            timeZone: timeZone,
          },
          nest: true,
        },
      )) as any;

      return { rows: datas, count: datas[0]?.count || 0 };
    } catch (error) {
      console.log(error);
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserFeedbackById(
    feedbackId: number,
    userId: number,
  ): Promise<Feedback | null> {
    return await this.feedBackRepository.findOne({
      where: {
        id: feedbackId,
        userId: userId,
      },
    });
  }

  async getUserFeedbacksByIds(
    feedbackId: number[],
    userId: number,
  ): Promise<Feedback[]> {
    return await this.feedBackRepository.findAll({
      where: {
        id: { [Op.in]: feedbackId },
        userId: userId,
      },
    });
  }

  async addFeedback(params: Partial<Feedback>, transaction?: Transaction) {
    const newFeedback = await this.feedBackRepository.create(params, {
      transaction,
    });
    return await newFeedback.update(
      {
        group: newFeedback.id,
      },
      { transaction },
    );
  }

  async deleteUserFeedbacks(
    userId: number,
    feedbackIds: number[],
    transaction?: Transaction,
  ): Promise<number> {
    if (feedbackIds.length > 0) {
      return await this.feedBackRepository.destroy({
        where: {
          id: { [Op.in]: feedbackIds },
          userId: userId,
          status: FeedbackStatus.SENT,
        },
        transaction,
      });
    }
    return 0;
  }

  async downloadAttachFile(
    id: number,
    fileName: string,
    companyGroupCode: string,
  ): Promise<any> {
    const s3 = await S3();

    const fileParams = {
      Bucket: process.env['S3_BUCKET'],
      Key: `${companyGroupCode}/${id}/${fileName}`,
    };
    const fileData = await s3.getObject(fileParams).promise();

    return {
      name: fileName, // Get the file name
      data: fileData.Body, // File data as Buffer
      contentType: fileData.ContentType, // Content type
    };
  }

  async getFolderName(id: string) {
    const data = (
      await this.feedBackRepository.sequelize.query(
        `select concat('フィードバック_',To_char(TO_TIMESTAMP(send_time , 'YYYY-mm-dd HH24:MI'),'YYYY_FMMM_FMDD_FMHH_MI'))  as "folderName" from feedback_tbl where id=:id`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            id: id,
          },
          nest: true,
        },
      )
    )[0] as { folderName: string };

    return data?.folderName || '';
  }

  async findOneFeedback(condition: any): Promise<any> {
    return await this.feedBackRepository.findOne({
      where: condition,
    });
  }

  async getDetailFeedback(id: any, timeZone: string) {
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
    const feedbackDetail: any = await this.feedBackRepository.sequelize.query(
      sql,
      {
        nest: true,
        replacements: {
          id: id,
          groupId: groupId.group,
          timeZone: timeZone,
        },
      },
    );

    return {
      feedbackDetail: feedbackDetail[0],
    };
  }

  async cancelFeedback(id: any) {
    return await this.feedBackRepository.update(
      { status: 8 },
      {
        where: {
          id: id,
        },
      },
    );
  }

  async addComment(params: {
    content: string;
    feedbackId: number;
    userId: number;
  }): Promise<any> {
    return await this.feedbackCommentRepository.create({
      content: params.content,
      userId: params.userId,
      feedbackId: params.feedbackId,
      active: 1,
    });
  }

  async addCommentBulkCreate(data: any): Promise<any> {
    return await this.feedbackCommentRepository.bulkCreate(data);
  }

  async getCommentById(commentId: number): Promise<any> {
    return await this.feedbackCommentRepository.findOne({
      where: {
        id: commentId,
      },
    });
  }

  async editComment(params: { content: string; id: number }): Promise<any> {
    return await this.feedbackCommentRepository.update(
      { content: params.content },
      { where: { id: params.id } },
    );
  }

  async updateImpactScope(query: any) {
    return await this.feedBackRepository.update(
      { impactScope: query.impactScope },
      {
        where: {
          id: query.id,
        },
      },
    );
  }

  async updateStatus(query: any) {
    return await this.feedBackRepository.update(
      { status: query.status },
      {
        where: {
          id: query.id,
        },
      },
    );
  }

  async updateFeedbackDetail(params: any) {
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
    } else {
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

  async getUpdateTime(id: number) {
    return await this.feedBackRepository.findOne({
      attributes: ['updatedTime', 'userId'],
      where: {
        id: id,
      },
    });
  }

  async deleteIssueRelated(id: number) {
    const feedback = await this.feedBackRepository.findByPk(id);
    if (feedback.group === feedback.id) {
      // if deleted feedback's group is its id, set all other feedbacks in group to a random feedback's id
      await this.feedBackRepository.sequelize.query(
        `
            WITH other_feedbacks AS (SELECT id
                                     FROM feedback_tbl
                                     WHERE "group" = :group
                                       AND id <> :group)
            UPDATE feedback_tbl
            SET "group" = (SELECT id FROM other_feedbacks LIMIT 1)
            WHERE id IN (SELECT id FROM other_feedbacks);
          `,
        {
          type: QueryTypes.UPDATE,
          replacements: {
            group: feedback.group,
          },
        },
      );
    } else {
      // Otherwise reset deleted feedback's group to its id
      await feedback.update({
        group: feedback.id,
      });
    }
  }

  async getNonRelatedFeedbacks(
    originalFeedback: Feedback,
    criteria: NonRelatedFeedbackSearchDto,
  ) {
    return await this.feedBackRepository.findAndCountAll({
      where: {
        group: {
          [Op.ne]: originalFeedback.group,
        },
        ...(criteria.type === null ? {} : { type: criteria.type }),
        ...(criteria.phase === null ? {} : { phase: criteria.phase }),
        ...(criteria.features.length === 0
          ? {}
          : {
              feature: {
                [Op.overlap]: Sequelize.cast(
                  criteria.features.map((feat) => feat.join('-')),
                  'text[]',
                ),
              },
            }),
        ...(criteria.impactScope === null
          ? {}
          : {
              impactScope:
                criteria.impactScope === -1 ? null : criteria.impactScope,
            }),
        ...(criteria.status === null ? {} : { status: criteria.status }),
        ...(!criteria.keyword
          ? {}
          : {
              [Op.or]: [
                Sequelize.where(
                  Sequelize.cast(Sequelize.col('id'), 'varchar'),
                  { [Op.like]: `%${criteria.keyword}%` },
                ),
                { summary: { [Op.iLike]: `%${criteria.keyword}%` } },
              ],
            }),
      },
      order: [['createdTime', 'DESC']],
      limit: criteria.limit,
      offset: criteria.offset,
    });
  }

  async groupFeedbacks(originalId: number, addedIds: number[]) {
    await this.feedBackRepository.sequelize.query(
      `
          UPDATE feedback_tbl
          SET "group" = (SELECT "group" FROM feedback_tbl WHERE id = :originalId)
          WHERE "group" IN (SELECT DISTINCT "group" FROM feedback_tbl WHERE id IN (:addedIds));
        `,
      {
        type: QueryTypes.UPDATE,
        replacements: {
          originalId,
          addedIds,
        },
      },
    );
  }

  async getUpdateTimeComment(id: number) {
    return await this.feedbackCommentRepository.findOne({
      attributes: ['updatedTime'],
      where: {
        id: id,
      },
    });
  }

  async deleteComment(data: any) {
    return await this.feedbackCommentRepository.destroy({
      where: {
        id: data.id,
      },
    });
  }

  async getUserIdByFeedbackId(id: number) {
    return await this.feedBackRepository.findOne({
      attributes: ['userId'],
      where: {
        id: id,
      },
    });
  }
}
