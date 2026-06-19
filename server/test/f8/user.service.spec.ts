import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { BasicBehaviorRepository } from 'src/repository/basicBehavior.repository';
import { DepartmentRepository } from 'src/repository/department.repository';
import { DivisionSubClassRepository } from 'src/repository/divisionSubClass.repository';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { Evaluation17Repository } from 'src/repository/evaluation17.repository';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { HistoryCronJobRepository } from 'src/repository/historyCronjob.repository';
import { MailSettingRepository } from 'src/repository/mailSetting.repository';
import { OracleRepository } from 'src/repository/oracle.repository';
import { PointRepository } from 'src/repository/point.repository';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { UserRepository } from 'src/repository/user.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { DepartmentService } from 'src/services/department.service';
import { Evaluation17Service } from 'src/services/evaluation17.service';
import { MailService } from 'src/services/mail.service';
import { UserService } from 'src/services/user.service';

describe('User', () => {
  let userRepository: UserRepository;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        EvaluationRepository,
        UserService,
        PointRepository,
        MailService,
        EvaluationPeriodRepository,
        ProSkillSettingRepository,
        BasicBehaviorRepository,
        ProSkillRepository,
        Evaluation17Service,
        Evaluation17Repository,
        DepartmentRepository,
        DivisionSubClassRepository,
        OracleRepository,
        MailSettingRepository,
        HistoryCronJobRepository,
        GuideEvaluationRepository,
        VersionSettingRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository);
    userService = moduleRef.get<UserService>(UserService);
  });

  test('Search list user', async () => {
    const results: any = {
      message: 'success',
    };
    const query = {
      role: 'すべて',
      department: 'すべて',
      division: 'すべて',
      nameAndEmail: '',
      limit: 20,
      offset: 0,
    };

    jest.spyOn(userRepository, 'getListUser').mockImplementation(() => results);
    expect(await userService.getListUser(query)).toMatchObject(results);
  });

  // test('Edit user', async () => {
  //   const results: any = {
  //     message: 'success',
  //   };
  //   jest
  //     .spyOn(userRepository, 'updateListUser')
  //     .mockImplementation(() => results);
  //   expect(
  //     await userService.updateListUser([1]),
  //   ).toMatchObject(results);
  // });

  test('Delete user', async () => {
    const results: any = {
      message: 'success',
    };
    jest
      .spyOn(userRepository, 'deleteListUser')
      .mockImplementation(() => results);
    expect(await userService.deleteListUser(1)).toMatchObject(results);
  });
});
