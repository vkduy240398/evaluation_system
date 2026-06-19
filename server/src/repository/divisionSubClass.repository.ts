import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { Department } from 'src/entity/Department';
import { DivisionSubclass } from 'src/entity/DivisionSubclass';

@Injectable()
export class DivisionSubClassRepository {
  @Inject(EntityConstant.DIVISION_SUBCLASS)
  private divisionSubclassEntity: typeof DivisionSubclass;

  async getDepartmentIdByCondition(where: {
    [x: string]: any;
  }): Promise<DivisionSubclass[]> {
    return await this.divisionSubclassEntity.findAll({
      where: where,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'code', 'name', 'type'],
        },
      ],
      limit: 20,
    });
  }

  async findOneDepartmentIdByCondition(where: {
    [x: string]: any;
  }): Promise<DivisionSubclass> {
    return await this.divisionSubclassEntity.findOne({
      where: where,
      include: [
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name', 'type'],
        },
      ],
    });
  }

  async getParentOfDepartment(id: any): Promise<DivisionSubclass> {
    return await this.divisionSubclassEntity.findOne({
      where: { departmentId: id },
      include: [
        {
          model: Department,
          as: 'division',
          attributes: ['id', 'code', 'name', 'type'],
          where: {
            active: 1,
          },
        },
      ],
    });
  }
}
