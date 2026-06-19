/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { UserService } from 'src/services/user.service';
import { MailService } from 'src/services/mail.service';
import { GetMailHistoryListDTO } from 'src/model/request/ExceptionPeriodRequestDto';
import { Request } from 'express';
import {
  EditMailTemplateObj,
  GetMailTemplateListDTO,
} from 'src/model/request/MailManagementDto';

@Controller('v1/f7/management-evaluation-setting')
@Authorize(Roles.F7)
@UseGuards(RolesGuard)
@ApiTags(Tag.F7)
export class ManagementEvaluationSettingRoleController {
  @Inject(UserService)
  private userService: UserService;

  @Inject(MailService)
  private mailService: MailService;

  @Post('/users-email-list')
  async getUsersEmailList(@Body() conditions: any, @Req() req: Request) {
    return await this.userService.getUsersEmailList(
      conditions.conditions,
      req.user.companyGroupCode,
    );
  }

  @Get('/mail-history-list')
  async getMailHistoryList(
    @Query() query: GetMailHistoryListDTO,
    @Req() req: Request,
  ) {
    return await this.mailService.getMailHistoryList(query, req);
  }
  @Put('/update-mail-history/:id')
  async updateMailHistory(
    @Body() body: any,
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return await this.mailService.updateMailHistory(body, id, req);
  }
  @Delete('/delete-mail/:id')
  async deleteMail(@Param('id') id: number) {
    return await this.mailService.deleteMail(id);
  }

  @Post('/import-user-from-excel')
  async importUserFromExcel(@Body() body: any) {
    return await this.userService.importUserFromExcel(body);
  }

  @Get('/mail-template-list')
  async getMailTemplateList(
    @Query() query: GetMailTemplateListDTO,
    @Req() req: Request,
  ) {
    return await this.mailService.getMailTemplateList(query, req);
  }

  @Get('/mail-template-list-by-id')
  async getMailTemplateListById(@Query() query: any, @Req() req: Request) {
    return await this.mailService.getMailTemplateListById(query, req);
  }

  @Put('/edit-mail-template')
  async editMailTemplate(
    @Body() body: EditMailTemplateObj,
    @Req() req: Request,
  ) {
    return await this.mailService.editMailTemplate(body, req);
  }
}
