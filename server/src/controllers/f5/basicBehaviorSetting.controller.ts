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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { Request, Response } from 'express';
import { EvaluationPeriodService } from 'src/services/evaluationPeriod.service';
import { EvaluationSearchDto } from 'src/model/request/ManagementEvaluationProDto';
import { AdminEvaluationServiceI } from 'src/interfaces/service/adminEvaluation.service.interface';
import { AdminEvaluationService } from 'src/services/adminEvaluation.service';
import {
  Evaluation810Param,
  Evaluation810RejectInfo,
  EvaluationAchievementPublicTypeDto,
  EvaluationBasicBehaviorPublicTypeDto,
  GetEvaluationDTO,
} from 'src/model/request/EvaluationParamDto';
import { EvaluationService } from 'src/services/evaluation.service';
import { UserService } from 'src/services/user.service';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import { IdDto, IdNumberDto } from 'src/model/request/IdNumberDto';
import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import { AdminApprovalService } from 'src/services/adminApproval.service';
import {
  CheckStatusRecordSendDTO,
  ConfirmGoalDTO,
  DeletePeriodDepartmentSettingDTO,
  EvaluationByPeriodParamDto,
  GetToEmailFixedListDTO,
  GetToEmailListDTO,
  ImportUserDTO,
  ListPeriodDTO,
  ListPeriodDepartmentSettingDTO,
  ListUserPeriodDTO,
  PeriodDTO,
  SavePeriodDepartmentSettingDTO,
  SavePeriodDTO,
  SendMailBodyDTO,
  SendMailNow2DTO,
  UndoFixEvaluationDTO,
  UpdateEvaluationPeriodExceptionDto,
  UpdateSettingEvaluatorOfOneUserDTO,
  findListUserToSettingEvaluationDTO,
} from 'src/model/request/ExceptionPeriodRequestDto';
import { EvaluationPeriodDepartmentSettingService } from 'src/services/evaluationPeriodDepartmentSetting.service';
import { MailService } from 'src/services/mail.service';
import { AddUserSettingEvaluationDTO } from 'src/model/request/UserSettingEvaluatorSearchRequestDto';
import { CompanyService } from 'src/services/company.service';
import { DepartmentService } from 'src/services/department.service';
import { CronJobServices } from 'src/services/cronJob.services';
import { SendStatusDto } from 'src/model/response/F6/SendStatusDto';
import { EvaluatorApproveStatusDto } from 'src/model/request/EvaluatorRequestDto';
import { EvaluatorServices } from 'src/services/evaluator.service';
import {
  ListFeedbackDto,
  UserFeedbackSearchDto,
} from 'src/model/request/FeedbackRequestDto';
import { FeedbackService } from 'src/services/feedback.service';
import { AuthVietNamSystemGuard } from 'src/handler/guard/authVietnamSystem.guard';
import { ExcelService } from 'src/services/excel.service';

import * as fs from 'fs';
import * as path from 'path';

@Controller('v1/f5/management-evaluation-history')
@Authorize(Roles.F5)
@UseGuards(RolesGuard)
@ApiTags(Tag.F5)
export class ManagementBasicBehaviorSettingRoleController {
  @Inject(EvaluatorServices)
  private evaluatorServices: EvaluatorServices;

  @Inject(EvaluationPeriodService)
  private evaluationPeriodService: EvaluationPeriodService;

  @Inject(AdminEvaluationService)
  private adminEvaluationService: AdminEvaluationServiceI;

  @Inject(EvaluationService)
  private evaluationServices: EvaluationService;

  @Inject(UserService)
  private userServices: UserService;

  @Inject(AdminApprovalService)
  private approvalService: ApprovalServiceI;

  @Inject(UserService)
  private userService: UserService;

  @Inject(MailService)
  private mailService: MailService;

  @Inject(CompanyService)
  private companyService: CompanyService;

  @Inject(DepartmentService)
  private departmentService: DepartmentService;

  @Inject(CronJobServices)
  private cronjobService: CronJobServices;

  @Inject(FeedbackService)
  private feedbackService: FeedbackService;

  @Inject(ExcelService)
  private excelService: ExcelService;

  @Inject(EvaluationPeriodDepartmentSettingService)
  private periodDeptSettingService: EvaluationPeriodDepartmentSettingService;

