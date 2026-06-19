/* eslint-disable lines-around-comment */
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Typography } from 'antd';
import { DataState } from '../../../model/DataState';
import { useParams, useSearchParams } from 'react-router-dom';
import commonApiService from '../../../common/api/common';
import { EvaluationApprovalHistoryResponse } from '../../../model/EvaluationApprovalHistory';
import { t } from 'i18next';
import EvaluatorEvaluatorEvaluationHisotryHelper from '../../../views/evaluator/evaluation-history/EvaluatorEvaluationHisotryHelper';
import EvaluatorEvaluationHistoryTimeline from '../../../views/evaluator/evaluation-history/EvaluatorEvaluationHistoryTimeline';
import { ColumnsType } from 'antd/es/table';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
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
const EvaluatorEvalutionHistoryScreen: React.FC = () => {
  const [dataState, setDataState] = useState(defaultDataState);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [proSkills, setProSkills] = useState<{
    isOpen: boolean;
    data: typeProSkill[];
  }>({
    data: {} as any,
    isOpen: false,
  });
  const url = `/api/v1/f2/evaluator/evaluation/${params.id}/get-approval-history`;

  const setDataCallback = (data: EvaluationApprovalHistoryResponse) => {
    setDataState({
      ...dataState,
      dataSource: data,
    });
  };

  useEffect(() => {
    commonApiService.getListApprovalHistoryF2(url, { order: searchParams.get('order') }, setDataCallback);
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
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_HISTORY_APPROVE')}
        </Typography.Title>
        <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false} style={{ marginBottom: 0 }}>
          <div style={{ marginBottom: 5, marginTop: 5 }}>
            {dataState.dataSource!.evaluation?.title}
            {t('IDS_EVALUATION_TABLE')}
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
        openModalProSkillDisable={openModalProSkillDisable}
        t={t}
      />

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

export default EvaluatorEvalutionHistoryScreen;
