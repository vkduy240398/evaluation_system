import React from 'react';
import { Modal, Form, Row, Col, DatePicker, Button, Space, Typography, Badge, Dropdown } from 'antd';
import { EditOutlined, CalendarOutlined, CheckSquareOutlined, SaveOutlined, DownOutlined } from '@ant-design/icons';
import localeJa from '../../../../../@core/locales/jaDatePick';

const { RangePicker } = DatePicker;

export interface DeptEditModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  editDeptRecord: any;
  editDeptForm: any;
  isLoadingDept: boolean;
  isLocked: boolean;
  isEvaluationTimeStarted: boolean;
  handleSaveEditDept: () => void;
  /** Called when a メール送信 dropdown item is selected; receives type ('goal' | 'evaluation') and isScheduled flag */
  onMailClick: (type: string, isScheduled: boolean) => void;
  ITEM_SPACING: number;
  t: any;
}
const DeptEditModal: React.FC<DeptEditModalProps> = ({
  isOpen,
  setIsOpen,
  editDeptRecord,
  editDeptForm,
  isLoadingDept,
  isLocked,
  isEvaluationTimeStarted,
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

  // メール送信 dropdowns only make sense once both the department and personal
  // dates are set for the corresponding block.
  const deptGoalSetting = Form.useWatch('deptGoalSetting', editDeptForm);
  const userGoalSetting = Form.useWatch('userGoalSetting', editDeptForm);
  const deptEvaluation = Form.useWatch('deptEvaluation', editDeptForm);
  const userEvaluation = Form.useWatch('userEvaluation', editDeptForm);

  const canSendGoalMail = Boolean(
    deptGoalSetting?.[0] && deptGoalSetting?.[1] && userGoalSetting?.[0] && userGoalSetting?.[1],
  );
  const canSendEvaluationMail = Boolean(
    deptEvaluation?.[0] && deptEvaluation?.[1] && userEvaluation?.[0] && userEvaluation?.[1],
  );

  // Editing a division (parent) row applies whichever fields are filled in to every
  // department in that division and leaves the rest untouched — so unlike a single
  // department edit, none of the four ranges are mandatory here.
  const isDivisionGroup = Boolean(editDeptRecord?.isDivisionGroup);

  // Once the 評価実施 (evaluation) period has started, 部門目標設定/個人目標設定 are frozen
  // outright — the goal-setting phase is over, so saving must leave whatever value is
  // already there untouched rather than showing/forcing any particular date.
  const isDeptGoalLocked = isEvaluationTimeStarted;
  const isUserGoalLocked = isEvaluationTimeStarted;

  // No auto-fill from 全社設定 here — a record with no dept-specific override shows blank,
  // same as the table's "—". Pre-filling from the company-wide dates (as this used to do
  // once that period started) made the modal show a date even when the table plainly showed
  // none, which read as if a dept-specific value already existed when it didn't.

  return (
    <Modal
      rootClassName="send-mail-modal"
      title={
        <Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
          <Space>
            <EditOutlined style={{ color: '#007240' }} />
            <span>{editDeptRecord?.departmentName || editDeptRecord?.divisionName || ''}</span>
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
      maskClosable={false}
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
                  marginBottom: 8,
                }}
              >
                <Typography.Title level={5} style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined style={{ color: '#0284C7' }} /> {t('IDS_AIM_SETTING')}
                </Typography.Title>
                {canSendGoalMail && (
                  <Dropdown
                    menu={buildMailMenu('goal')}
                    placement="bottomRight"
                    trigger={['click']}
                    disabled={isLocked}
                  >
                    <Button type="primary" size="middle" disabled={isLocked}>
                      {t('IDS_SEND_MAIL')} <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              </div>

              <Form.Item
                required={!isDivisionGroup && !isDeptGoalLocked}
                label={t('IDS_DEPARTMENTAL_GOAL_SETTING')}
                name="deptGoalSetting"
                style={{ marginBottom: 5 }}
                rules={
                  isDivisionGroup || isDeptGoalLocked
                    ? []
                    : [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(t('IDS_VALIDATION_DEPT_GOAL'))),
                        },
                      ]
                }
              >
                <RangePicker
                  locale={localeJa}
                  style={{ width: '100%' }}
                  format="YYYY/M/D"
                  clearIcon={false}
                  size="middle"
                  disabled={isLocked}
                />
              </Form.Item>
              <Form.Item
                required={!isDivisionGroup && !isUserGoalLocked}
                label={t('IDS_PERSONAL_GOAL_SETTING')}
                name="userGoalSetting"
                style={{ marginBottom: 0 }}
                rules={
                  isDivisionGroup || isUserGoalLocked
                    ? []
                    : [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(t('IDS_VALIDATION_PERSONAL_GOAL'))),
                        },
                      ]
                }
              >
                <RangePicker
                  locale={localeJa}
                  style={{ width: '100%' }}
                  format="YYYY/M/D"
                  clearIcon={false}
                  size="middle"
                  disabled={isLocked}
                />
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
                  marginBottom: 8,
                }}
              >
                <Typography.Title level={5} style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckSquareOutlined style={{ color: '#007240' }} /> {t('IDS_EVALUATION_IMPLEMENTATION')}
                </Typography.Title>
                {canSendEvaluationMail && (
                  <Dropdown
                    menu={buildMailMenu('evaluation')}
                    placement="bottomRight"
                    trigger={['click']}
                    disabled={isLocked}
                  >
                    <Button type="primary" size="middle" disabled={isLocked}>
                      {t('IDS_SEND_MAIL')} <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              </div>

              <Form.Item
                required={isEvaluationTimeStarted}
                label={t('IDS_DIVISION_EVALUATION')}
                name="deptEvaluation"
                style={{ marginBottom: 5 }}
                rules={
                  isEvaluationTimeStarted
                    ? [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(t('IDS_VALIDATION_DEPT_EVAL'))),
                        },
                      ]
                    : []
                }
              >
                <RangePicker
                  locale={localeJa}
                  style={{ width: '100%' }}
                  format="YYYY/M/D"
                  clearIcon={false}
                  size="middle"
                  disabled={isLocked}
                />
              </Form.Item>
              <Form.Item
                required={isEvaluationTimeStarted}
                label={t('IDS_EVALUATION_PERSONAL')}
                name="userEvaluation"
                style={{ marginBottom: 0 }}
                rules={
                  isEvaluationTimeStarted
                    ? [
                        {
                          validator: (_, value) =>
                            value && value[0] && value[1]
                              ? Promise.resolve()
                              : Promise.reject(new Error(t('IDS_VALIDATION_PERSONAL_EVAL'))),
                        },
                      ]
                    : []
                }
              >
                <RangePicker
                  locale={localeJa}
                  style={{ width: '100%' }}
                  format="YYYY/M/D"
                  clearIcon={false}
                  size="middle"
                  disabled={isLocked}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <Button type="primary" size="middle" loading={isLoadingDept} disabled={isLocked} onClick={handleSaveEditDept}>
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
