import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { Request } from 'express';
import {
  AddCommentFeedbackDto,
  DeleteCommentFeedbackDto,
  EditCommentFeedbackDto,
  NonRelatedFeedbackSearchDto,
  UserFeedbackSearchDto,
} from 'src/model/request/FeedbackRequestDto';
import { FeedbackService } from 'src/services/feedback.service';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FeedbackCommentService } from 'src/services/feedbackComment.service';
import { isFormatDate } from 'src/common/util';

@Controller('v1/f9/system-admin')
@Authorize(Roles.F9)
@UseGuards(RolesGuard)
@ApiTags(Tag.F9)
export class ManagementUserRoleController {
  constructor(private feedbackService: FeedbackService) {
    //
  }

  @Inject(FeedbackCommentService)
  private feedbackCommentService: FeedbackCommentService;

  @Post('/feedbacks')
  async getFeedbacks(@Body() body: UserFeedbackSearchDto, @Req() req: Request) {
    return await this.feedbackService.getUserFeedbacks(
      body,
      null,
      null,
      req.user.timeZone,
    );
  }

  @Post('/feedbacks/non-related')
  @HttpCode(HttpStatus.OK)
  async getNonRelatedFeedbacks(@Body() body: NonRelatedFeedbackSearchDto) {
    return await this.feedbackService.getNonRelatedFeedbacks(body);
  }

  @Put('/feedbacks/:id/related')
  async addRelatedFeedbacks(
    @Param('id') originalId: number,
    @Body() body: { ids: number[] },
  ) {
    await this.feedbackService.addRelatedFeedbacks(originalId, body.ids);
  }

  @Put('/update-impact-scope')
  async updateImpactScope(@Body() query: any) {
    return await this.feedbackService.updateImpactScope(query);
  }

  @Put('/update-status')
  async updateStatus(@Body() query: any, @Req() req: Request) {
    return await this.feedbackService.updateStatus(
      query,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/update-feedbacks')
  @UseInterceptors(FilesInterceptor('files'))
  async updateFeedbackDetail(
    @Body() params: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return await this.feedbackService.updateFeedbackDetail(
      params,
      req.user.companyGroupCode,
      files,
    );
  }

  @Get('/get-detail-feedback')
  async getDetailFeedback(@Query() query: any, @Req() req: Request) {
    const result = await this.feedbackService.getDetailFeedback(
      query.id,
      req.user.timeZone,
    );

    return result;
  }

  @Put('/delete-issue-related')
  async deleteIssueRelated(@Body() query: any) {
    return await this.feedbackService.deleteIssueRelated(query);
  }

  @Post('/add-comment')
  async addComment(@Body() body: AddCommentFeedbackDto, @Req() req: Request) {
    const params = {
      userId: req.user.id,
      feedbackId: body.feedbackId,
      content: body.content,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackService.addComment(params, 2, req.user.timeZone);
  }

  @Post('/add-comment-all-related')
  async addCommentAllRelated(
    @Body() body: AddCommentFeedbackDto,
    @Req() req: Request,
  ) {
    const params = {
      userId: req.user.id,
      feedbackId: body.feedbackId,
      content: body.content,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackService.addCommentAllRelated(
      params,
      req.user.timeZone,
    );
  }

  @Post('/feedbacks/excel')
  @HttpCode(HttpStatus.OK)
  async getFeedbacksForExcel(
    @Body() body: UserFeedbackSearchDto,
    @Req() req: Request,
  ) {
    return await this.feedbackService.getFeedbacksForExcel(
      body,
      null,
      req.user.timeZone,
    );
  }

  @Get('/feedbacks/:id/file')
  async downloadFile(
    @Param('id') id: number,
    @Query('fileName') fileName: string,
  ) {
    return await this.feedbackService.downloadAttachFile(id, fileName);
  }

  @Post('/edit-comment')
  async editComment(@Body() body: EditCommentFeedbackDto, @Req() req: Request) {
    const params = {
      userId: req.user.id,
      commentId: body.commentId,
      content: body.content,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackCommentService.editComment(params);
  }

  @Put('/delete-comment')
  async deleteComment(
    @Body() body: DeleteCommentFeedbackDto,
    @Req() req: Request,
  ) {
    const params = {
      userId: req.user.id,
      commentId: body.commentId,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackCommentService.deleteComment(params, 2);
  }
}
