import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { CompanyRepository } from 'src/repository/company.repository';
import { DepartmentRepository } from 'src/repository/department.repository';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { ManagementUserRepository } from 'src/repository/managementUser.repository';
import { UserRepository } from 'src/repository/user.repository';
import { ApprovalService } from 'src/services/approval.service';
import { ManagemantUserServices } from 'src/services/managementUser.service';

describe('ManagetmentUserService', () => {
  let managementUserRepository: ManagementUserRepository;
  let managementUserService: ManagemantUserServices;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ManagementUserRepository,
        ManagemantUserServices,
        UserRepository,
        EvaluationRepository,
        DepartmentRepository,
        CompanyRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    managementUserRepository = moduleRef.get<ManagementUserRepository>(
      ManagementUserRepository,
    );
    managementUserService = moduleRef.get<ManagemantUserServices>(
      ManagemantUserServices,
    );
  });

  test('Add user', async () => {
    const results: any = {
      message: 'success',
    };
    const department: any = [
      {
        id: 44,
        code: '17113',
        name: '物流ｼｽﾃﾑ開発課',
        class: 0,
        type: 0,
        active: 1,
        createdTime: '2023-04-20T06:31:54.756Z',
        updatedTime: '2023-04-20T06:31:54.756Z',
      },
      false,
    ];
    const company: any = [
      {
        id: 48,
        name: '株式会社ゲオホールディングス',
        createdTime: '2023-04-19T06:53:59.558Z',
        updatedTime: '2023-04-19T06:53:59.558Z',
      },
      false,
    ];
    jest
      .spyOn(managementUserRepository, 'addDepartment')
      .mockImplementation(() => department);

    jest
      .spyOn(managementUserRepository, 'addCompany')
      .mockImplementation(() => company);
    jest
      .spyOn(managementUserRepository, 'addUser')
      .mockImplementation(() => results);
    expect(
      await managementUserService.addUser([
        {
          username: 'miki.sakamoto',
          fullName: '坂本 幹',
          department: 'ｼｽﾃﾑ管理課',
          departmentId: '01237',
          companyId: '0010',
          company: '株式会社ゲオホールディングス',
          email: 'miki.sakamoto@geonet.co.jp',
          employeeNumber: 201349,
        },
      ]),
    ).toMatchObject(results);
  });
});
