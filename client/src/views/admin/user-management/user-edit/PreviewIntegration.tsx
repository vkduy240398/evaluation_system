import React, { useState } from 'react';
import { Card, Radio, Button, Space, Table, Typography, Row, Col, ConfigProvider, Tooltip, Form } from 'antd';
import type { FormInstance, RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Icon, {
  SettingFilled,
  EyeOutlined,
  CheckOutlined,
  InfoCircleFilled,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { TFunction } from 'i18next';
import httpAxios from '../../../../common/http';
import { CompanyProps, DivisionProps, LevelProps } from '../../../../page/admin/user-management/interfaces';
import { compareArrayNumber } from '../../../../page/admin/user-detail/processes';

const { Text } = Typography;

// 1. Tối ưu TypeScript: Dùng Union Type để giới hạn giá trị Radio chỉ được là 1 hoặc 2
type UpdateOptionValue = -1 | 1 | 2;

// 2. Định nghĩa Interface cho dữ liệu bảng
interface ImpactRecord {
  key: string;
  name: string;
  oldValue: number;
  newValue: number;
  impacts: string[];
}
interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}
type StateType = {
  departmentId: number;
  department: { id: number; name: string; code: string };
  companyId: number;
  company: { id: number; name: string; code: string };
  divisionId: number;
  division: { id: number; name: string; code: string };
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  level: number;
  flagSkill: number;
  roles: RoleProps[];
  updatedTime: string | undefined;
};
interface Props {
  t: TFunction;
  id: string | undefined;
  form: FormInstance;
  recordInfo: StateType;
  listCompanys: CompanyProps[];
  levelList: LevelProps[];
  listDepartmentTypeDivisions: DivisionProps[];
}
interface DataChange {
  employeeNumber: number;
  fullName: string;
  userEvaluationChange: string;
  userInforChange: string;
}
const PreviewIntegration: React.FC<Props> = (props: Props) => {
  const { t, form, id, recordInfo, listCompanys, levelList, listDepartmentTypeDivisions } = props;
  // Khai báo state với type chuẩn
  const [selectedOption, setSelectedOption] = useState<UpdateOptionValue>(-1);

  const currentRadioValue = Form.useWatch('radioLevelvalue', form);
  // Ép kiểu chuẩn cho sự kiện thay đổi Radio
  const handleOptionChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value as UpdateOptionValue);
  };

  const tealColor = '#007361';

  return (
    <div>
      <div style={{ marginBottom: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <SettingFilled style={{ color: tealColor, fontSize: '20px', marginRight: '8px' }} />
          <h3 style={{ margin: 0, color: tealColor, fontSize: '18px', fontWeight: 'bold' }}>
            目標設定の更新オプション
          </h3>
        </div>
        <Form.Item name={'radioLevelvalue'}>
          {/* Bỏ hoàn toàn value và onChange thủ công ở Radio.Group, để Form.Item tự lo */}
          <Radio.Group style={{ width: '100%', marginBottom: '12px' }}>
            <Row gutter={16}>
              {/* === Ô RADIO 1 === */}
              <Col span={12}>
                <div
                  // Mẹo: Thêm onClick trực tiếp vào Div bao ngoài để click cả vùng card đều ăn Đúp
                  onClick={() => form.setFieldValue('radioLevelvalue', 1)}
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${currentRadioValue === 1 ? tealColor : '#d9d9d9'}`,
                    borderRadius: '6px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: currentRadioValue === 1 ? '#f6fbf9' : '#fff',
                  }}
                >
                  <Radio value={1}>
                    {/* SỬA TẠI ĐÂY: Thay thẻ <div> bằng thẻ <span> với display: 'block' để đúng chuẩn HTML */}
                    <span
                      style={{
                        display: 'block',
                        color: currentRadioValue === 1 ? tealColor : 'inherit',
                        fontWeight: currentRadioValue === 1 ? 600 : 400,
                      }}
                    >
                      {t('IDS_RESET_ALL')}
                    </span>
                    <Typography.Text
                      style={{
                        fontSize: '10px',
                        lineHeight: '1.4',
                        color: '#6b7280',
                        display: 'block', // Đảm bảo xuống dòng gọn gàng
                      }}
                    >
                      {t('IDS_RESET_DATA_EVALUATION')}
                    </Typography.Text>
                  </Radio>
                </div>
              </Col>

              {/* === Ô RADIO 2 === */}
              <Col span={12}>
                <div
                  onClick={() => form.setFieldValue('radioLevelvalue', 2)}
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${currentRadioValue === 2 ? tealColor : '#d9d9d9'}`,
                    borderRadius: '6px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    backgroundColor: currentRadioValue === 2 ? '#f6fbf9' : '#fff',
                  }}
                >
                  <Radio value={2}>
                    {/* SỬA TẠI ĐÂY: Thay thẻ <div> bằng thẻ <span> */}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        color: currentRadioValue === 2 ? tealColor : 'inherit',
                        fontWeight: currentRadioValue === 2 ? 600 : 400,
                      }}
                    >
                      {t('IDS_RESET_BEHAVIOR')}
                    </span>
                  </Radio>
                </div>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
};

export default PreviewIntegration;
