import { Card, Timeline, Typography } from 'antd';
import EvaluationHisotryHelper from './EvaluationHisotryHelper';
import { t, TFunction } from 'i18next';
import { EvaluationApprovalHistoryResponse } from '../../../../model/EvaluationApprovalHistory';

interface Props {
  datasource: EvaluationApprovalHistoryResponse;
  openModalProSkillDisable: (
    data: { jobType: string; itemNo: number; itemTitle: string; content: string; note: string; difficulty: number }[],
  ) => void;
  t: TFunction;
}

const EvaluationHistoryTimeline: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Card style={{ marginTop: 15, paddingBottom: 0 }}>
        <Typography.Title level={4} style={{ marginBottom: 15 }}>
          {t('IDS_AIM_SETTING')}
        </Typography.Title>
        {props.datasource && props.datasource?.approvalHistories?.findIndex((v) => v.type === 0) >= 0 ? (
          <div style={{ marginTop: 10 }}>
            <Timeline
              items={EvaluationHisotryHelper.processingData(
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
      <Card style={{ marginTop: 20, paddingBottom: 0 }}>
        <Typography.Title level={4}>{t('IDS_EVALUATION')}</Typography.Title>
        {props.datasource && props.datasource?.approvalHistories?.findIndex((v) => v.type === 1) >= 0 ? (
          <div style={{ marginTop: 10 }}>
            <Timeline
              items={EvaluationHisotryHelper.processingData(
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
    </>
  );
};

export default EvaluationHistoryTimeline;
