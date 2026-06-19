/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Request } from 'express';
import { Transaction } from 'sequelize';
import { sendEmailsWith } from 'src/common/mail/util';
import { encrypt, isFormatDate, latin1ToUtf8, S3 } from 'src/common/util';
import { Roles } from 'src/enum/Roles';
import { FeedbackRepositoryI } from 'src/interfaces/repository/feedback.repository.interface';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { AddComment } from 'src/interfaces/service/feedback.service.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { UserRepository } from 'src/repository/user.repository';
import { Feedback } from '../entity/Feedback';
import { User } from '../entity/User';
import { FeedbackStatus } from '../enum/FeedbackStatus';
import {
  FeedbackCreateDto,
  NonRelatedFeedbackSearchDto,
  UserFeedbackSearchDto,
} from '../model/request/FeedbackRequestDto';
import { CustomLogger } from './logger.service';
import { MailService } from './mail.service';

@Injectable()
export class FeedbackService {
  @Inject(FeedbackRepository)
  private feedbackRepository: FeedbackRepositoryI;

  @Inject(UserRepository)
  private userRepository: UserRepositoryI;

  @Inject(MailService)
  private mailService: MailService;

  constructor(private logger: CustomLogger) {}

  STATUS_ADD_COMMENT = [1, 2, 4, 5];

  async listFeedback(params: any) {
    const dataRaw = await this.feedbackRepository.listFeedback(params);
    // const countsRaw = await this.feedbackRepository.countListFeedback(params);
    const data = dataRaw[0];
    const counts = dataRaw[0][0]?.count;

    return await { data: data, counts: counts };
  }

  async deleteFeedback(params: any, companyGroupCode: string) {
    const transaction: Transaction =
      await this.feedbackRepository.getNewTransaction();

    const result = await this.feedbackRepository.deleteFeedback(
      params,
      transaction,
      companyGroupCode,
    );

    await transaction.commit();
    return result;
  }

  async detailFeedback(params: any, companyGroupCode: string) {
    const dataRaw = await this.feedbackRepository.detailFeedback(
      params,
      companyGroupCode,
    );

    //  vì query thuần nên lấy [0] đầu tiên để lấy ra data của câu query
    // [0] thứ 2 lấy vì API detail nên lấy record đầu tiên
    return dataRaw[0][0];
  }

  async getZipFeedback(params: any, req: Request) {
    return await this.feedbackRepository.downloadFeedbackZIP(params, req);
  }

