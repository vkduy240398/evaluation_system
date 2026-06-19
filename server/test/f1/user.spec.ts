import { Test } from '@nestjs/testing';
import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/repository/user.repository';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { EvaluationService } from 'src/services/evaluation.service';
import { ApprovalService } from 'src/services/approval.service';
import { EvaluationSearchDto } from 'src/model/request/EvaluationParamDto';
import { UserRoleController } from 'src/controllers/f1/user.controller';
import {
  mocksColumnStatusInPeriodResults,
  mocksColumnStatusNotInPeriodResults,
  mocksColumnStatusRows54,
  mocksColumnStatusRows55,
  mocksColumnStatusRows56,
  mocksColumnStatusRows59,
  mocksColumnStatusRows63,
  mocksColumnStatusRows66,
  mocksColumnStatusRows68,
  mocksColumnStatusRows70,
  mocksColumnStatusRows71,
  mocksColumnStatusRows75,
  mocksColumnStatusRows76,
  mocksColumnStatusRows80,
  mocksColumnStatusRows81075,
  mocksColumnStatusRows87,
  mocksColumnStatusRows88,
  mocksColumnStatusRows89,
  mocksColumnStatusRows90,
  mocksColumnStatusRows91,
  mocksColumnStatusRows93,
  mocksColumnStatusRows94,
  mocksColumnStatusRows95,
  mocksColumnStatusRows97,
  statusPeriodNotEvaluations,
} from './mock';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { VerifyTokenService } from 'src/services/verifyToken.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { DepartmentService } from 'src/services/department.service';
import { DepartmentRepository } from 'src/repository/department.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { BasicBehaviorRepository } from 'src/repository/basicBehavior.repository';
import { PointRepository } from 'src/repository/point.repository';
import { MailService } from 'src/services/mail.service';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { CustomLogger } from 'src/services/logger.service';
import { Evaluation17Service } from 'src/services/evaluation17.service';
import { Evaluation17Repository } from 'src/repository/evaluation17.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { ConfigAppModule } from 'src/config/AppModule';

