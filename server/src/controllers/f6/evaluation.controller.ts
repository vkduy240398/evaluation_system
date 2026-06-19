import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { AdminEvaluationServiceI } from 'src/interfaces/service/adminEvaluation.service.interface';
import { VersionNotificationServiceI } from 'src/interfaces/service/versionNotification.service.interface';
import { VersionSettingServiceI } from 'src/interfaces/service/versionSetting.service.interface';
import { VersionSettingNsServiceI } from 'src/interfaces/service/versionSettingNs.service.interface';
import {
  ListEvaluationCriteriaHistorySearchInterfaces,
  ListEvaluationItemHistorySearchInterfaces,
} from 'src/interfaces/user.interfaces';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import {
  VersionSetting810Dto,
  VersionSetting810NSDto,
  VersionSettingDto,
} from 'src/model/generic/VersionSettingDto';
import {
  CalculatorDetail810Dto,
  CalculatorDetail810NSDto,
} from 'src/model/request/CalculatorDetail810Dto';
import { AddProSkillDto } from 'src/model/request/F6/AddProSkillDto';
import { BasicBehaviorPublicVersionBody } from 'src/model/request/F6/BasicBehaviorPublicVersionBody';
import { CancelSetting810Ex } from 'src/model/request/F6/CancelSetting810Ex';
import { CancelVersionEvaluationItemBody } from 'src/model/request/F6/CancelVersionEvaluationItemBody';
import { CancelVersionNotificationDto } from 'src/model/request/F6/CancelVersionNotificationDto';
import { EditProskillDto } from 'src/model/request/F6/EditProskillDto';
import { ListEvaluationCalculationHistoryDto } from 'src/model/request/F6/ListEvaluationCalculationHistoryDto';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
import { PublicVersionNotificationDto } from 'src/model/request/F6/PublicVersionSettingDto';
import { SaveDraftSetting810Ex } from 'src/model/request/F6/SaveDraftSetting810Ex';
import { ListEvaluationCriteriaHistoryRequestDto } from 'src/model/request/ListEvaluationCriteriaHistoryRequestDto';
import { ListEvaluationItemHistoryRequestDto } from 'src/model/request/ListEvaluationItemHistoryRequestDto';
import { GetManagementEvaluationSkillDto } from 'src/model/request/ManagementEvaluationProDto';
import { PublicVersionSettingDto } from 'src/model/request/PublicVersionSettingDto';
import { BasicBehaviorPublicVersionDto } from 'src/model/response/F6/BasicBehaviorPublicVersionDto';
import { ConflictCancelVersionEvaluationItemDto } from 'src/model/response/F6/ConflictCancelVersionEvaluationItemDto';
import { ConflictPublicVersionDto } from 'src/model/response/F6/ConflictPublicVersionDto';
import { DetailCriteriaDto } from 'src/model/response/F6/DetailCriteriaDto';
import { DetailEvaluationItemDto } from 'src/model/response/F6/DetailEvaluationItemDto';
import { FindListEvaluationCriteriaHistoryDto } from 'src/model/response/F6/FindListEvaluationCriteriaHistoryDto';
import { FindListEvaluationItemHistoryDto } from 'src/model/response/F6/FindListEvaluationItemHistoryDto';
import { GetHistoryApproveContentDto } from 'src/model/response/F6/GetHistoryApproveContentDto';
import { GetListCommonSkillDto } from 'src/model/response/F6/GetListCommonSkillDto';
import { GetNextVersion810Dto } from 'src/model/response/F6/GetNextVersion810Dto';
import { GetSettingEvaluationSkillDto } from 'src/model/response/F6/GetSettingEvaluationSkillDto';
import { GetUserActiveDto } from 'src/model/response/F6/GetUserActiveDto';
import { ListEvaluationCalculationHistoryResponseDto } from 'src/model/response/F6/ListEvaluationCalculationResponseDto';
import { ListVersionNotificationResponse } from 'src/model/response/F6/ListVersionNotificationResponse';
import { PublicVersionDto } from 'src/model/response/F6/PublicVersionDto';
import { SaveDraftDto } from 'src/model/response/F6/SaveDraftDto';
import { SaveDraftEvaluationItemDto } from 'src/model/response/F6/SaveDraftEvaluationItemDto';
import { SaveDraftSetting810ResEx } from 'src/model/response/F6/SaveDraftSetting810ResEx';
import { SavePrivateVersionDto } from 'src/model/response/F6/SavePrivateVersionDto';
import { SavePublicVersionDto } from 'src/model/response/F6/SavePublicVersionDto';
import { SavePublicVersionEvaluationItemDto } from 'src/model/response/F6/SavePublicVersionEvaluationItemDto';
import { VersionSettingConflictUpdateDto } from 'src/model/response/F6/VersionSettingConflictUpdateDto';
import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
import { AdminEvaluationService } from 'src/services/adminEvaluation.service';
import { BasicBehaviorServices } from 'src/services/basicBehavior.service';
import { EvaluationService } from 'src/services/evaluation.service';
import { GuideEvaluationService } from 'src/services/guideEvaluation.service';
import { ManagementEvaluationService } from 'src/services/managementEvaluation.service';
import { ProSkillServices } from 'src/services/proSkill.service';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';
import { VersionNotificationService } from 'src/services/versionNotification.service';
import { VersionSettingService } from 'src/services/versionSetting.service';
import { VersionSettingNsService } from 'src/services/versionSettingNs.service';
import { SettingReviewService } from 'src/services/settingReview.service';
import { SettingDefaultPeriodServices } from 'src/services/settingDefaultPeriod.service';

