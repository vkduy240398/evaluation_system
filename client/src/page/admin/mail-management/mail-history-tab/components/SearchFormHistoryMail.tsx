import { Button, DatePicker, Form, Radio, Select, Space } from 'antd';
import { t } from 'i18next';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import React, { useEffect, useRef } from 'react';
import EmptyComponent from '../../../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
import { conditionsMailHistory } from '../../interfaces/interfacesProps';
import { useLocation, useNavigate } from 'react-router-dom';
import { RangePickerProps } from 'antd/es/date-picker';

interface Props {
  handleSearchHistoryMail: (dataSearch: any) => void;
  setConditions: (data: conditionsMailHistory) => void;
  conditions: any;
  state: any;
  isLoading: boolean;
}

const SearchFormHistoryMail: React.FC<Props> = (props: Props) => {
  const statusOptions = [
    { label: t('IDS_ALL'), value: -1 },
    { label: t('IDS_NOT_SEND'), value: 0 },
    { label: t('IDS_SEND'), value: 1 },
  ];

  const { handleSearchHistoryMail, setConditions, conditions, state, isLoading } = props;
  const [form] = Form.useForm();
  const buttonFocus = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { RangePicker } = DatePicker;

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const end = dayjs().add(5, 'year');

    return dayjs().set('year', 2023) > current || current > end;
  };

  /** Handler func  */
  const handleSearch = async (value: any) => {
    const year = dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY');
    const years = form.getFieldValue('year') ?? [];
    const yearStart = years[0] ? dayjs(years[0], 'YYYY').format('YYYY') : '';
    const yearEnd = years[1] ? dayjs(years[1], 'YYYY').format('YYYY') : '';
    setConditions({
      ...conditions,
      yearStart,
      yearEnd,
      status: value.status,
      searchHistory: true,
      searchManage: false,
      offset: 0,
      limit: 20,
      current: 1,
      tabKey: '2',
    });

    handleSearchHistoryMail({
      ...conditions,
      yearStart,
      yearEnd,
      status: value.status,
      searchHistory: true,
      searchManage: false,
      offset: 0,
      limit: 20,
      current: 1,
      tabKey: '2',
    });

    navigate(location.pathname, {
      replace: true,
      state: {
        ...conditions,
        yearStart,
        yearEnd,
        status: value.status,
        searchHistory: true,
        searchManage: false,
        offset: 0,
        limit: 20,
        current: 1,
        tabKey: '2',
      },
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...conditions,
      year:
        conditions.yearStart !== '' && conditions.yearEnd !== ''
          ? [
              dayjs(moment(conditions.yearStart, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
              dayjs(moment(conditions.yearEnd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
            ]
          : [],
    });
  }, []);

  return (
    <>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_EVALUATION_PERIOD')} style={{ marginBottom: '10px' }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'}>
              {/* <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  return current && current > dayjs().add(5, 'year');
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: '100px' }}
              /> */}
              <RangePicker
                size={'small'}
                format={'YYYY'}
                picker="year"
                disabledDate={disabledDate}
                style={{ width: 180 }}
                allowClear={false}
                placeholder={[t('IDS_ALL'), '']}
                // allowEmpty={[false, false]}
              />
            </Form.Item>
            {/* <Form.Item name="periodIndex">
              <Radio.Group>
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item> */}
          </Space>
        </Form.Item>
        <Form.Item
          label={t('IDS_STATUS')}
          name="status"
          initialValue={{ label: t('IDS_ALL'), value: -1 }}
          colon={false}
          style={{ marginBottom: '10px' }}
        >
          <Select
            style={{ width: 180 }}
            defaultValue={{ label: t('IDS_ALL'), value: -1 }}
            options={statusOptions}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Button
          className="main_button"
          ref={buttonFocus}
          type="primary"
          name="Search"
          style={{ marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
          htmlType="submit"
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
    </>
  );
};

export default SearchFormHistoryMail;
