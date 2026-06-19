/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { DepartmentRepository } from 'src/repository/department.repository';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';

// giống test code history approval của F3
describe('historyApproveF3', () => {
  let proSkillRepository: ProSkillSettingRepository;
  let proSkillService: ProSkillSettingServices;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProSkillSettingRepository,
        ProSkillSettingServices,
        AdminEvaluationRepository,
        VersionSettingRepository,
        DepartmentRepository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    proSkillRepository = moduleRef.get<ProSkillSettingRepository>(
      ProSkillSettingRepository,
    );
    proSkillService = moduleRef.get<ProSkillSettingServices>(
      ProSkillSettingServices,
    );
  });

  test('content with data', async () => {
    const mockData: any = {
      id: 110,
      version: 1,
      subVersion: 1,
      skillId: 1,
      status: 3,
      creationUser: 94,
      reason: 'scsc',
      publicStatus: 0,
      publicDate: '2023/3/3',
      createdTime: '2023-06-06T09:38:48.569Z',
      updatedTime: '2023-06-09T08:25:53.159Z',
      // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
      skill_id: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
      creation_user: 94,
      skill: {
        id: 1,
        name: '5435435 dfsdvcs',
      },
    };
    const mockData2: any = [
      {
        skillId: 1,
        userId: 3,
        role: 1,
        createdTime: '2023-06-09T10:00:17.160Z',
        updatedTime: '2023-06-09T10:00:17.160Z',
        user_id: 3,
      },
    ];
    const mockData3: any = [
      {
        versionId: 110,
        comment: 'dasdad',
        status: '承認',
        creationUser: 3,
        createdTime: '2023-06-09T08:25:53.228Z',
        updatedTime: '2023-06-09T08:25:53.228Z',
        creation_user: 3,
        version_id: 110,
        user: {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
        },
      },
      {
        versionId: 110,
        comment: 'eo duyet',
        status: '差戻',
        creationUser: 96,
        createdTime: '2023-06-09T07:40:19.144Z',
        updatedTime: '2023-06-09T07:40:19.144Z',
        // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
        creation_user: 96,
        // eslint-disable-next-line camelcase
        version_id: 110,
        user: {
          id: 96,
          fullName: 'Nguyen HoangThien',
        },
      },
      {
        versionId: 110,
        comment: null,
        status: '承認',
        creationUser: 96,
        createdTime: '2023-06-08T08:36:29.083Z',
        updatedTime: '2023-06-08T08:36:29.083Z',
        creation_user: 96,
        version_id: 110,
        user: {
          id: 96,
          fullName: 'Nguyen HoangThien',
        },
      },
      {
        versionId: 110,
        comment: 'dvdv',
        status: '差戻',
        creationUser: 96,
        createdTime: '2023-06-08T02:35:26.221Z',
        updatedTime: '2023-06-08T02:35:26.221Z',
        creation_user: 96,
        version_id: 110,
        user: {
          id: 96,
          fullName: 'Nguyen HoangThien',
        },
      },
      {
        versionId: 110,
        comment: null,
        status: '承認',
        creationUser: 96,
        createdTime: '2023-06-08T01:52:39.617Z',
        updatedTime: '2023-06-08T01:52:39.617Z',
        creation_user: 96,
        version_id: 110,
        user: {
          id: 96,
          fullName: 'Nguyen HoangThien',
        },
      },
    ];

    jest
      .spyOn(proSkillRepository, 'getDetailProSkill')
      .mockImplementation(() => mockData);
    jest
      .spyOn(proSkillRepository, 'getSkillRole')
      .mockImplementation(() => mockData2);
    jest
      .spyOn(proSkillRepository, 'getHistoryApproveContent')
      .mockImplementation(() => mockData3);

    const results = await proSkillService.getHistoryApproveContent(3, 110);
    const compares: any = {
      info: {
        version: '1.1',
        skill: '5435435 dfsdvcs',
      },
      approvalHistories: [
        {
          approverUser: {
            id: 3,
            fullName: 'Vo Thi Huyen Trang',
          },
          createdTime: '2023-06-09T08:25:53.228Z',
          comment: 'dasdad',
          status: '承認',
        },
        {
          approverUser: {
            id: 96,
            fullName: 'Nguyen HoangThien',
          },
          createdTime: '2023-06-09T07:40:19.144Z',
          comment: 'eo duyet',
          status: '差戻',
        },
        {
          approverUser: {
            id: 96,
            fullName: 'Nguyen HoangThien',
          },
          createdTime: '2023-06-08T08:36:29.083Z',
          comment: null,
          status: '承認',
        },
        {
          approverUser: {
            id: 96,
            fullName: 'Nguyen HoangThien',
          },
          createdTime: '2023-06-08T02:35:26.221Z',
          comment: 'dvdv',
          status: '差戻',
        },
        {
          approverUser: {
            id: 96,
            fullName: 'Nguyen HoangThien',
          },
          createdTime: '2023-06-08T01:52:39.617Z',
          comment: null,
          status: '承認',
        },
      ],
    };
    expect(results).toEqual(compares);
  });
  test('empty content', async () => {
    const mockData: any = {
      id: 117,
      version: 1,
      subVersion: 7,
      skillId: 12,
      status: 3,
      creationUser: 1,
      reason: null,
      publicStatus: 0,
      publicDate: null,
      createdTime: '2023-06-12T04:00:51.793Z',
      updatedTime: '2023-06-12T04:04:48.307Z',
      skill_id: 12,
      creation_user: 1,
      skill: {
        id: 12,
        name: '経理1課',
      },
    };
    const mockData2: any = [
      {
        skillId: 12,
        userId: 3,
        role: 1,
        createdTime: '2023-06-09T10:00:17.160Z',
        updatedTime: '2023-06-09T10:00:17.160Z',
        user_id: 3,
      },
    ];
    const mockData3: any = [];

    jest
      .spyOn(proSkillRepository, 'getDetailProSkill')
      .mockImplementation(() => mockData);
    jest
      .spyOn(proSkillRepository, 'getSkillRole')
      .mockImplementation(() => mockData2);
    jest
      .spyOn(proSkillRepository, 'getHistoryApproveContent')
      .mockImplementation(() => mockData3);

    const results = await proSkillService.getHistoryApproveContent(3, 110);
    const compares: any = {
      info: { version: '1.7', skill: '経理1課' },
      approvalHistories: [],
    };
    expect(results).toEqual(compares);
  });
  test('NOT allow (version is NOT public and not in table department_role)', async () => {
    const mockData: any = {
      id: 117,
      version: 1,
      subVersion: 7,
      skillId: 12,
      status: 3,
      creationUser: 1,
      reason: null,
      publicStatus: 0,
      publicDate: null,
      createdTime: '2023-06-12T04:00:51.793Z',
      updatedTime: '2023-06-12T04:04:48.307Z',
      skill_id: 12,
      creation_user: 1,
      skill: {
        id: 12,
        name: '経理1課',
      },
    };
    const mockData2: any = [];
    const mockData3: any = [];

    jest
      .spyOn(proSkillRepository, 'getDetailProSkill')
      .mockImplementation(() => mockData);
    jest
      .spyOn(proSkillRepository, 'getSkillRole')
      .mockImplementation(() => mockData2);
    jest
      .spyOn(proSkillRepository, 'getHistoryApproveContent')
      .mockImplementation(() => mockData3);

    try {
      await proSkillService.getHistoryApproveContent(3, 110);
    } catch (error) {
      expect(error).toHaveProperty('message', 'Unauthorized user');
    }
  });
  test('version is public (statusPublic=1) and has role F3/F4 and NOT in table department_role', async () => {
    const mockData: any = {
      id: 117,
      version: 1,
      subVersion: 7,
      skillId: 12,
      status: 3,
      creationUser: 1,
      reason: null,
      publicStatus: 1,
      publicDate: null,
      createdTime: '2023-06-12T04:00:51.793Z',
      updatedTime: '2023-06-12T04:04:48.307Z',
      skill_id: 12,
      creation_user: 1,
      skill: {
        id: 12,
        name: '経理1課',
      },
    };
    const mockData2: any = [];
    const mockData3: any = [];

    jest
      .spyOn(proSkillRepository, 'getDetailProSkill')
      .mockImplementation(() => mockData);
    jest
      .spyOn(proSkillRepository, 'getSkillRole')
      .mockImplementation(() => mockData2);
    jest
      .spyOn(proSkillRepository, 'getHistoryApproveContent')
      .mockImplementation(() => mockData3);

    const results = await proSkillService.getHistoryApproveContent(3, 110);
    const compares: any = {
      info: { version: '1.7', skill: '経理1課' },
      approvalHistories: [],
    };
    expect(results).toEqual(compares);
  });
});
