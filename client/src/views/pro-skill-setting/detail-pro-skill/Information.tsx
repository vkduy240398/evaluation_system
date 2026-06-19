import { Form } from 'antd/lib';
import { proSkillPublicStatus, proSkillStatus } from '../../../common/status';
import { t } from 'i18next';
interface Props {
  dataState: any;
  isReadOnly?: boolean;
}
const Information = (props: Props) => {
  const { dataState, isReadOnly } = props;

  return (
    <div>
      <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }}>
        <Form.Item label={t('IDS_TEMPLATE')} colon={false} className="ant-form-item-info">
          {dataState.dataSource?.skill}
        </Form.Item>

        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {`${dataState.dataSource?.version || ''}`}
        </Form.Item>
        {!isReadOnly && (
          <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
            {proSkillStatus[dataState.dataSource.status]}
          </Form.Item>
        )}
        {!isReadOnly && dataState.dataSource.status === 5 && (
          <Form.Item label={t(' ')} colon={false} className="ant-form-item-info">
            {dataState.dataSource.rejectComment}
          </Form.Item>
        )}
        <Form.Item label={t('IDS_STATUS_PUBLIC')} colon={false} className="ant-form-item-info">
          {proSkillPublicStatus[dataState.dataSource.publicStatus]}
        </Form.Item>

        <Form.Item label={t('IDS_SETTER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {dataState.dataSource?.settersAndApprovers
            ? dataState.dataSource?.settersAndApprovers.setters.join('、')
            : ''}
        </Form.Item>
        <Form.Item label={t('IDS_APPROVER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {dataState.dataSource?.settersAndApprovers
            ? dataState.dataSource?.settersAndApprovers.approvers.join('、')
            : ''}
        </Form.Item>

        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {`${dataState.dataSource?.user?.fullName || dataState.dataSource?.userUpdated || ''}`}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {dataState.dataSource?.lastUpdatedTime}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {dataState.dataSource?.publicDate || null}
        </Form.Item>
        {!isReadOnly && (
          <Form.Item label={t('IDS_HISTORY_EDIT')} colon={false} style={{ marginBottom: 0, wordBreak: 'break-word' }}>
            {dataState.dataSource?.reason || ''}
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default Information;
