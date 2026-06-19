import { FeedbackCommnet } from 'src/entity/FeedbackComment';
import { FeedbackCommentRepositoryI } from 'src/interfaces/repository/feedbackComment.repository.interface';
export declare class FeedbackCommentRepository implements FeedbackCommentRepositoryI {
    private feedbackCommentRepository;
    getUpdateTime(id: number): Promise<FeedbackCommnet>;
    getCommentById(commentId: number): Promise<any>;
    editComment(params: {
        id: number;
        content: string;
    }): Promise<any>;
    deleteComment(params: {
        id: number;
    }): Promise<any>;
}
