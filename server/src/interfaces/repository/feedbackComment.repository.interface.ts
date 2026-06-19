export interface FeedbackCommentRepositoryI {
  getUpdateTime(id: any): any;
  getCommentById(commentId: number): Promise<any>;
  editComment(params: { id: number; content: string }): Promise<any>;
  deleteComment(params: { id: number }): Promise<any>;
}
