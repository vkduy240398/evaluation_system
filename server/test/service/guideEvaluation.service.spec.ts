import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { GuideEvaluationService } from 'src/services/guideEvaluation.service';

describe('GuideEvaluationService', () => {
  let guideEvaluationRepository: GuideEvaluationRepository;
  let guideEvaluationService: GuideEvaluationService;

  beforeEach(async () => {
    jest.setTimeout(10000);
    const moduleRef = await Test.createTestingModule({
      providers: [
        GuideEvaluationRepository,
        GuideEvaluationService,
        EvaluationPeriodRepository,
        ...ENTITY_MODULES,
      ],
    }).compile();

    guideEvaluationRepository = moduleRef.get<GuideEvaluationRepository>(
      GuideEvaluationRepository,
    );
    guideEvaluationService = moduleRef.get<GuideEvaluationService>(
      GuideEvaluationService,
    );
  });

  test('get guide evaluation', async () => {
    const mockGuideEvaluation17: any = {
      contentEvaluationCriteria: 'コンテンツ17',
      contentNotes: 'ノート17',
    };

    const mockGuideEvaluation810: any = {
      contentEvaluationCriteria: 'コンテンツ810',
      contentNotes: 'ノート810',
    };

    const result17 = {
      contentEvaluationCriteria: 'コンテンツ17',
      contentNotes: 'ノート17',
    };

    const result810 = {
      contentEvaluationCriteria: 'コンテンツ810',
      contentNotes: 'ノート810',
    };

    jest
      .spyOn(guideEvaluationRepository, 'getGuideEvaluation')
      .mockImplementation((typeLevel) => {
        if (typeLevel === 1) {
          return mockGuideEvaluation17;
        }
        return mockGuideEvaluation810;
      });

    expect(await guideEvaluationService.getGuideEvaluation(5, 1)).toMatchObject(
      result17,
    );
    expect(await guideEvaluationService.getGuideEvaluation(9, 1)).toMatchObject(
      result810,
    );
  });
});