  @Get('/list-user-evaluation')
  async getListUserEvaluation(
    @Query() query: EvaluationSearchDto,
    @Req() req: Request,
  ) {
    const departments: any = query.departmentSearch;
    const divisons: any = query.divisionSearch;
    // departments 0 => Id , 1=> code, 2 => name, 3 => type
    const salaryRanks: any = query.salaryRank.split(',');
    // salary rank: Search with salary rank, 1 -> 10 (All), 1 -7 , 8 - 10
    const periodArrs = ['', '上期', '下期']; // period evaluation
    // status
    const status =
      query.stringStatus !== '' ? query.stringStatus.split(',') : [];

    const params: any = {
      email: query.email || '',
      department: departments,
      division: divisons,
      salaryRank: salaryRanks,
      title: `${query.yearDisplayCalendar}年${
        periodArrs[query.periodEvaluate]
      }`,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      status,
      sortColumns: query.sortColumns ?? [],
      sortDirections: query.sortDirections ?? [],
      year: query.yearDisplayCalendar,
      periodIndex: query.periodEvaluate,
    };
    const datas = await this.adminEvaluationService.listUserEvaluation(
      params,
      req.user.companyGroupCode,
      req['user'].timeZone,
    );
    return datas;
  }

  @Get('/export-CSV')
  async download(
    @Query() query: EvaluationSearchDto,
    @Res() res,
    @Req() req: Request,
  ) {
    const departments: any =
      query.department !== 'すべて'
        ? query?.department.split(':')
        : query.department;
    // departments 0 => Id , 1=> code, 2 => name, 3 => type
    const salaryRanks: any = query.salaryRank.split(',');
    // salary rank: Search with salary rank, 1 -> 10 (All), 1 -7 , 8 - 10
    const periodArrs = ['', '上期', '下期']; // period evaluation
    // status
    const status =
      query.stringStatus !== '' ? query.stringStatus.split(',') : [];

    const params: any = {
      email: query.email,
      department: departments,
      salaryRank: salaryRanks,
      title: `${query.yearDisplayCalendar}年${
        periodArrs[query.periodEvaluate]
      }`,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      status,
    };
    const buffer = await this.adminEvaluationService.exportCSV(
      params,
      req.user.companyGroupCode,
    );

    res.send(buffer);
  }

  @ApiResponse({ status: 200 })
  @Get('/evaluation8-10/:id/:userId')
  findOne(
    @Param() params: Evaluation810Param,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const { role } = query;
    const result = this.evaluationServices.findOne(
      params.id,
      Number(params.userId),
      role,
      req.user.companyGroupCode,
    );
    return result;
  }

  // ** Evaluator F6 1-7

  @ApiResponse({ status: 200 })
  @Get('/evaluation-skill/:id')
  evaluationSkillCheck(@Param('id') id: number) {
    return this.userServices.evaluationSkillCheck(id);
  }

  @ApiResponse({ status: 200 })
  @Get('/evaluation/:id')
  getEvaluationById(
    @Param('id') id: number,
    @Query() query: GetEvaluationDTO,
    @Req() req: Request,
  ) {
    return this.userServices.getEvaluationData(
      id,
      req.user,
      query.isEvaluatorUser,
      req.user['companyGroupCode'],
      req.user.timeZone,
    );
  }

  // @ApiResponse({ status: 200 })
  // @Post('/evaluation8-10/save')
  // createNewEvaluation(@Body() dataBody: Evaluation810SaveInfo) {
  //   // console.log(dataBody.dataSource, dataBody.evaluationId, dataBody.status);
  //   const host = `${process.env.HOSTNAME_}/save`;
  //   const result = this.evaluationServices.createOrUpdateEvaluation(
  //     dataBody.dataSource,
  //     dataBody.additionData,
  //     dataBody.commentData,
  //     dataBody.evaluationId,
  //     dataBody.status,
  //     dataBody.isDraft,
  //     dataBody.listEvalutor,
  //     dataBody.total,
  //     dataBody.updatedTime,
  //     dataBody.checkList,
  //     host,
  //   );
  //   return result;
  // }

  // @ApiResponse({ status: 200 })
  // @Post('/evaluation8-10/approve')
  // approveEvaluation(@Body() dataBody: EvaluationApproveInfo) {
  //   const host = `${process.env.HOSTNAME_}/approve`;
  //   const result = this.evaluationServices.approveEvaluation(
  //     Number(dataBody.evaluationId),
  //     Number(dataBody.status),
  //     dataBody.listEvalutor,
  //     dataBody.maxOrder,
  //     dataBody.content,
  //     dataBody.approverId,
  //     dataBody.updatedTime,
  //     host,
  //   );
  //   return result;
  // }

