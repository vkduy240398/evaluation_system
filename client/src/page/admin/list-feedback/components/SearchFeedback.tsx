import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Select, Tooltip } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useEffect, useRef } from 'react';
import localeJa from '../../../../@core/locales/jaDatePick';
import EmptyComponent from '../../../../common/EmptyComponent';

interface Props {
  form: FormInstance<any>;
  onFinish: any;
  isLoading: boolean;
  conditions: any;
  departments: any;
  typeFeedback: any;
  statusFeedback: any;
}

const SearchFeedback = ({
  onFinish,
  form,
  isLoading,
  conditions,
  departments,
  typeFeedback,
  statusFeedback,
}: Props) => {
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/M/D';
  const inputFocus = useRef<any>(null);
  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    // Can not select date after today

    return current > dayjs().endOf('day');
  };

  useEffect(() => {
    form.setFieldsValue(conditions);
    form.setFieldValue('rangeTime', [dayjs(conditions.dateStart), dayjs(conditions.dateEnd)]);
  }, []);

  return (
    <>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        style={{ position: 'relative' }}
        onFinish={onFinish}
      >
        <Form.Item label={t('IDS_FEEDBACK_PERIOD')} name="rangeTime" className="ant-form-item-info">
          <RangePicker
            id="periodFeedback"
            allowClear={false}
            disabledDate={disabledDate}
            locale={localeJa}
            defaultValue={[dayjs(conditions.dateStart), dayjs(conditions.dateEnd)]}
            format={dateFormat}
            style={{ width: 250 }}
            disabled={isLoading}
            onChange={(_values: any, formatString: [string, string]) => {
              // console.log('formatString[0]', formatString[0]);
              // console.log('formatString[1]', formatString[1]);
            }}
          />
        </Form.Item>
        <Form.Item
          label={t('IDS_TYPE_FEEDBACK')}
          colon={false}
          name={'typeFeedback'}
          initialValue={'0,1'}
          style={{ marginTop: 5 }}
        >
          <Select
            allowClear={false}
            style={{ width: '200px' }}
            size="small"
            loading={isLoading}
            options={typeFeedback}
            clearIcon={false}
          />
        </Form.Item>
        <Form.Item
          label={t('IDS_DEPARTMENT')}
          colon={false}
          name={'department'}
          initialValue={[t('IDS_ALL').toString()]}
          style={{ marginTop: 5 }}
        >
          <Select
            allowClear={false}
            showSearch
            style={{ width: '200px' }}
            size="small"
            loading={isLoading}
            options={departments}
            clearIcon={false}
            fieldNames={{ label: `name`, value: 'value' }}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item
          label={t('IDS_STATUS')}
          colon={false}
          name={'statusFeedback'}
          initialValue={'2,3,4,5,6,7'}
          style={{ marginTop: 5 }}
        >
          <Select
            allowClear={false}
            showSearch
            style={{ width: '200px' }}
            onChange={() => {}}
            size="small"
            loading={isLoading}
            options={statusFeedback}
            clearIcon={false}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <div style={{ width: '240px' }}>
          <Form.Item
            label={
              <Row>
                <Col>{t('IDS_USER')}</Col>
                <Col>
                  <Tooltip
                    title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
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
            colon={false}
            name="user"
            rules={[
              {
                max: 30,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
              },
            ]}
          >
            <Input ref={inputFocus} style={{ width: '200px' }} maxLength={31} disabled={isLoading} />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            name="Search"
            value="txt_feedback_search"
            loading={isLoading}
            className="main_button"
            icon={<SearchOutlined />}
            style={{ marginTop: 10 }}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SearchFeedback;