@Controller('v1/f6/management-evaluation')
@Authorize(Roles.F6)
@UseGuards(RolesGuard)
@ApiTags(Tag.F6)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal Server Error',
})
export class ManagementEvaluationRoleController {
  @Inject(ManagementEvaluationService)
  private managementEvaluationService: ManagementEvaluationService;

  @Inject(VersionSettingService)
  private versionSettingService: VersionSettingServiceI;

  @Inject(VersionSettingNsService)
  private versionSettingNsService: VersionSettingNsServiceI;

  @Inject(AdminEvaluationService)
  private adminEvaluationService: AdminEvaluationServiceI;

  @Inject(GuideEvaluationService)
  private guideEvaluationService: GuideEvaluationService;

  @Inject(ProSkillSettingServices)
  private proSkillSettingServices: ProSkillSettingServices;

  @Inject(BasicBehaviorServices)
  private basicBehaviorServices: BasicBehaviorServices;

  @Inject(EvaluationService)
  private evaluationServices: EvaluationService;

  @Inject(VersionNotificationService)
  private versionNotificationService: VersionNotificationServiceI;

  @Inject(ProSkillServices)
  private proSkillServices: ProSkillServices;

  @Inject(SettingReviewService)
  private settingReviewService: SettingReviewService;

  @Inject(SettingDefaultPeriodServices)
  private settingDefaultPeriodServices: SettingDefaultPeriodServices;

