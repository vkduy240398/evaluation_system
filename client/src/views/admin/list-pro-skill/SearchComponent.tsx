import { Button, Col, Form, Row, Select } from 'antd';
import { i18n, TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import EmptyComponent from '../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
import proSkillSettingService from '../../../common/api/proSkillSetting';

interface Props {
  optionStatus: {
    label: string;
    value: number;
  }[];
  i18n: i18n;
  optionPublicStatus: {
    label: string;
    value: number;
  }[];
  t: TFunction;
  setIsloading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  getData: (searchCondition: { skillId: number; status: number }) => void;
  conditions: { skillId: number; status: number };
}
const { Option } = Select;
const SearchComponent = (props: Props) => {
  const { i18n, optionPublicStatus, optionStatus, t, setIsloading, isLoading, getData, conditions } = props;
  const [skills, setSkill] = useState<any[]>([{ label: t('IDS_ALL'), value: -1 }]);
  const [form] = Form.useForm();
  useEffect(() => {
    const callBack = (res: any) => {
      setSkill(res.skill);
      setIsloading(false);
    };

    const errorCallBack = () => {
      setIsloading(false);
    };
    // proSkillSettingService.getDepartmentRole({ callBack, errorCallBack });
    proSkillSettingService.getSkillRole({ callBack, errorCallBack });

    form.setFieldsValue({
      skillId: conditions.skillId || -1,
      status: conditions.status || -1,
    });
  }, []);
  const onFinish = (values: { skillId: number; status: number }) => {
    getData({ skillId: values.skillId, status: values.status });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false} // Ẩn dấu * đỏ nếu có field bắt buộc
        onFinish={onFinish}
        disabled={isLoading}
      >
        {/* gutter={[khoảng cách ngang, khoảng cách dọc]} */}
        <Row gutter={[24, 16]} align="bottom">
          {/* Cột Template: Chiếm diện tích lớn hơn một chút */}
          <Col xs={24} md={8} lg={7} xl={4} xxl={4}>
            <Form.Item
              name="skillId"
              label={<span style={{ fontWeight: 600, color: '#5f6368' }}>{t('IDS_TEMPLATE')}</span>}
              style={{ marginBottom: 0 }} // Xóa margin bottom mặc định của Form.Item để Row quản lý
            >
              <Select
                showSearch
                options={[{ label: t('IDS_ALL'), code: '-1', value: -1 }, ...skills]}
                filterOption={(input: any, option): any =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              />
            </Form.Item>
          </Col>

          {/* Cột Trạng thái */}
          <Col xs={24} md={6} lg={5} xl={4} xxl={4}>
            <Form.Item
              name="status"
              label={<span style={{ fontWeight: 600, color: '#5f6368' }}>{t('IDS_STATUS')}</span>}
              style={{ marginBottom: 0 }}
              initialValue={-1}
            >
              <Select
                placeholder={t('IDS_ALL')}
                defaultValue="all"
                size="large"
                style={{ width: '100%' }}
                options={optionStatus}
                filterOption={(input: any, option): any =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              />
            </Form.Item>
          </Col>

          {/* Cột Nút bấm: Căn lề phải hoặc đứng cạnh các input */}
          <Col xs={24} md={10} lg={12}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Row gutter={12} justify="start">
                <Col>
                  <Button
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    size="small"
                    style={{
                      backgroundColor: '#00796b',
                      paddingLeft: '30px',
                      paddingRight: '30px',
                      borderRadius: '6px',
                      height: 'unset',
                    }}
                  >
                    {t('IDS_BUTTON_SEARCH')}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default SearchComponent;
