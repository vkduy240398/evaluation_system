/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Body,
  Controller,
  Delete,
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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tag } from 'src/enum/Tag';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { CompanyService } from 'src/services/company.service';
import { DepartmentService } from 'src/services/department.service';
import { GuideEvaluationService } from 'src/services/guideEvaluation.service';
import { RoleService } from 'src/services/role.service';
import { IdNumberDto } from 'src/model/request/IdNumberDto';
import { ReportService } from 'src/services/report.service';
import { Request } from 'express';
import { EvaluationService } from 'src/services/evaluation.service';
import { EvaluationPeriodService } from 'src/services/evaluationPeriod.service';
import { Public } from 'src/handler/annotation/Authentication';
import { NotificationPeriodDto } from 'src/model/response/common/NotificationPeriodDto';
import {
  EvaluationDescriptionByIdDto,
  EvaluationDescriptionDto,
  EvaluationDescriptionQuery,
} from 'src/model/response/common/EvaluationDescriptionDto';
import { GetAllDepartmentDto } from 'src/model/response/common/GetAllDepartmentDto';
import { GetAllDivisionDepartmentDto } from 'src/model/response/common/GetAllDivisionDepartment';
import { GetAllCompanyDto } from 'src/model/response/common/GetAllCompanyDto';
import { GetAllRoleDto } from 'src/model/response/common/GetAllRoleDto';
import { GetAllDepartmentTypeDepartmentDto } from 'src/model/response/common/GetAllDepartmentTypeDepartmentDto';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { VersionNotificationServiceI } from 'src/interfaces/service/versionNotification.service.interface';
import { VersionNotificationService } from 'src/services/versionNotification.service';
import { decrypt, isFormatDate } from 'src/common/util';
import { FeedbackService } from 'src/services/feedback.service';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import {
  AddCommentFeedbackDto,
  FeedbackCreateDto,
  UserFeedbackSearchDto,
} from '../../model/request/FeedbackRequestDto';
import { Feedback } from '../../entity/Feedback';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserService } from 'src/services/user.service';
import {
  Evaluation810Param,
  EvaluationBasicBehaviorPublicTypeDto,
} from 'src/model/request/EvaluationParamDto';
import { ReferenceReviewService } from 'src/services/referenceReview.service';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import { AdminApprovalService } from 'src/services/adminApproval.service';
import { FeedbackCommentService } from 'src/services/feedbackComment.service';

const contentDisposition = require('content-disposition');

@Controller('v1/common')
@UseGuards(RolesGuard)
@ApiTags(Tag.COMMON)
@Public()
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal Server Error',
})
export class CommonController {
  @Inject(CompanyService)
  private companyService: CompanyService;

  @Inject(RoleService)
  private roleService: RoleService;

  @Inject(GuideEvaluationService)
  private guideEvaluationService: GuideEvaluationService;

  @Inject(DepartmentService)
  private departmentService: DepartmentService;

  @Inject(ReportService)
  private reportService: ReportService;

  @Inject(EvaluationService)
  private evaluationService: EvaluationService;

  @Inject(EvaluationPeriodService)
  private evaluationPeriodService: EvaluationPeriodService;

  @Inject(VersionNotificationService)
  private versionNotificationService: VersionNotificationServiceI;

  @Inject(FeedbackService)
  private feedbackService: FeedbackService;

  @Inject(ReferenceReviewService)
  private referenceReviewService: ReferenceReviewService;

  @Inject(UserService)
  private userServices: UserService;

  @Inject(AdminApprovalService)
  private approvalService: AdminApprovalService;

  @Inject(FeedbackCommentService)
  private feedbackCommentService: FeedbackCommentService;