  @Post('/evaluation8-10/reject')
  @ApiResponse({ status: 200 })
  rejectEvaluation(
    @Body() dataBody: Evaluation810RejectInfo,
    @Req() req: Request,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
    const result = this.evaluationServices.rejectEvaluation(
      Number(dataBody.evaluationId),
      dataBody.status,
      dataBody.selectedOrder,
      dataBody.content,
      dataBody.approverId,
      dataBody.ownerId,
      dataBody.listEvalutor,
      dataBody.updatedTime,
      dataBody.maxOrder,
      host,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
    return result;
  }

  @Get('/evaluation/:id/get-approval-history')
  @ApiResponse({ status: 200, type: ApprovalHistoryResponseDto })
  async getListApprovalHistory(@Param() param: IdNumberDto) {
    const results = await this.approvalService.getListApprovalHistory(param.id);
    return results;
  }

  @ApiResponse({ status: 200 })
  @Get('/department-goal')
  async getDepartmentGoal(@Query() query: IdDto, @Req() req: Request) {
    const { idEvaluation } = query;
    const userId = await this.userServices.getUserIdByEvaluationId(
      idEvaluation,
    );
    const departmentGoal = await this.userServices.getDepartmentGoal(
      idEvaluation,
      userId,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
    return departmentGoal;
  }

  @Get('/evaluation/achievement/public')
  getAchievementSettingPublic(
    @Query() query: EvaluationAchievementPublicTypeDto,
    @Req() req: Request,
  ) {
    const achievementType = query.achievementType;

    return this.userServices.getAchievementPublic(
      achievementType,
      req.user.companyGroupCode,
    );
  }

  @Get('/evaluation/list-pro-skill/public')
  getListProSkillPublic(
    @Req() req: Request,
    @Query() query: { evaluationId: number },
  ) {
    return this.userServices.getListProSkillPublic(
      req.user,
      query.evaluationId,
    );
  }

  @Get('/evaluation/achievement-additional/public')
  getAchievementAddSettingPublic(
    @Query() query: EvaluationAchievementPublicTypeDto,
    @Req() req: Request,
  ) {
    const achievementType = query.achievementType;
    const type = query.type;

    return this.userServices.getAchievementAddPublic(
      achievementType,
      type,
      req.user.companyGroupCode,
    );
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

  @Get('/list-period')
  async listPeriods(@Req() req: Request) {
    return await this.evaluationPeriodService.getAllPeriod(
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/export-history-evaluation')
  async exportHistoryEvaluation(@Query() params: any, @Req() req: Request) {
    const data = await this.adminEvaluationService.exportHistoryEvaluation(
      params,
      req.user.companyGroupCode,
    );
    return data;
  }

  @Get('/list-periods')
  async listPeriod(@Query() params: ListPeriodDTO, @Req() req: Request) {
    return await this.evaluationPeriodService.listPeriodByYear(
      params.yearStart,
      params.yearEnd,
      req.user.companyGroupCode,
    );
  }
  @Get('/evaluation-period-list')
  async evaluationPeriodList(
    @Query() params: { year: string },
    @Req() req: Request,
  ) {
    // return await this.evaluationPeriodService.listPeriodByYear(
    //   params.year,
    //   req.user.companyGroupCode,
    // );
  }
  @Post('/goal-confirm')
  async goalConfirm(@Body() body: ConfirmGoalDTO, @Req() req: Request) {
    return await this.adminEvaluationService.goalConfirm(
      body,
      req.user.companyGroupCode,
    );
  }
  @Post('/evaluation-confirm')
  async evaluationConfirm(@Body() body: ConfirmGoalDTO, @Req() req: Request) {
    return await this.adminEvaluationService.evaluationConfirm(
      body,
      req.user.companyGroupCode,
    );
  }
  @Post('/public-evaluation')
  async publicEvaluation(@Body() body: ConfirmGoalDTO, @Req() req: Request) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
    return await this.adminEvaluationService.publicEvaluation(
      body,
      host,
      req.user.companyGroupCode,
    );
  }
  @Post('/undo-fix-evaluation')
  async undoFixEvaluation(@Body() body: UndoFixEvaluationDTO) {
    return await this.adminEvaluationService.undoFixEvaluation(body);
  }
  @Get('/period/department/list')
  async listPeriodDepartmentSetting(
    @Query() query: ListPeriodDepartmentSettingDTO,
    @Req() req: Request,
  ) {
    const companyGroupCode = (req as any).user?.companyGroupCode ?? null;
    return this.periodDeptSettingService.list(
      Number(query.evaluationPeriodId),
      companyGroupCode,
    );
  }

  @Post('/period/department/save')
  @HttpCode(HttpStatus.OK)
  async savePeriodDepartmentSetting(
    @Body() body: SavePeriodDepartmentSettingDTO,
    @Req() req: Request,
  ) {
    const companyGroupCode = (req as any).user?.companyGroupCode ?? null;
    return this.periodDeptSettingService.save(body, companyGroupCode);
  }

  @Delete('/period/department/delete/:id')
  async deletePeriodDepartmentSetting(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const companyGroupCode = (req as any).user?.companyGroupCode ?? null;
    return this.periodDeptSettingService.delete(
      { id: Number(id) } as DeletePeriodDepartmentSettingDTO,
      companyGroupCode,
    );
  }

  @Get('/period/:year/:periodIndex')
  async getPeriodDetail(@Param() params: PeriodDTO, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    const conditions = {
      year: params.year,
      period_index: params.periodIndex,
      company_group_code: req.user.companyGroupCode,
    };
    return await this.evaluationPeriodService.getPeriodDetailByCondition(
      conditions,
    );
  }
  @Get('/check-is-fixed')
  checkIsFixed(@Query() query: PeriodDTO, @Req() req: Request) {
    return this.userService.checkIsFixed(query, req.user.companyGroupCode);
  }
  exception;

  @Get('/check-import-user')
  checkImportUser(@Query() query: PeriodDTO, @Req() req: Request) {
    return this.userService.checkImportUser(query, req.user.companyGroupCode);
  }
  @Get('/get-to-email-list/:type/:year/:periodIndex')
  async getToEmailList(
    @Param() params: GetToEmailListDTO,
    @Query('departmentId') departmentId: string,
    @Req() req: Request,
  ) {
    return await this.userService.getToEmailList(
      params.type,
      params.year,
      params.periodIndex,
      req.user.companyGroupCode,
      departmentId ? Number(departmentId) : undefined,
    );
  }
  @Get('/get-mail-template-fixed/:type/:periodId/:evaluationId')
  async getToEmailListFixed(
    @Param() params: GetToEmailFixedListDTO,
    @Req() req: Request,
  ) {
    return await this.userService.getToEmailListFixed(
      params.type,
      params.periodId,
      req.user.companyGroupCode,
      params.evaluationId,
    );
  }

  @Post('/check-status-selected/:type')
  async checkStatusSelected(
    @Param() params: CheckStatusRecordSendDTO,
    @Body() query: any,
  ) {
    return await this.userService.checkStatusRecordSend(
      query.rowData,
      params.type,
    );
  }

  @Post('/users-email-list')
  async getUsersEmailList(@Body() conditions: any, @Req() req: Request) {
    return await this.userService.getUsersEmailList(
      conditions.conditions,
      req.user.companyGroupCode,
    );
  }
  @Post('/send-mail-now')
  async saneMailNow(@Body() body: SendMailNow2DTO, @Req() req: Request) {
    if ([5, 6].includes(body.inputedValues?.type)) {
      const object = {
        ...body.inputedValues,
        emailType: body.inputedValues.type,
      };
      const isTestSend = !!body.inputedValues?.isTestSend;
      const dataMailCCs = body.inputedValues.dataMailCCs?.length
        ? body.inputedValues.dataMailCCs
        : [{ user: body.content.toEmails, evaluators: [] }];
      const data = {
        ...body.content,
        dataMailCCs,
        testEmail: isTestSend ? body.content.toEmails : undefined,
      };
      return await this.mailService.sendMailFixedUserEvaluator(
        data,
        object,
        req.user.companyGroupCode,
        undefined,
        isTestSend,
      );
    } else {
      this.mailService.sendMailFixedGoal(
        body.content,
        body.inputedValues.mailToObjList,
        req.user.companyGroupCode,
        body.inputedValues?.evaluationPeriodId,
        body.inputedValues?.type,
      );
      return await this.mailService.saveMailTemplate(
        body.inputedValues,
        req.user.companyGroupCode,
        false,
      );
    }
  }
  @Post('/save-mail-template')
  async saveMailTemplate(@Body() body: SendMailBodyDTO, @Req() req: Request) {
    return await this.mailService.saveMailTemplate(
      body,
      req.user.companyGroupCode,
      true,
    );
  }
  @Post('/period/save')
  async savePeriod(@Body() body: SavePeriodDTO, @Req() req: Request) {
    // =====================================================
    const conditions = {
      year: body.condition.year,
      // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
      period_index: body.condition.periodIndex,
      company_group_code: req.user.companyGroupCode,
    };
    return await this.evaluationPeriodService.savePeriod(conditions, body.body);
  }
  @Get('/find-list-user-to-setting-evaluation')
  findListUserToSettingEvaluation(
    @Query() query: findListUserToSettingEvaluationDTO,
    @Req() req: Request,
  ) {
    const departments: any =
      query.department !== 'すべて'
        ? query?.department.split(':')
        : query.department;

    const divisions: any =
      query.division !== 'すべて' ? query?.division.split(':') : query.division;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type
    const params: any = {
      nameAndEmail: query.nameAndEmail,
      department: departments,
      division: divisions,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      state: query.state,
      companyGroupCode: req.user.companyGroupCode,
    };
    return this.userService.findListUserToSettingEvaluation(params);
  }
  @Post('/add-user-setting-evaluation')
  async addUserSettingEvaluation(
    @Body() body: AddUserSettingEvaluationDTO,
    @Req() req: Request,
  ) {
    return await this.userService.addUserSettingEvaluationProcedure(
      body,
      req.user.companyGroupCode,
      req['user'].timeZone,
      req.user.id,
    );
  }
  @Get('/find-user-setting-evaluator')
  async searchListUserSettingEvaluator(
    @Query() query: any,
    @Req() req: Request,
  ) {
    const departments: any =
      query.department !== 'すべて'
        ? query?.department?.split(':')
        : query.department;
    query = {
      ...query,
      userName: query.userName === undefined ? '' : query.userName,
      department: departments,
      evaluatorName:
        query.evaluatorName === undefined ? '' : query.evaluatorName,
      offset: query.offset,
      limit: 20,
      skill: query.skill,
      level: query.level,
      flagSkill: query.flagSkill,
      divisionId: query.divisionId ?? null,
      departmentId: query.departmentId ?? null,
      tabMode: query.tabMode ?? null,
      companyGroupCode: req.user.companyGroupCode,
    };

    return await this.userService.searchListUserSettingEvaluator(query);
  }
  @Get('/import-user')
  importUser(@Query() query: ImportUserDTO, @Req() req: Request) {
    return this.userService.importUserProcedue(
      query,
      req.user.companyGroupCode,
      req['user'].timeZone,
    );
  }

  @Put('/delete-user-setting-evaluator')
  deleteUserSettingEvaluator(@Body() params: any, @Req() req: Request) {
    return this.userService.deleteUserSettingEvaluator(
      params,
      req.user.companyGroupCode,
    );
  }
  @Put('/update-setting-evaluator-of-one-user')
  updateSettingEvaluatorOfOneUser(
    @Body() query: UpdateSettingEvaluatorOfOneUserDTO,
    @Req() req: Request,
  ) {
    return this.userService.updateSettingEvaluatorOfOneUser(
      query,
      req.user.companyGroupCode,
    );
  }
  @Get('/get-list-evaluator')
  getListEvaluator(@Req() req: Request) {
    return this.userService.getListEvaluator(
      undefined, //* để undefined vì ở MH exception user không được làm người đánh giá của chính minh
      req.user.companyGroupCode,
    );
  }
  @Put('/update-setting-evaluator-list-user')
  updateSettingEvaluatorListUser(@Body() query: any, @Req() req: Request) {
    return this.userService.updateSettingEvaluatorListUser(
      query,
      req.user.companyGroupCode,
    );
  }
  @Get('/company')
  getCompanies() {
    return this.companyService.getOptionCompany();
  }

  @Get('/department')
  getDepartments(@Query() query: PeriodDTO, @Req() req: Request) {
    return this.departmentService.getOptionDepartment(
      query,
      req?.user?.companyGroupCode,
      req.user.timeZone,
    );
  }
  @Get('/user/evaluator')
  getEvaluatorUsers(
    @Query('evaluationCreatorId') evaluationCreatorId: number | undefined,
    @Req() req: Request,
  ) {
    return this.evaluationPeriodService.getEvaluatorUser(
      evaluationCreatorId,
      req.user.companyGroupCode,
    );
  }
  @Get('/exception/get-evaluation-by-period')
  getEvaluationByPeriod(
    @Query() query: EvaluationByPeriodParamDto,
    @Req() req: Request,
  ) {
    const { userId, year, periodIndex } = query;

    return this.evaluationPeriodService.getEvaluationByPeriod(
      userId,
      year,
      periodIndex,
      req.user.companyGroupCode,
    );
  }
  @Put('/exception')
  async updateEvaluationPeriodException(
    @Req() req: Request,
    @Body() body: UpdateEvaluationPeriodExceptionDto,
  ) {
    //
    return await this.evaluationPeriodService.updateEvaluationPeriodException(
      body.evaluations,
      body.userId,
      req.user.id,
      body.deleteIds,
      body.year,
      body.periodIndex,
      req.user.companyGroupCode,
    );
  }
  @Get('/list-user-evaluation-period')
  async listUserEvaluationPeriod(
    @Query() params: ListUserPeriodDTO,
    @Req() req: Request,
  ) {
    const results = await this.adminEvaluationService.listUserEvaluationPeriod(
      params,
      req.user.companyGroupCode,
    );
    return results;
  }
  @Post('/send-email')
  // async sendEmailFixedGoal(@Body() body: SendMailDTO) {
  sendEmailFixedGoal(@Body() body: any, @Req() req: Request) {
    this.evaluationServices.sendMailFixedGoal(
      body,
      req.user.companyGroupCode,
      req.user.timeZone,
      req.user.emailHR,
    );
    return { message: 'success' };
  }

  @Get('/get-mail-template-by-id/:id')
  getMailTemplateById(@Param() params: any) {
    return this.mailService.getMailTemplateById(params.id);
  }

  @Get('/get-all-department-evaluation-default')
  async getAllDepartmentEvaluation(
    @Query() query: { year: number; periodIndex: number },
    @Req() req: Request,
  ) {
    const results =
      await this.evaluationServices.getAllDepartmentEvaluationDefault(
        query,
        req.user.companyGroupCode,
      );
    return results;
  }

  @Post('/cronjob-send-mail')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async cronjobSendMail() {
    await this.cronjobService.triggerNotifications();
  }

  @Get('/get-all-skill')
  async getAllSkill(@Req() req: Request) {
    return this.userService.getAllSkill(req.user.companyGroupCode);
  }

  @Get('/get-all-skill-public')
  async getAllSkillPublic(@Req() req: Request) {
    return this.userService.getAllSkillPublic(req.user.companyGroupCode);
  }

  @Put('/rejected/status/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SendStatusDto,
  })
  async sendRejectedStatus(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() body: EvaluatorApproveStatusDto,
  ) {
    const { comment, type, statusReject, updateTime } = body;
    const userId = req.user.id;
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
    return this.evaluatorServices.sendRejectStatus(
      id,
      comment,
      userId,
      type,
      statusReject,
      updateTime,
      host,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/approved/status/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SendStatusDto,
  })
  async sendApprovedStatus(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() body: EvaluatorApproveStatusDto,
  ) {
    const { comment, type, updateTime } = body;
    const userId = req.user.id;
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/approve`;
    const result = await this.evaluatorServices.sendApproveStatus(
      id,
      comment,
      userId,
      type,
      updateTime,
      host,
      req.user.companyGroupCode,
      req.user.timeZone,
    );

    return result;
  }

  @Get('/list-feedback')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getListFeedback(@Query() query: ListFeedbackDto, @Req() req: Request) {
    const type = query.typeFeedback !== '' ? query.typeFeedback.split(',') : [];
    const status =
      query.statusFeedback !== '' ? query.statusFeedback.split(',') : [];
    const departments: any =
      query.department !== 'すべて'
        ? query.department.split(':')
        : query.department;

    const params: any = {
      dateStart: query.dateStart,
      dateEnd: query.dateEnd,
      type: type,
      department: departments,
      status: status,
      user: query.user,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy,
      sortType: query.sortType,
      companyGroupCode: req?.user?.companyGroupCode,
    };

    return await this.feedbackService.listFeedback(params);
  }

  @Post('/feedbacks/excel')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async getFeedbacksForExcel(
    @Body() body: UserFeedbackSearchDto,
    @Req() req: Request,
  ) {
    return await this.feedbackService.getFeedbacksForExcel(
      body,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/delete-feedback')
  async deleteFeedback(@Body() params: any, @Req() req: Request) {
    return await this.feedbackService.deleteFeedback(
      params,
      req?.user?.companyGroupCode,
    );
  }

  @Get('/detail-feedback')
  async detailFeedback(@Query() params: any, @Req() req: Request) {
    return await this.feedbackService.detailFeedback(
      params,
      req?.user?.companyGroupCode,
    );
  }

  @Get('/list-feedback/download-zip')
  async getZipFeedback(@Query() params: any, @Req() req: Request) {
    return await this.feedbackService.getZipFeedback(params, req);
  }

  @Put('/update-feedback')
  async updateFeedback(@Body() params: any, @Req() req: Request) {
    return await this.feedbackService.updateFeedback(
      params,
      req?.user?.companyGroupCode,
    );
  }

  @Post('/feedbacks')
  async getFeedbacks(@Body() body: UserFeedbackSearchDto, @Req() req: Request) {
    return await this.feedbackService.getUserFeedbacks(
      body,
      null,
      req.user.companyGroupCode,

      req.user.timeZone,
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

  @Get('/run-cron-job-create-evaluation')
  @UseGuards(AuthVietNamSystemGuard)
  async cronJobCreateEvaluation(@Req() req: Request) {
    const group = {
      code: req.user.companyGroupCode,
      timezone: req.user.timeZone,
    };

    return await this.cronjobService.processCompanyGroupSettingGoals(group);
  }

  @Get('/run-cron-job-send-mail')
  @UseGuards(AuthVietNamSystemGuard)
  async cronJobSendMail(@Req() req: Request) {
    const group = {
      code: req.user.companyGroupCode,
      timezone: req.user.timeZone,
    };

    return await this.cronjobService.processCompanyGroupSendMail(group);
  }

  @Put('/undo-exception')
  async undoException(@Body() data: any, @Req() req: Request) {
    return await this.userService.undoException(data, req);
  }

  @Post('excel/start')
  async startExcelJob(
    @Body() body,
    @Req() req: Request,
  ): Promise<{ jobId: string }> {
    //logic xóa file đã tồn tại trong folder
    const folderPath = path.join(__dirname, '../../../jobs');
    const now = Date.now();
    const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 phút (ms)

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Lỗi khi đọc thư mục:', err);
        return;
      }

      files.forEach((file) => {
        const match = file.match(/^temp-(\d+)\.zip$/);
        if (!match) return;

        const timestamp = parseInt(match[1], 10);
        if (now - timestamp > FIFTEEN_MINUTES) {
          const filePath = path.join(folderPath, file);

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Không thể xóa file ${file}:`, err);
            } else {
              console.log(`Đã xóa file: ${file}`);
            }
          });
        }
      });
    });

    const jobId = await this.excelService.createJob(body, req);
    return { jobId };
  }

  @Get('excel/status')
  checkJob(@Query('jobId') jobId: string): {
    ready: boolean;
    percent: number;
    message: string;
  } {
    return {
      ready: this.excelService.isJobReady(jobId),
      percent: this.excelService.percentJob(jobId),
      message: this.excelService.messsageJob(jobId),
    };
  }

  @Get('excel/download')
  downloadExcel(
    @Query('jobId') jobId: string,
    @Query('year') year: number,
    @Query('periodIndex') periodIndex: number,
    @Res() res: Response,
  ) {
    const filePath = this.excelService.getFilePath(jobId);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not ready' });
    }

    res.download(
      filePath,
      `【${year}年${periodIndex == 1 ? '上期' : '下期'}】評価表.zip`,
      (err) => {
        if (err) {
          console.error('Lỗi khi gửi file:', err);
          // Bạn có thể xử lý lỗi ở đây nếu cần
        }

        // ✅ Sau khi gửi file xong thì xóa file
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Không thể xóa file ${filePath}:`, unlinkErr);
          } else {
            console.log(`Đã xóa file tạm: ${filePath}`);
          }
        });
      },
    );
  }

  // ─── 部署別期間設定 (Department Period Settings) ──────────────────────
}
