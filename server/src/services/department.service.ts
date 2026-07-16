import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DepartmentRepository } from 'src/repository/department.repository';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { DepartmentUpdateRequestDto } from 'src/model/request/DepartmentRequestDto';
import { PeriodDTO } from 'src/model/request/ExceptionPeriodRequestDto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
@Injectable()
export class DepartmentService {
  @Inject(DepartmentRepository)
  private departmentRepo: DepartmentRepository;

  async createNewDivisionDepartment(
    department: any,
    companyGroupCode?: string,
  ) {
    return await this.departmentRepo.createNewDivisionDepartment(
      department,
      companyGroupCode,
    );
  }

  async addDivisionSub(data: any) {
    return await this.departmentRepo.addDivisionSub(data);
  }

  async updateDepartmentForGNW(
    id: any,
    department: DepartmentUpdateRequestDto,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const data = await this.departmentRepo.getDepartmentUpdateTime(
      id,
      companyGroupCode,
    );
    if (!data)
      throw new RuntimeException('Department not found', HttpStatus.NOT_FOUND);
    if (department.updatedTime !== data?.updatedTime.toISOString())
      throw new RuntimeException('Department is duplicate', 409);

    return await this.departmentRepo.updateDepartmentForGNW(
      id,
      department,
      data,
      companyGroupCode,
      timeZone,
    );
  }

  async findListDepartment(query: any, companyGroupCode?: string) {
    return await this.departmentRepo.findListDepartment(
      query,
      companyGroupCode,
    );
  }

  async getAllDepartment(companyGroupCode: string) {
    return await this.departmentRepo.getAllDepartment(companyGroupCode);
  }

  async getAllDepartmentNotSetDivision(companyGroupCode: string) {
    return await this.departmentRepo.getAllDepartmentNotSetDivision(
      companyGroupCode,
    );
  }

  async getAllDepartmentGNW(companyGroupCode: string) {
    return await this.departmentRepo.getAllDepartmentGNW(companyGroupCode);
  }

  async getAllDepartmentTypeDepartment(companyGroupCode: string) {
    return await this.departmentRepo.getAllDepartmentTypeDepartment(
      companyGroupCode,
    );
  }

  async getAllDepartmentNotGroup(companyGroupCode: string) {
    return await this.departmentRepo.getAllDepartmentNotGroup(companyGroupCode);
  }

  async getAllDepartmentTypeDivision(companyGroupCode: string) {
    const divisions = await this.departmentRepo.getAllDepartmentTypeDivision(
      companyGroupCode,
    );

    return divisions;
  }

  async getAllDivisionDepartment(companyGroupCode: string) {
    const divisions = await this.departmentRepo.getAllDivisionDepartment(
      companyGroupCode,
    );
    const results: {
      divisionId: number;
      code: string;
      name: string;
      childrens: any[];
    }[] = [];

    // return divisions;

    for (let i = 0; i < divisions.length; i++) {
      const division = divisions[i];
      const childrens = division.divisionSubclass
        .filter((f) => f.department !== null)
        .map((v) => ({
          id: v.departmentId,
          code: v?.department.code,
          name: v?.department.name,
          codeName: `${v?.department.name}`,
        }));
      const item: {
        divisionId: number;
        code: string;
        name: string;
        codeName: string;
        childrens: any[];
      } = {
        divisionId: division.id,
        code: division.code,
        name: division.name,
        codeName: `${division.name}`,
        childrens,
      };

      results.push(item);
    }

    return results;
  }

  async getUserDivisionAndDepartment(userId: number) {
    const divisionInfo = await this.departmentRepo.getUserDivision(userId);
    if (!divisionInfo.departmentId) {
      const departmentInfos =
        await this.departmentRepo.getSubDepartmentListByDivisionId(
          divisionInfo.division.id,
        );

      return { division: divisionInfo.division, department: departmentInfos };
    } else {
      const departmentInfo = await this.departmentRepo.getDepartmentById(
        divisionInfo.departmentId,
      );
      return { division: divisionInfo.division, department: departmentInfo };
    }
  }

  async mergeDivision(companyGroupCode: string) {
    // const oracleOptionList = await this.oracleRepo.getDepartment();
    const systemOptionList =
      await this.departmentRepo.getAllDepartmentTypeDivision(companyGroupCode);

    return systemOptionList;
  }

  async deleteDepartment(id: any, department: any, companyGroupCode?: string) {
    const data = await this.departmentRepo.getDepartmentUpdateTime(
      id,
      companyGroupCode,
    );
    if (!data)
      throw new RuntimeException('Department not found', HttpStatus.NOT_FOUND);
    if (department && department.updateTime !== data?.updatedTime.toISOString())
      throw new RuntimeException('Department is duplicate', 409);

    // ** Update groups, if the department deleted then remove department in group
    return await this.departmentRepo.deleteDepartment(
      id,
      data,
      companyGroupCode,
    );
  }

  async getDepartmentById(id: any) {
    return await this.departmentRepo.getDepartmentById(id);
  }

  async getOptionDepartment(
    query: PeriodDTO,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const results: { label: string; value: any; type: any }[] = [];

    // get lịch sử update department name
    const oldDepartments = await this.departmentRepo.getHistoryUpdateDepartment(
      query.year,
      query.periodIndex,
      companyGroupCode,
      timeZone
    );

    if (oldDepartments && oldDepartments[0]?.length > 0) {
      results.push(
        ...oldDepartments[0].map((v) => ({
          label: `${v.departmentName}`,
          value: v.departmentId,
          type: v.type,
        })),
      );
    }

    const departments = await this.departmentRepo.getAllDepartment(
      companyGroupCode,
    );
    if (departments.length > 0) {
      // Tạo tập hợp chứa departmentId từ oldDepartments
      const existingDepartmentIds =
        oldDepartments && oldDepartments[0]?.length > 0
          ? new Set(oldDepartments[0]?.map((v) => v.departmentId))
          : undefined;

      const filteredDepartments = !existingDepartmentIds
        ? departments
        : departments.filter((v) => !existingDepartmentIds.has(v.id));
      results.push(
        ...filteredDepartments.map((v) => ({
          label: `${v.name}`,
          value: v.id,
          type: v.type,
        })),
      );
    }

    const uniqueItems = [];
    const labelsSeen = new Set();

    // loại bỏ các department giống nhau
    results.forEach((item) => {
      if (!labelsSeen.has(item.label)) {
        labelsSeen.add(item.label);
        uniqueItems.push(item);
      }
    });

    // sort tên phòng ban tăng dần
    const sortedUniqueItems = uniqueItems.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });

    return sortedUniqueItems;
  }
  async getListSubDepartment(
    query: any,
    id: number,
    companyGroupCode?: string,
  ) {
    return await this.departmentRepo.getListSubDepartment(
      query,
      id,
      companyGroupCode,
    );
  }
  async getSubDepartmentListByDivisionId(id: number) {
    return await this.departmentRepo.getSubDepartmentListByDivisionId(id);
  }

  async getAllSkill(companyGroupCode: string) {
    return await this.departmentRepo.getAllSkill(companyGroupCode);
  }
}

/**
 * Note
 * class => 0 : create from oracle, 1 : manual create
 * type => 0 : department, 1 : division
 * active => 0 : inactive, 1 : active
 */