  @Get('/get-notification-period')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [NotificationPeriodDto],
  })
  async getNotificationPeriod(@Req() req: Request) {
    return await this.evaluationPeriodService.getNotificationPeriod(
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/get-evaluation-description')
  @ApiResponse({
    status: HttpStatus.OK,
    type: EvaluationDescriptionDto,
  })
  @ApiQuery({ type: EvaluationDescriptionQuery })
  async getGuideEvaluation(@Req() req: Request) {
    const flagSkill = req.user.flagSkill;
    const level = req.user.level;
    const companyGroupCode = req.user.companyGroupCode;
    const result = await this.guideEvaluationService.getGuideEvaluation(
      level,
      flagSkill,
      companyGroupCode,
    );

    return result;
  }

  @Get('/get-evaluation-description-by-evaluation-id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: EvaluationDescriptionByIdDto,
  })
  @ApiQuery({ type: IdNumberDto })
  async getGuideEvaluationByEvaluationId(@Query() query: any) {
    const result =
      await this.evaluationService.getGuideEvaluationByEvaluationId(query.id);

    return result;
  }

  @Get('/get-all-department')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDepartmentDto],
  })
  async getAllDepartment(@Req() req: Request) {
    const results = await this.departmentService.getAllDepartment(
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('/get-all-department-evaluation')
  async getAllDepartmentEvaluation(
    @Query() query: { year: number; periodIndex: number },
    @Req() req: Request,
  ) {

    const results = await this.evaluationService.getAllDepartmentEvaluation(
      query,
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('/get-all-department-not-set-division')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDepartmentDto],
  })
  async getAllDepartmentNotSetDivision(@Req() req: Request) {
    const results = await this.departmentService.getAllDepartmentNotSetDivision(
      req.user.companyGroupCode,
    );
    return results;
  }

  // @Get('/evaluation-8-10/:role/:id/report-pdf/:userId/:orientation/:size')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: GetEvaluation810ReportDto,
  // })
  // @ApiParam({
  //   name: 'role',
  //   type: String,
  //   example: 'user',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   example: 1,
  // })
  // @ApiParam({
  //   name: 'userId',
  //   type: Number,
  //   example: 1,
  // })
  // async getEvaluation810Report(
  //   @Param()
  //   param: {
  //     role: string;
  //     id: number;
  //     userId: number;
  //     orientation: 'p' | 'l';
  //     size: string;
  //   },
  // ) {
  //   const data = await this.reportService.exportEvaluation810ReportPdf(
  //     param.id,
  //     param.orientation,
  //     param.size,
  //   );
  //   return { buffer: data.buffer, fileName: data.fileName };
  // }

  @Get('/get-all-department-type-department')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDepartmentTypeDepartmentDto],
  })
  async getAllDepartmentTypeDepartment(@Req() req: Request) {
    const results = await this.departmentService.getAllDepartmentTypeDepartment(
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('/get-all-department-type-division')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDepartmentDto],
  })
  async getAllDepartmentTypeDivision(@Req() req: Request) {
    const results = await this.departmentService.getAllDepartmentTypeDivision(
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('/get-all-department-not-group')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDepartmentDto],
  })
  async getAllDepartmentByCondition(@Req() req: Request) {
    const results = await this.departmentService.getAllDepartmentNotGroup(
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('get-all-division-department-by-children')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllDivisionDepartmentDto],
  })
  async getAllDivisionDepartment(@Req() req: Request) {
    return await this.departmentService.getAllDivisionDepartment(
      req.user.companyGroupCode,
    );
  }

  @Get('/get-all-company')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllCompanyDto],
  })
  async getAllCompany() {
    const results = await this.companyService.getAllCompany();
    return results;
  }

  @Get('/get-all-role')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [GetAllRoleDto],
  })
  async getAllRole() {
    const results = await this.roleService.getAllRole();
    return results;
  }

  // @Get('/get-evaluation-period')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: [GetEvaluationPeriodDto],
  // })
  // async getEvaluationPeriod() {
  //   const results = await this.evaluationPeriodService.getEvaluationPeriod();
  //   return results;
  // }

  @Get('/get-user-division-and-department')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getUserDivisionAndDepartment(@Req() req: Request) {
    const results = await this.departmentService.getUserDivisionAndDepartment(
      req.user.userId,
    );
    return results;
  }

  // ** Export report pdf
  // @Post('/report/pdf/evaluation')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: GetEvaluation810ReportDto,
  // })
  // @ApiBody({
  //   type: ExportReportPdfDto,
  // })
  // @HttpCode(200) // @Res() res,
  // async exportReportPdf(
  //   @Req() res: Request,
  //   @Body()
  //   body: {
  //     id: number[];
  //     isEvaluatorUser: boolean;
  //     orientation: 'l' | 'p';
  //     format: 'a4' | 'a3';
  //   },
  // ) {
  //   const { id, isEvaluatorUser, orientation, format } = body;
  //   const pdf = await this.reportService.exportReportPdf(
  //     id,
  //     res.user.id,
  //     isEvaluatorUser,
  //     false,
  //     orientation,
  //     format,
  //   );
  //   return { buffer: pdf.buffer, fileName: pdf.fileName };
  // }

  // ** Export pdf detail 8-10
  @Get('/condition-user-list')
  @HttpCode(200)
  async getConditionUserList(@Req() req: Request) {
    const divisions = await this.departmentService.getAllDivisionDepartment(
      req.user.companyGroupCode,
    );
    // const departments =
    //   await this.departmentService.getAllDepartmentTypeDepartment(
    //     req.user.companyGroupCode,
    //   );
    const company = await this.companyService.getAllCompany();

    return {
      divisions: divisions || [],
      company: company || [],
    };
  }

  @Post('/review/report/pdf/evaluation-8-10')
  @HttpCode(200) // @Res() res,
  async exportReportPdfReview810(
    @Req() res: Request,
    @Body()
    body: {
      role: any;
      evaluationId: any;
      userId: any;
      isEvaluatorUser: any;
      isF5: boolean | undefined;
    },
  ) {
    const { role, evaluationId, userId, isEvaluatorUser, isF5 } = body;

    return await this.reportService.exportReportPdfReview810(
      evaluationId,
      res.user.id,
      isF5,
      isEvaluatorUser,
      false,
      res.user.companyGroupCode,
      res.user.timeZone,
    );
  }

  // ** Export pdf detail 1-7
  @Post('/review/report/pdf/evaluation')
  @HttpCode(200) // @Res() res,
  async exportReportPdfReview(
    @Req() res: Request,
    @Body()
    body: {
      id: number[];
      isEvaluatorUser: boolean;
      isF5: boolean | undefined;
    },
  ) {
    const { id, isEvaluatorUser, isF5 } = body;
    return await this.reportService.exportReportPdfReview17(
      id,
      res.user.id,
      isF5,
      isEvaluatorUser,
      false,
      res.user.companyGroupCode,
      res.user.timeZone,
    );
  }

  // ** Export pdf ở dòng con */
  @Post('/review/report/list/pdf/evaluation')
  async exportReportPdfOnListReview(
    @Body()
    body: {
      evaluationId: number;
      role: string;
      userId: number;
      level: number;
      isF5: boolean | undefined;
    },
    @Req() req: Request,
  ) {
    const { evaluationId, role, userId, level, isF5 } = body;
    const idList = [];
    idList.push(evaluationId);
    if (level < 8) {
      return await this.reportService.exportReportPdfReview17(
        idList,
        userId,
        isF5,
        false,
        false,
        req.user.companyGroupCode,
        req.user.timeZone,
      );
    } else {
      return await this.reportService.exportReportPdfReview810(
        idList,
        userId,
        isF5,
        false,
        false,
        req.user.companyGroupCode,
        req.user.timeZone,
      );
    }
  }

  // ** Export pdf ở dòng cha */
  @Post('/review/report/pdf/list')
  async exportReportListPdfReview(
    @Body()
    body: {
      childrenArr: { evaluationId: number; level: number }[];
      role: string;
      isF5: boolean | undefined;
    },
    @Req() req: Request,
  ) {
    const { childrenArr, role, isF5 } = body;
    const userId = req.user.id;
    const idList810: number[] = [];
    const idList17: number[] = [];
    const idList: number[] = [];
    childrenArr.map((child) => {
      if ([8, 9, 10].includes(child.level)) idList810.push(child.evaluationId);
      if (child.level <= 7) idList17.push(child.evaluationId);
      idList.push(child.evaluationId);
    });

    //** get PDF list only includes 8~10
    if (idList810.length === childrenArr.length) {
      return this.reportService.exportReportPdfReview810(
        idList810,
        userId,
        isF5,
        role === 'user',
        true,
        req.user.companyGroupCode,
        req.user.timeZone,
      );
    }

    //** get PDF list only includes 1~7
    if (idList17.length === childrenArr.length) {
      return await this.reportService.exportReportPdfReview17(
        idList17,
        userId,
        isF5,
        role === 'user',
        true,
        req.user.companyGroupCode,
        req.user.timeZone,
      );
    }

    //** */ get PDF list includes 1~7 and 8~10
    if (
      idList810.length !== childrenArr.length &&
      idList17.length !== childrenArr.length
    ) {
      return await this.reportService.exportPDFMultiLevel(
        userId,
        idList17,
        idList810,
        role,
        isF5,
        req.user.companyGroupCode,
        req.user.timeZone,
      );
    }
  }

  // @HttpCode(200)
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: GetEvaluation810ReportDto,
  // })
  // @ApiBody({
  //   type: ExportReportPdfOnListDto,
  // })
  // @Post('/report/list/pdf/evaluation')
  // async exportReportPdfOnList(
  //   @Body()
  //   body: {
  //     evaluationId: number;
  //     role: string;
  //     userId: number;
  //     level: number;
  //     orientation: 'l' | 'p';
  //     size: 'a4' | 'a3';
  //   },
  // ) {
  //   const { evaluationId, role, userId, level, orientation, size } = body;
  //   let result = {} as { buffer: Buffer; fileName: string };
  //   const idList = [];
  //   idList.push(evaluationId);
  //   if (level < 8) {
  //     result = await this.reportService.exportReportPdf(
  //       idList,
  //       userId,
  //       false,
  //       false,
  //       orientation,
  //       size,
  //     );
  //   } else {
  //     result = await this.reportService.exportEvaluation810ReportPdf(
  //       evaluationId,
  //       orientation,
  //       size,
  //     );
  //   }
  //   return { buffer: result.buffer, fileName: result.fileName };
  // }

  // @Post('/report/pdf/list')
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: GetEvaluation810ReportDto,
  // })
  // @ApiBody({
  //   type: ExportReportListPdfDto,
  // })
  // @HttpCode(200)
  // async exportReportListPdf(
  //   @Body()
  //   body: {
  //     childrenArr: { evaluationId: number; level: number }[];
  //     role: string;
  //     orientation: 'l' | 'p';
  //     size: 'a4' | 'a3';
  //   },
  //   @Req() req: Request,
  // ) {
  //   const { childrenArr, role, orientation, size } = body;
  //   const userId = req.user.id;
  //   let result = {} as { buffer: Buffer; fileName: string };
  //   const idList810: number[] = [];
  //   const idList17: number[] = [];
  //   const idList: number[] = [];
  //   childrenArr.map((child) => {
  //     if ([8, 9, 10].includes(child.level)) idList810.push(child.evaluationId);
  //     if (child.level <= 7) idList17.push(child.evaluationId);
  //     idList.push(child.evaluationId);
  //   });
  //   // console.log(idList);

  //   // get PDF list only includes 8~10
  //   if (idList810.length === childrenArr.length)
  //     result = await this.reportService.exportMultiEvaluation810ReportPdf(
  //       idList810,
  //       role,
  //       userId,
  //       orientation,
  //       size,
  //     );
  //   // get PDF list only includes 1~7
  //   if (idList17.length === childrenArr.length)
  //     result = await this.reportService.exportReportPdf(
  //       idList17,
  //       userId,
  //       role === 'user',
  //       true,
  //       orientation,
  //       size,
  //     );
  //   if (
  //     idList810.length !== childrenArr.length &&
  //     idList17.length !== childrenArr.length
  //   )
  //     result = await this.reportService.exportPDFOnList(
  //       userId,
  //       idList17,
  //       idList810,
  //       role,
  //       orientation,
  //       size,
  //     );
  //   return { buffer: result.buffer, fileName: result.fileName };
  // }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Get('/get-public-notification')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionNotificationDto,
  })
  async getPublicNotification(@Req() req: Request) {
    return await this.versionNotificationService.getPublicNotification(
      req.user.companyGroupCode,
    );
  }

  @Get('/get-all-skill')
  async getAllSkill(@Req() req: Request) {
    const results = await this.departmentService.getAllSkill(
      req.user.companyGroupCode,
    );
    return results;
  }

  @Get('download-file-from-excel')
  async downloadFileFromExcel(
    @Query() query: { id: string },
    @Req() req: Request,
  ) {
    const id = decrypt(query.id);
    if (id) {
      const data = await this.feedbackService.downloadFileFromExcel(
        id,
        req.user.companyGroupCode,
      );
      return data;
    } else throw new RuntimeException('File not found', 204);
  }

  @Post('/feedbacks')
  async getFeedbacks(@Body() body: UserFeedbackSearchDto, @Req() req: Request) {
    return await this.feedbackService.getUserFeedbacks(
      body,
      req.user.userId,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/feedbacks/:id')
  async getFeedbackById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<Feedback | null> {
    return await this.feedbackService.getUserFeedbackById(id, req.user.userId);
  }

  @Post('/feedbacks/create')
  @UseInterceptors(FilesInterceptor('files'))
  async createFeedback(
    @Req() req: Request,
    @Body() body: FeedbackCreateDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    body['companyGroupCode'] = req.user.companyGroupCode;
    return await this.feedbackService.createFeedback(
      req.user.userId,
      body,
      files,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/feedbacks')
  @UseInterceptors(FilesInterceptor('files'))
  async updateFeedback(
    @Body() params: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    return await this.feedbackService.updateFeedbackWithFiles(
      params,
      req.user.companyGroupCode,
      req.user.id,
      files,
    );
  }

  @Delete('/feedbacks')
  async deleteFeedbacks(@Query('ids') ids: number[], @Req() req: Request) {
    await this.feedbackService.deleteUserFeedbacks(
      req.user.userId,
      ids,
      req.user.companyGroupCode,
    );
  }

  @Get('/feedbacks/:id/file')
  async downloadFile(
    @Param('id') id: number,
    @Query('fileName') fileName: string,
    @Req() req: Request,
  ) {
    return await this.feedbackService.downloadAttachFile(
      id,
      fileName,
      req.user.companyGroupCode,
    );
  }

  @Get('/review-evaluation/detail/:id')
  async reviewEvaluationDetail(@Param('id') id: number, @Req() req: Request) {
    return await this.userServices.getEvaluationData(
      id,
      req.user,
      'false',
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/evaluation-skill/:id')
  async checkEvaluationSkill(@Param('id') id: number) {
    return await this.userServices.evaluationSkillCheck(id);
  }

  @Get('/review-evaluation/detail810/:id/:userId')
  findOne(
    @Param() params: Evaluation810Param,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const { role } = query;
    const result = this.evaluationService.findOne(
      params.id,
      Number(params.userId),
      'admin',
      req.user.companyGroupCode,
    );
    return result;
  }

  @Get('/list-reference-review')
  async getListReferenceReview(@Query() query: any, @Req() req: Request) {
    const departments: any = query.departmentSearch;
    // departments 0 => Id , 1=> code, 2 => name, 3 => type
    const salaryRanks: any = query.salaryRank.split(',');
    // salary rank: Search with salary rank, 1 -> 10 (All), 1 -7 , 8 - 10
    const periodArrs = ['', '上期', '下期']; // period evaluation
    const type =
      query.typeReference !== '' ? query.typeReference.split(',') : [];

    const params: any = {
      email: query.email || '',
      department: departments,
      salaryRank: salaryRanks,
      title: `${query.yearDisplayCalendar}年${
        periodArrs[query.periodEvaluate]
      }`,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      type: type,
    };

    return await this.referenceReviewService.listReferenceReview(params, req);
  }

  @Get('/evaluation/:id/get-approval-history')
  @ApiResponse({ status: 200, type: ApprovalHistoryResponseDto })
  async getListApprovalHistory(
    @Param() param: IdNumberDto,
    @Query() query: any,
  ) {
    const order = decrypt(query?.order || '');

    const results = await this.approvalService.getListApprovalHistory(
      param.id,
      0,
      order ? Number(order) : 0,
    );
    return results;
  }

  @Get('/get-detail-feedback')
  async getDetailFeedback(@Query() query: any, @Req() req: Request) {
    const user = await this.feedbackService.getUserIdByFeedbackId(query.id);

    if (req?.user?.id !== user?.userId) {
      throw new RuntimeException('Not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.feedbackService.getDetailFeedback(
      query.id,
      req.user.timeZone,
    );

    return result;
  }

  @Put('/cancel-feedback')
  async confirmEditListUser(@Body() query: any) {
    return await this.feedbackService.cancelFeedback(query);
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

  @Post('/add-comment')
  async addComment(@Body() body: AddCommentFeedbackDto, @Req() req: Request) {
    const params = {
      userId: req.user.id,
      feedbackId: body.feedbackId,
      content: body.content,
      updatedTime: body.updatedTime,
      createdTime: new Date(
        isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', req.user.timeZone),
      ),
    };

    return await this.feedbackService.addComment(params, 1, req.user.timeZone);
  }

  @Post('/edit-comment')
  async editComment(@Body() body: any, @Req() req: Request) {
    const params = {
      userId: req.user.id,
      commentId: body.commentId,
      content: body.content,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackCommentService.editComment(params);
  }

  @Put('/delete-comment')
  async deleteComment(@Body() body: any, @Req() req: Request) {
    const params = {
      userId: req.user.id,
      commentId: body.commentId,
      updatedTime: body.updatedTime,
    };

    return await this.feedbackCommentService.deleteComment(params, 1);
  }

  @Get('/evaluation/basic-behavior-skill/public')
  getBasicBehaviorSkillPublic(
    @Query() query: EvaluationBasicBehaviorPublicTypeDto,
    @Req() req: Request,
  ) {
    const basicBehaviorType = query.basicBehaviorType;
    return this.userServices.getBasicBehaviorSkillPublic(
      basicBehaviorType,
      req.user.companyGroupCode,
      query.level,
    );
  }
}