  @Get('/setting-evaluation-skills')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSettingEvaluationSkillDto,
  })
  @UsePipes(
    // Transform boolean from "true" to True
    // ? Could be set in global pipe but didn't know why it's wasn't there
    new ValidationPipe({
      forbidUnknownValues: true,
      transform: true,
    }),
  )
  async getSettingEvaluationSkills(
    @Query() query: GetManagementEvaluationSkillDto,
    @Req() req: Request,
  ) {
    return await this.managementEvaluationService.getSettingEvaluationSkills(
      query,
      req.user.companyGroupCode,
    );
  }

  @Delete('/setting-evaluation-skills/:id')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async deleteAdminEvalutionSkill(@Param('id') skillId: number) {
    return await this.managementEvaluationService.deleteAdminEvalutionSkill(
      skillId,
    );
  }

  @Get('/get-user-active')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetUserActiveDto,
  })
  async getUserActive(@Req() req: Request) {
    return await this.managementEvaluationService.getUserActive(
      req.user.companyGroupCode,
    );
  }

  @Get('/list-common-skill')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListCommonSkillDto,
  })
  async getListCommonSkill(@Query() query: any, @Req() req: Request) {
    let type = [];
    let level: any;
    /**convert type */
    if (
      /**基本スキル - 1 ～ 7等級 */
      query.basicBehavior === '1' &&
      query.typeLevel === '1'
    ) {
      type = [1];
    } else if (
      /**基本スキル - 8 ～ 10等級 */
      query.basicBehavior === '1' &&
      query.typeLevel === '2'
    ) {
      type = [4];
    } else if (
      /**行動・情意 - スキル評価(あり) */
      query.basicBehavior === '2' &&
      query.flagSkill === '1'
    ) {
      type = [2, 5];
    } else if (
      /**行動・情意 - スキル評価(なし) */
      query.basicBehavior === '2' &&
      query.flagSkill === '0'
    ) {
      type = [3, 6];
    }

    /**convert level */
    if (
      /**行動・情意 - all level */
      query.basicBehavior === '2' &&
      query.level === 'すべて'
    ) {
      level = '1,2,3,4,5,6,7,8,9,10'.split(',');
    } else if (
      /**行動・情意 - by each level */
      query.basicBehavior === '2' &&
      query.level !== 'すべて'
    ) {
      level = query.level.split(',');
    }

    const companyGroupCode = req.user.companyGroupCode;
    const params = {
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      basicBehavior: query.basicBehavior,
      status: query.status,
      level: query.basicBehavior === '2' ? level : null,
      flagSkill: query.flagSkill,
      type: type,
      companyGroupCode: companyGroupCode,
    };

    const datas = await this.basicBehaviorServices.searchListBasicBehavior(
      params,
    );
    return datas;
  }

  @Get('/detail-evaluation-item/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DetailEvaluationItemDto,
  })
  @ApiQuery({ name: 'isEdit', type: Boolean, example: true })
  async detailEvaluationItem(
    @Param('id') id: number,
    @Query() query,
    @Req() req: Request,
  ) {
    return await this.basicBehaviorServices.getInformationCriteria(
      id,
      query.isEdit,
      req.user.companyGroupCode,
    );
  }

  @Put('evaluation-item/save-draft')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SaveDraftEvaluationItemDto,
  })
  async saveDraftEvaluationItem(@Req() req: Request) {
    const results = await this.basicBehaviorServices.saveDraftData(
      req.body,
      req.user.id,
      req.user.companyGroupCode,
      req.user.timeZone,
    );

    return {
      fullName: req.user.fullName,
      versionId: results.id,
      timer: results.updatedTime,
      subVersion: results.subVersion,
      version: results.version,
      status: results.status,
      lastUpdatedTime: results.lastUpdatedTime,
      edited: results.edited || false,
      code: results.code,
    };
  }

  @Put('evaluation-item/:id/save-public-version/')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SavePublicVersionEvaluationItemDto,
  })
  async savePublicVersionEvaluationItem(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.basicBehaviorServices.savePublicVersion({
      versionId: id,
      version: req.body.version,
      subVersion: req.body.subVersion,
      timer: req.body.timer,
      userId: req.user.id,
      type: req.body.type,
      data: req.body.children,
      status: req.body.status,
      reason: req.body.reason,
      hostname: req.body.hostname,
      level: req.body.level,
      companyGroupCode: req.user.companyGroupCode,
      timeZone: req.user.timeZone,
    });
  }

  @Put('evaluation-item/cancel-version/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [VersionProSkillDto],
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictCancelVersionEvaluationItemDto,
  })
  @ApiBody({})
  async cancelVersionEvaluationItem(
    @Param('versionId') versionId: number,
    @Req() req: Request,
    @Body() body: any,
  ) {
    return await this.basicBehaviorServices.cancelVersionPro(
      versionId,
      req.user.id,
      body,
      req.user.companyGroupCode,
    );
  }

  /**
   * Get detail evaluation calculation 1~7
   *
   * @author tran.le.ha.nam
   */
  @Get('/list-evaluation-calculation-history')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListEvaluationCalculationHistoryResponseDto,
  })
  async getListEvaluationCalculationHistory(
    @Query() query: ListEvaluationCalculationHistoryDto,
    @Req() req: Request,
  ) {
    return await this.versionSettingService.getListEvaluationCalculationHistory(
      query,
      req,
    );
  }

  /**
   * Get detail evaluation calculation 1~7
   *
   * @author tran.le.ha.nam
   */
  @Get('/detail-evaluation-calculation/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSettingDto,
  })
  async getDetailEvaluationCalculation(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.versionSettingService.getDetailEvaluationCalculation17(
      id,
      req,
    );
  }

  /**
   * Get detail evaluation calculation 1~7 no skill
   *
   * @author tran.le.ha.nam
   */
  @Get('/detail-evaluation-calculation-ns/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSettingDto,
  })
  async getDetailEvaluationCalculationNs(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.versionSettingNsService.getDetailEvaluationCalculation17ns(
      id,
      req,
    );
  }

  @Get('/detail-evaluation-calculation-common/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSettingDto,
  })
  async getDetailEvaluationCalculationCommon(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.versionSettingService.getDetailEvaluationCalculationCommon(
      id,
      req,
    );
  }

  @Put('/detail-evaluation-calculation/save-draft-common')
  @ApiResponse({ status: HttpStatus.OK, type: [VersionSettingDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async saveDraftVersionSettingCommon(
    @Req() req: Request,
    @Query('type') type: string,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingService.saveDraftVersionSettingCommon(
      dto,
      type,
      req,
    );
  }

  @Get('/list-criteria-evaluation-history')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindListEvaluationCriteriaHistoryDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  findListEvaluationCriteriaHistory(
    @Query() query: ListEvaluationCriteriaHistoryRequestDto,
    @Req() req: Request,
  ) {
    const params: ListEvaluationCriteriaHistorySearchInterfaces = {
      status: query.status,
      type: query.type,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      flagSkill: query.flagSkill,
    };
    return this.guideEvaluationService.findListEvaluationCriteriaHistory(
      params,
      req.user.companyGroupCode,
    );
  }

  @Get('/history-approve/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetHistoryApproveContentDto,
  })
  async getHistoryApproveContent(
    @Param('versionId') versionId: number,
    @Query('userId') userId: number,
  ) {
    const data = await this.proSkillSettingServices.getHistoryApproveContent(
      versionId,
      userId,
      true,
    );

    return data;
  }

  @Get('/list-evaluation-item-history')
  @ApiResponse({
    status: HttpStatus.OK,
    type: FindListEvaluationItemHistoryDto,
  })
  findListEvaluationItemHistory(
    @Query() query: ListEvaluationItemHistoryRequestDto,
    @Req() req: Request,
  ) {
    const skill: any =
      query.skill !== 'すべて' ? query?.skill.split(':') : query.skill;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type
    const params: ListEvaluationItemHistorySearchInterfaces = {
      status: query.status,
      skill: skill,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      publicStatus: query.publicStatus,
      companyGroupCode: req.user.companyGroupCode,
    };
    return this.evaluationServices.findListEvaluationItemHistory(params);
  }

  @Get('/get-data-8-10/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSetting810Dto,
  })
  async getData810(
    @Param('versionId') versionId: number,
    @Req() req: Request,
  ): Promise<VersionSetting810Dto> {
    const result =
      await this.versionSettingService.getDetailEvaluationCalculation810(
        versionId,
        req,
      );

    return result;
  }

  @Get('/get-data-8-10-ns/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSetting810NSDto,
  })
  async getData810NS(
    @Param('versionId') versionId: number,
    @Req() req: Request,
  ): Promise<VersionSetting810NSDto> {
    const result =
      await this.versionSettingService.getDetailEvaluationCalculation810NS(
        versionId,
        req,
      );

    return result;
  }

  @Get('/detail-criteria-evaluation/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DetailCriteriaDto,
  })
  async detailCriteria(@Param('id') id: number, @Req() req: Request) {
    return await this.guideEvaluationService.getInformationCriteria(
      id,
      req.user.companyGroupCode,
    );
  }

  @Put('/:id/public-version/')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictPublicVersionDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PublicVersionDto,
  })
  async publicVersion(@Param('id') id: number, @Req() req: Request) {
    return await this.guideEvaluationService.publicVersion(
      {
        versionId: id,
        version: req.body.version,
        subVersion: req.body.subVersion,
        timer: req.body.timer,
        userId: req.user.id,
        type: req.body.type,
      },
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/criteria-evaluation/save-draft')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SaveDraftDto,
  })
  async saveDraft(@Req() req: Request) {
    const results = await this.guideEvaluationService.saveDraftData(
      req.body,
      req.user.id,
      req.user.companyGroupCode,
      req.user.timeZone,
    );

    return {
      ...results,
      fullName: req.user.fullName,
      versionId: results.id,
      timer: results.updatedTime,
      subVersion: results.subVersion,
      version: results.version,
      lastUpdatedTime: results.lastUpdatedTime,
    };
  }

  @Put('/criteria-evaluation/cancel-version/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'number', example: 3 },
  })
  @ApiBody({ type: CancelVersionEvaluationItemBody })
  async cancelVersion(
    @Param('versionId') versionId: number,
    @Req() req: Request,
    @Body() body: any,
  ) {
    return await this.guideEvaluationService.cancelVersionPro(
      versionId,
      req.user.id,
      body,
      req.user.companyGroupCode,
    );
  }

  @Put('/:id/save-private-version-criteria-evaluation')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictPublicVersionDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SavePrivateVersionDto,
  })
  async savePrivateVersion(@Param('id') id: number, @Req() req: Request) {
    return await this.guideEvaluationService.savePrivateVersion({
      versionId: id,
      version: req.body.version,
      subVersion: req.body.subVersion,
      timer: req.body.timer,
      userId: req.user.id,
      type: req.body.type,
      status: req.body.status,
      reason: req.body.reason,
      contentEvaluationCriteria: req.body.contentEvaluationCriteria,
      contentNotes: req.body.contentNotes,
      companyGroupCode: req.user.companyGroupCode,
    });
  }

  @Put('/:id/save-public-version-criteria-evaluation')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictPublicVersionDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SavePublicVersionDto,
  })
  async savePublicVersion(@Param('id') id: number, @Req() req: Request) {
    return await this.guideEvaluationService.savePublicVersion(
      {
        versionId: id,
        version: req.body.version,
        subVersion: req.body.subVersion,
        timer: req.body.timer,
        userId: req.user.id,
        type: req.body.type,
        status: req.body.status,
        reason: req.body.reason,
        contentEvaluationCriteria: req.body.contentEvaluationCriteria,
        contentNotes: req.body.contentNotes,
      },
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/detail-pro-skill/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionProSkillDto,
  })
  async getDetailProSkill(@Param('id') id: number) {
    return await this.evaluationServices.detailProSkillById(id);
  }

  @Put('/:id/public-pro-skill')
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async publicVersionById(
    @Param('id') id: number,
    @Body() body: Request,
    @Req() req: Request,
  ) {
    const results = await this.evaluationServices.publicVersionService(
      id,
      body,
      req.user.id,
      body.hostname,
      req.user.fullName,
      req.user.companyGroupCode,
      req.user.timeZone
    );
    return results;
  }

  @Put('/:id/reject-pro-skill')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionProSkillDto,
  })
  async rejectVersionById(
    @Param('id') id: number,
    @Body() body: Request,
    @Req() req: Request,
  ) {
    const host = process.env.HOSTNAME_;
    const results = await this.evaluationServices.rejectVersionService(
      id,
      body,
      req.user.id,
      host,
      req.user.companyGroupCode,
      req.user.timeZone
    );

    const rejectComment = await this.evaluationServices.getRejectComment(
      results.id,
    );

    return {
      updatedTime: results.updatedTime,
      version: `${results.version}.${results.subVersion}`,
      publicDate: results.publicDate,
      publicStatus: results.publicStatus,
      versionMain: results.version,
      subVersion: results.subVersion,
      status: results.status,
      id: results.id,
      rejectComment: rejectComment?.comment || '',
    };
  }

  @Get('/detail-evaluation-calculation-8-10/get-next-version/:version')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetNextVersion810Dto,
  })
  async getNextVersion810(
    @Param('version') version: number,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingService.getNextVersion810(
      version,
      req,
    );
    return results;
  }

  @Get('/detail-evaluation-calculation-8-10ns/get-next-version/:version')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetNextVersion810Dto,
  })
  async getNextVersion810NS(
    @Param('version') version: number,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingService.getNextVersion810NS(
      version,
      req,
    );
    return results;
  }

  @Get('/list-user-evaluation-period')
  @ApiExcludeEndpoint()
  async listUserEvaluationPeriod(@Query() params: any, @Req() req: Request) {
    const results = await this.adminEvaluationService.listUserEvaluationPeriod(
      params,
      req.user.companyGroupCode,
    );
    return results;
  }

  @Post('/detail-evaluation-calculation-8-10/save-draft')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { example: SaveDraftSetting810ResEx },
  })
  @ApiBody({ schema: { example: SaveDraftSetting810Ex } })
  async saveDraftSetting(
    @Body() params: CalculatorDetail810Dto,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingService.saveDraft810(
      params,
      req.user.id,
      req,
    );

    return results;
  }

  @Post('/detail-evaluation-calculation-8-10ns/save-draft')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { example: SaveDraftSetting810ResEx },
  })
  @ApiBody({ schema: { example: SaveDraftSetting810Ex } })
  async saveDraftSettingNS(
    @Body() params: CalculatorDetail810NSDto,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingNsService.saveDraft810NS(
      params,
      req.user.id,
      req,
    );

    return results;
  }

  @Post('/detail-evaluation-calculation-8-10/save-public-or-private')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { example: SaveDraftSetting810ResEx },
  })
  @ApiBody({ schema: { example: SaveDraftSetting810Ex } })
  async savePublicOrPrivate(
    @Body() params: CalculatorDetail810Dto,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingService.savePublicOrPrivate(
      params,
      req.user.id,
      req,
    );

    return results;
  }

  @Post('/detail-evaluation-calculation-8-10ns/save-public-or-private')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: { example: SaveDraftSetting810ResEx },
  })
  @ApiBody({ schema: { example: SaveDraftSetting810Ex } })
  async savePublicOrPrivateNS(
    @Body() params: CalculatorDetail810NSDto,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingNsService.savePublicOrPrivateNS(
      params,
      req.user.id,
      req,
    );

    return results;
  }

  @Get('/detail-evaluation-calculation-8-10/check-date-public')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ConflictPublicVersionDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: { type: 'boolean', example: false },
  })
  async checkDatePublic(@Req() req: Request) {
    const isResult = await this.versionSettingService.checkDatePublic(
      req.user.companyGroupCode,
      req.user.timeZone,
    );

    return isResult;
  }

  @Put('/detail-evaluation-calculation-8-10/cancel/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: [Number],
    schema: { example: [1] },
  })
  @ApiBody({ schema: { example: CancelSetting810Ex } })
  async cancelSetting(
    @Param('versionId') id: number,
    @Body() params: any,
    @Req() req: Request,
  ) {
    const results = await this.versionSettingService.cancelSetting(
      id,
      params,
      req.user.id,
      req,
    );

    return results;
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Patch('/public-version-setting')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PublicVersionSettingDto,
  })
  @ApiBody({ type: PublicVersionSettingDto, required: true })
  async publicVersionSetting(
    @Req() req: Request,
    @Body() publicVersionSettingDto: PublicVersionSettingDto,
  ) {
    return await this.versionSettingService.publicVersionSetting17(
      publicVersionSettingDto,
      req,
    );
  }

  @Patch('/public-version-setting-common')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PublicVersionSettingDto,
  })
  @ApiBody({ type: PublicVersionSettingDto, required: true })
  async publicVersionSettingCommon(
    @Req() req: Request,
    @Body() publicVersionSettingDto: PublicVersionSettingDto,
  ) {
    return await this.versionSettingService.publicVersionSettingCommon(
      publicVersionSettingDto,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Get('/get-max-sub-version/:version')
  @ApiResponse({ status: HttpStatus.OK, type: Number, schema: { example: 2 } })
  async getMaxSubVersion(
    @Param('version') version: number,
    @Query('type') type: number,
    @Req() req: Request,
  ) {
    return await this.versionSettingService.findMaxSubVersion(
      version,
      type,
      req,
    );
  }

  @Put('/detail-evaluation-calculation/save-public-common')
  @ApiResponse({ status: 200, type: [VersionSettingDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async savePublicDetailCalculationCommon(
    @Req() req: Request,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingService.savePublicVersionSettingCommon(
      dto,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Put('/detail-evaluation-calculation/save-draft17')
  @ApiResponse({ status: HttpStatus.OK, type: [VersionSettingDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async saveDraftVersionSetting17(
    @Req() req: Request,
    @Query('type') type: string,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingService.saveDraftVersionSetting17(
      dto,
      type,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   * @last_update
   */
  @Put('/detail-evaluation-calculation/save-draft17ns')
  @ApiResponse({ status: 200, type: [VersionSettingDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async saveDraftVersionSetting17ns(
    @Req() req: Request,
    @Query('type') type: string,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingNsService.saveDraftVersionSetting17ns(
      dto,
      type,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Patch('/detail-evaluation-calculation/:id/cancel')
  @ApiResponse({ status: 200, type: Boolean, schema: { example: true } })
  async cancelVersionSetting(
    @Param('id') id: number,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const data = { ...body };
    return await this.versionSettingService.cancelVersionSetting17(
      id,
      data,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Put('/detail-evaluation-calculation/save-public17')
  @ApiResponse({ status: 200, type: [VersionSettingDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async savePublicDetailCalculation(
    @Req() req: Request,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingService.savePublicVersionSetting17(
      dto,
      req,
    );
  }

  @Put('/:id/basic-behavior-public-version/')
  @ApiBody({ type: BasicBehaviorPublicVersionBody })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: BasicBehaviorPublicVersionDto,
  })
  async basicBehaviorPublicVersion(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.basicBehaviorServices.publicVersion({
      versionId: id,
      version: req.body.version,
      subVersion: req.body.subVersion,
      timer: req.body.timer,
      userId: req.user.id,
      type: req.body.type,
      hostname: req.body.hostname,
      companyGroupCode: req.user.companyGroupCode,
      timeZone: req.user.timeZone,
    });
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Put('/detail-evaluation-calculation/save-public17ns')
  @ApiResponse({ status: HttpStatus.OK, type: [VersionSettingDto] })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: VersionSettingConflictUpdateDto,
  })
  async savePublicDetailCalculationNs(
    @Req() req: Request,
    @Body() dto: VersionSettingDto,
  ) {
    return await this.versionSettingNsService.savePublicVersionSetting17ns(
      dto,
      req,
    );
  }

  /**
   * Get list version notification
   *
   * @author tran.le.ha.nam
   */
  @Get('/list-version-notification')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListVersionNotificationResponse,
  })
  async getListVersionNotification(
    @Query() query: ListVersionNotificationParam,
    @Req() req: Request,
  ) {
    return await this.versionNotificationService.getListVersionNotification(
      query,
      req.user.companyGroupCode,
    );
  }

  /**
   * Get detail notification
   *
   * @author tran.le.ha.nam
   */
  @Get('/detail-notification/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionNotificationDto,
  })
  async getDetailNotification(@Param('id') id: number, @Req() req: Request) {
    return await this.versionNotificationService.getDetailNotification(
      id,
      req.user.companyGroupCode,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Put('/detail-notification/save-draft')
  @ApiResponse({ status: HttpStatus.OK, type: [VersionNotificationDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async saveDraftVersionNotification(
    @Req() req: Request,
    @Query('type') type: string,
    @Body() dto: VersionNotificationDto,
  ) {
    return await this.versionNotificationService.saveDraftVersionNotification(
      dto,
      type,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Patch('/detail-notification/:id/cancel')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    schema: { example: true },
  })
  async cancelVersionNotification(
    @Param('id') id: number,
    @Body() body: CancelVersionNotificationDto,
    @Req() req: Request,
  ) {
    const data = { ...body };
    data.id = id;

    return await this.versionNotificationService.cancelVersionNotification(
      data,
      req.user.companyGroupCode,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Put('/detail-notification/save-public')
  @ApiResponse({ status: 200, type: [VersionNotificationDto] })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict update' })
  async savePublicDetailNotification(
    @Req() req: Request,
    @Body() dto: VersionNotificationDto,
  ) {
    return await this.versionNotificationService.savePublicVersionNotification(
      dto,
      req,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Get('/detail-notification/:version/get-max-sub-version')
  @ApiResponse({ status: HttpStatus.OK, type: Number, schema: { example: 2 } })
  async getMaxSubVersionNotification(
    @Param('version') version: number,
    @Req() req: Request,
  ) {
    return await this.versionNotificationService.findMaxSubVersion(
      version,
      req.user.companyGroupCode,
    );
  }

  /**
   *
   * @author tran.le.ha.nam
   */
  @Patch('/detail-notification/public')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PublicVersionNotificationDto,
  })
  async publicVersionNotification(
    @Body() publicVersionSettingDto: PublicVersionNotificationDto,
    @Req() req: Request,
  ) {
    return await this.versionNotificationService.publicVersionNotification(
      publicVersionSettingDto,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  /**
   *
   * @author huynh.ngoc.hung
   */
  @Post('/get-all-departments-with-subclass')
  async getAllDepartmentsWithSubClass(@Req() req: Request) {
    return await this.adminEvaluationService.getAllDepartmentsWithSubClass(
      req.user.companyGroupCode,
    );
  }

  /**
   *
   * @author huynh.ngoc.hung
   */
  @Post('/add-pro-skill')
  async addProSkill(@Body() payload: AddProSkillDto, @Req() req: Request) {
    return await this.adminEvaluationService.addProSkill(
      payload,
      req.user.companyGroupCode,
    );
  }

  @Put('/setting-evaluation-skills/:id')
  async editProSkill(
    @Param('id') skillId: number,
    @Body() payload: EditProskillDto,
    @Req() req: Request,
  ) {
    return await this.adminEvaluationService.editProSkill(
      skillId,
      payload,
      req.user.companyGroupCode,
    );
  }

  @Get('/list-dep-temp-export')
  async getListDep_TempExport(@Query() params: any, @Req() req: Request) {
    const year = params.year;
    const periodIndex = params.periodEvaluate;
    const role = params.role;
    const companyGroupCode = req.user.companyGroupCode;
    const results = await this.proSkillServices.getListDep_TempExport(
      year,
      periodIndex,
      role,
      companyGroupCode,
    );
    return results;
  }

  @Get('/dep-temp-export')
  async dep_TempProSkillExport(@Query() params: any, @Req() req: Request) {
    const year = params.year;
    const periodIndex = params.periodIndex;
    const role = params.role;
    const listSelected = params.listSelected;
    const companyGroupCode = req.user.companyGroupCode;
    return await this.proSkillServices.dep_TempProSkillExport(
      year,
      periodIndex,
      role,
      listSelected,
      companyGroupCode,
    );
  }

  @Get('/find-list-user-to-setting-evaluation-history-reference')
  async searchListUserToSettingEvaluationHistoryReference(
    @Query() query: any,
    @Req() req: Request,
  ) {
    const departments: any =
      query.department !== 'すべて'
        ? query?.department?.split(':')
        : query.department;
    // departments 0 => id , 1=> name, 2 => type
    query = {
      ...query,
      userName: query.userName === undefined ? '' : query.userName,
      department: departments,
      offset: query.offset,
      limit: query.limit,
      companyGroupCode: req.user.companyGroupCode,
    };
    return await this.settingReviewService.searchListUserToSettingEvaluationHistoryReference(
      query,
    );
  }

  @Get('/get-all-user')
  async getAllUser(@Req() req: Request) {
    return await this.settingReviewService.getAllUser(
      req.user.companyGroupCode,
    );
  }

  @Post('/add-edit-user-setting-evaluation-history-reference')
  addEditUser(@Body() data: any, @Req() req: Request) {
    return this.settingReviewService.addEditUser(
      data,
      req.user.companyGroupCode,
    );
  }

  @Get('/list-department')
  async listDepartment(@Req() req: Request) {
    return await this.settingReviewService.getListDepartmentRepository(
      req.user.companyGroupCode,
    );
  }

  @Get('/list-setting-review-history')
  async listSettingReviewHistory(@Query() query, @Req() req: Request) {
    return await this.settingReviewService.getListSettingReviewHistoryReference(
      query,
      req.user['companyGroupCode'],
      req.user.timeZone
    );
  }

  @Put('/update-number-period')
  async saveNumberPeriod(@Body() payload, @Req() req: Request) {
    return await this.settingDefaultPeriodServices.updateOrCreateSetting(
      payload.defaultPeriod,
      req.user['companyGroupCode'],
    );
  }

  @Get('/get-setting-default-period')
  async findOne(@Req() req: Request) {
    return await this.settingDefaultPeriodServices.findOneSettingDefaultService(
      req.user['companyGroupCode'],
    );
  }

  @Delete('/delete-history-reference')
  async deleteHistoryReference(
    @Body() payload,
    @Query() query,
    @Req() req: Request,
  ) {
    const arrayIds = [];
    payload.map((v) => {
      v.split(',').map((val) => {
        arrayIds.push(Number(val));
      });
    });
    return await this.settingReviewService.deleteHistoryReference(
      arrayIds,
      query,
      req.user['companyGroupCode'],
      req.user.timeZone
    );
  }
}
