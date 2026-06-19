import { Card, Form, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import React, { startTransition } from 'react';
import { VersionSettingType } from '../../../../../constant/VersionSettingType';

interface Props {
  record: any;
  listStatus: any;
  statusNumber: any;
  isEdit: any;
  setRecord: any;
}

const CardCommonInfo = ({ record, listStatus, statusNumber, isEdit, setRecord }: Props) => {
  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_TITLE_CALCULATION')}
        </Typography.Title>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} className="ant-form-item-info">
          {record.type === VersionSettingType.LEVEL_8_10 ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}
        </Form.Item>
        <Form.Item label={t('IDS_LEVEL')} colon={false} className="ant-form-item-info">
          {'8 ～ 10'}
        </Form.Item>
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {record.version}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {listStatus[statusNumber]}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {record.creationUser}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {record.lastUpdatedTime}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {record.publicDate}
        </Form.Item>
        {isEdit ? (
          <Form.Item
            required={false}
            name={'reason'}
            label={t('IDS_HISTORY_EDIT')}
            colon={false}
            initialValue={record.reason}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              { max: 500, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500') },
            ]}
          >
            <TextArea
              autoSize
              placeholder={t('IDS_PLACEHOLDER_HISTORY_EDIT').toString()}
              style={{ whiteSpace: 'pre-wrap', width: '100%' }}
              onChange={(e) => {
                startTransition(() => {
                  setRecord({ ...record, reason: e.target.value });
                });
              }}
              maxLength={501}
            />
          </Form.Item>
        ) : (
          <Form.Item
            required={false}
            name={'reason'}
            label={t('IDS_HISTORY_EDIT')}
            colon={false}
            initialValue={record.reason}
            style={{ marginBottom: 0, wordBreak: 'break-word' }}
          >
            {record.reason}
          </Form.Item>
        )}
      </Card>
    </>
  );
};

export default CardCommonInfo;
