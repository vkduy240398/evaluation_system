import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal, Timeline, Table, Button, Empty, Spin, Card, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FieldTimeOutlined, ArrowRightOutlined } from '@ant-design/icons';

import './HistoryModal.css';
import { getHistoryUpdateUser } from './restApi/conditionSearch';
import dayjs from 'dayjs';
import { TFunction } from 'i18next';

interface ChangeDetail {
  key: string;
  field: string;
  old: string;
  new: string;
  status: 'important' | 'normal' | 'warning';
}

interface HistoryLog {
  id: number;
  date: string;
  admin: string;
  action: 'reset' | 'update';
  actionName: string;
  changes: ChangeDetail[];
}

interface HistoryModalProps {
  isOpen: boolean;
  setIsModalOpen: (open: { userId: string; isOpen: boolean }) => void;
  userId: string;
  t: TFunction;
}

interface HistoryData {
  id: number;
  afterUpdateContent: string;
  beforeUpdateContent: string;
  creationUser: {
    email: string;
    employeeNumber: string;
    fullName: string;
  };
  user: {
    email: string;
    employeeNumber: string;
    fullName: string;
  };
  option: string;
  createdTime: string;
}

// Pure function ngoài component — không tạo lại khi render
// beforeUpdate.roles = [{id: number, name: string}[]], afterUpdate.roles = number[]
const transformHistoryData = (data: any, roleName: Record<number, string>, resetAllLabel: string): HistoryLog[] =>
  data.userHistoryUpdates
    .map((v: HistoryData) => {
      const beforeUpdate = JSON.parse(v.beforeUpdateContent);
      const afterUpdate = JSON.parse(v.afterUpdateContent);
      const changes: ChangeDetail[] = [];

      const allKeys = new Set([...Object.keys(beforeUpdate), ...Object.keys(afterUpdate)]);
      for (const key of allKeys) {
        if (beforeUpdate[key] === afterUpdate[key]) continue;

        changes.push({
          key: `${v.creationUser.employeeNumber}-${key}`,
          field: key,
          old: Array.isArray(beforeUpdate[key])
            ? beforeUpdate[key].map((val: any) => roleName[val.id] ?? '').join(', ')
            : String(beforeUpdate[key] ?? ''),
          // afterUpdate stores role IDs as plain numbers → lookup trực tiếp bằng roleName
          new: Array.isArray(afterUpdate[key])
            ? afterUpdate[key].map((val: any) => roleName[val] ?? '').join(', ')
            : String(afterUpdate[key] ?? ''),
          status: 'normal',
        });
      }

      return {
        id: data.id,
        date: dayjs(v.createdTime).format('YYYY-MM-DD HH:mm'),
        admin: v.creationUser.fullName,
        action: (v.option === resetAllLabel ? 'reset' : 'update') as 'reset' | 'update',
        actionName: v.option,
        changes,
      };
    })
    .filter((log: HistoryLog) => log.changes.length > 0);

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, setIsModalOpen, userId, t }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<{
    informationUser: { email: string; employeeNumber: string; fullName: string };
    HistoryLog: HistoryLog[];
  }>({ informationUser: { email: '', employeeNumber: '', fullName: '' }, HistoryLog: [] });

  // Computed once per language change — không rebuild mỗi render
  const roleName = useMemo<Record<number, string>>(() => {
    const roles = (t('IDL_LIST_ROLE', { returnObjects: true }) as Record<string, string>) || {};
    return {
      1: roles['1'],
      2: roles['2'],
      3: roles['3'],
      4: roles['4'],
      5: roles['5'],
      6: roles['6'],
      7: roles['7'],
      8: roles['8'],
      9: t('IDS_SYSTEM_ADMIN'),
    };
  }, [t]);

  // Field key → display label map, computed once per language change
  const objectKeyJa = useMemo<Record<string, string>>(
    () => ({
      department: t('IDS_TYPE_DEPARTMENT_NAME'),
      division: t('IDS_TYPE_DIVISION_NAME'),
      company: t('IDS_COMPANY'),
      level: t('IDS_LEVEL'),
      flagSkill: t('IDS_EVALUATION_SKILL'),
      roles: t('IDS_ROLE'),
      fullName: t('IDS_FULLNAME'),
    }),
    [t],
  );

  // Column definitions computed once — không tạo lại trừ khi ngôn ngữ đổi
  const tableColumns = useMemo<ColumnsType<ChangeDetail>>(
    () => [
      {
        title: t('IDS_POPUP_EDIT_HISTORY.IDS_INPUT_FIELD'),
        dataIndex: 'field',
        key: 'field',
        width: '15%',
        render: (text: string) => <span className="cell-field">{objectKeyJa[text] || text}</span>,
      },
      {
        title: t('IDS_POPUP_EDIT_HISTORY.IDS_BEFORE_CHANGE'),
        dataIndex: 'old',
        key: 'old',
        width: '40%',
        render: (text: string) => <span className="cell-old">{text}</span>,
      },
      {
        title: t('IDS_POPUP_EDIT_HISTORY.IDS_AFTER_CHANGE'),
        dataIndex: 'new',
        key: 'new',
        width: '40%',
        render: (text: string) => (
          <div className="cell-new-group">
            <ArrowRightOutlined className="cell-icon-arrow" />
            <span className="cell-new-text">{text}</span>
          </div>
        ),
      },
    ],
    [t, objectKeyJa],
  );

  const handleCancel = useCallback((): void => setIsModalOpen({ userId: '', isOpen: false }), [setIsModalOpen]);

  // Chạy lại khi userId đổi (tránh stale data) hoặc roleName đổi (ngôn ngữ thay đổi)
  useEffect(() => {
    if (!isOpen || !userId) return;
    setIsLoading(true);
    setDataSources({ informationUser: { email: '', employeeNumber: '', fullName: '' }, HistoryLog: [] });
    getHistoryUpdateUser(
      userId,
      (data) => {
        if (data) {
          setDataSources({
            informationUser: {
              email: data.email,
              employeeNumber: data.employeeNumber,
              fullName: data.fullName,
            },
            HistoryLog: transformHistoryData(data, roleName, t('IDS_RESET_ALL')),
          });
        }
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  }, [isOpen, userId, roleName]);

  const modalTitle = (
    <div className="modal-header-layout">
      <div>
        <div className="header-title-group">
          <div className="header-icon-box">
            <FieldTimeOutlined style={{ color: '#007240' }} />
          </div>
          <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
            {t('IDS_POPUP_EDIT_HISTORY.IDS_TITLE')}
          </Typography.Title>
        </div>
        {!isLoading && dataSources.informationUser.employeeNumber && (
          <p className="header-subtitle">
            {t('IDS_POPUP_EDIT_HISTORY.IDS_TITLE_EMPLOYEE')}:{' '}
            {`${dataSources.informationUser.employeeNumber} - ${dataSources.informationUser.fullName}`}
          </p>
        )}
      </div>
    </div>
  );

  const modalFooter = (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Button onClick={handleCancel} size="middle">
        {t('IDS_BUTTON_CLOSE')}
      </Button>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={handleCancel}
      footer={modalFooter}
      width={900}
      style={{ top: 20 }}
      destroyOnClose
      maskClosable={false}
      rootClassName="history-modal"
      closeIcon={<span style={{ color: '#d1d5db', fontSize: '24px' }}>&times;</span>}
      bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
    >
      {isLoading ? (
        <div className="loading-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : dataSources.HistoryLog.length > 0 ? (
        <Timeline
          style={{ marginTop: '8px', paddingLeft: '5px', paddingTop: 5 }}
          items={dataSources.HistoryLog.map((log: HistoryLog) => ({
            dot: <div className={`timeline-dot ${log.action === 'reset' ? 'dot-reset' : 'dot-update'}`} />,
            children: (
              <div style={{ marginLeft: '10px', marginTop: '-8px' }} className="block-table">
                <div className="timeline-item-meta">
                  <span className="badge-date">{dayjs(log.date).format('YYYY/MM/DD HH:mm')}</span>
                  <span className="text-admin">
                    {t('IDS_POPUP_EDIT_HISTORY.IDS_PERFORMED_BY')}: {log.admin}
                  </span>
                </div>
                <Card>
                  <Table<ChangeDetail>
                    columns={tableColumns}
                    dataSource={log.changes}
                    bordered
                    pagination={false}
                    size="small"
                    rowKey="key"
                  />
                </Card>
              </div>
            ),
          }))}
        />
      ) : (
        <div className="empty-state-wrapper">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span className="empty-text">{t('IDS_POPUP_EDIT_HISTORY.TEXT_EMPTY')}</span>}
          />
        </div>
      )}
    </Modal>
  );
};

export default HistoryModal;
