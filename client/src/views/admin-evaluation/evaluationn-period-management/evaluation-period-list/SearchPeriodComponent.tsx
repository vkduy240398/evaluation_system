import { DatePicker, Form, FormInstance } from 'antd';
import { TFunction } from 'i18next';
import { Dayjs } from 'dayjs';
import React from 'react';
import { MainButton } from '../../../../common/MainButton';
import { SearchOutlined } from '@ant-design/icons';
interface Props {
  form: FormInstance;
  t: TFunction;
  yearStart: number;
  currentYear: Dayjs;
  isLoading: boolean;
  handleSearch: () => void;
}
const { RangePicker } = DatePicker;

const SearchPeriodComponent = (props: Props) => {
  const disabledDate = (current: Dayjs): boolean => {
    // Trả về true nếu năm được chọn lớn hơn năm hiện tại
    return current && current.isAfter(currentYear, 'year');
  };
  const { form, t, currentYear, isLoading, handleSearch } = props;

  return (
    <>
      <Form
        layout="vertical" // Giữ vertical để label nằm trên input, hoặc "horizontal" nếu muốn label bên trái input
        form={form}
        disabled={isLoading}
      >
        <Form.Item label={t('IDS_YEAR')} colon={false} style={{ marginBottom: 0 }} name={'year'}>
          <RangePicker
            format={'YYYY'}
            clearIcon={false}
            picker="year"
            size="small"
            disabledDate={disabledDate}
            style={{ width: 180 }}
          />
        </Form.Item>
        <MainButton
          type="primary"
          onClick={handleSearch}
          style={{ marginTop: 15 }}
          loading={isLoading}
          icon={<SearchOutlined />}
          size="middle"
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
    </>
  );
};

export default SearchPeriodComponent;
