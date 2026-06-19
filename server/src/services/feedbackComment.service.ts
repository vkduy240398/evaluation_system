import { Inject, Injectable } from '@nestjs/common';
import { FeedbackCommnet } from 'src/entity/FeedbackComment';
import { FeedbackCommentRepositoryI } from 'src/interfaces/repository/feedbackComment.repository.interface';
import {
  DeleteComment,
  EditComment,
} from 'src/interfaces/service/feedback.service.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { FeedbackCommentRepository } from 'src/repository/feedbackComment.repository';
import { MailService } from './mail.service';
import { UserRepository } from 'src/repository/user.repository';
import { UserRepositoryI } from 'src/interfaces/repository/user.repository.interface';
import { Roles } from 'src/enum/Roles';
import { sendEmailsWith } from 'src/common/mail/util';

@Injectable()
export class FeedbackCommentService {
  STATUS_ADD_COMMENT = [1, 2, 4, 5];

  @Inject(FeedbackCommentRepository)
  private feedbackCommentRepository: FeedbackCommentRepositoryI;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(UserRepository)
  private userRepository: UserRepositoryI;

  async editComment(params: EditComment) {
    const currentComment = await this.feedbackCommentRepository.getUpdateTime(
      params.commentId,
    );

    if (
      new Date(currentComment.updatedTime).getTime() !==
      new Date(params.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    const result: FeedbackCommnet =
      await this.feedbackCommentRepository.getCommentById(params.commentId);

    if (result.userId === params.userId) {
      await this.feedbackCommentRepository.editComment({
        id: params.commentId,
        content: params.content,
      });
    }

    return { code: 200 };
  }

  async deleteComment(params: DeleteComment, typeAddComment: number) {
    const currentUpdateTimeComment =
      await this.feedbackCommentRepository.getUpdateTime(params.commentId);

    if (
      new Date(currentUpdateTimeComment.updatedTime).getTime() !==
      new Date(params.updatedTime).getTime()
    ) {
      throw new RuntimeException('Invalid time', 409);
    }

    const result: FeedbackCommnet =
      await this.feedbackCommentRepository.getCommentById(params.commentId);

    if (
      result.userId === params.userId &&
      this.STATUS_ADD_COMMENT.includes(result.feedback.status)
    ) {
      if (typeAddComment === 1) {
        // get danh sach system admin
        const getListEmailSystemAdmins =
          await this.userRepository.getListUserWithRole(Roles.F9);

        // user comment
        const data = {
          feedbackId: result.feedback.id,
          listFullName: getListEmailSystemAdmins.map((value) => value.fullName),
          typeFeedback: result.feedback.type,
        };

        // format title, content
        const { title, content } =
          await this.mailService.getSendMailDeleteComment(
            data,
            result.feedback.companyGroupCode,
            1,
          );

        sendEmailsWith(
          getListEmailSystemAdmins.map((value) => value.email),
          [],
          title,
          content,
        );
      } else if (typeAddComment === 2) {
        const getUserCreatedFeedback =
          await this.userRepository.getUserInforById(result.feedback.userId);

        if (getUserCreatedFeedback.active === 1) {
          // sa comment
          const data = {
            feedbackId: result.feedback.id,
            listFullName: [getUserCreatedFeedback.fullName],
            typeFeedback: result.feedback.type,
          };
          // format title, content
          const { title, content } =
            await this.mailService.getSendMailDeleteComment(
              data,
              result.feedback.companyGroupCode,
              2,
            );
          sendEmailsWith([getUserCreatedFeedback.email], [], title, content);
        }
      }

      // delete comment để cuối
      await this.feedbackCommentRepository.deleteComment({
        id: params.commentId,
      });
      return { code: 200 };
    }
  }
}
