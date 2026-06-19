//  ** Antd Imports
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Typography from 'antd/es/typography';

// ** Type Imports
import { statusEvaluationObj, statusEvaluationType } from '../../../common/status';

// ** I18 Imports
import { t } from 'i18next';
import { memo } from 'react';

type headerType = '評価目標詳細';
type Props = {
  header: headerType;
  fiscalYear: string;
  periodStart: string;
  periodEnd: string;
  fullName: string;
  department: string;
  division: string;
  evaluationLevel: string | number;
  evaluators: string[];
  statusName?: string;
  status: statusEvaluationType;
  isEvaluationDate: boolean;
  employeeNumber: string;
  isNotEvaluator2?: boolean;

  historyApproveEvaluation?: string;
  flagSkill?: number;
  isReview?: boolean;
  isEvaluatorUser: boolean;
  evaluatorOrder: number;
  isF5: boolean;
};
const UserEvaluationInforComponent = memo(
  (props: Props) => {
    const {
      department,
      division,
      evaluationLevel,
      evaluators,
      fiscalYear,
      periodStart,
      periodEnd,
      fullName,
      header,
      status,
      isEvaluationDate,
      isNotEvaluator2,
      employeeNumber,
      historyApproveEvaluation,
      flagSkill,
      isEvaluatorUser,
      evaluatorOrder,
      isF5,
      isReview,
    } = props;

    const renderCommentReject = () => {
      if (isEvaluatorUser) {
        return [2, 52].includes(status) && historyApproveEvaluation;
      } else {
        if (Number(evaluatorOrder) >= 2 || isF5) {
          return [2, 4, 6, 8, 52, 55, 58, 61].includes(status) && historyApproveEvaluation;
        }
        if (Number(evaluatorOrder) >= 1 || isF5) {
          return [2, 4, 6, 52, 55, 58].includes(status) && historyApproveEvaluation;
        }
        if (Number(evaluatorOrder) >= 0.5 || isF5) {
          return [2, 4, 52, 55].includes(status) && historyApproveEvaluation;
        }
      }
    };

    return (
      <Card style={{ marginBottom: 15 }}>
        {/* Header page */}
        <div>
          <Typography.Title level={3} style={{ paddingBottom: 10 }}>
            {header}
          </Typography.Title>
        </div>
        {/* Information */}
        <div>
          <Form
            labelAlign="left"
            colon={false}
            requiredMark={false}
            labelCol={{ span: 1 }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
          >
            {/* <Form.Item label={`${fiscalYear}評価表`} className="ant-form-item-info"></Form.Item> */}
            <div style={{ marginBottom: 5, marginTop: 5 }}>
              {fiscalYear}
              {t('IDS_EVALUATION_TABLE')}
            </div>
            <Form.Item
              label={t('IDS_EVALUATION_PERIOD')}
              className="ant-form-item-info"
            >{`${periodStart} ～ ${periodEnd}`}</Form.Item>
            <Form.Item label={t('IDS_FULLNAME')} className="ant-form-item-info">
              {employeeNumber}: {fullName}
            </Form.Item>
            <Form.Item label={t('IDS_DEPARTMENT')} className="ant-form-item-info">
              <Typography>{department || division}</Typography>
            </Form.Item>
            <Form.Item label={t('IDS_LEVEL')} className="ant-form-item-info">
              {evaluationLevel}
            </Form.Item>

            {/*sẽ bỏ điệu kiên <=7 khi bổ sung 8-10 skill */}
            {/* {(evaluationLevel as number) <= 7 && ( */}
            <Form.Item label={t('IDS_EVALUATION_SKILL')} className="ant-form-item-info">
              {flagSkill ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}
            </Form.Item>
            {/* )} */}

            <Form.Item label={t('IDS_EVALUATOR')} className="ant-form-item-info">
              {evaluators?.length > 0 && evaluators.join('、')}
            </Form.Item>
            {!isReview ? (
              <Form.Item label={t('IDS_STATUS')} className="ant-form-item-info">
                {status === 50 && isEvaluationDate
                  ? t('IDS_STATUS_EVALUATION_NOT_CREATE')
                  : statusEvaluationObj[status]}

                <br />

                {renderCommentReject()}
              </Form.Item>
            ) : (
              <></>
            )}

            {isNotEvaluator2 && (
              <Form.Item>
                <span style={{ color: 'red' }}>{t('MESSAGE.COMMON.IDM_NOT_EVALUATOR_2')}</span>
              </Form.Item>
            )}
          </Form>
        </div>
      </Card>
    );
  },
  (pre, next) => pre.status === next.status,
);

export default UserEvaluationInforComponent;
