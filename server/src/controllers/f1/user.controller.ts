import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { EvaluationService } from 'src/services/evaluation.service';
import { UserService } from 'src/services/user.service';
import {
  CheckPermissionDto,
  CreateOrUpdateEvaluationResponseDto,
  Evaluation810Param,
  Evaluation810RejectInfo,
  Evaluation810SaveInfo,
  EvaluationAchievementPublicTypeDto,
  EvaluationApproveInfo,
  EvaluationBasicBehaviorPublicTypeDto,
  EvaluationListProSkillPublicResponseDto,
  EvaluationProSkillDto,
  EvaluationSearchDto,
  EvaluationSearchResponseDto,
  EvaluationSkillCheckResponseDto,
  EvaluationUpdateTypeDto,
  EvaluationUpdateTypeResponseDto,
  GetAchievementSettingPublicResponseDto,
  GetBasicBehaviorSkillPublicResponseDto,
  GetDepartmentGoalResponseDto,
  GetEvaluation810ResponseDto,
  GetEvaluationDTO,
  GetProSkillEvaluationItemResponseDto,
  GetSettingProFormulaPublicResponseDto,
  ListBasicBehaviorResponseDto,
} from 'src/model/request/EvaluationParamDto';
import { ApprovalService } from 'src/services/approval.service';
import { ApprovalServiceI } from 'src/interfaces/service/approval.service.interface';
import { IdDto, IdNumberDto } from 'src/model/request/IdNumberDto';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApprovalHistoryResponseDto } from 'src/model/response/ApprovalHistoryResponseDto';
import { Tag } from 'src/enum/Tag';
import { Roles } from 'src/enum/Roles';
import { Authorize } from 'src/handler/annotation/Authorization';
import { Request } from 'express';
import { TypeBasicBehavior } from 'src/model/request/BasicBehaviorRequest';
import { UpdateEvaluationType } from 'src/interfaces/user.interfaces';
import { decrypt } from 'src/common/util';

@Controller('v1/f1/user')
@Authorize(Roles.F1)
@UseGuards(RolesGuard)
@ApiTags(Tag.F1)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class UserRoleController {
  @Inject(UserService)
  private userServices: UserService;

  @Inject(EvaluationService)
  private evaluationService: EvaluationService;

  @Inject(ApprovalService)
  private approvalService: ApprovalServiceI;

  @ApiResponse({ status: 200, type: EvaluationSearchResponseDto })
  @Get('/evaluation')
  async getData(@Query() query: EvaluationSearchDto, @Req() req: Request) {
    const results = await this.userServices.listEvaluation(
      query,
      req.user.userId,
      req.user['companyGroupCode'],
    );
    return results;
  }

  //

  @ApiResponse({ status: 200, type: EvaluationSkillCheckResponseDto })
  @Get('/evaluation-skill/:id')
  evaluationSkillCheck(@Param('id') id: number) {
    return this.userServices.evaluationSkillCheck(id);
  }

  @ApiResponse({ status: 200, type: 'string' })
  @Get('/evaluation/:id')
  getEvaluation(
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

  @ApiResponse({ status: 200, type: EvaluationUpdateTypeResponseDto })
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
  @Get('/evaluation/list-pro-skill/public')
  getListProSkillPublic(
    @Query() query: EvaluationProSkillDto,
    @Req() req: Request,
  ) {
    return this.userServices.getListProSkillPublic(
      req.user,
      query.evaluationId,
    );
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: GetAchievementSettingPublicResponseDto,
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
    isArray: true,
    type: GetAchievementSettingPublicResponseDto,
  })
  @Get('/evaluation/achievement-sub/public')
  getAchievementSubPublic(
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
    isArray: true,
    type: GetAchievementSettingPublicResponseDto,
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

  @ApiResponse({
    status: 200,
    isArray: true,
    type: GetSettingProFormulaPublicResponseDto,
  })
  @Get('/evaluation/setting-pro-formula/public')
  getSettingProFormulaPublic(@Req() req: Request) {
    return this.userServices.getSettingProFormulaPublic(
      req.user.companyGroupCode,
    );
  }

  //

  @ApiResponse({ status: 200, type: GetEvaluation810ResponseDto })
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

  @ApiResponse({ status: 200, type: 'number' })
  @Post('/evaluation8-10/approve')
  approveEvaluation(
    @Body() dataBody: EvaluationApproveInfo,
    @Req() req: Request,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/user/evaluation-8-10`;
    const result = this.evaluationService.approveEvaluation(
      dataBody.evaluationId,
      dataBody.status,
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
  @Post('/evaluation8-10/reject')
  rejectEvaluation(
    @Body() dataBody: Evaluation810RejectInfo,
    @Req() req: Request,
  ) {
    const host = `${process.env.HOSTNAME_}/company/${req.user.companyGroupCode}/user/evaluation-8-10`;
    const result = this.evaluationService.rejectEvaluation(
      dataBody.evaluationId,
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

  /**
   * Get list approval history
   *
   * @author tran.le.ha.nam
   * @last_update
   */
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: [ApprovalHistoryResponseDto] })
  @Get('/evaluation/:id/get-approval-history')
  async getListApprovalHistory(
    @Req() req: Request,
    @Param() param: IdNumberDto,
  ) {
    const results = await this.approvalService.getListApprovalHistory(
      param.id,
      req.user.id,
    );

    return results;
  }

  @ApiResponse({
    status: 200,
    type: ListBasicBehaviorResponseDto,
    isArray: true,
  })
  @Get('/evaluation/:type/list-basic-behavior')
  async getBasicBehavior(
    @Param() params: TypeBasicBehavior,
    @Req() req: Request,
  ) {
    const flagSkill = req.user.flagSkill;
    const level = req.user.level;
    const companyGroupCode = req.user.companyGroupCode;
    const datas = await this.userServices.listBasicBehavior(
      parseInt(params.type),
      level,
      flagSkill,
      companyGroupCode,
    );
    return datas;
  }

  @ApiResponse({ status: 200, type: GetProSkillEvaluationItemResponseDto })
  @Get('/evaluation-criteria/list-pro-skill')
  async getProSkill(@Req() req: Request) {
    const results = await this.userServices.getListProSkillPublicInMenu(
      req.user,
    );

    return {
      department: results.departmentName,
      results: results.listProSkills,
    };
  }

  @ApiResponse({ status: 200, type: GetDepartmentGoalResponseDto })
  @Get('/department-goal')
  async getDepartmentGoal(@Query() query: IdDto, @Req() req: Request) {
    const { idEvaluation } = query;
    const departmentGoal = await this.userServices.getDepartmentGoal(
      idEvaluation,
      req.user.id,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
    return departmentGoal;
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Get('/check-permission/:evaluationId/:userId')
  async checkPermission(@Param() params: CheckPermissionDto) {
    const { evaluationId, userId } = params;
    return await this.evaluationService.checkPermission(evaluationId, userId);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Get('/goals/past')
  async goalsPastEvaluation(
    @Query()
    params: {
      year: number;
      type: number;
      periodIndex: number;
      evaluationPeriodId: number;
    },
    @Req() req: Request,
  ) {
    const { periodIndex, type, year, evaluationPeriodId } = params;
    const userId = req.user.id;

    return await this.evaluationService.goalsPastEvaluation(
      type,
      year,
      periodIndex,
      userId,
      evaluationPeriodId,
    );
  }
}
