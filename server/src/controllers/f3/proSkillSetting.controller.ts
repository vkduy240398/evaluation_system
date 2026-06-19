import {
  Controller,
  Get,
  UseGuards,
  Param,
  Inject,
  Query,
  Req,
  Put,
  Post,
  Body,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { Request } from 'express';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';
import {
  ListProSKillVersionRequestDto,
  ProSKillVersionRequestDto,
} from 'src/model/request/ProSkillSetingRequestDto';
import { MailService } from 'src/services/mail.service';
import { ProSkillDetail } from 'src/interfaces/proskillSetting.interfaces';
import {
  DepartmentDto,
  DetailProSkillPublicResponse,
  DetailProSkillResponse,
  HistoryApproveResponse,
  InitialVersionResponse,
  ListPointResponse,
  PermissionResponse,
  ProSkillEditResponse,
  ProSkillSaveDrafReponse,
  VersionCancelResponse,
  VersionProSkillDepartmentResponse,
  VersionProSkillResponse,
  VersionPublicResponse,
  VersionSubmitResponse,
} from 'src/model/response/F3/ProSkillSettingResponse';
import { GetDetailProSkill } from 'src/model/request/ProSkillSettingRequestDto';
import { ProSkillServices } from 'src/services/proSkill.service';

@Controller('v1/f3/pro-setting')
@Authorize(Roles.F3)
@UseGuards(RolesGuard)
@ApiTags(Tag.F3)
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal Server Error',
})
export class ProSkillSettingRoleController {
  @Inject(ProSkillSettingServices)
  private proSkillSettingServices: ProSkillSettingServices;

  @Inject(ProSkillServices)
  private proSkillServices: ProSkillServices;

  @Inject(MailService)
  private mailService: MailService;

