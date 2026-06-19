import { Card, Form, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { criteriaEvaluationStatus } from '../../../../../common/status';
import { VersionSettingType } from '../../../../../constant/VersionSettingType';

interface Props {
  dataSources: any;
}

const CommonInformationEvaluationCriteriaDescription = (props: Props) => {
  const { dataSources } = props;

  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_EVALUATION_CRITERIA_DETAIL')}
        </Typography.Title>
        <Form.Item label={t('IDS_LEVEL')} colon={false} className="ant-form-item-info">
          {dataSources?.data.level}
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} className="ant-form-item-info">
          {dataSources?.data.type === VersionSettingType.LEVEL_1_7 ||
          dataSources?.data.type === VersionSettingType.LEVEL_8_10
            ? t('IDS_HAVE')
            : t('IDS_NOT_HAVE')}
        </Form.Item>
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {dataSources?.data.status !== 2 && dataSources?.data.status !== 1
            ? `${dataSources?.data.version}.${dataSources?.subVersion + 1}`
            : `${dataSources.data.version}.${dataSources.data.subVersion}`}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {dataSources?.data.status !== 2 ? criteriaEvaluationStatus['1'] : dataSources.data.statusName}
        </Form.Item>

        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {dataSources?.data.status !== 2 && dataSources?.data.status !== 1 ? '' : dataSources.data.updatedBy}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {dataSources?.data.status !== 2 && dataSources?.data.status !== 1 ? '' : dataSources.data.lastUpdatedTime}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {dataSources?.data.status !== 2 || dataSources?.data.status === 1 ? '' : dataSources?.data.publicDate}
        </Form.Item>
        <Form.Item
          name={'reason'}
          label={t('IDS_HISTORY_EDIT')}
          colon={false}
          required={false}
          style={{ marginBottom: 0 }}
          rules={[
            { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
            {
              max: 500,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
            },
          ]}
        >
          <TextArea
            maxLength={501}
            autoSize
            style={{ whiteSpace: 'pre-wrap' }}
            placeholder={t('IDS_PLACEHOLDER_HISTORY_EDIT').toString()}
          />
        </Form.Item>
      </Card>
    </>
  );
};
export default CommonInformationEvaluationCriteriaDescription;
