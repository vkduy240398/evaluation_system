import { Card, Typography, Form } from 'antd';
import { t } from 'i18next';
import { proSkillStatus, proSkillPublicStatus } from '../../../common/status';

interface Props {
  dataState: any;
}
const CommonInformationDetailProSkillApprove = (props: Props) => {
  const { dataState } = props;

  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {dataState.dataSource.status === 3 ? t('IDS_APPROVER_DETAIL') : t('IDS_DETAIL_EVALUATION_ITEM')}
        </Typography.Title>
        <Form
          labelAlign="left"
          labelCol={{ span: 1 }}
          layout="horizontal"
          style={{ width: '100%' }}
          colon={false}
          requiredMark={false}
        >
          <Form.Item label={t('IDS_TEMPLATE')} className="ant-form-item-info">
            <Typography>{dataState.dataSource?.skill || ''}</Typography>
          </Form.Item>
          <Form.Item label={t('IDS_VERSION')} className="ant-form-item-info">
            {`${dataState.dataSource?.version || ''}`}
          </Form.Item>
          <Form.Item label={t('IDS_STATUS')} className="ant-form-item-info">
            {proSkillStatus[dataState.dataSource.status]}
          </Form.Item>
          {dataState.dataSource.status === 5 && (
            <Form.Item label={' '} className="ant-form-item-info" colon={false}>
              {dataState.dataSource.rejectComment}
            </Form.Item>
          )}
          <Form.Item label={t('IDS_STATUS_PUBLIC')} className="ant-form-item-info">
            {proSkillPublicStatus[dataState.dataSource.publicStatus]}
          </Form.Item>
          <Form.Item label={t('IDS_SETTER_PRO_SKILL')} className="ant-form-item-info">
            {`${
              dataState.dataSource?.listSettersAndApprovers
                ? dataState.dataSource?.listSettersAndApprovers.setters.join('、')
                : ''
            }`}
          </Form.Item>
          <Form.Item label={t('IDS_APPROVER_PRO_SKILL')} className="ant-form-item-info">
            {`${
              dataState.dataSource?.listSettersAndApprovers
                ? dataState.dataSource?.listSettersAndApprovers.approvers.join('、')
                : ''
            }`}
          </Form.Item>
          <Form.Item label={t('IDS_LAST_UPDATE_USER')} className="ant-form-item-info">
            {`${dataState.dataSource?.userUpdated || ''}`}
          </Form.Item>
          <Form.Item label={t('IDS_LAST_UPDATE_DATE')} className="ant-form-item-info">
            {dataState.dataSource?.lastUpdatedTime}
          </Form.Item>
          <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
            {dataState.dataSource?.publicDate}
          </Form.Item>
          <Form.Item label={t('IDS_HISTORY_EDIT')} colon={false} style={{ marginBottom: 0, wordBreak: 'break-word' }}>
            {dataState.dataSource?.reason || ''}
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
export default CommonInformationDetailProSkillApprove;