  @Get('/detail-pro-skill/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DetailProSkillResponse,
  })
  @ApiQuery({
    type: GetDetailProSkill,
  })
  async getDetailProskill(
    @Param('versionId') versionId: number,
    // @Param('isReadOnly') readOnly: boolean,
    @Query() query: any,
    @Req() req: Request,
  ) {
    const data = await this.proSkillSettingServices.getDetailProSkill(
      versionId,
      req.user.id,
      query.isReadOnly,
      req.user.companyGroupCode,
    );

    return data;
  }

  @Get('/get-skill')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
  })
  async getSkillRoleUser(@Req() req: Request) {
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const results = await this.proSkillSettingServices.getSkillRoleUser(
      userId,
      companyGroupCode,
    );
    return results;
  }

  @Get('/version-pro-skill')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionProSkillResponse,
  })
  async getVersionProSkill(
    @Query() query: ListProSKillVersionRequestDto,
    @Req() req: Request,
  ) {
    const userId = req.user.id;
    const companyGroupCode = req.user.companyGroupCode;
    const results = await this.proSkillSettingServices.getVersionProSkill(
      query,
      userId,
      companyGroupCode,
    );
    return results;
  }

  @Put('/save-draft/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProSkillSaveDrafReponse,
  })
  async saveDraft(
    @Param('versionId') versionId: number,
    @Req() request: Request,
  ) {
    const { data } = request.body;

    const response =
      await this.proSkillSettingServices.createNewVersionSaveDraft(
        versionId,
        data,
        request.user.id,
        request.user.companyGroupCode,
        request['user'].timeZone,
      );
    if (response.code === 200) {
      const childrens = data.children.map((v) => {
        delete v.id;
        delete v.version_id;
        v.versionId = parseInt(response.id.toString());
        if (typeof v.difficulty === 'string') {
          v.difficulty = null;
        }
        return v;
      });

      await this.proSkillSettingServices.createBulk(
        parseInt(response.id.toString()),
        childrens,
      );
      return {
        code: 200,
        id: parseInt(response.id.toString()),
        updated: response.updatedTime,
        status: response.status,
        publicStatus: response.publicStatus,
        skillId: response.skillId,
        version: response.version,
        subVersion: response.subVersion,
        fullName: request.user.fullName,
        reason: response.reason,
        skillActive: response.skillActive,
        skill: response.skill,
        skillName: response.skillName,
        creationUser: { fullName: request.user.fullName, id: request.user.id },
        lastUpdatedTime: response.lastUpdatedTime,
        // listDepartment: response.listDepartment,
      };
    } else {
      return response;
    }
  }

  @Get('/version-pro-skill-department')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionProSkillDepartmentResponse,
  })
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

  @Put('/submit-version/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionSubmitResponse,
  })
  async submitVersion(
    @Param('versionId') versionId: number,
    @Req() request: Request,
  ) {
    const host = process.env.HOSTNAME_;
    const { data } = request.body;
    const tempListPoint = data.children.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t.difficulty === obj.difficulty),
    );
    const response = await this.proSkillSettingServices.createNewVersionSubmit(
      versionId,
      data,
      request.user.id,
      request.user.companyGroupCode,
      tempListPoint,
      request['user'].timeZone,
    );

    if (response?.code === 200) {
      const childrens = data.children.map((v: any) => {
        delete v.id;
        delete v.version_id;
        v.versionId = response.id;
        return v;
      });
      await this.proSkillSettingServices.createBulk(response.id, childrens);
      // send mail when sudmit pro skill version successfully
      const mailData = {
        skillId: response.skillId,
        versionId: response.id,
        versionMain: response.version,
        versionSub: response.subVersion,
        skillName: response.skillName,
        createdUser: { fullName: request.user.fullName, id: request.user.id },
      };

      await this.mailService.submitProSkill(
        {
          ...mailData,
          skillName: response.skillName,
        },
        host,
        request.user.companyGroupCode,
      );
      return {
        ...response,
        code: 200,
      };
    }
    return {
      ...response,
    };
  }

  @Put('/cancel-version/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionCancelResponse,
  })
  async cancelVersion(
    @Param('versionId') versionId: number,
    @Req() req: Request,
    @Body() body: any,
  ) {
    return await this.proSkillSettingServices.cancelVersionPro(
      versionId,
      req.user.id,
      body.updated,
    );
  }

  @Get('/edit-pro-skill/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProSkillEditResponse,
  })
  async editProSkill(
    @Param('versionId') versionId: number,
    @Query() query,
    @Req() req: Request,
  ) {
    const data = await this.proSkillSettingServices.getEditProSkillVersion(
      versionId,
      req.user.id,
      req.user.companyGroupCode,
    );
    return data;
  }

  @Get('/history-approve/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: HistoryApproveResponse,
  })
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

  // @Get('/get-role-user')
  // async getRoleUser(@Query() query: any, @Req() req: Request) {
  //   const { departmentId, divisionId, type } = query;
  //   const userId = req.user.id;
  //   return await this.proSkillSettingServices.getRoleUser(
  //     departmentId,
  //     divisionId,
  //     userId,
  //     type,
  //   );
  // }

  @Post('/:skillId/create-initial-version')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: InitialVersionResponse,
  })
  async createInitialVersion(
    @Param('skillId') skillId: number,
    @Req() req: Request,
  ) {
    const response = await this.proSkillSettingServices.createNewVersionInit(
      req.body,
      req.user.id,
      skillId,
      req.user.companyGroupCode,
      req['user'].timeZone,
    );

    if (response.code === 200) {
      if (req.body.status === 3) {
        const data = {
          skillId: skillId,
          versionId: response.id,
          versionMain: response.version,
          versionSub: response.subVersion,
          skillName: response.skillName,
          createdUser: { fullName: req.user.fullName, id: req.user.id },
        };
        await this.mailService.submitProSkill(
          {
            ...data,
            skillName: response.skillName,
          },
          process.env.HOSTNAME_,
          req.user.companyGroupCode,
        );
      }
      return {
        ...response,
        fullName: req.user.fullName,
        skillId: skillId,
        skillName: response.skillName,
        skill: response.skill,
        creationUser: { fullName: req.user.fullName, id: req.user.id },
      };
    }
    return {
      ...response,
      fullName: req.user.fullName,
      skillId: skillId,
      creationUser: { fullName: req.user.fullName, id: req.user.id },
    };
  }

  @Get('/list-point-of-version/:skillId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ListPointResponse,
  })
  async listPointOfVersion(
    @Param('skillId') skillId: string,
    @Req() req: Request,
  ) {
    return await this.proSkillSettingServices.listPointByVersion(
      skillId,
      req.user.id,
      req.user.companyGroupCode,
    );
  }

  @Get('/check-permission/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PermissionResponse,
  })
  async checkPermissionSetterOfDepartment(
    @Req() req: Request,
    @Param('versionId') versionId: number,
  ) {
    const userId = req.user.id;
    return await this.proSkillSettingServices.checkPermissionSetterOfDepartment(
      userId,
      versionId,
    );
  }

  @Get('/get-version-public')
  @ApiResponse({
    status: HttpStatus.OK,
    type: VersionPublicResponse,
    isArray: true,
  })
  async getVersionPublic(@Req() req: Request) {
    const companyGroupCode = req.user.companyGroupCode;
    return await this.proSkillSettingServices.listVersionPublic(
      companyGroupCode,
    );
  }

  @Get('/detail-pro-skill-public/:versionId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: DetailProSkillPublicResponse,
  })
  async getDetailProSkill(@Param() param: ProSkillDetail, @Req() req: Request) {
    const data = await this.proSkillSettingServices.getDetailProSkillGeneric(
      param.versionId,
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

  @Get('/get-item-template-skill/:versionId')
  async listItemTemplateSkill(@Param() param: { versionId: number }) {
    const datas = await this.proSkillServices.getItemsTemplateProSkill(
      param.versionId,
    );

    return datas;
  }
}
