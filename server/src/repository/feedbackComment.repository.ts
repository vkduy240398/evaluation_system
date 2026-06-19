import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { Feedback } from 'src/entity/Feedback';
import { FeedbackCommnet } from 'src/entity/FeedbackComment';
import { User } from 'src/entity/User';
import { FeedbackCommentRepositoryI } from 'src/interfaces/repository/feedbackComment.repository.interface';

@Injectable()
export class FeedbackCommentRepository implements FeedbackCommentRepositoryI {
  @Inject(EntityConstant.FEEDBACK_COMMENT_ENTITY)
  private feedbackCommentRepository: typeof FeedbackCommnet;

  async getUpdateTime(id: number) {
    return await this.feedbackCommentRepository.findOne({
      attributes: ['updatedTime'],
      where: {
        id: id,
      },
    });
  }

  async getCommentById(commentId: number): Promise<any> {
    return await this.feedbackCommentRepository.findOne({
      where: {
        id: commentId,
      },
      include: [
        { model: Feedback, as: 'feedback' },
        { model: User, as: 'user' },
      ],
    });
  }

  async editComment(params: { id: number; content: string }): Promise<any> {
    return await this.feedbackCommentRepository.update(
      { content: params.content, createdTime: new Date() },
      {
        where: { id: params.id },
      },
    );
  }

  async deleteComment(params: { id: number }): Promise<any> {
    return await this.feedbackCommentRepository.update(
      {
        active: 0,
      },
      {
        where: {
          id: params.id,
        },
      },
    );
  }
}
