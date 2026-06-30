import React from 'react';
import { Modal, Form, Row, Col, DatePicker, Button, Space, Typography, Badge, Dropdown } from 'antd';
import { EditOutlined, CalendarOutlined, CheckSquareOutlined, SaveOutlined, DownOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export interface DeptEditModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  editDeptRecord: any;
  editDeptForm: any;
  isLoadingDept: boolean;
  isLocked: boolean;
  handleSaveEditDept: () => void;
  /** Called when a メール送信 dropdown item is selected; receives type ('goal' | 'evaluation') and isScheduled flag */
  onMailClick: (type: string, isScheduled: boolean) => void;
  ITEM_SPACING: number;
  t: any;
}
const FONT_SIZE = 14;
const MARGIN_BOTTOM = 15;
const DeptEditModal: React.FC<DeptEditModalProps> = ({
  isOpen,
  setIsOpen,
  editDeptRecord,
  editDeptForm,
  isLoadingDept,
  isLocked,
  handleSaveEditDept,
  onMailClick,
  ITEM_SPACING,
  t,
}) => {
  const buildMailMenu = (type: string) => ({
    items: [
      { key: '1', label: t('IDS_SEND_MAIL_NOW') },
      { key: '2', label: t('IDS_SEND_MAIL_SETTING_TIME') },
    ],
    onClick: ({ key }: { key: string }) => onMailClick(type, key === '2'),
  });

  return (
    <Modal
      rootClassName="send-mail-modal"
      title={
        <Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
          <Space>
            <EditOutlined style={{ color: '#007240' }} />
            <span>{editDeptRecord?.departmentName ?? ''}</span>
          </Space>
        </Typography.Title>
      }
      open={isOpen}
      onCancel={() => {
        setIsOpen(false);
        editDeptForm.resetFields();
      }}
      width={800}
      footer={null}
      destroyOnClose
      style={{ top: 20 }}
    >
      <div style={{ marginBottom: 15, background: '#FFFBE6', padding: 10 }}>
        <Typography.Text>{t('IDS_DEPT_SETTING_NOTE')}</Typography.Text>
      </div>

      <Form form={editDeptForm} layout="vertical">
        <Row gutter={[15, 15]}>
          {/* 目標設定 block */}
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 6,
                padding: 20,
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: FONT_SIZE }}
                >
                  <CalendarOutlined style={{ color: '#0284C7' }} /> {t('IDS_AIM_SETTING')}
                </Typography.Title>
                <Dropdown menu={buildMailMenu('goal')} placement="bottomRight" trigger={['click']}>
                  <Button type="primary" size="middle">
                    {t('IDS_SEND_MAIL')} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <Form.Item
                required
                label={t('IDS_DEPARTMENTAL_GOAL_SETTING')}
                name="deptGoalSetting"
                rules={[
                  {
                    validator: (_, value) =>
                      value && value[0] && value[1]
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('IDS_VALIDATION_DEPT_GOAL'))),
                  },
                ]}
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
              <Form.Item
                required
                label={t('IDS_PERSONAL_GOAL_SETTING')}
                name="userGoalSetting"
                rules={[
                  {
                    validator: (_, value) =>
                      value && value[0] && value[1]
                        ? Promise.resolve()
                        : Promise.reject(new Error(t('IDS_VALIDATION_PERSONAL_GOAL'))),
                  },
                ]}
              >
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
            </div>
          </Col>

          {/* 評価実施 block */}
          <Col xs={24} sm={12}>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: 6,
                padding: 20,
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Typography.Title
                  level={5}
                  style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: FONT_SIZE }}
                >
                  <CheckSquareOutlined style={{ color: '#007240' }} /> {t('IDS_EVALUATION_IMPLEMENTATION')}
                </Typography.Title>
                <Dropdown menu={buildMailMenu('evaluation')} placement="bottomRight" trigger={['click']}>
                  <Button type="primary" size="middle">
                    {t('IDS_SEND_MAIL')} <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <Form.Item label={t('IDS_DIVISION_EVALUATION')} name="deptEvaluation">
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
              <Form.Item label={t('IDS_EVALUATION_PERSONAL')} name="userEvaluation">
                <RangePicker style={{ width: '100%' }} format="YYYY/MM/DD" clearIcon={false} size="middle" />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <Button
            type="primary"
            size="middle"
            loading={isLoadingDept}
            disabled={isLocked}
            onClick={handleSaveEditDept}
          >
            {t('IDS_BUTTON_SAVE')}
          </Button>
          <Button
            size="middle"
            disabled={isLoadingDept}
            onClick={() => {
              setIsOpen(false);
              editDeptForm.resetFields();
            }}
          >
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DeptEditModal;
