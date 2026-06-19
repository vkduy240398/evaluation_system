import { Card, Timeline, Typography } from 'antd';
import EvaluatorEvaluationHisotryHelper from './EvaluatorEvaluationHisotryHelper';
import { t, TFunction } from 'i18next';
import { EvaluationApprovalHistoryResponse } from '../../../model/EvaluationApprovalHistory';

interface Props {
  datasource: EvaluationApprovalHistoryResponse;
  isReview?: boolean;
  typeReview?: number;
  openModalProSkillDisable: (
    data: { jobType: string; itemNo: number; itemTitle: string; content: string; note: string; difficulty: number }[],
  ) => void;
  t: TFunction;
}

const EvaluatorEvaluationHistoryTimeline: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Card style={{ marginTop: 15, paddingBottom: 0 }}>
        <Typography.Title level={4} style={{ marginBottom: 15 }}>
          {t('IDS_AIM_SETTING')}
        </Typography.Title>
        {props.datasource && props.datasource?.approvalHistories?.findIndex((v) => v.type === 0) >= 0 ? (
          <div style={{ marginTop: 10 }}>
            <Timeline
              items={EvaluatorEvaluationHisotryHelper.processingData(
                props.datasource,
                0,
                props.openModalProSkillDisable,
                props.t,
              )}
            />
          </div>
        ) : (
          t('MESSAGE.COMMON.IDM_EMPTY_DATA')
        )}
      </Card>
      {props.isReview && props.typeReview && props.typeReview < 4 ? (
        <></>
      ) : (
        <Card style={{ marginTop: 20, paddingBottom: 0 }}>
          <Typography.Title level={4}>{t('IDS_EVALUATION')}</Typography.Title>
          {props.datasource && props.datasource?.approvalHistories?.findIndex((v) => v.type === 1) >= 0 ? (
            <div style={{ marginTop: 10 }}>
              <Timeline
                items={EvaluatorEvaluationHisotryHelper.processingData(
                  props.datasource,
                  1,
                  props.openModalProSkillDisable,
                  props.t,
                )}
              />
            </div>
          ) : (
            t('MESSAGE.COMMON.IDM_EMPTY_DATA')
          )}
        </Card>
      )}
    </>
  );
};

export default EvaluatorEvaluationHistoryTimeline;
