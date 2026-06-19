import { FeedbackType } from '../../enum/FeedbackType';
import { FeedbackStatus } from '../../enum/FeedbackStatus';
import { FeedbackPhase } from '../../enum/FeedbackPhase';
import { FeedbackImpactScope } from '../../enum/FeedbackImpactScope';
export declare class ListFeedbackDto {
    dateStart: string;
    dateEnd: string;
    typeFeedback: string;
    statusFeedback: string;
    department: string;
    user: string;
    offset: string;
    limit: string;
    sortBy: string;
    sortType: string;
}
export declare class UserFeedbackSearchDto {
    dates: [string, string];
    type?: FeedbackType;
    phase?: number;
    feature: (string | number)[][];
    status?: FeedbackStatus;
    offset: number;
    limit: number;
    role: 'user' | 'admin' | 'systemAdmin';
    impactScope?: number | null;
    keywork: string;
}
export declare class FeedbackCreateDto {
    roles: string;
    type: FeedbackType;
    phase: FeedbackPhase;
    features?: string;
    summary: string;
    detail: string;
}
export declare class NonRelatedFeedbackSearchDto {
    type: FeedbackType;
    phase: FeedbackPhase;
    features: string[][];
    impactScope: FeedbackImpactScope | -1;
    status: FeedbackStatus;
    keyword: string;
    originalFeedbackId: number;
    limit: number;
    offset: number;
}
export declare class AddCommentFeedbackDto {
    content: string;
    feedbackId: number;
    updatedTime: string;
}
export declare class EditCommentFeedbackDto {
    content: string;
    commentId: number;
    updatedTime: string;
}
export declare class DeleteCommentFeedbackDto {
    commentId: number;
    updatedTime: string;
}
