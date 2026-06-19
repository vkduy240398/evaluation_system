import { Button, Cascader, Col, Form, FormInstance, Input, Row, Select, Tooltip } from 'antd';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { INonRelatedFeedbackSearchForm } from '../../../../model/Feedback';
import { optionsTargetScreens } from '../../../../common/targetScreen';

const KEYWORD_MAX_LENGTH = 200;

interface Props {
  form: FormInstance<INonRelatedFeedbackSearchForm>;
  onSearch: (values: INonRelatedFeedbackSearchForm) => void;
  isLoading: boolean;
}

export default function NonRelatedFeedbackSearchForm(props: Props) {
  useEffect(() => {
    props.form.setFieldsValue({
      type: null,
      status: null,
      phase: null,
      features: [],
      impactScope: null,
      keyword: '',
    });
  }, []);

  return (
    <Form
      name="create_template_form"
      initialValues={{ division: t('IDS_ALL'), department: t('IDS_ALL') }}
      colon={false}
      labelCol={{ span: 1 }}
      labelAlign="left"
      form={props.form}
      onFinish={props.onSearch}
    >
      <Form.Item name="type" label={t('IDS_TYPE_FEEDBACK')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))
              .map(([key, value]) => ({
                value: +key,
                label: value,
              }))
              .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value)),
          ]}
        />
      </Form.Item>
      <Form.Item name="phase" label={t('IDS_PHASE')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }))
              .map(([key, value]) => ({
                value: +key,
                label: value,
              }))
              .sort((o1, o2) => (o1.value === 0 ? 1 : o2.value === 0 ? -1 : o1.value - o2.value)),
          ]}
        />
      </Form.Item>
      <Form.Item name="features" label={t('IDS_TARGET_SCREEN')}>
        <Cascader
          style={{ width: '200px' }}
          size="small"
          options={optionsTargetScreens()}
          multiple={true}
          showSearch={true}
          displayRender={(labels) => {
            return `${labels[labels.length - 1]}${labels.length > 1 ? `（${t(labels[0])}）` : ''}`;
          }}
        />
      </Form.Item>
      <Form.Item name="impactScope" label={t('IDS_IMPACT_SCOPE')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            { label: t('IDS_HAVE_NOT_SET'), value: -1 },
            ...Object.entries(t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true })).map(([key, value]) => ({
              value: +key,
              label: value,
            })),
          ]}
        />
      </Form.Item>
      <Form.Item name="status" label={t('IDS_STATUS')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true })).map(([key, value]) => ({
              value: +key,
              label: value,
            })),
          ]}
        />
      </Form.Item>
      <Form.Item
        label={
          <Row>
            <Col>{t('IDS_KEYWORD')}</Col>
            <Col>
              <Tooltip
                title={t('IDS_TOOLTIP_SEARCH_FEEDBACK_EXPLAINATION')}
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <Icon
                  component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                  style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                />
              </Tooltip>
            </Col>
          </Row>
        }
        name="keyword"
        rules={[
          {
            max: KEYWORD_MAX_LENGTH,
            message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', KEYWORD_MAX_LENGTH.toString()),
          },
        ]}
      >
        <Input style={{ width: 200 }} maxLength={KEYWORD_MAX_LENGTH + 1} />
      </Form.Item>
      <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={props.isLoading}>
        {t('IDS_BUTTON_SEARCH')}
      </Button>
    </Form>
  );
}
