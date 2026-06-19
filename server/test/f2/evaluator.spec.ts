import { Test } from '@nestjs/testing';
import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repository/user.repository';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { EvaluationService } from 'src/services/evaluation.service';
import { ApprovalService } from 'src/services/approval.service';
import { EvaluatorServices } from 'src/services/evaluator.service';
import { EvaluatorSearchInterfaces } from 'src/interfaces/evaluator.interfaces';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { EvaluatorRoleController } from 'src/controllers/f2/evaluator.controller';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { DepartmentRepository } from 'src/repository/department.repository';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { DepartmentService } from 'src/services/department.service';
import { VerifyTokenService } from 'src/services/verifyToken.service';
import { ProSkillSettingServices } from 'src/services/proSkillSetting.service';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { EvaluatorApprovalService } from 'src/services/evaluatorApproval.service';
import { caseHaveCreateEvaluation } from './mock';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { BasicBehaviorRepository } from 'src/repository/basicBehavior.repository';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { PointRepository } from 'src/repository/point.repository';
import { MailService } from 'src/services/mail.service';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { CustomLogger } from 'src/services/logger.service';
import { Evaluation17Service } from 'src/services/evaluation17.service';
import { Evaluation17Repository } from 'src/repository/evaluation17.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { ConfigAppModule } from 'src/config/AppModule';

describe('AppController', () => {
  let evaluatorRepository: EvaluatorRepository;
  let evaluatorServices: EvaluatorServices;
  let evaluatorRoleController: EvaluatorRoleController;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [EvaluatorRoleController],
      imports: [
        ConfigAppModule,
        CacheModule.register({ ttl: 300000, isGlobal: true }),
      ],
      providers: [
        UserRepository,
        EvaluationRepository,
        UserService,
        EvaluationService,
        EvaluatorRepository,
        ApprovalRepository,
        DepartmentRepository,
        ProSkillSettingRepository,
        ApprovalService,
        EvaluatorServices,
        JwtService,
        DepartmentService,
        VerifyTokenService,
        ProSkillSettingServices,
        EvaluatorApprovalService,
        EvaluationPeriodRepository,
        ProSkillRepository,
        BasicBehaviorRepository,
        AdminEvaluationRepository,
        PointRepository,
        MailService,
        VersionSettingRepository,
        CustomLogger,
        Evaluation17Service,
        Evaluation17Repository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        GuideEvaluationRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();
    evaluatorServices = moduleFixture.get<EvaluatorServices>(EvaluatorServices);
    evaluatorRoleController = moduleFixture.get<EvaluatorRoleController>(
      EvaluatorRoleController,
    );
    evaluatorRepository =
      moduleFixture.get<EvaluatorRepository>(EvaluatorRepository);
  });
  describe('evaluation', () => {
    it('get Haven"t created a target yet - Status 0', async () => {
      const query: EvaluatorSearchInterfaces = {
        email: '',
        department: 'すべて',
        evaluators: ['0.5', 1, 2],
        salaryRank: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        limit: 20,
        offset: 0,
        sortBy: 'periodStart',
        sortType: 'ASC',
        status: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
          60, 61, 98, 99, 100,
        ],
        evaluatorId: 1,
        title: '2022年上期',
      };
      const mocks = caseHaveCreateEvaluation;
      jest
        .spyOn(evaluatorRepository, 'listUserEvaluator')
        .mockImplementation(() => mocks);
      const results: any = mocks;
      const compares = [
        {
          evalutionId: '7',
          id: 'k5xim3wl',
          isInActive: true,
          summaryPointEvaluator2: null,
          title: '2022年上期',
          userId: 3,
          children: [
            {
              departmentName: '16745: GEO SYSTEM SOLUTIONS VIETNAM',
              divisionName: 'GNW-1002: GEO SYSTEM VN',
              evaluationId: '7',
              evaluationOrder: '2.0',
              evaluatorId: 1,
              fullName: 'Vo Thi Huyen Trang',
              isInActive: true,
              level: 1,
              periodEnd: '2023/4',
              periodStart: '2022/9',
              status: 0,
              summaryPointEvaluator2: null,
              title: '2022/9 ～ 2023/4',
              userId: 3,
              stringStatus: '【目標】未作成',
            },
            {
              departmentName: '16745: GEO SYSTEM SOLUTIONS VIETNAM',
              divisionName: '1003: GEO SYSTEM SOLUTION',
              evaluationId: '5',
              evaluationOrder: '0.5',
              evaluatorId: 1,
              fullName: 'Vo Thi Huyen Trang',
              isInActive: true,
              level: 8,
              periodEnd: '2023/4',
              periodStart: '2022/9',
              status: 1,
              summaryPointEvaluator2: '0.00',
              title: '2022/9 ～ 2023/4',
              userId: 3,
              stringStatus: '【目標】作成中',
            },
          ],
        },
      ];
      const dataCompares = mocks;
      expect(results).toBe(dataCompares);
    });

    it('get Haven"t created a target yet - Status 1', async () => {
      const query: EvaluatorSearchInterfaces = {
        email: '',
        department: 'すべて',
        evaluators: ['0.5', 1, 2],
        salaryRank: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        limit: 20,
        offset: 0,
        sortBy: 'periodStart',
        sortType: 'ASC',
        status: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
          60, 61, 98, 99, 100,
        ],
        evaluatorId: 1,
        title: '2022年上期',
      };
      const mocks = caseHaveCreateEvaluation;
      jest
        .spyOn(evaluatorRepository, 'listUserEvaluator')
        .mockImplementation(() => mocks);
      const results: any = mocks;
      const compares = [
        {
          evalutionId: '7',
          id: 'k5xim3wl',
          isInActive: true,
          summaryPointEvaluator2: null,
          title: '2022年上期',
          userId: 3,
          children: [
            {
              departmentName: '16745: GEO SYSTEM SOLUTIONS VIETNAM',
              divisionName: 'GNW-1002: GEO SYSTEM VN',
              evaluationId: '7',
              evaluationOrder: '2.0',
              evaluatorId: 1,
              fullName: 'Vo Thi Huyen Trang',
              isInActive: true,
              level: 1,
              periodEnd: '2023/4',
              periodStart: '2022/9',
              status: 1,
              summaryPointEvaluator2: null,
              title: '2022/9 ～ 2023/4',
              userId: 3,
              stringStatus: '【目標】作成中',
            },
            {
              departmentName: '16745: GEO SYSTEM SOLUTIONS VIETNAM',
              divisionName: '1003: GEO SYSTEM SOLUTION',
              evaluationId: '5',
              evaluationOrder: '0.5',
              evaluatorId: 1,
              fullName: 'Vo Thi Huyen Trang',
              isInActive: true,
              level: 8,
              periodEnd: '2023/4',
              periodStart: '2022/9',
              status: 1,
              summaryPointEvaluator2: '0.00',
              title: '2022/9 ～ 2023/4',
              userId: 3,
              stringStatus: '【目標】作成中',
            },
          ],
        },
      ];
      const dataCompares = mocks;
      expect(results).toBe(dataCompares);
    });
  });
});
