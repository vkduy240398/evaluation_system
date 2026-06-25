import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/enum/Roles';
import { Tag } from 'src/enum/Tag';
import { Authorize } from 'src/handler/annotation/Authorization';
import { RolesGuard } from 'src/handler/guard/role.guard';
import {
  DepartmentSearchInterfaces,
  UserSearchInterfaces,
} from 'src/interfaces/user.interfaces';
import {
  DeleteDepartment,
  DepartmentRequestAdd,
  DepartmentRequestDto,
  DepartmentSearchRequestDto,
  DepartmentUpdateRequestDto,
  DivisionSubclassRequestDTO,
  RequestEditDepartmentGnw,
} from 'src/model/request/DepartmentRequestDto';
import {
  DataAddUserOracleDb,
  RequestDeleteUser,
  RequestFindSubDepartment,
  RequestUpdatedUser,
  UserSearchRequestDto,
} from 'src/model/request/UserRequestDto';
import { DepartmentService } from 'src/services/department.service';
import { ManagemantUserServices } from 'src/services/managementUser.service';
import OracleService from 'src/services/oracle.service';
import { UserService } from 'src/services/user.service';
import { EditUserRequestDto } from 'src/model/request/managementUser.Dto';
import {
  GetDepartmentGnw,
  GetListDepartment,
  ListDepartment,
  ListDepartmentOracle,
  ListDepartmentOracleMerge,
  ListDepartmentSub,
  ResponseFindSubDepartment,
  ResultsAddDepartment,
} from 'src/model/response/DepartmentDto';
import {
  CompanyResponse,
  FindUser,
  GetUserDataOracleDb,
  ResponseDetailUser,
  ResponseUpdatedUser,
  ResultsAddUserOracle,
} from 'src/model/response/UserResponse';
import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
import { Request } from 'express';
import { EvaluationPeriodService } from 'src/services/evaluationPeriod.service';

@Controller('v1/f8/management-user')
@Authorize(Roles.F8)
@UseGuards(RolesGuard)
@ApiTags(Tag.F8)
export class ManagementUserRoleController {
  constructor(
    private departmentService: DepartmentService,
    private evaluationPeriodService: EvaluationPeriodService,
    private oracleService: OracleService,
    private managementUserService: ManagemantUserServices,
    private userService: UserService,
  ) {
    //
  }

  @Get('/find-department')
  @ApiQuery({
    type: DepartmentSearchRequestDto,
  })
  @ApiResponse({
    type: ListDepartment,
  })
  getData(@Query() query: DepartmentSearchRequestDto, @Req() req: Request) {
    const params: DepartmentSearchInterfaces = {
      catergory: query.catergory,
      classification: query.classification,
      departmentCodeAndName: query.departmentCodeAndName,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
    };
    return this.departmentService.findListDepartment(
      params,
      req.user.companyGroupCode,
    );
  }

  @Get('/get-all-department-gnw')
  @ApiResponse({
    type: GetDepartmentGnw,
    isArray: true,
  })
  getAllDepartmentGNW(@Req() req: Request) {
    return this.departmentService.getAllDepartmentGNW(
      req.user.companyGroupCode,
    );
  }

  @Get('/get-list')
  @ApiResponse({
    type: GetListDepartment,
    isArray: true,
  })
  getAllDepartment(@Req() req: Request) {
    return this.departmentService.getAllDepartment(req.user.companyGroupCode);
  }

  @Post('/add-division-deparment')
  @ApiBody({
    type: DepartmentRequestAdd,
  })
  @ApiResponse({
    type: ResultsAddDepartment,
  })
  createNewDepartmentOfGNW(
    @Body() newDepartmentGNW: DepartmentRequestDto,
    @Req() req: Request,
  ) {
    return this.departmentService.createNewDivisionDepartment(
      newDepartmentGNW,
      req.user.companyGroupCode,
    );
  }

  @Post('/add-division-sub')
  addDivisionSub(@Body() data: DivisionSubclassRequestDTO) {
    return this.departmentService.addDivisionSub(data);
  }

