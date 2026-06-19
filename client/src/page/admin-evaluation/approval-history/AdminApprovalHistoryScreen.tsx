/* eslint-disable lines-around-comment */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Spin, Typography } from 'antd';
import { DataState } from '../../../model/DataState';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import commonApiService from '../../../common/api/common';
import { EvaluationApprovalHistoryResponse } from '../../../model/EvaluationApprovalHistory';
import { t } from 'i18next';
import EvaluatorEvaluatorEvaluationHisotryHelper from '../../../views/evaluator/evaluation-history/EvaluatorEvaluationHisotryHelper';
import EvaluatorEvaluationHistoryTimeline from '../../../views/evaluator/evaluation-history/EvaluatorEvaluationHistoryTimeline';
import { decrypt } from '../../../common/util';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import { ColumnsType } from 'antd/es/table';
type typeProSkill = {
  jobType: string;
  itemNo: number;
  itemTitle: string;
  content: string;
  note: string;
  difficulty: number;
};
const defaultDataState: DataState<EvaluationApprovalHistoryResponse> = {
  dataSource: {} as EvaluationApprovalHistoryResponse,
};

/**
 * List approval history screen for user
 *
 * @author tran.le.ha.nam
 */
const AdminApprovalHistoryScreen: React.FC = () => {
  const [dataState, setDataState] = useState(defaultDataState);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const evaluationId = params.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const [proSkills, setProSkills] = useState<{
    isOpen: boolean;
    data: typeProSkill[];
  }>({
    data: {} as any,
    isOpen: false,
  });
  const location = useLocation();

  const url = `/api/v1/${
    !searchParams.get('isReview') === true ? `f5/management-evaluation-history` : `common`
  }/evaluation/${evaluationId}/get-approval-history`;
  const EVALUATION_TEXT = t('IDS_EVALUATION_TABLE');

  const setDataCallback = async (data: EvaluationApprovalHistoryResponse) => {
    await setDataState({
      ...dataState,
      dataSource: data,
    });
    setLoading(false);
  };

  const callbackError = () => {
    setLoading(true);
  };

  useEffect(() => {
    setLoading(true);
    if (!evaluationId) {
      navigate('/404page');
    }

    if (
      location.pathname.includes('reference-review') &&
      (searchParams.get('isReview') === null ||
        searchParams.get('typeReview') === null ||
        !Number.isInteger(Number(decrypt(searchParams.get('typeReview') || ''))))
    )
      navigate('/404page');
    commonApiService.getListApprovalHistoryF6(
      url,
      { order: searchParams.get('order') },
      setDataCallback,
      callbackError,
    );
  }, []);
  const openModalProSkillDisable = (
    proSkillList: {
      jobType: string;
      itemNo: number;
      itemTitle: string;
      content: string;
      note: string;
      difficulty: number;
    }[],
  ) => {
    setProSkills({
      isOpen: true,
      data: proSkillList,
    });
  };
  const columns: ColumnsType<typeProSkill> = [
    {
      title: t('IDS_JOB_TYPE'),
      dataIndex: 'jobType',
      align: 'left' as const,
      width: 150,
    },
    {
      title: t('IDS_EVALUATION_ITEM'),
      dataIndex: 'itemTitle',
      align: 'left' as const,
      width: 150,
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      align: 'left' as const,
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      width: 70,
      align: 'center' as const,
    },
    {
      title: t('IDS_EVALUATION_CRITERIA'),
      dataIndex: 'note',
      width: 600,
      align: 'left' as const,
    },
  ];

  return (
    <>
      {!isLoading ? (
        <div>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_HISTORY_APPROVE')}
            </Typography.Title>
            <Form
              labelAlign="left"
              labelCol={{ span: 1 }}
              colon={false}
              requiredMark={false}
              style={{ marginBottom: 0 }}
            >
              <div style={{ marginBottom: 5, marginTop: 5 }}>
                {dataState.dataSource!.evaluation?.title}
                {EVALUATION_TEXT}
              </div>
              <Form.Item className="ant-form-item-info" label={t('IDS_EVALUATION_PERIOD')}>
                {dataState.dataSource!.evaluation
                  ? `${dataState.dataSource!.evaluation.periodStart} ～ ${dataState.dataSource!.evaluation.periodEnd}`
                  : ''}
              </Form.Item>
              <Form.Item className="ant-form-item-info" label={t('IDS_FULLNAME')}>
                {dataState.dataSource!.userDetail
                  ? `${dataState.dataSource!.userDetail.employeeNumber}: ${dataState.dataSource!.userDetail.fullName}`
                  : ''}
              </Form.Item>
              <Form.Item className="ant-form-item-info" label={t('IDS_DEPARTMENT')}>
                {dataState.dataSource!.evaluation?.departmentName}
              </Form.Item>
              <Form.Item className="ant-form-item-info" label={t('IDS_LEVEL')}>
                {dataState.dataSource!.evaluation?.level}
              </Form.Item>
              <Form.Item className="ant-form-item-info" label={t('IDS_EVALUATOR')}>
                {EvaluatorEvaluatorEvaluationHisotryHelper.getOrderEvaluators(dataState.dataSource!.evaluators || [])}
              </Form.Item>
            </Form>
          </Card>
          <EvaluatorEvaluationHistoryTimeline
            datasource={dataState.dataSource!}
            isReview={searchParams.get('isReview') === 'true'}
            typeReview={Number(decrypt(searchParams.get('typeReview') || '0'))}
            openModalProSkillDisable={openModalProSkillDisable}
            t={t}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {/* Modal */}
      <ModalCustomComponent
        isOpen={proSkills.isOpen}
        header={t('IDS_DISABLE_PRO_SKILL')}
        isDestroyOnCloseType={true}
        footer={null}
        width="calc(100vw - 100px)"
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        content={
          <>
            <div style={{ marginBottom: 15 }}>
              <TableCustomComponent columns={columns} dataSources={proSkills.data} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="default"
                className="cancel_button"
                onClick={() => {
                  setProSkills((state) => ({ ...state, isOpen: false }));
                }}
              >
                {t('IDS_BUTTON_CLOSE')}
              </Button>
            </div>
          </>
        }
        fnHandleOk={function (): void {
          throw new Error('Function not implemented.');
        }}
        fnHandleCancel={function (): void {
          setProSkills((state) => ({ ...state, isOpen: false }));
        }}
      />
    </>
  );
};

export default AdminApprovalHistoryScreen;
