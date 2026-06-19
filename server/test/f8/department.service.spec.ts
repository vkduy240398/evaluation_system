import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { DepartmentRepository } from 'src/repository/department.repository';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { DepartmentService } from 'src/services/department.service';

describe('Department', () => {
  let deparmentRepository: DepartmentRepository;
  let departmentService: DepartmentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DepartmentRepository,
        DepartmentService,
        EvaluationPeriodRepository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    deparmentRepository =
      moduleRef.get<DepartmentRepository>(DepartmentRepository);
    departmentService = moduleRef.get<DepartmentService>(DepartmentService);
  });

  test('Add department', async () => {
    const results: any = {
      message: 'success',
    };
    jest
      .spyOn(deparmentRepository, 'createNewDivisionDepartment')
      .mockImplementation(() => results);
    expect(
      await departmentService.createNewDivisionDepartment([
        {
          id: 99,
          code: 'GNW-55555',
          name: 'Department 1',
          type: 1,
          active: 1,
          creatTime: '2023-04-18 06:06:05.477649+00',
          updatedTime: '2023-04-18 06:06:05.477649+00',
        },
      ]),
    ).toMatchObject(results);
  });

  // test('Edit department', async () => {
  //   const results: any = {
  //     message: 'success',
  //   };
  //   jest
  //     .spyOn(deparmentRepository, 'updateDepartmentForGNW')
  //     .mockImplementation(() => results);
  //   expect(
  //     await departmentService.updateDepartmentForGNW(1, [
  //       {
  //         id: 99,
  //         code: 'GNW-55555',
  //         name: 'Department 1',
  //         type: 1,
  //         active: 1,
  //         creatTime: '2023-04-18 06:06:05.477649+00',
  //         updatedTime: '2023-04-18 06:06:05.477649+00',
  //       },
  //     ]),
  //   ).toMatchObject(results);
  // });

  // test('Delete department', async () => {
  //   const results: any = {
  //     message: 'success',
  //   };
  //   jest
  //     .spyOn(deparmentRepository, 'deleteDepartment')
  //     .mockImplementation(() => results);
  //   expect(await departmentService.deleteDepartment(1, {})).toMatchObject(results);
  // });

  test('get All Department GNW', async () => {
    const results: any = {
      message: 'success',
    };
    jest
      .spyOn(deparmentRepository, 'getAllDepartmentGNW')
      .mockImplementation(() => results);
    expect(await departmentService.getAllDepartmentGNW()).toMatchObject(
      results,
    );
  });

  test('get All Department Type Department', async () => {
    const results: any = {
      message: 'success',
    };
    jest
      .spyOn(deparmentRepository, 'getAllDepartmentTypeDepartment')
      .mockImplementation(() => results);
    expect(
      await departmentService.getAllDepartmentTypeDepartment(),
    ).toMatchObject(results);
  });

  test('get All Department Type Division', async () => {
    const results: any = {
      message: 'success',
    };
    jest
      .spyOn(deparmentRepository, 'getAllDepartmentTypeDivision')
      .mockImplementation(() => results);
    expect(
      await departmentService.getAllDepartmentTypeDivision(),
    ).toMatchObject(results);
  });

  test('Search list department', async () => {
    const results: any = {
      message: 'success',
    };
    const query = {
      category: 'すべて',
      classification: 'すべて',
      departmentCodeAndName: '',
      limit: 20,
      offset: 0,
    };

    jest
      .spyOn(deparmentRepository, 'findListDepartment')
      .mockImplementation(() => results);
    expect(await departmentService.findListDepartment(query)).toMatchObject(
      results,
    );
  });
});
