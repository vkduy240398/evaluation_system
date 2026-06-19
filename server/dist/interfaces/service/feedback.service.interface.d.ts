export interface AddComment {
    userId: number;
    feedbackId: number;
    content: string;
    updatedTime: string;
}
export interface EditComment {
    userId: number;
    commentId: number;
    content: string;
    updatedTime: string;
}
export interface DeleteComment {
    userId: number;
    commentId: number;
    updatedTime: string;
}
