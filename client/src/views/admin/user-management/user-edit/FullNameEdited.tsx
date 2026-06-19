import { Col, Form, FormInstance, Input, Tooltip } from 'antd';
import React from 'react';
import InfoField from './components/InfoField';
import { TFunction } from 'i18next';

interface Props {
  t: TFunction;
  data:
    | {
        employeeNumber: string;
      }
    | undefined;
  selectStyle: React.CSSProperties;
  form: FormInstance;
}
const FullNameEdited = (props: Props) => {
  const { t, data, selectStyle, form } = props;

  return (
    <>
      <Col xs={24} sm={12} md={12} xl={12}>
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            const errors = form.getFieldError('fullName');
            const hasError = errors && errors.length > 0;

            return (
              <Tooltip
                title={hasError ? errors[0] : ''} // Hiển thị câu lỗi đầu tiên
                open={hasError} // Tự động mở khi có lỗi (AntD v5 dùng 'open')
                placement="topLeft" // Vị trí hiển thị của Tooltip
                color="#ff4d4f" // Màu đỏ chuẩn của thông báo lỗi
              >
                <Form.Item
                  name="fullName"
                  style={{ margin: 0 }}
                  rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() }]}
                  help="" // Bắt buộc: Ẩn dòng chữ báo lỗi mặc định ở phía dưới ô Input
                >
                  <Input
                    style={selectStyle}
                    prefix={
                      <div
                        style={{
                          background: '#f5f5f5', // Màu xám nhẹ (hoặc #e6f7ff nếu muốn dùng màu xanh nhạt của bạn)
                          color: '#007240', // Chữ màu xám đậm tạo cảm giác text tĩnh (Read-only)
                          padding: '0 8px',
                          marginRight: '4px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          border: '1px solid #d9d9d9', // Viền nhẹ tạo ranh giới rõ ràng với ô nhập liệu
                          userSelect: 'none', // Không cho phép người dùng bôi đen text này bừa bãi
                          cursor: 'not-allowed', // Hiện con trỏ "cấm" khi di chuột vào phần mã nhân viên
                        }}
                      >
                        {data?.employeeNumber || '---'}
                      </div>
                    }
                  />
                </Form.Item>
              </Tooltip>
            );
          }}
        </Form.Item>
      </Col>
    </>
  );
};

export default FullNameEdited;
