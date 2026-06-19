import { DeleteComment, EditComment } from 'src/interfaces/service/feedback.service.interface';
export declare class FeedbackCommentService {
    STATUS_ADD_COMMENT: number[];
    private feedbackCommentRepository;
    private mailService;
    private userRepository;
    editComment(params: EditComment): Promise<{
        code: number;
    }>;
    deleteComment(params: DeleteComment, typeAddComment: number): Promise<{
        code: number;
    }>;
}
