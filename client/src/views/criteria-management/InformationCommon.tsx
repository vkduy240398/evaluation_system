import Form from 'antd/lib/form';
import { t } from 'i18next';
interface Props {
  version: string;
  status: string;
  userUpdated: string;
  lastestUpdated: string;
  datePublic: string;
  reasonPublic: string;
  level: number | null;
  type: number;
}
const InformationCommon = (props: Props) => {
  const { version, status, userUpdated, lastestUpdated, datePublic, reasonPublic, level, type } = props;

  return (
    <>
      <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }}>
        <Form.Item label={t('IDS_LEVEL')} colon={false} className="ant-form-item-info">
          {level}
        </Form.Item>

        {type === 2 || type === 3 || type === 5 || type === 6 ? (
          <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} className="ant-form-item-info">
            {type === 2 || type === 5 ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}
          </Form.Item>
        ) : null}
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {version}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {status}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {userUpdated}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {lastestUpdated}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {datePublic}
        </Form.Item>
        <Form.Item label={t('IDS_HISTORY_EDIT')} colon={false} style={{ marginBottom: 0, wordBreak: 'break-word' }}>
          {reasonPublic}
        </Form.Item>
      </Form>
    </>
  );
};

export default InformationCommon;
