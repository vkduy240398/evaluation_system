import React, { useState } from 'react';
import { Card, Button, Row, Col, Space, message, Typography } from 'antd';
import { EditTwoTone, SyncOutlined } from '@ant-design/icons';
import './EvaluationBlocks.css';
import { ListPeriods } from '../../../../page/admin/review-management/interfaces/InterfacesProps';
import { TFunction } from 'i18next';
import moment from 'moment';
import AdminEvaluationApiService from '../../../../common/api/adminEvaluation';
import functionsPeriods from '../../../../common/api/adminPeriod';
import { FormInstance } from 'antd/lib';
import dayjs from 'dayjs';

export interface PhaseAction {
  alertCount: number;
  progressText: string;
  status: 'active' | 'disabled';
  buttonText: string;
}

interface Props {
  dataSources: ListPeriods[];
  t: TFunction;
  callBack: (data: ListPeriods[]) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  form: FormInstance;
}

const EvaluationBlocks = (props: Props) => {
  const { dataSources, t, callBack, setLoading, isLoading, form } = props;

  // Hàm render ngày tháng dạng rút gọn inline
  const renderTargetTime = (title: string, evaluationGoals: { departmentGoals: string; goals: string }) => (
    <div className="phase-section-compact">
      <div className="phase-header-title-compact">{title}</div>
      <div className="date-item-inline">
        <span className="label-compact">{t('IDS_DEPARTMENT_PERIOD')}:</span>
        <span className="value-compact">{evaluationGoals.departmentGoals || '—'}</span>
      </div>
      <div className="date-item-inline">
        <span className="label-compact">{t('IDS_PERSONAL_PERIOD')}:</span>
        <span className="value-compact">{evaluationGoals.goals || '—'}</span>
      </div>
    </div>
  );

  const renderEvaluteTime = (
    title: string,
    evaluationGoals: { divisionEvaluate: string; personalEvaluation: string },
  ) => (
    <div className="phase-section-compact">
      <div className="phase-header-title-compact">{title}</div>
      <div className="date-item-inline">
        <span className="label-compact">{t('IDS_DEPARTMENT_PERIOD')}:</span>
        <span className="value-compact">{evaluationGoals.divisionEvaluate || '—'}</span>
      </div>
      <div className="date-item-inline">
        <span className="label-compact">{t('IDS_PERSONAL_PERIOD')}:</span>
        <span className="value-compact">{evaluationGoals.personalEvaluation || '—'}</span>
      </div>
    </div>
  );

  // Hàm render Action Khu vực nút bấm nằm ngang siêu gọn
  const renderActionSection = (title: string, phaseAction?: PhaseAction) => {
    if (!phaseAction) return null;
    const isActive = phaseAction.status === 'active';

    return (
      <div className="phase-section-compact">
        <div className="phase-header-title-compact">{title}</div>
        <Space size={8} align="center" className="action-flex-container">
          <span className="label-compact">{t('IDS_ALERT')}:</span>
          <span className={`alert-count-compact ${phaseAction.alertCount > 0 ? 'has-alerts' : ''}`}>
            {phaseAction.alertCount}
          </span>
          <Button
            className={`action-btn-compact ${!isActive ? 'btn-active' : 'btn-disabled'}`}
            disabled={isActive}
            size="small"
          >
            {phaseAction.buttonText}
          </Button>
          <span className="progress-text-compact">
            <SyncOutlined className="sync-icon-mini" /> {phaseAction.progressText}
          </span>
        </Space>
      </div>
    );
  };

  const isDisplayFixEvalation = (item: any) => {
    const endPersonalEvaluation = item.personalEvaluation?.split(' ～ ')[1];
    const endDepartmentEvaluation = item.divisionEvaluate?.split(' ～ ')[1];
    if (!endPersonalEvaluation && !endDepartmentEvaluation) return false;

    return (
      item.checkFixed === 0 &&
      item.totalRecord !== 0 &&
      ((endPersonalEvaluation &&
        moment(endPersonalEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')) ||
        (endDepartmentEvaluation &&
          moment(endDepartmentEvaluation, 'YYYY/M/D').format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')))
    );
  };

  const isDisplayPublicEvaluation = (item: any) => {
    return item.checkFixed <= 1 && item.evaluationConfirmRecord === 0 && item.totalRecord !== 0;
  };

  return (
    <div className="evaluation-blocks-container horizontal-mode">
      <Row gutter={[0, 12]}>
        {dataSources.map((record) => (
          <Col key={record.id} span={24}>
            <Card className="eval-card-horizontal" size="small">
              <Row align="middle" gutter={[16, 8]}>
                {/* CỘT 1: THÔNG TIN KỲ ĐÁNH GIÁ */}
                <Col xxl={3} xl={4} lg={24} md={24} sm={24} xs={24} className="period-section-col">
                  <div className="period-box">
                    <div className="period-hint">{t('IDS_EVALUATION_PERIOD')}</div>
                    <Typography.Text strong className="period-title-text">
                      {record.evaluationPeriod}
                    </Typography.Text>
                  </div>
                  <EditTwoTone style={{ fontSize: 16, cursor: 'pointer' }} />
                </Col>

                {/* CỘT 2: THIẾT LẬP MỤC TIÊU */}
                <Col xxl={9} xl={9} lg={12} md={24} sm={24} xs={24} className="border-left-divider">
                  <Row gutter={[12, 0]} align="middle">
                    <Col span={13}>{renderTargetTime(t('IDS_AIM_SETTING'), record)}</Col>
                    <Col span={11}>
                      {renderActionSection(t('IDS_FIX_GOAL'), {
                        alertCount: record.goalRecord,
                        buttonText: '確定',
                        // Tinh gọn chuỗi hiển thị record để tiết kiệm không gian
                        progressText: `${record.goalFixedRecord}/${record.totalRecord}`,
                        status:
                          record.goalFixedRecord === record.totalRecord || record.totalRecord === 0
                            ? 'active'
                            : 'disabled',
                      })}
                    </Col>
                  </Row>
                </Col>

                {/* CỘT 3: ĐÁNH GIÁ & CÔNG BỐ */}
                <Col xxl={12} xl={11} lg={12} md={24} sm={24} xs={24} className="border-left-divider">
                  <Row gutter={[12, 0]} align="middle">
                    <Col xxl={8} xl={24} lg={24} md={24}>
                      {renderEvaluteTime(t('IDS_EVALUATION'), record)}
                    </Col>
                    <Col xxl={8} xl={12} lg={12} md={12}>
                      {renderActionSection(t('IDS_FIX_EVALUATION'), {
                        alertCount: record.evaluationFixedRecord,
                        buttonText: '確定',
                        progressText: `${record.evaluationFixedRecord}/${record.totalRecord}`,
                        status: !isDisplayFixEvalation(record) ? 'active' : 'disabled',
                      })}
                    </Col>
                    <Col xxl={8} xl={12} lg={12} md={12}>
                      {renderActionSection(t('IDS_PUBLIC_EVALUATION'), {
                        alertCount: record.evaluationConfirmRecord,
                        buttonText: t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC'),
                        progressText: `${record.evaluationFixedRecord}/${record.totalRecord}`,
                        status: !isDisplayPublicEvaluation(record) ? 'active' : 'disabled',
                      })}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EvaluationBlocks;
