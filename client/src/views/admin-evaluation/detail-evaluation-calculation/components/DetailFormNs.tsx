/* eslint-disable @typescript-eslint/naming-convention */
import { Affix, Button, Card, Col, Form, Grid, Row, Tabs, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { VersionSettingType } from '../../../../constant/VersionSettingType';
import { VersionSettingStatus } from '../../../../constant/VersionSettingStatus';
import { getItemTagNs } from './ItemTabNs';
import { BASIC_KEY } from './ItemTab';

interface Props {
  dataSource: any;
  setDataSource: any;
  form: any;
  isEdit: boolean;
  onChangeReason: any;
  onChangeTabs: any;
  openNotification: any;
  currentTab: any;
  onEdit: any;
  setIsOpenPublicConfirm: any;
  onSaveDraft: any;
  setIsOpenCancelConfirm: any;
  setIsOpenSavePublicConfirm: any;
  onValidateSavePublic: any;
  isLoading: boolean;
  isSaveDraft: boolean;
}

const DetailFormNs = (props: Props) => {
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [hasButton, setHasButton] = useState<boolean>(true);
  const [keyReason, setKeyReason] = useState(Math.random());
  const breaks = Grid.useBreakpoint();
  const TEXT_1_7_NS = '1 ～ 7';

  useEffect(() => {
    if (
      !(props.dataSource?.status === VersionSettingStatus.PUBLIC && !props.dataSource.existEditingVersion) &&
      props.dataSource?.status !== VersionSettingStatus.PRIVATE &&
      !(props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING)
    ) {
      setHasButton(false);
    } else {
      setHasButton(true);
    }
  }, [props.dataSource]);

  useEffect(() => {
    setKeyReason(Math.random());
  }, [props.isSaveDraft]);

  return (
    <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }} form={props.form}>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_TITLE_CALCULATION')}
        </Typography.Title>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} className="ant-form-item-info">
          {t('IDS_NOT_HAVE')}
        </Form.Item>
        <Form.Item label={t('IDS_LEVEL')} colon={false} className="ant-form-item-info">
          {props.dataSource?.type === VersionSettingType.LEVEL_1_7_NO_SKILL ? TEXT_1_7_NS : ''}
        </Form.Item>
        <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
          {props.dataSource?.versionDisplay}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
          {
            (t('IDL_LIST_STATUS_VERSION_SETTING', { returnObjects: true }) as any)[
              props.isEdit ? 1 : props.dataSource.status
            ]
          }
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
          {props.dataSource?.user?.fullName}
        </Form.Item>
        <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
          {props.dataSource?.lastUpdatedTime}
        </Form.Item>
        <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info">
          {props.dataSource?.publicDate}
        </Form.Item>
        <Form.Item
          key={keyReason}
          label={t('IDS_HISTORY_EDIT')}
          colon={false}
          required={false}
          initialValue={props.dataSource.reason}
          name="reason"
          style={{ marginBottom: 0 }}
          rules={[
            {
              validator: async (_, value) => {
                if (!value) {
                  return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
                }
                if (value.length > 500) {
                  return Promise.reject(
                    new Error(t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500')),
                  );
                }
              },
            },
          ]}
        >
          {props.isEdit || props.dataSource.status === VersionSettingStatus.EDITING ? (
            <TextArea
              autoSize
              defaultValue={props.dataSource.reason || ''}
              placeholder={t('IDS_PLACEHOLDER_HISTORY_EDIT').toString()}
              style={{ whiteSpace: 'pre-wrap', width: '100%' }}
              onChange={props.onChangeReason}
              maxLength={501}
            />
          ) : (
            <div style={{ wordBreak: 'break-word' }}>{props.dataSource?.reason}</div>
          )}
        </Form.Item>
      </Card>

      <div style={{ marginTop: 15 }}>
        <div>
          <Tabs
            type="card"
            items={getItemTagNs({
              dataSource: props.dataSource,
              setDataSource: props.setDataSource,
              form: props.form,
              isEdit: props.isEdit,
              openNotification: props.openNotification,
              isLoading: props.isLoading,
              isSaveDraft: props.isSaveDraft,
            })}
            onChange={props.onChangeTabs}
            defaultActiveKey={props.currentTab || BASIC_KEY}
            activeKey={props.currentTab}
          />
        </div>
        {props.dataSource?.status !== VersionSettingStatus.CANCEL && hasButton && (
          <Affix
            offsetBottom={0}
            style={{ paddingBottom: 10 }}
            onChange={(affixed) => {
              setIsAffixed(affixed);
            }}
          >
            <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
              <Row gutter={{ xs: 8, sm: 16, md: 20, lg: 10 }}>
                {!(props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING) && (
                  <>
                    {props.dataSource?.status === VersionSettingStatus.PUBLIC &&
                      !props.dataSource.existEditingVersion && (
                        <Col>
                          <Button type="primary" className="button-normal" onClick={props.onEdit} loading={props.isLoading}>
                            {t('IDS_EDIT')}
                          </Button>
                        </Col>
                      )}
                    {props.dataSource?.status === VersionSettingStatus.PRIVATE && (
                      <Col>
                        <Button
                          type="primary"
                          className="button-normal"
                          loading={props.isLoading}
                          onClick={() => props.setIsOpenPublicConfirm(true)}
                        >
                          {t('IDS_PUBLIC')}
                        </Button>
                      </Col>
                    )}{' '}
                  </>
                )}

                {(props.isEdit || props.dataSource?.status === VersionSettingStatus.EDITING) && (
                  <>
                    <Col style={{ marginBottom: breaks.xs ? '0.5rem' : 0 }}>
                      <Button
                        type="primary"
                        className="button-normal"
                        onClick={props.onSaveDraft}
                        loading={props.isLoading}
                      >
                        {t('IDS_BUTTON_SAVE_DRAFT')}
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        type="primary"
                        className="button-normal"
                        onClick={() => props.setIsOpenCancelConfirm(true)}
                        loading={props.isLoading}
                      >
                        {t('IDS_BUTTON_CANCELED')}
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        type="primary"
                        className="button-normal"
                        onClick={() => props.onValidateSavePublic()}
                        loading={props.isLoading}
                      >
                        {t('IDS_BUTTON_SAVE_PUBLIC')}
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </Affix>
        )}
      </div>
    </Form>
  );
};

export default DetailFormNs;
