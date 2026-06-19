import Form from 'antd/es/form';
import { proSkillPublicStatus, proSkillStatus } from '../../../common/status';
import { t } from 'i18next';
import { Typography } from 'antd';

interface Props {
  data: {
    creationUser: string;
    skill: string;
    versionId: number;
    publicDate: string;
    publicStatus: number;
    status: number;
    subVersion: number;
    versionMain: number;
    updatedTime: Date;
    version: string;
    reason: string;
    lastUpdatedTime: string;
    childrens: any[];
    settersAndApprovers: {
      setters: string[];
      approvers: string[];
    };
    rejectComment?: any;
  };
}
const Information = (props: Props) => {
  const { data } = props;

  return (
    <>
      <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }}>
        <Form.Item label={t('IDS_TEMPLATE')} colon={false} className="ant-form-item-info">
          <Typography>{data.skill}</Typography>
          {/* {data.listDepartment !== '' && <span>{`(${data.listDepartment?.trim()})`}</span>} */}
        </Form.Item>
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {data.version}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {proSkillStatus[data.status]}
        </Form.Item>
        {data.status === 5 && (
          <Form.Item label={t(' ')} colon={false} className="ant-form-item-info">
            {data.rejectComment}
          </Form.Item>
        )}
        <Form.Item label={t('IDS_STATUS_PUBLIC')} colon={false} className="ant-form-item-info">
          {proSkillPublicStatus[data.publicStatus]}
        </Form.Item>
        <Form.Item label={t('IDS_SETTER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {data.settersAndApprovers.setters.join('、')}
        </Form.Item>
        <Form.Item label={t('IDS_APPROVER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {data.settersAndApprovers.approvers.join('、')}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {`${data.creationUser}`}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {data?.lastUpdatedTime}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {data?.publicDate}
        </Form.Item>
        <Form.Item label={t('IDS_HISTORY_EDIT')} colon={false} style={{ marginBottom: 0, wordBreak: 'break-word' }}>
          {data?.reason || ''}
        </Form.Item>
      </Form>
    </>
  );
};

export default Information;
