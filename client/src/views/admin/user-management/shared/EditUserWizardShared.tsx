import React, { useMemo } from 'react';
import { ConfigProvider, Select, Spin, Table, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import {
  FONT_SIZE,
  SELECT_BORDER_RADIUS,
  SECTION_BORDER_RADIUS,
  SECTION_HEADER_PADDING,
  SECTION_BODY_PADDING,
  STEP3_HEADER_PADDING,
  STEP3_SCROLL_PADDING,
  COLOR_BORDER,
  COLOR_SECTION_BG,
  COLOR_TEXT_LABEL,
  COLOR_TEXT_MAIN,
  COLOR_TEXT_MUTED,
  COLOR_WARNING_BG,
  COLOR_WARNING_BORDER,
  COLOR_WARNING_TEXT,
  COLOR_PRIMARY,
} from './editUserWizard.constants';
import {
  parseUserInfoChange,
  parseEvaluationChange,
  getUserDisplayName,
  getChangeTypeLabel,
} from './editUserWizard.utils';

// ── Shared Types ───────────────────────────────────────────────────────────────

export interface DataChange {
  employeeNumber: number;
  fullName: string;
  userEvaluationChange: string;
  userInforChange: string;
}

// ── ColoredSelect ──────────────────────────────────────────────────────────────

export const ColoredSelect = ({ color: _color, ...props }: any) => (
  <ConfigProvider theme={{ components: { Select: { borderRadius: SELECT_BORDER_RADIUS } } }}>
    <Select {...props} />
  </ConfigProvider>
);

// ── ImpactSection ──────────────────────────────────────────────────────────────
// Card-like section used in Step 3 impact area

export const ImpactSection: React.FC<{
  title: string;
  children: React.ReactNode;
  border?: string;
  marginBottom?: number;
}> = ({ title, children, border = `1px solid ${COLOR_BORDER}`, marginBottom = 0 }) => (
  <div style={{ border, borderRadius: SECTION_BORDER_RADIUS, marginBottom, overflow: 'hidden' }}>
    <div
      style={{
        padding: SECTION_HEADER_PADDING,
        backgroundColor: COLOR_SECTION_BG,
        borderBottom: `1px solid ${COLOR_BORDER}`,
        fontSize: FONT_SIZE,
        fontWeight: 600,
        color: COLOR_TEXT_LABEL,
      }}
    >
      {title}
    </div>
    <div style={{ padding: SECTION_BODY_PADDING }}>{children}</div>
  </div>
);

// ── Step 3: Confirmation panel ─────────────────────────────────────────────────

export interface Step3ConfirmDetailProps {
  dataChanges: DataChange[];
  selectedUserIndex: number;
  setSelectedUserIndex: React.Dispatch<React.SetStateAction<number>>;
  isMultiUser: boolean;
  isLoading: boolean;
  targetMode: 'reset' | 'update' | '';
  t: TFunction;
}

export const Step3ConfirmDetail: React.FC<Step3ConfirmDetailProps> = React.memo(
  ({ dataChanges, selectedUserIndex, setSelectedUserIndex, isMultiUser, isLoading, targetMode, t }) => {
    const current = dataChanges[selectedUserIndex];

    const infoRows = useMemo(() => (current ? parseUserInfoChange(current.userInforChange) : []), [current]);
    const { userManagement, goalSetting, proposal } = useMemo(
      () =>
        current
          ? parseEvaluationChange(current.userEvaluationChange)
          : { userManagement: [], goalSetting: [], proposal: [] },
      [current],
    );

    const tableColumns = useMemo(
      () => [
        {
          title: t('MODAL_EDIT_USER.IDS_COLUMN_CHANGE_INFOR'),
          dataIndex: 'field',
          width: '15%',
          render: (text: string) => <span style={{ fontSize: FONT_SIZE }}>{text}</span>,
        },
        {
          title: t('IDS_POPUP_EDIT_HISTORY.IDS_BEFORE_CHANGE'),
          dataIndex: 'before',
          width: '45%',
          render: (val: string) => (
            <span style={{ color: val ? '#858585' : undefined, fontSize: FONT_SIZE }}>{val || '—'}</span>
          ),
        },
        {
          title: t('IDS_POPUP_EDIT_HISTORY.IDS_AFTER_CHANGE'),
          dataIndex: 'after',
          width: '45%',
          render: (val: string) => (
            <span
              style={{ color: val ? '#2c2a2a' : undefined, fontWeight: val ? 600 : undefined, fontSize: FONT_SIZE }}
            >
              {val || '変更しない'}
            </span>
          ),
        },
      ],
      [t],
    );

    return (
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Left panel: user list — only shown for multi-user edit */}
        {isMultiUser && (
          <div
            style={{
              minWidth: 200,
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              flexShrink: 0,
              minHeight: 0,
            }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {isLoading ? (
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <Spin size="small" />
                </div>
              ) : (
                dataChanges.map((user, index) => (
                  <div
                    key={user.employeeNumber}
                    onClick={() => setSelectedUserIndex(index)}
                    style={{
                      padding: SECTION_BODY_PADDING,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${COLOR_SECTION_BG}`,
                      backgroundColor: index === selectedUserIndex ? '#ecfdf5' : 'white',
                      borderLeft: index === selectedUserIndex ? `3px solid ${COLOR_PRIMARY}` : '3px solid transparent',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <div style={{ fontSize: FONT_SIZE, fontWeight: 500, color: COLOR_TEXT_MAIN }}>
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 2 }}>
                      {getChangeTypeLabel(user.userInforChange)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Right panel: detail for selected user */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          {isLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin size="small" />
            </div>
          ) : current ? (
            <>
              <div
                style={{
                  padding: STEP3_HEADER_PADDING,
                  flexShrink: 0,
                  fontSize: FONT_SIZE,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontWeight: 400, color: COLOR_TEXT_MAIN }}>
                    {isMultiUser
                      ? getUserDisplayName(current.fullName)
                      : `${current.employeeNumber}: ${getUserDisplayName(current.fullName)}`}
                  </span>
                </div>
                {targetMode !== '' && (
                  <Tag
                    color="gold"
                    style={{
                      fontSize: FONT_SIZE,
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {targetMode === 'reset' ? t('IDS_RESET_ALL') : t('IDS_RESET_BEHAVIOR')}
                  </Tag>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: STEP3_SCROLL_PADDING }}>
                <div style={{ display: 'grid', gap: 10 }}>
                  <Table
                    dataSource={infoRows.map((r, i) => ({ ...r, key: i }))}
                    columns={tableColumns}
                    size="small"
                    bordered
                    pagination={false}
                    locale={{ emptyText: '変更情報がありません。' }}
                  />

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 10px',
                      backgroundColor: COLOR_WARNING_BG,
                      border: `1px solid ${COLOR_WARNING_BORDER}`,
                      borderRadius: SELECT_BORDER_RADIUS,
                      fontSize: FONT_SIZE,
                      fontWeight: 600,
                      color: COLOR_WARNING_TEXT,
                    }}
                  >
                    <ExclamationCircleOutlined />
                    {t('IDS_IMPACT_SCOPE')}
                  </div>

                  <ImpactSection title={t('MODAL_EDIT_USER.IDS_TITLE_POPUP_EIDT_USER')}>
                    {userManagement.length > 0 ? (
                      userManagement.map((line, i) => (
                        <div
                          key={i}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, fontSize: FONT_SIZE }}
                        >
                          <span style={{ color: COLOR_TEXT_MAIN }}>{line}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: FONT_SIZE, color: COLOR_TEXT_MUTED }}>
                        {t('MODAL_EDIT_USER.IDS_MODAL_INFO_BEFORE_AFTER_UPDATED')}
                      </div>
                    )}
                  </ImpactSection>

                  <ImpactSection title={t('MODAL_EDIT_USER.IDS_TITLE_SETTING_GOAL')}>
                    {goalSetting.length > 0 ? (
                      goalSetting
                        .map((line, i) => {
                          const cleanLine = line
                            .replace(/^[①②③④⑤⑥⑦⑧⑨⑩・]/, '')
                            .replace(/^目標設定時の内容：/, '')
                            .trim();
                          if (!cleanLine) return null;
                          return (
                            <div
                              key={i}
                              style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: FONT_SIZE }}
                            >
                              <span style={{ color: COLOR_TEXT_MAIN }}>{line}</span>
                            </div>
                          );
                        })
                        .filter(Boolean)
                    ) : (
                      <div style={{ fontSize: FONT_SIZE, color: COLOR_TEXT_MUTED }}>
                        {t('MODAL_EDIT_USER.IDS_MODAL_INFO_BEFORE_AFTER_UPDATED')}
                      </div>
                    )}
                  </ImpactSection>

                  {proposal.length > 0 && (
                    <ImpactSection
                      title={t('MODAL_EDIT_USER.IDS_TEXT_PROPOSE')}
                      border="1px solid #e0e7ff"
                      marginBottom={0}
                    >
                      {proposal.map((line, i) => {
                        const isCaseHeader =
                          line.includes('■ケース1：期初の目標レコードの設定を編集する') ||
                          line.includes('■ケース2：複数の目標レコードを作成する');
                        return (
                          <div
                            key={i}
                            style={{
                              fontSize: FONT_SIZE,
                              color: COLOR_TEXT_LABEL,
                              lineHeight: 1.7,
                              marginBottom: 2,
                              marginTop: isCaseHeader && i > 0 ? 10 : 0,
                              fontWeight: isCaseHeader ? 700 : undefined,
                            }}
                          >
                            {line}
                          </div>
                        );
                      })}
                    </ImpactSection>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  },
);
