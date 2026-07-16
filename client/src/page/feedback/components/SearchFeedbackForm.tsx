import { FC, useEffect, useState } from 'react';
import { Button, Cascader, CascaderProps, Col, DatePicker, Form, Input, Select, Tooltip } from 'antd';
import localeJa from '../../../@core/locales/jaDatePick';
import dayjs from 'dayjs';
import { FeedbackCondition, FeedbackSearchForm } from '../../../model/Feedback';
import { useTranslation } from 'react-i18next';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import useForm from 'antd/es/form/hooks/useForm';
import { getListExceptRoleByUser, getListKeyExceptRole, optionsTargetScreens } from '../../../common/targetScreen';
import { useLocation } from 'react-router-dom';
import { Row } from 'antd/lib';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  isFetching: boolean;
  condition: FeedbackCondition;
  handleSearch: (values: FeedbackSearchForm) => void;
  role: 'user' | 'admin' | 'systemAdmin';
  isLoading: boolean;
  search: boolean;
  resultCount: number;
  onExport: () => void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
  disableCheckbox?: boolean;
  key?: string;
}

const DATE_FORMAT = 'YYYY/M/D';

const SearchFeedbackForm: FC<Props> = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = useForm<FeedbackSearchForm>();
  const [optionLength, setOptionLength] = useState<number>(0);
  const location = useLocation();
  const { user } = useAuth();
   const auth = useAuth();
  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';

  useEffect(() => {
    const errors = form.getFieldsError();
    const errorFields = errors.filter((err) => err.errors.length > 0).map((err) => err.name); // Lấy danh sách các field đang có lỗi

    if (errorFields.length > 0) {
      form.validateFields(errorFields); // Chỉ validate lại các field có lỗi
    }
  }, [i18n.language]);
  useEffect(() => {
    form.setFieldsValue({
      type: location?.state?.type || null,
      status: location?.state?.status || null,
      phase: location?.state?.phase || null,
      feature: location?.state?.feature || [],
      impactScope: location?.state?.impactScope || null,
      keywork: location?.state?.keywork,
      dates: location?.state?.dates
        ? (location?.state?.dates?.map((d: any) => dayjs(d)) as [dayjs.Dayjs, dayjs.Dayjs])
        : ([new Date().setMonth(new Date().getMonth() - 1), new Date()].map((d: any) => dayjs(d)) as [
            dayjs.Dayjs,
            dayjs.Dayjs,
          ]),
    });
    setOptionLength(form.getFieldValue('feature').length);
  }, []);
  const onChange: CascaderProps<Option>['onChange'] = (value: (string | number)[][]) => {
    setOptionLength(value.length);
  };

  return (
    <Form
      form={form}
      colon={false}
      labelCol={{ span: 1 }}
      labelAlign="left"
      onFinish={(values) => props.handleSearch({ ...values, current: 1, offset: 0 })}
    >
      <Form.Item name="dates" label={t('IDS_FEEDBACK_PERIOD')}>
        <DatePicker.RangePicker
          style={{ width: '200px' }}
          disabledDate={(current) => current > dayjs.tz(dayjs(), timeZone)}
          locale={localeJa}
          format={DATE_FORMAT}
          allowClear={false}
        />
      </Form.Item>
      <Form.Item name="type" label={t('IDS_TYPE_FEEDBACK')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_TYPE_FEEDBACK_OPTIONS', { returnObjects: true }))
              .sort((a, b) => (a[0] === '0' ? 1 : b[0] === '0' ? -1 : 0))
              .map(([key, value]) => ({
                value: key,
                label: value,
              })),
          ]}
        />
      </Form.Item>
      <Form.Item name="phase" label={t('IDS_PHASE')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_PHASE_FEEDBACK_OPTIONS', { returnObjects: true }))
              .sort((a, b) => (a[0] === '0' ? 1 : b[0] === '0' ? -1 : 0))
              .map(([key, value]) => ({
                value: key,
                label: value,
              })),
          ]}
        />
      </Form.Item>
      <Form.Item name="feature" label={t('IDS_TARGET_SCREEN')}>
        <Cascader
          style={{ width: optionLength > 0 ? '250px' : '200px' }}
          options={optionsTargetScreens(getListKeyExceptRole(user?.roles, props.role))}
          onChange={onChange}
          multiple={true}
          showSearch={true}
          displayRender={(labels) => {
            return `${labels[labels.length - 1]}${labels.length > 1 ? `（${t(labels[0])}）` : ''}`;
          }}
        />
      </Form.Item>
      {props.role !== 'user' && (
        <Form.Item name="impactScope" label={t('IDS_IMPACT_SCOPE')}>
          <Select
            style={{ width: '200px' }}
            options={[
              { label: t('IDS_ALL'), value: null },
              { label: t('IDS_HAVE_NOT_SET'), value: -1 },
              ...Object.entries(t('IDS_IMPACT_SCOPE_OPTIONS', { returnObjects: true })).map(([key, value]) => ({
                value: key,
                label: value,
              })),
            ]}
          />
        </Form.Item>
      )}

      <Form.Item name="status" label={t('IDS_STATUS')}>
        <Select
          style={{ width: '200px' }}
          options={[
            { label: t('IDS_ALL'), value: null },
            ...Object.entries(t('IDS_STATUS_FEEDBACK_OPTIONS', { returnObjects: true })).map(([key, value]) => ({
              value: key,
              label: value,
            })),
          ]}
        />
      </Form.Item>
      <Form.Item
        name="keywork"
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
        rules={[
          {
            max: 200,
            message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '200'),
          },
        ]}
      >
        <Input style={{ width: '200px' }} maxLength={201} />
      </Form.Item>
      <Row>
        <Col>
          <Button
            style={{ marginTop: '10px', marginBottom: '10px' }}
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={props.isFetching}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Col>
        <Col style={{ marginLeft: 'auto' }}>
          {props.role !== 'user' && props.search && (
            <Button
              style={{ marginTop: '10px', marginBottom: '10px' }}
              type="primary"
              onClick={props.onExport}
              loading={props.isLoading}
              className="main_button"
              disabled={props.resultCount === 0}
            >
              {t('IDS_LABLE_OUTPUT_LIST_USER')}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default SearchFeedbackForm;
