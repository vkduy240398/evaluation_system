import { Test } from '@nestjs/testing';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { ApprovalRepository } from 'src/repository/approval.repository';
import { EvaluatorApprovalService } from 'src/services/evaluatorApproval.service';

describe('EvaluatorApprovalService', () => {
  let approvalRepository: ApprovalRepository;
  let evaluatorApprovalService: EvaluatorApprovalService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApprovalRepository,
        EvaluatorApprovalService,
        ...ENTITY_MODULES,
      ],
    }).compile();

    approvalRepository = moduleRef.get<ApprovalRepository>(ApprovalRepository);
    evaluatorApprovalService = moduleRef.get<EvaluatorApprovalService>(
      EvaluatorApprovalService,
    );
  });

  test('User log in is in list evaluator', async () => {
    const mockGetListApprovalHistoryByEvaluationId: any = [
      {
        evaluationId: 1,
        comment: 'evaluator 2 reject to user',
        receiverOrder: '0',
        status: '被評価者へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:49:18.804Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 97,
          fullName: 'Tran LeHaNam',
        },
      },
      {
        evaluationId: 1,
        comment: '',
        receiverOrder: '0.5',
        status: '仮評価者へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:47:44.980Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 6,
          fullName: 'Vo KhanhDuy',
        },
      },
      {
        evaluationId: 1,
        comment: '',
        receiverOrder: '1',
        status: '一次評価へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:46:55.585Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
        },
      },
      {
        evaluationId: 1,
        comment: 'approved',
        receiverOrder: '1',
        status: '承認',
        type: 0,
        createdTime: '2023-06-02T08:43:13.613Z',
        approverUser: {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
        },
        receiverUser: null,
      },
      {
        evaluationId: 1,
        comment: 'approved',
        receiverOrder: '0.5',
        status: '承認',
        type: 0,
        createdTime: '2023-06-02T08:42:48.240Z',
        approverUser: {
          id: 6,
          fullName: 'Vo KhanhDuy',
        },
        receiverUser: null,
      },
    ];

    const mockGetEvaluationById: any = {
      id: 1,
      level: 2,
      status: 0,
      periodStart: '2023/4',
      periodEnd: '2023/6',
      userId: 97,
      departmentName: '1002: GEO NET WORK',
      user: {
        id: 97,
        employeeNumber: '2011110',
        fullName: 'Tran LeHaNam',
        department: {
          id: 163,
          code: 'GNW-1111113',
          name: 'vdvdvcscs',
        },
      }
    };

    const mockGetUserDetail: any = {
      id: 97,
      employeeNumber: '2011110',
      fullName: 'Tran LeHaNam',
      department: {
        id: 163,
        code: 'GNW-1111113',
        name: 'vdvdvcscs',
      },
    };

    const mockGetListEvaluatorByEvaluationId: any = [
      {
        evaluationId: 1,
        evaluatorId: 3,
        evaluationOrder: '1.0',
        user: { id: 3, fullName: 'Vo Thi Huyen Trang' },
      },
      {
        evaluationId: 1,
        evaluatorId: 1,
        evaluationOrder: '2.0',
        user: { id: 1, fullName: 'ベトナム システム' },
      },
    ];

    const results = {
      approvalHistories: [
        {
          evaluationId: 1,
          comment: 'evaluator 2 reject to user',
          receiverOrder: 0,
          status: '被評価者へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:49:18.804Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 97,
            fullName: 'Tran LeHaNam',
          },
        },
        {
          evaluationId: 1,
          comment: '',
          receiverOrder: 0.5,
          status: '仮評価者へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:47:44.980Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 6,
            fullName: 'Vo KhanhDuy',
          },
        },
        {
          evaluationId: 1,
          comment: '',
          receiverOrder: 1,
          status: '一次評価へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:46:55.585Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 3,
            fullName: 'Vo Thi Huyen Trang',
          },
        },
        {
          evaluationId: 1,
          comment: 'approved',
          receiverOrder: 1,
          status: '承認',
          type: 0,
          createdTime: '2023-06-02T08:43:13.613Z',
          approverUser: {
            id: 3,
            fullName: 'Vo Thi Huyen Trang',
          },
          receiverUser: null,
        },
        {
          evaluationId: 1,
          comment: 'approved',
          receiverOrder: 0.5,
          status: '承認',
          type: 0,
          createdTime: '2023-06-02T08:42:48.240Z',
          approverUser: {
            id: 6,
            fullName: 'Vo KhanhDuy',
          },
          receiverUser: null,
        },
      ],
      evaluators: [
        {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
          evaluationOrder: 1,
        },
        {
          id: 1,
          fullName: 'ベトナム システム',
          evaluationOrder: 2,
        },
      ],
      evaluation: {
        id: 1,
        level: 2,
        status: 0,
        periodStart: '2023/4',
        periodEnd: '2023/6',
        departmentName: '1002: GEO NET WORK',
      },
      userDetail: {
        id: 97,
        employeeNumber: '2011110',
        fullName: 'Tran LeHaNam',
        department: {
          id: 163,
          code: 'GNW-1111113',
          name: 'vdvdvcscs',
        },
      },
    };

    jest
      .spyOn(approvalRepository, 'getListApprovalHistoryByEvaluationId')
      .mockImplementation(() => mockGetListApprovalHistoryByEvaluationId);

    jest
      .spyOn(approvalRepository, 'getEvaluationById')
      .mockImplementation(() => mockGetEvaluationById);

    jest
      .spyOn(approvalRepository, 'getListEvaluatorByEvaluationId')
      .mockImplementation(() => mockGetListEvaluatorByEvaluationId);

    expect(
      await evaluatorApprovalService.getListApprovalHistory(1, 5),
    ).toMatchObject(results);
  });

  test('User log in is not in list evaluator', async () => {
    const mockGetListApprovalHistoryByEvaluationId: any = [
      {
        evaluationId: 1,
        comment: 'evaluator 2 reject to user',
        receiverOrder: '0',
        status: '被評価者へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:49:18.804Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 97,
          fullName: 'Tran LeHaNam',
        },
      },
      {
        evaluationId: 1,
        comment: '',
        receiverOrder: '0.5',
        status: '仮評価者へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:47:44.980Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 6,
          fullName: 'Vo KhanhDuy',
        },
      },
      {
        evaluationId: 1,
        comment: '',
        receiverOrder: '1',
        status: '一次評価へ差戻',
        type: 0,
        createdTime: '2023-06-02T08:46:55.585Z',
        approverUser: {
          id: 1,
          fullName: 'ベトナム システム',
        },
        receiverUser: {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
        },
      },
      {
        evaluationId: 1,
        comment: 'approved',
        receiverOrder: '1',
        status: '承認',
        type: 0,
        createdTime: '2023-06-02T08:43:13.613Z',
        approverUser: {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
        },
        receiverUser: null,
      },
      {
        evaluationId: 1,
        comment: 'approved',
        receiverOrder: '0.5',
        status: '承認',
        type: 0,
        createdTime: '2023-06-02T08:42:48.240Z',
        approverUser: {
          id: 6,
          fullName: 'Vo KhanhDuy',
        },
        receiverUser: null,
      },
    ];

    const mockGetEvaluationById: any = {
      id: 1,
      level: 2,
      status: 0,
      periodStart: '2023/4',
      periodEnd: '2023/6',
      userId: 97,
      departmentName: '1002: GEO NET WORK',
      user: {
        id: 97,
      employeeNumber: '2011110',
      fullName: 'Tran LeHaNam',
      department: {
        id: 163,
        code: 'GNW-1111113',
        name: 'vdvdvcscs',
      },
      }
    };

    const mockGetUserDetail: any = {
      id: 97,
      employeeNumber: '2011110',
      fullName: 'Tran LeHaNam',
      department: {
        id: 163,
        code: 'GNW-1111113',
        name: 'vdvdvcscs',
      },
    };

    const mockGetListEvaluatorByEvaluationId: any = [
      {
        evaluationId: 1,
        evaluatorId: 3,
        evaluationOrder: '1.0',
        user: { id: 3, fullName: 'Vo Thi Huyen Trang' },
      },
      {
        evaluationId: 1,
        evaluatorId: 1,
        evaluationOrder: '2.0',
        user: { id: 1, fullName: 'ベトナム システム' },
      },
    ];

    const results = {
      approvalHistories: [
        {
          evaluationId: 1,
          comment: 'evaluator 2 reject to user',
          receiverOrder: 0,
          status: '被評価者へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:49:18.804Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 97,
            fullName: 'Tran LeHaNam',
          },
        },
        {
          evaluationId: 1,
          comment: '',
          receiverOrder: 0.5,
          status: '仮評価者へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:47:44.980Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 6,
            fullName: 'Vo KhanhDuy',
          },
        },
        {
          evaluationId: 1,
          comment: '',
          receiverOrder: 1,
          status: '一次評価へ差戻',
          type: 0,
          createdTime: '2023-06-02T08:46:55.585Z',
          approverUser: {
            id: 1,
            fullName: 'ベトナム システム',
          },
          receiverUser: {
            id: 3,
            fullName: 'Vo Thi Huyen Trang',
          },
        },
        {
          evaluationId: 1,
          comment: 'approved',
          receiverOrder: 1,
          status: '承認',
          type: 0,
          createdTime: '2023-06-02T08:43:13.613Z',
          approverUser: {
            id: 3,
            fullName: 'Vo Thi Huyen Trang',
          },
          receiverUser: null,
        },
        {
          evaluationId: 1,
          comment: 'approved',
          receiverOrder: 0.5,
          status: '承認',
          type: 0,
          createdTime: '2023-06-02T08:42:48.240Z',
          approverUser: {
            id: 6,
            fullName: 'Vo KhanhDuy',
          },
          receiverUser: null,
        },
      ],
      evaluators: [
        {
          id: 3,
          fullName: 'Vo Thi Huyen Trang',
          evaluationOrder: 1,
        },
        {
          id: 1,
          fullName: 'ベトナム システム',
          evaluationOrder: 2,
        },
      ],
      evaluation: {
        id: 1,
        level: 2,
        status: 0,
        periodStart: '2023/4',
        periodEnd: '2023/6',
        departmentName: '1002: GEO NET WORK',
      },
      userDetail: {
        id: 97,
        employeeNumber: '2011110',
        fullName: 'Tran LeHaNam',
        department: {
          id: 163,
          code: 'GNW-1111113',
          name: 'vdvdvcscs',
        },
      },
    };

    jest
      .spyOn(approvalRepository, 'getListApprovalHistoryByEvaluationId')
      .mockImplementation(() => mockGetListApprovalHistoryByEvaluationId);

    jest
      .spyOn(approvalRepository, 'getEvaluationById')
      .mockImplementation(() => mockGetEvaluationById);

    jest
      .spyOn(approvalRepository, 'getListEvaluatorByEvaluationId')
      .mockImplementation(() => mockGetListEvaluatorByEvaluationId);

    expect(
      await evaluatorApprovalService.getListApprovalHistory(1, 3),
    ).toMatchObject(results);
  });
});
