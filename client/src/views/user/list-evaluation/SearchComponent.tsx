import { useEffect, useRef } from 'react';
import { Button, DatePicker, Form } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { conditionsEvaluation } from '../../../model/Conditions';
import { t } from 'i18next';
import { SearchOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  conditions: conditionsEvaluation;
  setConditions: (data: any) => void;
  setDataSources: (data: any) => void;
  isLoading: boolean;
}
const SearchComponent = (props: Props) => {
  const auth = useAuth();
  const { conditions, setConditions, isLoading } = props;
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const buttonFocus = useRef<HTMLButtonElement>(null);

  const handleSearch = () => {
    const years = form.getFieldValue('year');
    const yearStart = dayjs(years[0], 'YYYY').format('YYYY');
    const yearEnd = dayjs(years[1], 'YYYY').format('YYYY');
    setConditions({ ...conditions, yearStart, yearEnd, search: true });
  };
  useEffect(() => {
    const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
    moment.tz(timeZone);
    form.setFieldsValue({
      year: [
        dayjs(moment(conditions.yearStart, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(conditions.yearEnd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
    });
  }, []);

  const timeZone = auth.user?.timeZone || 'Asia/Tokyo';
  const nows = dayjs.tz(dayjs(), timeZone);
  const defaultYear = dayjs().set('year', 2023);
  const endYear = nows.add(5, 'year');
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return defaultYear > current || current > endYear;
  };

  return (
    <>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        onFinish={handleSearch}
        colon={false}
        style={{ marginBottom: 20 }}
      >
        <Form.Item label={t('IDS_EVALUATION_PERIOD')} name={'year'} style={{ marginBottom: 15 }}>
          <RangePicker
            size={'small'}
            picker="year"
            // disabledDate={disabledDate}
            clearIcon={false}
            style={{ width: 180 }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            ref={buttonFocus}
            htmlType="submit"
            type="primary"
            name="Search"
            value="Search"
            loading={isLoading}
            className="main_button"
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default SearchComponent;
