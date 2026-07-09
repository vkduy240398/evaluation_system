import {
  Body,
  Controller,
  Get,
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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { decrypt } from 'src/common/util';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { EvaluatorSearchInterfaces } from 'src/interfaces/evaluator.interfaces';
import { ProSkillDetail } from 'src/interfaces/proskillSetting.interfaces';
import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import { UpdateEvaluationType } from 'src/interfaces/user.interfaces';
import {
  CheckPermissionRequestDto,
  CreateOrUpdateEvaluationResponseDto,
  Evaluation810Param,
  Evaluation810RejectInfo,
  Evaluation810SaveInfo,
  EvaluationAchievementPublicTypeDto,
  EvaluationApproveInfo,
  EvaluationBasicBehaviorPublicTypeDto,
  EvaluationListProSkillPublicResponseDto,
  EvaluationUpdateTypeDto,
  GetBasicBehaviorSkillPublicResponseDto,
  GetDepartmentGoalResponseDto,
  GetEvaluation810ResponseDto,
  GetEvaluationDTO,
} from 'src/model/request/EvaluationParamDto';
import {
  EvaluatorApproveStatusDto,
  EvaluatorSearchDto,
  ExportHistoryEvaluationEvaluatorDto,
  GetListDepartmentExportEvaluationHistoryDto,
} from 'src/model/request/EvaluatorRequestDto';
import { IdNumberDto } from 'src/model/request/IdNumberDto';
import { ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import {
  Approve17ResponseDto,
  DetailPublicProSkillResponseDto,
  Evaluation17AchievementResponseDto,
  Evaluation17AdditionalAchievementResponseDto,
  Evaluation17DetailResponseDto,
  Evaluation17SkillResponseDto,
  EvaluatorListResponseDto,
  ProSkillApprovalHistoryResponseDto,
  PublicProSkillListResponseDto,
  Reject17ResponseDto,
} from 'src/model/response/EvaluatorResponseDto';
import { EvaluationService } from 'src/services/evaluation.service';
import { EvaluatorServices } from 'src/services/evaluator.service';
import { EvaluatorApprovalService } from 'src/services/evaluatorApproval.service';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';
import { UserService } from 'src/services/user.service';

@Controller('v1/f2/evaluator')
@Authorize(Roles.F2)
@UseGuards(RolesGuard)
@ApiTags(Tag.F2)
export class EvaluatorRoleController {
  @Inject(EvaluatorServices)
  private evaluatorServices: EvaluatorServices;

  @Inject(ProSkillSettingServices)
  private proSkillSettingServices: ProSkillSettingServices;

  @Inject(UserService)
  private userServices: UserService;

  @Inject(EvaluatorApprovalService)
  private approvalService: ApprovalServiceI;

  @Inject(EvaluationService)
  private evaluationService: EvaluationService;

  @ApiResponse({ status: 200, type: EvaluatorListResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/list-user-evaluation')
  async getEvaluation(@Query() query: EvaluatorSearchDto, @Req() req: Request) {
    const departments: any = query.departmentSearch;
    const division: any = query.divisionSearch;
    // departments 0 => Id , 1=> code, 2 => name, 3 => type
    const salaryRanks: any = query.salaryRank?.split(',');
    // salary rank: Search with salary rank, 1 -> 10 (All), 1 -7 , 8 - 10
    const periodArrs = ['', '上期', '下期']; // period evaluation
    const evaluators = query.evaluator?.split(',');
    // status
    const status =
      query.stringStatus !== '' ? query.stringStatus?.split(',') : [];

    const params: EvaluatorSearchInterfaces = {
      email: query.email,
      department: departments,
      division: division,
      salaryRank: salaryRanks,
      title: `${query.yearDisplayCalendar}年${
        periodArrs[query.periodEvaluate]
      }`,
      evaluators: evaluators,
      evaluatorId: req.user.id,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      status,
      sortColumns: query.sortColumns ?? [],
      sortDirections: query.sortDirections ?? [],
      companyGroupCode: req.user['companyGroupCode'],
    };
    // console.time();
    const datas = await this.evaluatorServices.searchListUserEvaluator2(params);
    // console.timeEnd();

    return datas;
  }

  @ApiResponse({ status: 200, type: Approve17ResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Put('/approved/status/:id')
  sendApprovedStatus(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() body: EvaluatorApproveStatusDto,
  ) {
    const { comment, type, updateTime } = body;
    const userId = req.user.id;
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation`;
    return this.evaluatorServices.sendApproveStatus(
      id,
      comment,
      userId,
      type,
      updateTime,
      host,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @ApiResponse({ status: 200, type: Reject17ResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Put('/rejected/status/:id')
  sendRejectedStatus(
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

  @ApiResponse({ status: 200, type: ProSkillApprovalHistoryResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/history-approve/:versionId')
  async getHistoryApproveContent(
    @Param('versionId') versionId: number,
    @Req() req: Request,
  ) {
    const data = await this.proSkillSettingServices.getHistoryApproveContent(
      versionId,
      req.user.id,
      undefined,
      req.user.companyGroupCode,
    );

    return data;
  }

  @ApiResponse({ status: 200, type: DetailPublicProSkillResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/detail-pro-skill-public/:versionId')
  async getDetailProSkill(@Param() param: ProSkillDetail, @Req() req: Request) {
    const data = await this.proSkillSettingServices.getDetailProSkillGeneric(
      param.versionId,
      req.user.companyGroupCode,
    );

    return data;
  }

  @ApiResponse({ status: 200, type: PublicProSkillListResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @ApiQuery({ type: ProSKillVersionRequestDto })
  @Get('/version-pro-skill-department')
  async getVersionProSkillDepartment(
    @Req() req: Request,
    @Query() query: ProSKillVersionRequestDto,
  ) {
    const results =
      await this.proSkillSettingServices.getVersionProSkillDepartment(
        query,
        req.user.companyGroupCode,
      );
    return results;
  }

  // ** Evaluator F2 1-7
  @ApiResponse({ status: 200, type: Evaluation17SkillResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/evaluation-skill/:id')
  evaluationSkillCheck(@Param('id') id: number) {
    return this.userServices.evaluationSkillCheck(id);
  }

  @ApiResponse({ status: 200, type: String })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
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

  @ApiResponse({ status: 200, type: Evaluation17DetailResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Put('/evaluation/:id')
  updateEvaluation(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() body: EvaluationUpdateTypeDto,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation`;

    const decode = decrypt(body.data);

    const data: UpdateEvaluationType = JSON.parse(decode);
    const timeZone = req.user.timeZone;
    return this.userServices.updateEvaluation(
      id,
      req.user,
      data,
      host,
      timeZone,
    );
  }

  @ApiResponse({
    status: 200,
    type: EvaluationListProSkillPublicResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
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

  @ApiResponse({ status: 200, type: Evaluation17AchievementResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
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

  @ApiResponse({
    status: 200,
    type: Evaluation17AdditionalAchievementResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
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

  @ApiResponse({
    status: 200,
    isArray: true,
    type: GetBasicBehaviorSkillPublicResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
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

  /**
   * Get list approval history
   *
   * @author tran.le.ha.nam
   */
  @ApiResponse({ status: 200, type: [ApprovalHistoryResponseDto] })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/evaluation/:id/get-approval-history')
  async getListApprovalHistory(
    @Req() req: Request,
    @Query() query: any,
    @Param() param: IdNumberDto,
  ) {
    const order = decrypt(query?.order || '');

    const results = await this.approvalService.getListApprovalHistory(
      param.id,
      req.user.userId,
      order ? Number(order) : 0,
    );
    return results;
  }
  //

  @ApiResponse({ status: 200, type: GetEvaluation810ResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/evaluation8-10/:id/:userId')
  findOne(
    @Param() params: Evaluation810Param,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const { role } = query;
    const result = this.evaluationService.findOne(
      params.id,
      Number(params.userId),
      role,
      req.user.companyGroupCode,
    );
    return result;
  }

  @ApiResponse({ status: 200, type: CreateOrUpdateEvaluationResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Post('/evaluation8-10/save')
  createNewEvaluation(
    @Body() dataBody: Evaluation810SaveInfo,
    @Req() req: Request,
  ) {
    // console.log(dataBody.dataSource, dataBody.evaluationId, dataBody.status);
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation-8-10`;

    const result = this.evaluationService.createOrUpdateEvaluation(
      dataBody.dataSource,
      dataBody.additionData,
      dataBody.commentData,
      dataBody.evaluationId,
      dataBody.status,
      dataBody.isDraft,
      dataBody.listEvalutor,
      dataBody.total,
      dataBody.updatedTime,
      dataBody.checkList,
      host,
      dataBody.listBehaviors,
      dataBody.listPersonalGoals,
      dataBody.achievementAdditionalPersonals,
      dataBody.listProSkills,
      req.user.timeZone,
      req.user.id,
    );
    return result;
  }

  @ApiResponse({ status: 200 })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Post('/evaluation8-10/approve')
  approveEvaluation(
    @Body() dataBody: EvaluationApproveInfo,
    @Req() req: Request,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/evaluator/evaluation-8-10`;
    const result = this.evaluationService.approveEvaluation(
      Number(dataBody.evaluationId),
      Number(dataBody.status),
      dataBody.listEvalutor,
      dataBody.maxOrder,
      dataBody.content,
      dataBody.approverId,
      dataBody.updatedTime,
      host,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
    return result;
  }

  @ApiResponse({ status: 200, type: CreateOrUpdateEvaluationResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Post('/evaluation8-10/reject')
  rejectEvaluation(
    @Body() dataBody: Evaluation810RejectInfo,
    @Req() req: Request,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}`;
    const result = this.evaluationService.rejectEvaluation(
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
  @ApiResponse({ status: 200, type: GetDepartmentGoalResponseDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/department-goal')
  async getDepartmentGoal(@Query() query: any, @Req() req: Request) {
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

  @ApiResponse({ status: 200, type: Boolean })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: ' Internal Server Error',
  })
  @Get('/check-permission/:evaluationId/:userId')
  async checkPermission(@Param() params: CheckPermissionRequestDto) {
    const { evaluationId, userId } = params;
    return await this.evaluationService.checkEvaluatorPermission(
      evaluationId,
      userId,
    );
  }

  @Get('/detail-pro-skill/:versionId')
  async getDetailProskill(@Param('versionId') versionId: number, @Req() req) {
    const data = await this.proSkillSettingServices.getDetailProSkillVersion(
      versionId,
      'f2',
      req.user.companyGroupCode,
    );
    return data;
  }

  @Get('/export-history-evaluation-evaluator')
  async exportHistoryEvaluationEvaluator(
    @Query() params: ExportHistoryEvaluationEvaluatorDto,
    @Res() res,
    @Req() req,
  ) {
    const buffer =
      await this.evaluatorServices.exportHistoryEvaluationEvaluator(
        params,
        req.user.userId,
        req.user.companyGroupCode,
      );
    res.send(buffer);
  }

  @Get('/get-user-detail-by-id')
  async getUserDetailById(@Query() query: any) {
    const result = await this.userServices.getUserDetailById(query.id);

    return result;
  }

  @Get('/get-list-department-export-evaluation-history')
  async getListDepartmentExportEvaluationHistory(
    @Req() req,
    @Query() params: GetListDepartmentExportEvaluationHistoryDto,
  ) {
    const result =
      await this.evaluatorServices.getListDepartmentToExportHistoryEvaluation(
        req.user.userId,
        req.user.companyGroupCode,
        params,
      );

    return result;
  }

  @Get('/get-list-user-pro-skill-expertise')
  async listUserProSkillExpertise(@Query() params: any, @Req() req) {
    return await this.evaluatorServices.listUserProSkillExpertise(
      params,
      req.user.userId,
      req.user.companyGroupCode,
    );
  }

  @Get('/get-list-department-pro-skill-expertise')
  async getListDepartmentExpertise(@Req() req, @Query() params: any) {
    const result = await this.evaluatorServices.getListDepartmentExpertise(
      req.user.userId,
      req.user.companyGroupCode,
      params,
    );

    return result;
  }

  // ** Export pdf ở dòng cha */
  @Post('/export-pdf-pro-skill-expertise')
  async exportPDFProSkillExpertise(
    @Body()
    body: {
      year: number;
      periodIndex: number;
      userId: number;
    },
    @Req() req: Request,
  ) {
    const result = await this.evaluatorServices.exportPDFProSkillExpertise(
      body,
      req.user.companyGroupCode,
      req.user.timeZone,
    );

    return result;
  }

  @Get('/development-professional-expertise/detail/:userId/:yearStart/:yearEnd')
  async detailProfessionalExpertise(@Req() req: Request, @Param() params) {
    return await this.evaluationService.getDetailProfessionalExpertise(
      params.userId,
      params.yearStart,
      params.yearEnd,
      req.user.companyGroupCode,
      req.user.id,
    );
  }
}