  @Put('/edit-deparment-gnw/:id')
  @ApiBody({
    type: RequestEditDepartmentGnw,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  updateNewDepartmentOfGNW(
    @Param('id') id: string,
    @Body() departmentGNW: DepartmentUpdateRequestDto,
    @Req() req: Request,
  ) {
    return this.departmentService.updateDepartmentForGNW(
      id,
      departmentGNW,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: DeleteDepartment,
  })
  @ApiResponse({
    status: 200,
  })
  @Put('/delete-deparment/:id')
  deleteDepartment(
    @Param('id') id: string,
    @Body() department: any,
    @Req() req: Request,
  ) {
    return this.departmentService.deleteDepartment(
      id,
      department,
      req.user.companyGroupCode,
    );
  }

  @ApiResponse({
    type: ListDepartmentOracle,
    isArray: true,
  })
  @Get('/get-department-oracledb')
  async getDepartmentOracleDb() {
    return await this.oracleService.getDepartment();
  }

  @ApiResponse({
    type: ListDepartmentOracleMerge,
    isArray: true,
  })
  @Get('/get-division-department-oracledb-merge')
  async getDivisionDepartmentOracleDb(@Req() req: Request) {
    return await this.departmentService.mergeDivision(
      req.user.companyGroupCode,
    );
  }

  @ApiResponse({
    type: GetUserDataOracleDb,
    isArray: true,
  })
  @Get('/get-user-data-oracleDb')
  async getUserDataOracleDb(
    @Query() query: GetUserDataOracleDto,
    @Req() req: Request,
  ) {
    return await this.oracleService.getUserDataOracleDb(
      query,
      req.user.companyGroupCode,
    );
  }

  @ApiBody({
    type: DataAddUserOracleDb,
    isArray: true,
  })
  @ApiResponse({
    type: ResultsAddUserOracle,
  })
  @Post('/add-user')
  async addUser(@Body() body: any, @Req() req: Request) {
    return await this.managementUserService.addUser(
      body.data,
      req.user.companyGroupCode,
    );
  }

  @ApiQuery({
    type: UserSearchRequestDto,
  })
  @ApiResponse({
    type: FindUser,
  })
  @Get('/find-user')
  searchListUser(@Query() query: UserSearchRequestDto, @Req() req: Request) {
    const departments: any =
      query.department !== 'すべて' && query.department !== '_blank'
        ? query.department.split(':')
        : query.department;

    const divisions: any =
      query.division !== 'すべて' && query.division !== '_blank'
        ? query.division.split(':')
        : query.division;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type

    const params: UserSearchInterfaces = {
      nameAndEmail: query.nameAndEmail,
      department: departments,
      division: divisions,
      company: query.company,
      role: query.role,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      skill: query.skill,
      companyGroupCode: req.user.companyGroupCode,
      level: query.level,
    };
    return this.userService.getListUser(params);
  }
  @ApiResponse({
    type: FindUser,
  })
  @Get('/user-list')
  userList(@Query() query: any, @Req() req: Request) {
    const departments: any =
      query.department &&
      query.department !== '-1' &&
      query.department !== '_blank'
        ? query.department.split(':')
        : query.department;

    const divisions: any =
      query.division !== '-1' && query.division !== '_blank'
        ? query.division.split(':')
        : query.division;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type

    const params: UserSearchInterfaces = {
      nameAndEmail: query.nameAndEmail,
      department: departments,
      division: divisions,
      company: query.company,
      role: query.role,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      skill: query.skill,
      companyGroupCode: req.user.companyGroupCode,
      level: query.level,
    };
    return this.userService.getListUser(params);
  }
  @Put('/delete-user')
  @ApiBody({
    type: RequestDeleteUser,
  })
  @ApiResponse({
    status: 200,
  })
  deleteListUser(@Body() query: any, @Req() req: Request) {
    return this.userService.deleteListUser(
      query.selectedRowKeys,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @ApiBody({
    type: RequestUpdatedUser,
  })
  @ApiResponse({ type: ResponseUpdatedUser })
  @Put('/update-user')
  updateListUser(@Body() query: any, @Req() req: Request) {
    // return this.managementUserService.updateListUser(query);
    return this.managementUserService.updateListUserProcedure(
      query,
      req.user.companyGroupCode,
      req.user.timeZone,
      req.user.id,
    );
  }

  //
  @ApiResponse({
    status: 200,
  })
  @Put('/edit-user')
  updateOneUser(@Body() body: EditUserRequestDto, @Req() req: Request) {
    const {
      userId,
      company,
      department,
      division,
      level,
      levelOld,
      roles,
      isChangeRoleF2,
      isChangeRoleF3,
      isChangeRoleF4,
      typeChangeRoleF1,
      updatedTime,
      radioLevelvalue,
      flagSkillValue,
      oldFlagSkill,
      fullName,
    } = body;
    // return this.managementUserService.updateOneUser(
    return this.managementUserService.updateOneUserProcedure(
      userId,
      company,
      department,
      division,
      level,
      levelOld,
      roles,
      isChangeRoleF2,
      isChangeRoleF3,
      isChangeRoleF4,
      typeChangeRoleF1,
      updatedTime,
      radioLevelvalue,
      flagSkillValue,
      oldFlagSkill,
      req.user.companyGroupCode,
      req.user.timeZone,
      req.user.id,
      fullName,
    );
  }

  @ApiQuery({ name: 'id', type: String })
  @ApiResponse({ type: ResponseDetailUser })
  @Get('/get-user-detail-by-id')
  async getUserDetailById(@Query() query: any) {
    const result = await this.userService.getUserDetailById(query.id);

    return result;
  }

  @ApiQuery({ name: 'id', type: String })
  // @ApiResponse({ type: ResponseDetailUser })
  @Get('/get-evaluation-by-user')
  async getEvaluationByUserId(@Query() query: any, @Req() req: Request) {
    const result = await this.userService.getEvaluationByUserId(
      query.id,
      req.user.companyGroupCode,
    );
    return result;
  }

  @Get('/find-sub-department')
  @ApiQuery({
    type: RequestFindSubDepartment,
  })
  @ApiResponse({
    type: ResponseFindSubDepartment,
  })
  async getSubDepartmentData(@Query() query: any, @Req() req: Request) {
    const params = {
      departmentCodeAndName: query.departmentCodeAndName || null,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
    };
    return await this.departmentService.getListSubDepartment(
      params,
      query.divisionId,
      req.user.companyGroupCode,
    );
  }

  @Get('/sub-department-list/:divisionId')
  async getSubDepartmentListByDivisionId(
    @Param('divisionId') divisionId: number,
  ) {
    return await this.departmentService.getSubDepartmentListByDivisionId(
      divisionId,
    );
  }

  @ApiResponse({ isArray: true, type: ListDepartmentSub })
  @Get('/list-division')
  async getListDivision(@Req() req: Request) {
    return await this.departmentService.getAllDepartmentTypeDivision(
      req.user.companyGroupCode,
    );
  }

  @ApiResponse({ isArray: true, type: CompanyResponse })
  @Get('/get-company-oracledb')
  async getCompanyOracleDb() {
    return await this.oracleService.getCompany();
  }

  @Get('/export-list-user')
  async exportListUser(
    @Query() query: UserSearchRequestDto,
    @Res() res,
    @Req() req: Request,
  ) {
    // Bug 6 fix: thêm guard query.department để tránh undefined.split(':') crash
    // khi chỉ chọn company mà không chọn division/department (department không có trong URL).
    const departments: any =
      query.department && query.department !== '-1' && query.department !== '_blank'
        ? query.department.split(':')
        : query.department;

    const divisions: any =
      query.division !== '-1' && query.division !== '_blank'
        ? query.division.split(':')
        : query.division;

    const skill: any = query.skill;
    // deparments 0 => Id , 1=> code, 2 => name, 3 => type
    const params: UserSearchInterfaces = {
      nameAndEmail: query.nameAndEmail,
      department: departments,
      division: divisions,
      company: query.company,
      role: query.role,
      offset: query.offset,
      limit: query.limit,
      sortBy: query.sortBy,
      sortType: query.sortType,
      skill: skill,
      companyGroupCode: req.user.companyGroupCode,
      level: query.level,
    };
    const buffer = await this.userService.exportListUser(params);

    res.send(buffer);
  }

  @Put('/confirm-edit-one-user')
  async confirmEditOneUser(@Body() query: any, @Req() req: Request) {
    const {
      userId,
      company,
      department,
      division,
      level,
      levelOld,
      roles,
      radioLevelvalue,
      flagSkillValue,
      oldFlagSkill,
    } = query.dataChange;

    return await this.managementUserService.confirmEditOneUser(
      userId,
      company,
      department,
      division,
      level,
      levelOld,
      roles,
      radioLevelvalue,
      flagSkillValue,
      oldFlagSkill,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Put('/confirm-edit-list-user')
  async confirmEditListUser(@Body() query: any, @Req() req: Request) {
    return await this.managementUserService.confirmEditListUser(
      query.dataChange,
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/getEvaluationPeriod')
  async getEvaluationPeriod(@Req() req: Request) {
    return await this.evaluationPeriodService.getEvaluationPeriodCurrent(
      req.user.companyGroupCode,
      req.user.timeZone,
    );
  }

  @Get('/get-history-update-user/:id')
  async getHistoryUpdateUser(@Param('id') id: string, @Req() req: Request) {
    return await this.managementUserService.historyUpdateUserList(
      req.user.companyGroupCode,
      id,
    );
  }

  @Put('/change-role-user')
  async changeRoleUser(@Body() query: any, @Req() req: Request) {
    const {
      userId,
      newRole,
      isChangeRoleF2,
      isChangeRoleF3,
      isChangeRoleF4,
      typeChangeRoleF1,
    } = query;

    return await this.managementUserService.changeRoleUserManagement(
      userId,
      newRole,
      req.user.companyGroupCode,
      isChangeRoleF2,
      isChangeRoleF3,
      isChangeRoleF4,
      typeChangeRoleF1,
      req.user.timeZone,
    );
  }

  @Put('/update-full-name')
  async updateFullName(@Body() query: any, @Req() req: Request) {
    const { userId, fullName } = query;
    return await this.managementUserService.updateFullNameUser(
      userId,
      fullName,
    );
  }
}
