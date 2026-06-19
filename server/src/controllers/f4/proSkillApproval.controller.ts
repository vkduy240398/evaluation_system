import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import {
  DetailProSkillApproved,
  ListVersionPublicDto,
  ResultsApproved,
  ResultsHistoryApproved,
  VersionProSkillDepartment,
  VersionProSkillDto,
} from 'src/model/response/VersionProSkillDto';
import { ProSkillServices } from 'src/services/proSkill.service';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';
import { Request } from 'express';
import { ProSkillApproveRequestDto } from 'src/model/request/ProSkillApproveRequestDto';
import { ProSkillApproveSearchInterfaces } from 'src/interfaces/user.interfaces';
import { ProSKillVersionRequestDto } from 'src/model/request/ProSkillSetingRequestDto';
import { GetDepartmentApproved } from 'src/model/response/DepartmentDto';
import { RequestApprovedProSkill } from 'src/model/request/VersionListProSkillRequest';

@Controller('v1/f4/pro-skill-approval')
@Authorize(Roles.F4)
@UseGuards(RolesGuard)
@ApiTags(Tag.F4)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
export class ProSkillApprovalRoleController {
  @Inject(ProSkillServices)
  private proSkillServices: ProSkillServices;

  @Inject(ProSkillSettingServices)
  private proSkillSettingServices: ProSkillSettingServices;

  @Get('/list-approve-pro-skill')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListVersionPublicDto,
  })
  async searchListApprovalProSkill(
    @Query() query: ProSkillApproveRequestDto,
    @Req() req: Request,
  ) {
    const skill: any =
      query.skill !== 'すべて' ? query.skill.split(':') : query.skill;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type
    const params: ProSkillApproveSearchInterfaces = {
      skill: skill,
      status: query.status,
      publicStatus: query.publicStatus,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
    };
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const results = await this.proSkillServices.searchListApprovalProSkill(
      params,
      userId,
      companyGroupCode,
    );
    return results;
  }

  @Get('/get-skill-approval')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetDepartmentApproved,
    isArray: true,
  })
  async getAllDepartment(@Req() req: Request) {
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const results = await this.proSkillServices.getSkillByRoleUser(
      userId,
      companyGroupCode,
    );
    return results;
  }

  @Get('/detail-pro-skill-approve/:versionId/:skillId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DetailProSkillApproved,
  })
  async getDetailProSkillApproval(
    @Req() req: Request,
    @Param('versionId') versionId: number,
    @Param('skillId') skillId: number,
  ) {
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const data = await this.proSkillServices.getDetailProSkillVersion(
      versionId,
      'f4',
      skillId,
      userId,
      companyGroupCode,
    );
    return data;
  }

  @ApiParam({ name: 'versionId', type: Number, example: 1 })
  @ApiResponse({ status: 200, type: VersionProSkillDto })
  @Get('/detail-pro-skill-public/:versionId')
  async getDetailProSkill(
    @Param('versionId') versionId: number,
    @Req() req: Request,
  ) {
    const data = await this.proSkillSettingServices.getDetailProSkillGeneric(
      versionId,
      req.user.companyGroupCode,
    );

    return data;
  }

  @Put('/approved/:id')
  @ApiResponse({ status: 200, type: ResultsApproved })
  approveProSkill(
    @Param('id') versioniId: number,
    @Req() req: Request,
    @Body() body: RequestApprovedProSkill,
  ) {
    const { comment, updateTime, hostName, skillId } = body;
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const statusApprove = '承認';
    return this.proSkillServices.approveProSkill(
      versioniId,
      comment,
      statusApprove,
      userId,
      updateTime,
      hostName,
      skillId,
      companyGroupCode,
      req['user'].timeZone,
    );
  }

  @Put('/rejected/:id')
  @ApiResponse({ status: 200, type: Boolean })
  rejectProSkill(
    @Param('id') versioniId: number,
    @Req() req: Request,
    @Body() body: RequestApprovedProSkill,
  ) {
    const { comment, updateTime, hostName, skillId } = body;
    const userId = req.user.id;
    const statusReject = '差戻';
    const companyGroupCode = req.user.companyGroupCode;
    return this.proSkillServices.rejectProSkill(
      versioniId,
      comment,
      statusReject,
      userId,
      updateTime,
      hostName,
      skillId,
      companyGroupCode,
      req['user'].timeZone,
    );
  }

  @Get('/version-pro-skill-department')
  @ApiResponse({ status: 200, type: VersionProSkillDepartment })
  async getVersionProSkillDepartment(
    @Query() query: ProSKillVersionRequestDto,
    @Req() req: Request,
  ) {
    const results =
      await this.proSkillSettingServices.getVersionProSkillDepartment(
        query,
        req.user.companyGroupCode,
      );
    return results;
  }

  @Get('/detail-pro-skill-public-of-skill/:skillId')
  async getDetailProSkillPublicOfDepartment(
    @Param('skillId') skillId: number,
    @Req() req: Request,
  ) {
    const data = await this.proSkillServices.getDetailProSkillPublicOfSkill(
      skillId,
      req.user.companyGroupCode,
    );

    return data;
  }

  @Get('/history-approve/:versionId')
  @ApiResponse({ status: 200, type: ResultsHistoryApproved })
  async getHistoryApproveContent(
    @Param('versionId') versionId: number,
    @Query('userId') userId: number,
    @Req() req: Request,
  ) {
    const data = await this.proSkillSettingServices.getHistoryApproveContent(
      versionId,
      userId,
      undefined,
      req.user.companyGroupCode,
    );

    return data;
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
}
