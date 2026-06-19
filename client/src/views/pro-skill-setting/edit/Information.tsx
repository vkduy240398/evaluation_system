import { Card, Form, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { DataSourceEditProSkill } from '../../../page/detail-pro-skill/interfaces/Interfaces';
import { proSkillPublicStatus, proSkillStatus } from '../../../common/status';
import { t } from 'i18next';
import { memo } from 'react';
interface Props {
  dataSources: any;
  isLoading: boolean;
}
const Information = (props: Props) => {
  const { dataSources, isLoading } = props;

  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_DETAIL_PRO_SKILL')}
        </Typography.Title>

        <Form.Item label={t('IDS_TEMPLATE')} colon={false} className="ant-form-item-info">
          <Typography>{dataSources?.data.skill || ''}</Typography>
          {/* {dataSources?.data.listDepartment !== '' && <span>{`(${dataSources?.data.listDepartment?.trim()})`}</span>} */}
        </Form.Item>
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {`${
            dataSources.data.status !== 2 && dataSources.data.status !== 1 && dataSources.data.status !== 5
              ? `${dataSources.data.versionMain}.${dataSources.subVersion + 1}`
              : dataSources?.data.version || ''
          }`}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {dataSources.data.status !== 2 && dataSources.data.status !== 5
            ? proSkillStatus['1']
            : proSkillStatus[dataSources.data.status]}
        </Form.Item>
        {dataSources.data.status === 5 && (
          <Form.Item label={' '} className="ant-form-item-info" colon={false}>
            {dataSources?.rejectComment}
          </Form.Item>
        )}
        <Form.Item label={t('IDS_STATUS_PUBLIC')} colon={false} className="ant-form-item-info">
          {dataSources.data.status !== 2 && dataSources.data.status !== 5
            ? proSkillPublicStatus[0]
            : proSkillPublicStatus[dataSources.data.publicStatus]}
        </Form.Item>
        <Form.Item label={t('IDS_SETTER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {dataSources.settersAndApprovers ? dataSources.settersAndApprovers.setters.join('、') : ''}
        </Form.Item>
        <Form.Item label={t('IDS_APPROVER_PRO_SKILL')} colon={false} className="ant-form-item-info">
          {dataSources.settersAndApprovers ? dataSources.settersAndApprovers.approvers.join('、') : ''}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {`${
            ((dataSources.data.status === 1 || dataSources.data.status === 5) &&
              (dataSources?.data?.createdUser?.fullName || dataSources?.data?.userUpdated)) ||
            ''
          }`}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {(dataSources.data.status === 1 || dataSources.data.status === 5) &&
            dataSources?.data.updated !== null &&
            dataSources?.data.lastUpdatedTime}
        </Form.Item>
        <Form.Item
          name={'reason'}
          label={t('IDS_HISTORY_EDIT')}
          colon={false}
          required={false}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString(),
            },
            {
              max: 500,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
            },
          ]}
        >
          <TextArea
            disabled={isLoading}
            autoSize
            style={{ whiteSpace: 'pre-wrap' }}
            placeholder={t('IDS_PLACEHOLDER_HISTORY_EDIT').toString()}
            maxLength={501}
          />
        </Form.Item>
      </Card>
    </>
  );
};

export default memo(Information, (pre, next) => pre.isLoading === next.isLoading);

// export default Information;