describe('AppController', () => {
  let userRoleController: UserRoleController;
  let userService: UserService;
  let userRepository: UserRepository;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [UserRoleController],
      imports: [
        ConfigAppModule,
        CacheModule.register({ ttl: 300000, isGlobal: true }),
      ],
      providers: [
        UserRepository,
        EvaluationRepository,
        ApprovalRepository,
        DepartmentRepository,
        UserService,
        EvaluationService,
        ApprovalService,
        VerifyTokenService,
        JwtService,
        DepartmentService,
        EvaluationPeriodRepository,
        ProSkillRepository,
        BasicBehaviorRepository,
        PointRepository,
        PointRepository,
        MailService,
        ProSkillSettingRepository,
        CustomLogger,
        Evaluation17Service,
        Evaluation17Repository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        GuideEvaluationRepository,
        VersionSettingRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);
    userRepository = moduleFixture.get<UserRepository>(UserRepository);
    userRoleController =
      moduleFixture.get<UserRoleController>(UserRoleController);
  });
  describe('evaluation - salary rank  1 - 7', () => {
    it('- Column 評価期間:  Check format', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = statusPeriodNotEvaluations;
      // const results = await userService.listEvaluation(query, 1);
      // expect(results.data).toBe(compares.data);
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      expect(results.data[0].year).toMatch(/[0-9]{4}年[上期|下期]/);
    });
    it('- Column 状態:  user click button save draft  - Status 0', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows54;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      results.data.forEach((v) => {
        if (v.children !== undefined) {
          v.children.forEach((e) => {
            if (e.statusNo === 0) {
              expect(e.status).toContain('【目標】未作成');
            }
          });
        }
      });
    });
    it('- Column 状態:  user click button save draft  - Status 1', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows55;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】作成中',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】作成中',
              statusNo: 1,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              isActive: false,
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 2', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows56;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】被評価者へ差戻',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】被評価者へ差戻',
              statusNo: 2,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 3', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows59;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】仮評価者確認中',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】仮評価者確認中',
              statusNo: 3,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 4', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows68;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】仮評価者へ差戻',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】仮評価者へ差戻',
              statusNo: 4,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 5', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows63;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】一次評価者確認中',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】一次評価者確認中',
              statusNo: 5,
              isActive: false,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 6', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows70;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】一次評価者へ差戻',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】一次評価者へ差戻',
              statusNo: 6,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 7', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows66;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】二次評価者確認中',
          stringSummary: '-',
          totalPoint: 0,
          year: '2022年上期',
          isActive: false,
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】二次評価者確認中',
              statusNo: 7,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              isActive: false,
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 8', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows71;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】二次評価者へ差戻',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】二次評価者へ差戻',
              statusNo: 8,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  Check status 50  If it is not time to evaluate', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusNotInPeriodResults;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      results.data.forEach((v) => {
        if (v.children !== undefined) {
          v.children.forEach((e) => {
            if (e.statusNo === 50) {
              expect(e.status).toContain('【評価】未作成');
            }
          });
        }
      });
    });
    it('- Column 状態:  Check status 50   If during the evaluation', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusInPeriodResults;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      results.data.forEach((v) => {
        if (v.children !== undefined) {
          v.children.forEach((e) => {
            if (e.statusNo === 50) {
              expect(e.status).toContain('【評価】未作成');
            }
          });
        }
      });
    });
    it('- Column 状態:  user click button save draft  - Status 51', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows75;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 52', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows80;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          isActive: false,
          stringSummary: '-',
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】被評価者へ差戻',
              statusNo: 52,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 53', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows76;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者確認中',
              statusNo: 53,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 54', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows87;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者評価中',
              statusNo: 54,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 55', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows95;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者へ差戻',
              statusNo: 55,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 56', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows88;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者確認中',
              statusNo: 56,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 57', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows89;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者評価中',
              statusNo: 57,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 58', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows94;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者へ差戻',
              statusNo: 58,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 59', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows90;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者確認中',
              statusNo: 59,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 60', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows91;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者評価中',
              statusNo: 60,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 61', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows93;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          isActive: false,
          stringSummary: '-',
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者へ差戻',
              statusNo: 61,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 98', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows97;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】提出済み',
              statusNo: 98,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              isActive: false,
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
  });
  // =======================================================
  describe('evaluation - salary rank  8 - 10', () => {
    it('- Column 状態:  user click button save draft  - Status 0', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows54;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      results.data.forEach((v) => {
        if (v.children !== undefined) {
          v.children.forEach((e) => {
            if (e.statusNo === 0) {
              expect(e.status).toContain('【目標】未作成');
            }
          });
        }
      });
    });
    it('- Column 状態:  user click button save draft  - Status 1', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows55;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】作成中',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】作成中',
              statusNo: 1,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 2', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows56;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】被評価者へ差戻',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】被評価者へ差戻',
              statusNo: 2,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 3', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows59;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】仮評価者確認中',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】仮評価者確認中',
              statusNo: 3,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 4', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows68;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】仮評価者へ差戻',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】仮評価者へ差戻',
              statusNo: 4,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 5', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows63;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】一次評価者確認中',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】一次評価者確認中',
              statusNo: 5,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 6', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows70;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】一次評価者へ差戻',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】一次評価者へ差戻',
              statusNo: 6,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 7', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows66;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】二次評価者確認中',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】二次評価者確認中',
              statusNo: 7,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 8', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows71;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/20',
          id: 1,
          status: '【目標】二次評価者へ差戻',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】二次評価者へ差戻',
              statusNo: 8,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  Check status 50  If it is not time to evaluate', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows81075;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          isActive: false,
          stringSummary: '',
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 8,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】確定済み ',
              isActive: false,
              statusNo: 50,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】被評価者へ差戻',
              statusNo: 52,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  Check status 50   If during the evaluation', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusInPeriodResults;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】作成中',
              statusNo: 51,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
    });
    it('- Column 状態:  user click button save draft  - Status 51', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows81075;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 8,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【評価】被評価者へ差戻',
              statusNo: 52,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 52', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows80;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】被評価者へ差戻',
              statusNo: 52,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 53', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows76;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者確認中',
              statusNo: 53,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 54', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows87;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者評価中',
              statusNo: 54,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 55', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows95;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】仮評価者へ差戻',
              statusNo: 55,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 56', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows88;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者確認中',
              statusNo: 56,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 57', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows89;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者評価中',
              statusNo: 57,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              isActive: false,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 58', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows94;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】一次評価者へ差戻',
              statusNo: 58,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 59', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows90;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者確認中',
              statusNo: 59,
              stringSummary: '',
              isActive: false,
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              isActive: false,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 60', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows91;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          isActive: false,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者評価中',
              statusNo: 60,
              stringSummary: '',
              summaryPoint: null,
              isActive: false,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
    it('- Column 状態:  user click button save draft  - Status 61', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows93;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          status: '【目標】確定済み ',
          stringSummary: '-',
          isActive: false,
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】二次評価者へ差戻',
              statusNo: 61,
              isActive: false,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              isActive: false,
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });

    it('- Column 状態:  user click button save draft  - Status 98', async () => {
      const query: EvaluationSearchDto = {
        limit: 20,
        offset: 0,
        sortBy: 'year',
        sortType: 'ASC',
        yearEnd: '2022',
        yearStart: '2022',
      };
      const mocks: any = mocksColumnStatusRows97;
      jest
        .spyOn(userRepository, 'getEvaluationPeriod')
        .mockImplementation(() => mocks);
      const results: any = await userService.listEvaluation(query, 1);
      const compares = [
        {
          dateEvaluationEnd: '2023/6/30',
          dateEvaluationStart: '2023/5/15',
          id: 1,
          isActive: false,
          status: '【目標】確定済み ',
          stringSummary: '-',
          totalPoint: 0,
          year: '2022年上期',
          childrens: [
            {
              evaluationId: 1,
              evaluator1: 'Lam DucHuy',
              evaluator2: 'ベトナム システム',
              evaluator05: 'Vo Thi Huyen Trang',
              level: 1,
              isActive: false,
              periodEnd: '2022/5',
              periodStart: '2022/4',
              status: '【評価】提出済み',
              statusNo: 98,
              stringSummary: '',
              summaryPoint: null,
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/4 ～ 2022/5',
            },
            {
              evaluationId: 3,
              evaluator1: '',
              evaluator2: 'Vo Thi Huyen Trang',
              evaluator05: '',
              level: 8,
              isActive: false,
              periodEnd: '2022/9',
              periodStart: '2022/6',
              status: '【目標】確定済み ',
              statusNo: 50,
              stringSummary: '',
              summaryPoint: '20.00',
              totalPoint: null,
              userInfo: {
                employeeNumber: '1600381',
                fullName: 'Vo Khanh Duy',
                department: {
                  active: 1,
                  class: 0,
                  code: '16660',
                  name: '2nd Street MALAYSIA店舗運営1課',
                  type: 0,
                },
              },
              year: '2022/6 ～ 2022/9',
            },
          ],
        },
      ];
      expect(results.data).toEqual(compares);
    });
  });
});
