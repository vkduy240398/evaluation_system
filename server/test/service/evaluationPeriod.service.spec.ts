import { SchedulerRegistry } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { EvaluatorRepository } from 'src/repository/evaluator.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { UserRepository } from 'src/repository/user.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { CronJobServices } from 'src/services/cronJob.services';
import { EvaluationPeriodService } from 'src/services/evaluationPeriod.service';
import { CustomLogger } from 'src/services/logger.service';
import { MailService } from 'src/services/mail.service';
import { CacheModule } from '@nestjs/cache-manager';
import { SettingLevelRepository } from 'src/repository/settingLevel.repository';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';

describe('EvaluationPeriodService', () => {
  let evaluationPeriodRepository: EvaluationPeriodRepository;
  let evaluationPeriodService: EvaluationPeriodService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register({ ttl: 300000, isGlobal: true })],
      providers: [
        EvaluationPeriodRepository,
        EvaluationPeriodService,
        UserRepository,
        SchedulerRegistry,
        EvaluationRepository,
        GuideEvaluationRepository,
        VersionSettingRepository,
        EvaluatorRepository,
        MailService,
        ProSkillSettingRepository,
        ProSkillRepository,
        HistoryCronJobRepository,
        CustomLogger,
        CronJobServices,
        SettingLevelRepository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        AdminEvaluationRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    evaluationPeriodRepository = moduleRef.get<EvaluationPeriodRepository>(
      EvaluationPeriodRepository,
    );
    evaluationPeriodService = moduleRef.get<EvaluationPeriodService>(
      EvaluationPeriodService,
    );
  });

  test('get notification period', async () => {
    const mockGetProgressingPeriod: any = [
      {
        id: 1,
        year: '2022',
        period_index: 1,
        period_start: '2022/4',
        period_end: '2022/09',
        date_creation_goal_start: '2023/04/01',
        date_creation_goal_end: '2124/06/30',
        date_evaluation_start: '2023/4/20',
        date_evaluation_end: '2023/5/25',
        date_creation_goal_department_start: '2022/04/01',
        date_creation_goal_department_end: '2022/04/27',
        date_evaluation_department_start: '2023/04/01',
        date_evaluation_department_end: '2124/10/07',
        created_time: '2023-04-18T04:22:42.869Z',
        updated_time: '2023-04-18T04:22:42.869Z',
        date_send_mail_creation_goal: null,
        date_send_mail_evaluation: null,
      },
      {
        id: 3,
        year: '2023',
        period_index: 1,
        period_start: '2023/4',
        period_end: '2023/9',
        date_creation_goal_start: '2023/4/1',
        date_creation_goal_end: '2023/5/1',
        date_evaluation_start: '2023/03/01',
        date_evaluation_end: '2023/06/10',
        date_creation_goal_department_start: '2023/4/12',
        date_creation_goal_department_end: '2023/5/15',
        date_evaluation_department_start: '2023/03/01',
        date_evaluation_department_end: '2023/03/07',
        created_time: '2023-04-18T04:34:19.742Z',
        updated_time: '2023-04-18T04:34:19.742Z',
        date_send_mail_creation_goal: null,
        date_send_mail_evaluation: null,
      },
    ];

    const resultGetNotificationPeriod = [
      {
        type: '目標',
        period: '2022年上期',
        datePersonal: '2023/04/01 ～ 2124/06/30',
        dateDepartment: '',
      },
      {
        type: '評価',
        // period: '2023年上期',
        // datePersonal: '2023/03/01～2023/06/10',
        // dateDepartment: '2023/03/01～2023/03/07',
        dateDepartment: '2023/04/01 ～ 2124/10/07',
        datePersonal: '',
        period: '2022年上期',
      },
    ];

    jest
      .spyOn(evaluationPeriodRepository, 'getProgressingPeriod')
      .mockImplementation(() => mockGetProgressingPeriod);

    expect(await evaluationPeriodService.getNotificationPeriod()).toEqual(
      resultGetNotificationPeriod,
    );
  });
});