  async updateFeedback(
    params: any,
    companyGroupCode: string,
    files?: Express.Multer.File[],
  ) {
    const transaction: Transaction =
      await this.feedbackRepository.getNewTransaction();

    try {
      const feedback = await this.feedbackRepository.findOneFeedback({
        id: params.id,
        companyGroupCode: companyGroupCode,
      });

      if (
        params.updatedTime &&
        params.updatedTime.toString() !== feedback.updatedTime.toISOString()
      ) {
        throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
      } else {
        const result = await this.feedbackRepository.updateFeedback(
          params,
          companyGroupCode,
          transaction,
        );

        await transaction.commit();
        return true;
      }
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFeedbackWithFiles(
    params: any,
    companyGroupCode: string,
    userId: number,
    files: Express.Multer.File[],
  ) {
    const currentFeedback = await this.feedbackRepository.getUserFeedbackById(
      params.id,
      userId,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(params.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    const transaction: Transaction =
      await this.feedbackRepository.getNewTransaction();
    let result;
    try {
      result = await this.feedbackRepository.updateFeedback(
        params,
        companyGroupCode,
        transaction,
      );
      const s3 = await S3();
      // Delete each file individually
      if (params.listFilesDeleted) {
        for (const fileName of params?.listFilesDeleted) {
          const deleteParams = {
            Bucket: process.env['S3_BUCKET_' + companyGroupCode],
            Key: `${params.id}/${fileName}`, // The specific file key to delete
          };
          await s3.deleteObject(deleteParams).promise();
        }
      }

      if (files) {
        const uploadPromises = files.map(
          (f): Promise<ManagedUpload.SendData> =>
            s3
              .upload({
                Bucket: process.env['S3_BUCKET_' + companyGroupCode],
                Key: `${params.id}/${latin1ToUtf8(f.originalname)}`,
                Body: f.buffer,
                ContentType: f.mimetype,
              })
              .promise(),
        );
        await Promise.all(uploadPromises);
      }
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadExcel(params: {
    department: string;
    user: string;
    dateStart: string;
    dateEnd: string;
    type: string[];
    status: string[];
    companyGroupCode: string;
  }) {
    const dataRaws = await this.feedbackRepository.listFeedbackExcel(params);
    const dataLinks = dataRaws.map((v) => ({
      ...v,
      link: v.attachFiles
        ? `${process.env.HOSTNAME_}/company/${
            params.companyGroupCode
          }/download-feedback/${encrypt(v.id.toString())}`
        : null,
    }));
    return dataLinks;
  }

  async getUserFeedbacks(
    body: UserFeedbackSearchDto,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    return await this.feedbackRepository.getFeedbacksByUserId(
      body,
      userId,
      companyGroupCode,
      timeZone,
    );
  }

  async getUserFeedbackById(
    feedbackId: number,
    userId: number,
  ): Promise<Feedback | null> {
    return await this.feedbackRepository.getUserFeedbackById(
      feedbackId,
      userId,
    );
  }

  async createFeedback(
    userId: number,
    params: FeedbackCreateDto,
    files: Express.Multer.File[],
    companyGroupCode: string,
    timeZone: string,
  ) {
    const transaction = await this.feedbackRepository.getNewTransaction();
    try {
      const newFeedback: Partial<Feedback> = {
        role: JSON.parse(params.roles).map((r) => +r),
        type: +params.type,
        phase: +params.phase,
        feature: params.features
          ? JSON.parse(params.features).map((feat) => feat.join('-'))
          : [],
        summary: params.summary,
        detail: params.detail,
        attachFiles:
          files.map((f) => latin1ToUtf8(f.originalname)).join('|') || undefined,
        status: FeedbackStatus.SENT,
        userId,
        companyGroupCode,
      };
      const createdFeedback = await this.feedbackRepository.addFeedback(
        newFeedback,
        transaction,
      );

      const s3 = await S3();
      const uploadPromises = files.map(
        (f): Promise<ManagedUpload.SendData> =>
          s3
            .upload({
              Bucket: process.env['S3_BUCKET'],
              Key: `${companyGroupCode}/${createdFeedback.id}/${latin1ToUtf8(
                f.originalname,
              )}`,
              Body: f.buffer,
              ContentType: f.mimetype,
            })
            .promise(),
      );
      await Promise.all(uploadPromises);

      await transaction.commit();
      void this.sendEmailOnFeedbackCreated(createdFeedback);
      return createdFeedback;
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendEmailOnFeedbackCreated(createdFeedback: Feedback) {
    try {
      const sentUser: User = await this.userRepository.getUserInforById(
        createdFeedback.userId,
      );
      const f9Users = await this.userRepository.getListUserWithRole(Roles.F9);
      const { title, content } =
        await this.mailService.getSendMailCreateFeedback(
          {
            feedbackId: createdFeedback.id,
            userName: sentUser.fullName,
            companyName: sentUser.company.name,
            departmentName:
              sentUser.level >= 8
                ? sentUser.division.name
                : sentUser.department.name, // có thể null vì khi user level > 8 có thể setting không có department
            typeFeedback: createdFeedback.type,
            overview: createdFeedback.summary,
          },
          createdFeedback.companyGroupCode,
        );
      sendEmailsWith(
        f9Users.map((value) => value.email),
        [],
        title,
        content,
      );
    } catch (e) {
      this.logger.error(
        undefined,
        `Send mail create feedback failed at ${new Date()}:\n${e}`,
      );
    }
  }

  async deleteUserFeedbacks(
    userId: number,
    feedbackIds: number[],
    companyGroupCode: string,
  ) {
    const transaction = await this.feedbackRepository.getNewTransaction();
    try {
      const filteredId = (
        await this.feedbackRepository.getUserFeedbacksByIds(feedbackIds, userId)
      ).map((f) => f.id);
      await this.feedbackRepository.deleteUserFeedbacks(
        userId,
        filteredId,
        transaction,
      );

      const s3 = await S3();
      const promises = filteredId.map((id) =>
        s3
          .listObjectsV2({
            Bucket: process.env['S3_BUCKET_' + companyGroupCode],
            Prefix: `${id}/`,
          })
          .promise(),
      );
      const keys = (await Promise.all(promises)).flatMap((l) =>
        l.Contents.map((o) => ({ Key: o.Key })),
      );
      if (keys.length > 0)
        await s3
          .deleteObjects({
            Bucket: process.env['S3_BUCKET_' + companyGroupCode],
            Delete: { Objects: keys },
          })
          .promise();
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadAttachFile(
    id: number,
    fileName: string,
    companyGroupCode?: string,
  ) {
    return await this.feedbackRepository.downloadAttachFile(
      id,
      fileName,
      companyGroupCode ||
        (
          await this.feedbackRepository.findOneFeedback({ id })
        ).companyGroupCode,
    );
  }

  async downloadFileFromExcel(id: string, companyGroupCode: string) {
    const s3 = await S3();

    //** Coi file tren s3 */

    const fileParams = {
      Bucket: process.env['S3_BUCKET_' + companyGroupCode],
      Prefix: `${id}/`,
    };
    const data = await s3.listObjectsV2(fileParams).promise();
    const files = data.Contents;
    // Fetch each file's data
    const filePromises = await files.map(async (file) => {
      const fileParams = {
        Bucket: process.env['S3_BUCKET_' + companyGroupCode],
        Key: file.Key,
      };
      const fileData = await s3.getObject(fileParams).promise();
      return {
        name: file.Key.split('/').pop(), // Get the file name
        data: fileData.Body, // File data as Buffer
        contentType: fileData.ContentType, // Content type
      };
    });
    const folderName = await this.feedbackRepository.getFolderName(id);

    const datas = await Promise.all(filePromises);

    return { data: datas, folderName: folderName };
  }

  async getDetailFeedback(id: any, timeZone: string) {
    return await this.feedbackRepository.getDetailFeedback(id, timeZone);
  }

  async cancelFeedback(query: any) {
    const id = query.id;
    const currentFeedback = await this.feedbackRepository.getUpdateTime(id);

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(query.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    return await this.feedbackRepository.cancelFeedback(id);
  }

  // async handleSendMailToAdmin(feedbackId: number, userId: number) {
  //   const getUserInfo = await this.userRepository.getUserInforById(userId);
  //   const getFeedbackInfo = await this.feedbackRepository.getDetailFeedback(
  //     feedbackId,
  //   );
  //   const data = {
  //     userName: getUserInfo.fullName,
  //     typeFeedback: getFeedbackInfo.feedbackDetail.type,
  //     overview: getFeedbackInfo.feedbackDetail.summary,
  //     companyName: getUserInfo.company.name,
  //   };

  //   const { title, content } =
  //     await this.mailService.getSendMailAdminWhenUserDeleted(
  //       data,
  //       getFeedbackInfo.feedbackDetail.companyGroupCode,
  //     );
  //   // get danh sach admin cua company do
  //   const getListEmailSystemAdmin =
  //     await this.userRepository.getListUserWithRole(
  //       Roles.F5,
  //       getFeedbackInfo.feedbackDetail.companyGroupCode,
  //     );
  //   const listEmail = getListEmailSystemAdmin.map((value) => value.email);

  //   sendEmailsWith(listEmail, [], title, content);
  // }

  async addComment(
    params: AddComment,
    typeAddComment: number,
    timeZone: string,
  ) {
    const currentFeedback = await this.feedbackRepository.getUpdateTime(
      params.feedbackId,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(params.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    const result = await this.feedbackRepository.addComment(params);

    if (result) {
      const getFeedbackInfo = await this.feedbackRepository.getDetailFeedback(
        params.feedbackId,
        timeZone,
      );

      if (typeAddComment === 1) {
        // truong hop user call API ma khong can quyen
        if (
          this.STATUS_ADD_COMMENT.includes(
            getFeedbackInfo.feedbackDetail.status,
          )
        ) {
          // get danh sach system admin
          const getListEmailSystemAdmin =
            await this.userRepository.getListUserWithRole(Roles.F9);

          // user comment
          const data = {
            feedbackId: params.feedbackId,
            listFullName: getListEmailSystemAdmin.map(
              (value) => value.fullName,
            ),
            typeFeedback: getFeedbackInfo.feedbackDetail.type,
            overview: getFeedbackInfo.feedbackDetail.summary,
          };

          // format title, content
          const { title, content } =
            await this.mailService.getSendMailCommentFeedback(
              data,
              getFeedbackInfo.feedbackDetail.companyGroupCode,
              1,
            );

          sendEmailsWith(
            getListEmailSystemAdmin.map((value) => value.email),
            [],
            title,
            content,
          );
        }
      } else if (typeAddComment === 2) {
        if (
          this.STATUS_ADD_COMMENT.includes(
            getFeedbackInfo.feedbackDetail.status,
          )
        ) {
          const getUserCreatedFeedback =
            await this.userRepository.getUserInforById(
              getFeedbackInfo.feedbackDetail.userID,
            );

          if (getUserCreatedFeedback.active === 1) {
            // sa comment
            const data = {
              feedbackId: params.feedbackId,
              listFullName: [getUserCreatedFeedback.fullName],
              typeFeedback: getFeedbackInfo.feedbackDetail.type,
              overview: getFeedbackInfo.feedbackDetail.summary,
            };
            // format title, content
            const { title, content } =
              await this.mailService.getSendMailCommentFeedback(
                data,
                getFeedbackInfo.feedbackDetail.companyGroupCode,
                2,
              );
            sendEmailsWith([getUserCreatedFeedback.email], [], title, content);
          }
        }
      }

      return {
        code: 200,
      };
    }
  }

  async addCommentAllRelated(params: AddComment, timeZone: string) {
    await this.addComment(params, 2, timeZone);

    const getFeedbackInfo = await this.feedbackRepository.getDetailFeedback(
      params.feedbackId,
      timeZone,
    );

    // seperates add comment and send mail
    // add comment to all issues has status can comment
    const listRelatedIssues: any[] =
      getFeedbackInfo.feedbackDetail.issuesRelated.filter(
        (item: { status: number }) =>
          this.STATUS_ADD_COMMENT.includes(item.status),
      );
    const listDataBulkCreate = listRelatedIssues.map((i: { id: number }) => {
      return {
        content: params.content,
        feedbackId: i.id,
        userId: params.userId,
        active: 1,
      };
    });
    const result = await this.feedbackRepository.addCommentBulkCreate(
      listDataBulkCreate,
    );

    // send mail
    if (result) {
      for (const issue of listRelatedIssues) {
        if (issue.userInfor.active === 1) {
          // format title, content
          const data = {
            feedbackId: issue.id,
            listFullName: [issue.userInfor.fullName],
            typeFeedback: issue.type,
            overview: issue.summary,
          };
          // format title, content
          const { title, content } =
            await this.mailService.getSendMailCommentFeedback(
              data,
              getFeedbackInfo.feedbackDetail.companyGroupCode,
              2,
            );
          sendEmailsWith([issue.userInfor.email], [], title, content);
        }
      }
    }
    return {
      code: 200,
    };
  }

  async updateImpactScope(query: any) {
    const currentFeedback = await this.feedbackRepository.getUpdateTime(
      query.id,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(query.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    return await this.feedbackRepository.updateImpactScope(query);
  }

  async updateStatus(query: any, companyGroupCode: string, timeZone: string) {
    const currentFeedback = await this.feedbackRepository.getUpdateTime(
      query.id,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(query.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    const userInfor = await this.userRepository.getUserInforById(
      currentFeedback.userId,
    );
    const feedbackInfo = await this.feedbackRepository.getDetailFeedback(
      query.id,
      timeZone,
    );

    if (userInfor.active === 1) {
      const data = {
        userName: userInfor.fullName,
        feedbackId: query.id,
        status: query.status,
        overview: feedbackInfo.feedbackDetail.summary,
      };
      // format title, content
      const { title, content } =
        await this.mailService.getSendMailUpdateFeedback(
          data,
          companyGroupCode,
        );
      sendEmailsWith([userInfor.email], [], title, content);
    }

    return await this.feedbackRepository.updateStatus(query);
  }

  async updateFeedbackDetail(
    params: any,
    companyGroupCode: string,
    files: Express.Multer.File[],
  ) {
    const currentFeedback = await this.feedbackRepository.getUpdateTime(
      params.id,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(params.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }
    const result = await this.feedbackRepository.updateFeedbackDetail(params);

    if (params.permission == 'user') {
      const s3 = await S3();
      // Delete each file individually
      if (params.listFilesDeleted) {
        for (const fileName of params?.listFilesDeleted) {
          const deleteParams = {
            Bucket: process.env['S3_BUCKET'],
            Key: `${companyGroupCode}/${params.id}/${fileName}`, // The specific file key to delete
          };
          await s3.deleteObject(deleteParams).promise();
        }
      }

      if (files) {
        const uploadPromises = files.map(
          (f): Promise<ManagedUpload.SendData> =>
            s3
              .upload({
                Bucket: process.env['S3_BUCKET'],
                Key: `${companyGroupCode}/${params.id}/${latin1ToUtf8(
                  f.originalname,
                )}`,
                Body: f.buffer,
                ContentType: f.mimetype,
              })
              .promise(),
        );
        await Promise.all(uploadPromises);
      }
    }

    return result;
  }

  async deleteIssueRelated(query: any) {
    const currentFeedback = await this.feedbackRepository.getUpdateTime(
      query.id,
    );

    if (
      new Date(currentFeedback.updatedTime).getTime() !==
      new Date(query.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }
    return await this.feedbackRepository.deleteIssueRelated(query.id);
  }

  async getNonRelatedFeedbacks(criteria: NonRelatedFeedbackSearchDto) {
    const feedback = await this.feedbackRepository.findOneFeedback({
      id: criteria.originalFeedbackId,
    });
    if (!feedback)
      throw new RuntimeException(
        `Feedback ${criteria.originalFeedbackId} not found`,
        HttpStatus.NOT_FOUND,
      );
    return await this.feedbackRepository.getNonRelatedFeedbacks(
      feedback,
      criteria,
    );
  }

  async addRelatedFeedbacks(originalId: number, addedIds: number[]) {
    await this.feedbackRepository.groupFeedbacks(originalId, addedIds);
  }

  async getFeedbacksForExcel(
    param: UserFeedbackSearchDto,
    companyGroupCode: string,
    timeZone: string,
  ) {
    return await this.feedbackRepository.getFeedbacksForExcel(
      param,
      companyGroupCode,
      timeZone,
    );
  }

  async deleteComment(data: any) {
    const currentComment = await this.feedbackRepository.getUpdateTimeComment(
      data.id,
    );

    if (
      new Date(currentComment.updatedTime).getTime() !==
      new Date(data.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }
    return await this.feedbackRepository.deleteComment(data);
  }

  async getUserIdByFeedbackId(id: any) {
    return await this.feedbackRepository.getUserIdByFeedbackId(id);
  }
}
