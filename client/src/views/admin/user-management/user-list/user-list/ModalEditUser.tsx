import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';
import { ExclamationCircleOutlined, RightOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import styles from './BulkUserManagement.module.css';
import EmptyComponent from '../../../../../common/EmptyComponent';
import httpAxios from '../../../../../common/http';
import { UserRecord } from '../../../../../page/admin/user-management/user-list/interfaces/interfaces';
import { compareDatePeriod } from '../../../../../common/util';
import { EvaluationPeriodHelper } from '../../../../../common/utils/datetime/EvaluationPeriodHelper';
import { useAuth } from '../../../../../hooks/useAuth';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DepartmentProps {
  id: any;
  code?: string;
  name?: string;
  codeName: string;
}

interface DivisionProps {
  divisionId: any;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}

interface DataChange {
  employeeNumber: number;
  fullName: string;
  userEvaluationChange: string;
  userInforChange: string;
}

interface ModalEditUserProps {
  selectedRecords: UserRecord[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<UserRecord[]>>;
  handleSearch: () => void;
}

// ── UI constants ──────────────────────────────────────────────────────────────
const FONT_SIZE = 14;
const SELECT_BORDER_RADIUS = 6;
const MODAL_TOP = 20;
const MODAL_WIDTH_NORMAL = 600;
const MODAL_WIDTH_STEP3 = 800;
const MODAL_WIDTH_STEP3_MULTI = 1100;
const HEADER_MARGIN_BOTTOM = 15;
const TITLE_MARGIN_BOTTOM = 15;
const BODY_PADDING = '0 15px';
const FOOTER_GAP = 15;
const ROW_GUTTER: [number, number] = [10, 10];
const SECTION_BORDER_RADIUS = 8;
const SECTION_HEADER_PADDING = '6px 12px';
const SECTION_BODY_PADDING = '8px 12px';
const BANNER_PADDING = '0.5rem';
const BANNER_BORDER_RADIUS = '6px';
const STEP3_HEADER_PADDING = '0px 15px';
const STEP3_SCROLL_PADDING = '15px 15px 0 15px';

// ── Colors ────────────────────────────────────────────────────────────────────
const COLOR_PRIMARY = '#047857';
const COLOR_BANNER_BG = 'rgb(236 253 245)';
const COLOR_BORDER = '#e5e7eb';
const COLOR_SECTION_BG = '#f3f4f6';
const COLOR_TEXT_LABEL = '#374151';
const COLOR_TEXT_MAIN = '#1f2937';
const COLOR_TEXT_MUTED = '#9ca3af';
const COLOR_WARNING_BG = '#fffbeb';
const COLOR_WARNING_BORDER = '#fcd34d';
const COLOR_WARNING_TEXT = '#92400e';
const COLOR_CLOSE_ICON = '#d1d5db';

// ── Pure utility functions (ngoài component, không tạo lại theo render) ───────

const safeCompare = (val1: any, val2: any): boolean => String(val1 ?? '') === String(val2 ?? '');

const parseUserInfoChange = (text: string): Array<{ field: string; before: string; after: string }> => {
  if (!text?.trim()) return [];
  const rows: Array<{ field: string; before: string; after: string }> = [];
  for (const line of text.split('\n').filter((l) => l.trim())) {
    const colonIdx = line.indexOf(': ');
    if (colonIdx === -1) continue;
    const field = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 2).trim();
    if (value.includes(' → ')) {
      const [before, ...rest] = value.split(' → ');
      rows.push({ field, before: before.trim(), after: rest.join(' → ').trim() });
    } else if (value.includes('が取り消されます')) {
      rows.push({ field, before: value.replace('が取り消されます。', '').trim(), after: '（取り消し）' });
    } else {
      rows.push({ field, before: value, after: '' });
    }
  }
  return rows;
};

const parseEvaluationChange = (text: string) => {
  const empty = { goalSetting: [] as string[], proposal: [] as string[] };
  if (!text?.trim()) return empty;

  // Split by blank line: first block = goal setting, rest = proposal
  const sections = text.split(/\n[ \t]*\n/);
  const goalSetting = sections[0]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && l !== '・目標設定時の内容：' && !l.includes('【ユーザ管理】'));
  const proposal = sections
    .slice(1)
    .join('\n\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l);

  return { goalSetting, proposal };
};

const getUserDisplayName = (fullName: string): string => {
  const idx = fullName.indexOf(': ');
  return idx !== -1 ? fullName.substring(idx + 2) : fullName;
};

const getChangeTypeLabel = (userInforChange: string): string => {
  const changes: string[] = [];
  if (userInforChange.includes('等級')) changes.push('等級変更');
  if (userInforChange.includes('会社')) changes.push('会社変更');
  if (userInforChange.includes('部署名')) changes.push('部署変更');
  if (userInforChange.includes('課名')) changes.push('課変更');
  if (userInforChange.includes('スキル評価')) changes.push('スキル変更');
  return changes.join('、');
};

// ── Shared UI ─────────────────────────────────────────────────────────────────

const ColoredSelect = ({ color: _color, ...props }: any) => (
  <ConfigProvider theme={{ components: { Select: { borderRadius: SELECT_BORDER_RADIUS } } }}>
    <Select {...props} />
  </ConfigProvider>
);

// Card-like section used in Step 3 impact area — eliminates ~30 lines of repeated markup
const ImpactSection: React.FC<{
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
// Extracted from the original IIFE inside JSX (was ~300 lines inline)

interface Step3ConfirmDetailProps {
  dataChanges: DataChange[];
  selectedUserIndex: number;
  setSelectedUserIndex: React.Dispatch<React.SetStateAction<number>>;
  isMultiUser: boolean;
  isLoading: boolean;
  targetMode: 'reset' | 'update' | '';
  t: TFunction;
}

const Step3ConfirmDetail: React.FC<Step3ConfirmDetailProps> = React.memo(
  ({ dataChanges, selectedUserIndex, setSelectedUserIndex, isMultiUser, isLoading, targetMode, t }) => {
    const current = dataChanges[selectedUserIndex];

    const infoRows = useMemo(() => (current ? parseUserInfoChange(current.userInforChange) : []), [current]);
    const { goalSetting, proposal } = useMemo(
      () => (current ? parseEvaluationChange(current.userEvaluationChange) : { goalSetting: [], proposal: [] }),
      [current],
    );
    const changedInfoRows = useMemo(() => infoRows.filter((r) => r.after), [infoRows]);

    const tableColumns = useMemo(
      () => [
        {
          title: <span style={{ fontSize: FONT_SIZE }}>{t('MODAL_EDIT_USER.IDS_COLUMN_CHANGE_INFOR')}</span>,
          dataIndex: 'field',
          width: '15%',
          render: (text: string) => <span style={{ fontSize: FONT_SIZE }}>{text}</span>,
        },
        {
          title: <span style={{ fontSize: FONT_SIZE }}>{t('IDS_POPUP_EDIT_HISTORY.IDS_BEFORE_CHANGE')}</span>,
          dataIndex: 'before',
          width: '45%',
          render: (val: string) => (
            <span style={{ color: val ? '#858585' : undefined, fontSize: FONT_SIZE }}>{val || '—'}</span>
          ),
        },
        {
          title: <span style={{ fontSize: FONT_SIZE }}>{t('IDS_POPUP_EDIT_HISTORY.IDS_AFTER_CHANGE')}</span>,
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
                    <div style={{ fontSize: FONT_SIZE, fontWeight: 500, color: COLOR_TEXT_MAIN }}>{user.fullName}</div>
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
              <Spin />
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
                    style={{
                      fontSize: FONT_SIZE,
                      margin: 0,
                      background: COLOR_WARNING_BG,
                      color: COLOR_WARNING_TEXT,
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
                    {changedInfoRows.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: FONT_SIZE }}>
                        <span>
                          {changedInfoRows.map((r) => r.field).join('・') +
                            t('MODAL_EDIT_USER.IDS_MESSAGE_CHANGE_INFOR')}
                        </span>
                      </div>
                    ) : (
                      <div style={{ fontSize: FONT_SIZE, color: COLOR_TEXT_MUTED }}>
                        {t('MODAL_EDIT_USER.IDS_MODAL_INFO_BEFORE_AFTER_UPDATED')}
                      </div>
                    )}
                  </ImpactSection>

                  <ImpactSection
                    title={t('MODAL_EDIT_USER.IDS_TITLE_SETTING_GOAL')}
                    // marginBottom={proposal.length > 0 ? 10 : 0}
                  >
                    {goalSetting.length > 0 ? (
                      goalSetting
                        .map((line, i) => {
                          const cleanLine = line
                            .replace(/^[①②③④⑤⑥⑦⑧⑨⑩・]/, '')
                            .replace(/^目標設定時の内容：/, '')
                            .trim();
                          if (!cleanLine) return null;
                          return (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: FONT_SIZE }}>
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

// ── Step 1: Edit form ──────────────────────────────────────────────────────────

interface Step1UserFormProps {
  isMultiUser: boolean;
  selectedRowKeys: React.Key[];
  companyList: { value: number; label: string }[];
  mappingDivisionList: { value: any; label: string }[];
  mappingDepartmentList: { value: any; label: string }[];
  levelOptions: { value: any; label: any }[];
  levelValue: any;
  isLoading: boolean;
  evaluationPeriod: { personalGoal: string; departmentGoal: string };
  timezone: string;
  handleDivisionChange: (value: string) => void;
  onChangeDepartment: () => void;
  t: TFunction;
}

const Step1UserForm: React.FC<Step1UserFormProps> = React.memo(
  ({
    isMultiUser,
    selectedRowKeys,
    companyList,
    mappingDivisionList,
    mappingDepartmentList,
    levelOptions,
    levelValue,
    isLoading,
    evaluationPeriod,
    timezone,
    handleDivisionChange,
    onChangeDepartment,
    t,
  }) => (
    <div style={{ display: 'grid' }}>
      {/* Evaluation period banner — single user only, shows active goal-setting window */}
      {!isLoading &&
        evaluationPeriod.departmentGoal &&
        evaluationPeriod.personalGoal &&
        selectedRowKeys.length <= 1 && (
          <div
            style={{
              backgroundColor: COLOR_BANNER_BG,
              padding: BANNER_PADDING,
              borderRadius: BANNER_BORDER_RADIUS,
              borderLeft: `4px solid ${COLOR_PRIMARY}`,
            }}
          >
            <p style={{ color: COLOR_PRIMARY, margin: 0, marginBottom: 5, fontWeight: 'bold' }}>
              {`${EvaluationPeriodHelper.getCurrentPeriodYear(
                timezone,
              )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(timezone)}`}
            </p>
            <p style={{ color: COLOR_PRIMARY, margin: 0, marginBottom: 0 }}>
              {`${t('IDS_PERSONAL_PERIOD')}: ${evaluationPeriod.personalGoal}`}
            </p>
            <p style={{ color: COLOR_PRIMARY, margin: 0 }}>
              {`${t('IDS_DEPARTMENT_PERIOD')}: ${evaluationPeriod.departmentGoal}`}
            </p>
          </div>
        )}
      <div style={{ marginTop: selectedRowKeys.length <= 1 ? 15 : 0, marginBottom: 0 }}>
        <Space size={5} direction="vertical" style={{ width: '100%' }}>
          <Row gutter={ROW_GUTTER}>
            <Col span={24}>
              <Form.Item label={t('IDS_COMPANY')} name="company" colon={false} style={{ marginBottom: 0 }}>
                <ColoredSelect
                  showSearch
                  style={{ width: '100%' }}
                  filterOption={(input: any, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                  options={companyList}
                  notFoundContent={<EmptyComponent />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={ROW_GUTTER}>
            <Col span={12}>
              <Form.Item label={t('IDS_TYPE_DIVISION_NAME')} name="division" colon={false} style={{ marginBottom: 0 }}>
                <ColoredSelect
                  showSearch
                  style={{ width: '100%' }}
                  filterOption={(input: any, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                  options={mappingDivisionList}
                  notFoundContent={<EmptyComponent />}
                  onChange={handleDivisionChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('IDS_TYPE_DEPARTMENT_NAME')}
                name="department"
                colon={false}
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    // Level 1-7: personal goal track → department required
                    // Level 8-10: department goal track → department optional
                    required: Number(levelValue) < 8,
                    message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
                  },
                ]}
              >
                <ColoredSelect
                  showSearch
                  style={{ width: '100%' }}
                  filterOption={(input: any, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                  options={mappingDepartmentList}
                  notFoundContent={<EmptyComponent />}
                  onChange={onChangeDepartment}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={ROW_GUTTER}>
            <Col span={12}>
              <Form.Item label={t('IDS_LEVEL')} name="level" colon={false} style={{ marginBottom: 0 }}>
                <ColoredSelect
                  showSearch
                  style={{ width: '100%' }}
                  filterOption={(input: any, option: any) => option?.label.toLowerCase().includes(input.toLowerCase())}
                  options={levelOptions}
                  notFoundContent={<EmptyComponent />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill" colon={false} style={{ marginBottom: 0 }}>
                <ColoredSelect showSearch style={{ width: '100%' }} notFoundContent={<EmptyComponent />}>
                  {isMultiUser && (
                    <Select.Option value="-1" key="no-update">
                      {t('IDS_NO_UPDATE')}
                    </Select.Option>
                  )}
                  <Select.Option value={1} key={1}>
                    {t('IDS_HAVE')}
                  </Select.Option>
                  <Select.Option value={0} key={0}>
                    {t('IDS_NOT_HAVE')}
                  </Select.Option>
                </ColoredSelect>
              </Form.Item>
            </Col>
          </Row>
        </Space>
      </div>
    </div>
  ),
);

// ── Main component ─────────────────────────────────────────────────────────────

const ModalEditUser: React.FC<ModalEditUserProps> = ({
  selectedRecords,
  setIsModalOpen,
  isModalOpen,
  selectedRowKeys,
  setSelectedRowKeys,
  setSelectedRows,
  handleSearch,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [targetMode, setTargetMode] = useState<'reset' | 'update' | ''>('');
  const [companyList, setCompanyList] = useState<{ value: number; label: string }[]>([]);
  const [listDivisions, setListDivisions] = useState<DivisionProps[]>([]);
  const [listDepartments, setListDepartments] = useState<DepartmentProps[]>([]);
  const [listLevels, setListLevels] = useState<{ id: any; level: any }[]>([]);
  const [radioLevelValue, setRadioLevelValue] = useState(-1);
  const [typeEvaluation, setTypeEvaluation] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [dataChanges, setDataChanges] = useState<DataChange[]>([]);
  const [evaluationPeriod, setEvaluationPeriod] = useState({ personalGoal: '', departmentGoal: '' });

  const departmentValue = Form.useWatch('department', form);
  const divisionValue = Form.useWatch('division', form);
  const levelValue = Form.useWatch('level', form);
  const flagSkillValue = Form.useWatch('flagSkill', form);
  const companyValue = Form.useWatch('company', form);

  const isMultiUser = selectedRecords.length > 1;
  const timezone = auth.user?.timeZone || 'Asia/Tokyo';

  // ── Memoized option lists ─────────────────────────────────────────────────

  const mappingDivisionList = useMemo(
    () => listDivisions.map((d) => ({ value: d.divisionId, label: d.codeName })),
    [listDivisions],
  );

  const mappingDepartmentList = useMemo(
    () => listDepartments.map((d) => ({ value: d.id, label: d.codeName })),
    [listDepartments],
  );

  const levelOptions = useMemo(() => listLevels.map((item) => ({ value: item.id, label: item.level })), [listLevels]);

  const stepsConfigs = useMemo(
    () => [
      { displayNumber: 1, label: t('IDS_POPUP_EIDT_USER.IDS_INFORMATION'), value: 1 },
      { displayNumber: 2, label: t('IDS_POPUP_EIDT_USER.IDS_TARGET_TITLE'), value: 2 },
      { displayNumber: 3, label: t('IDS_POPUP_EIDT_USER.IDS_STEP_CONFIRM'), value: 3 },
    ],
    [t],
  );

  // True if at least one selected user is in personal-goal track (level 1–7)
  const hasPersonalGoalLevel = useMemo(() => selectedRecords.some((r: any) => Number(r.level) < 8), [selectedRecords]);

  // ── Memoized display flags ────────────────────────────────────────────────
  // Moved from render body to useMemo — removes the form.validateFields() side effect bug

  const { displayRadioOne, displayRadioTwo } = useMemo(() => {
    if (!isMultiUser) {
      const record = selectedRecords[0] as any;
      const oldLevel = Number(record?.level || 0);
      const newLevel = Number(levelValue || 0);
      const isLevelChanged = !safeCompare(oldLevel, newLevel);
      const isOtherFieldsUnchanged =
        safeCompare(record?.company?.id, companyValue) &&
        safeCompare(record?.department?.id, departmentValue) &&
        safeCompare(record?.division?.id, divisionValue) &&
        safeCompare(record?.flagSkill, flagSkillValue);
      const isSameLevelGroup = (oldLevel <= 7 && newLevel <= 7) || (oldLevel > 7 && newLevel > 7);
      const isNotChanged = isOtherFieldsUnchanged && !isLevelChanged;

      return {
        displayRadioOne: !isNotChanged && typeEvaluation < 1,
        displayRadioTwo: isOtherFieldsUnchanged && isLevelChanged && isSameLevelGroup,
      };
    }

    const noUpdateLabel = t('IDS_NO_UPDATE');
    const isNotSelectMultiEdit =
      safeCompare(departmentValue, noUpdateLabel) &&
      safeCompare(divisionValue, noUpdateLabel) &&
      safeCompare(flagSkillValue, noUpdateLabel) &&
      safeCompare(levelValue, noUpdateLabel) &&
      safeCompare(companyValue, noUpdateLabel);

    return {
      displayRadioOne: !isNotSelectMultiEdit,
      displayRadioTwo:
        safeCompare(departmentValue, noUpdateLabel) &&
        safeCompare(divisionValue, noUpdateLabel) &&
        safeCompare(flagSkillValue, noUpdateLabel) &&
        !safeCompare(levelValue, noUpdateLabel),
    };
  }, [
    isMultiUser,
    selectedRecords,
    levelValue,
    companyValue,
    departmentValue,
    divisionValue,
    flagSkillValue,
    typeEvaluation,
    t,
  ]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) {
      if (!isMultiUser) {
        const record = selectedRecords[0] as any;
        return (
          safeCompare(record?.company?.id, companyValue) &&
          safeCompare(record?.department?.id, departmentValue) &&
          safeCompare(record?.division?.id, divisionValue) &&
          safeCompare(record?.level, levelValue) &&
          safeCompare(record?.flagSkill, flagSkillValue)
        );
      }
      const noUpdateLabel = t('IDS_NO_UPDATE');
      return (
        safeCompare(departmentValue, noUpdateLabel) &&
        safeCompare(divisionValue, noUpdateLabel) &&
        safeCompare(flagSkillValue, noUpdateLabel) &&
        safeCompare(levelValue, noUpdateLabel) &&
        safeCompare(companyValue, noUpdateLabel)
      );
    }
    if (currentStep === 2) {
      // typeEvaluation === 2: user has no evaluations → no radio needed
      return typeEvaluation !== 2 && radioLevelValue === -1 && (displayRadioOne || displayRadioTwo);
    }
    return false;
  }, [
    currentStep,
    isMultiUser,
    selectedRecords,
    companyValue,
    departmentValue,
    divisionValue,
    levelValue,
    flagSkillValue,
    radioLevelValue,
    typeEvaluation,
    displayRadioOne,
    displayRadioTwo,
    t,
  ]);

  // Re-validate department when level changes (dynamic required rule: level 1-7 requires department)
  useEffect(() => {
    if (currentStep === 1) {
      form.validateFields(['department']).catch(() => {});
    }
  }, [levelValue, currentStep, form]);

  // ── Initial data fetch (3 APIs in parallel) ───────────────────────────────

  useEffect(() => {
    const levels = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, level: i + 1 }));
    const noUpdate = { id: t('IDS_NO_UPDATE'), level: t('IDS_NO_UPDATE') };
    setListLevels(isMultiUser ? [noUpdate, ...levels] : levels);

    setIsLoading(true);

    Promise.all([
      httpAxios.Get('/api/v1/common/get-all-company'),
      httpAxios.Get('/api/v1/common/get-all-division-department-by-children'),
      httpAxios.Get('/api/v1/f8/management-user/getEvaluationPeriod'),
    ])
      .then(([companyRes, divisionRes, periodRes]) => {
        if (companyRes?.status === 200) {
          const items = companyRes.data.map((item: any) => ({ value: item.id, label: item.name }));
          setCompanyList(isMultiUser ? [{ value: -1, label: t('IDS_NO_UPDATE') }, ...items] : items);
        }

        if (divisionRes?.status === 200) {
          const dataList = divisionRes.data as DivisionProps[];
          if (isMultiUser) {
            setListDivisions([
              { divisionId: t('IDS_NO_UPDATE'), codeName: t('IDS_NO_UPDATE'), childrens: [] },
              ...dataList,
            ]);
            setListDepartments([{ id: t('IDS_NO_UPDATE'), codeName: t('IDS_NO_UPDATE') }]);
          } else {
            setListDivisions(dataList);
            const match = dataList.find((f) => f.divisionId === selectedRecords[0]?.division?.id);
            if (match) setListDepartments(match.childrens);
          }
        }

        if (periodRes?.status === 200) {
          const d = periodRes.data;
          setEvaluationPeriod({
            personalGoal: d.datePersonal ? String(d.datePersonal) : '',
            departmentGoal: d.dateDepartment ? String(d.dateDepartment) : '',
          });
        }

        if (isMultiUser) {
          const noUpdateLabel = t('IDS_NO_UPDATE');
          form.setFieldsValue({
            company: noUpdateLabel,
            division: noUpdateLabel,
            department: noUpdateLabel,
            level: noUpdateLabel,
            flagSkill: noUpdateLabel,
          });
        } else {
          const record = selectedRecords[0] as any;
          form.setFieldsValue({
            company: record?.company?.id,
            division: record?.division?.id,
            department: record?.department?.id || null,
            level: record?.level,
            flagSkill: record?.flagSkill,
          });

          // Fetch evaluation status for single user to determine radio options
          if (record?.id) {
            httpAxios
              .Get('/api/v1/f8/management-user/get-evaluation-by-user', { params: { id: record.id } })
              .then((res) => {
                if (res?.status === 200) {
                  if (res.data?.length > 0) {
                    const first = res.data[0];
                    const inPeriod = compareDatePeriod(
                      first.level <= 7
                        ? first.evaluationPeriod.dateCreationGoalStart
                        : first.evaluationPeriod.dateCreationGoalDepartmentStart,
                      first.level <= 7
                        ? first.evaluationPeriod.dateCreationGoalEnd
                        : first.evaluationPeriod.dateCreationGoalDepartmentEnd,
                    );
                    setTypeEvaluation(inPeriod ? 0 : 1);
                  } else {
                    // No evaluations → no reset needed, skip step 2
                    setTypeEvaluation(2);
                  }
                }
              })
              .catch(console.error);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDivisionChange = useCallback(
    (value: string) => {
      const match = listDivisions.find((f) => f.divisionId === value);
      if (!isMultiUser) {
        setListDepartments(match?.childrens || []);
        form.setFieldsValue({ department: '' });
      } else {
        setListDepartments([{ id: t('IDS_NO_UPDATE'), codeName: t('IDS_NO_UPDATE') }, ...(match?.childrens || [])]);
      }
    },
    [listDivisions, isMultiUser, form, t],
  );

  const onChangeDepartment = useCallback(() => {
    if (isMultiUser) return;
    const record = selectedRecords[0] as any;
    const unchanged =
      safeCompare(record?.department?.id, form.getFieldValue('department')) &&
      safeCompare(record?.division?.id, form.getFieldValue('division')) &&
      safeCompare(record?.level, form.getFieldValue('level')) &&
      safeCompare(record?.flagSkill, form.getFieldValue('flagSkill')) &&
      safeCompare(record?.company?.id, form.getFieldValue('company'));

    if (unchanged) {
      setRadioLevelValue(-1);
      setTargetMode('');
    } else if (typeEvaluation === 0) {
      setRadioLevelValue(1);
      setTargetMode('reset');
    }
  }, [isMultiUser, selectedRecords, form, typeEvaluation]);

  const getValidateFields = useCallback((): string[] => {
    const needsDepartment = (hasPersonalGoalLevel && levelValue == '-1') || (levelValue < 8 && levelValue !== '-1');
    return needsDepartment
      ? ['company', 'division', 'department', 'level', 'flagSkill']
      : ['company', 'division', 'level'];
  }, [hasPersonalGoalLevel, levelValue]);

  const getDataChange = useCallback(
    () => ({
      company: form.getFieldValue('company'),
      department: form.getFieldValue('department') === '' ? null : form.getFieldValue('department'),
      division: form.getFieldValue('division'),
      level: form.getFieldValue('level'),
      listId: selectedRowKeys,
      flagSkillValue: form.getFieldValue('flagSkill'),
      radioLevelValue,
      listUserSelecteds: selectedRecords,
      languageChange: {
        textItemChanged: t('MESSAGE.IDS_TEXT_TITLE_ITEM_CHANGED'),
        textTitleSkill: t('MESSAGE.IDS_TEXT_TITLE_SKILL'),
        textTitleDepDiv: t('MESSAGE.IDS_TEXT_TITLE_DEP_DIV'),
        textTitleLevel: t('MESSAGE.IDS_TEXT_TITLE_LEVEL'),
        textComma: t('IDS_COMMA'),
      },
    }),
    [form, selectedRowKeys, radioLevelValue, selectedRecords, t],
  );

  const gotoStep = useCallback(() => {
    form
      .validateFields(getValidateFields())
      .then(async () => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        if (nextStep === 3) {
          setIsLoading(true);
          setSelectedUserIndex(0);
          try {
            const res = await httpAxios.Put('/api/v1/f8/management-user/confirm-edit-list-user', {
              dataChange: getDataChange(),
            });
            setDataChanges(res?.data || []);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        }
      })
      .catch(() => {});
  }, [form, getValidateFields, currentStep, getDataChange]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    const department = form.getFieldValue('department') === '' ? null : form.getFieldValue('department');
    try {
      const res = await httpAxios.Put('/api/v1/f8/management-user/update-user', {
        listUserSelecteds: selectedRecords,
        listId: selectedRowKeys,
        company: form.getFieldValue('company'),
        department,
        division: form.getFieldValue('division'),
        level: form.getFieldValue('level'),
        radioLevelValue,
        flagSkillValue: form.getFieldValue('flagSkill'),
      });

      if (res?.status === 200) {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setIsModalOpen(false);
        handleSearch();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    form,
    selectedRecords,
    selectedRowKeys,
    radioLevelValue,
    t,
    setSelectedRowKeys,
    setSelectedRows,
    setIsModalOpen,
    handleSearch,
  ]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      closable={false}
      width={currentStep === 3 ? (isMultiUser ? MODAL_WIDTH_STEP3_MULTI : MODAL_WIDTH_STEP3) : MODAL_WIDTH_NORMAL}
      className={styles.modalContainer}
      style={{ top: MODAL_TOP }}
    >
      <Form
        layout="vertical"
        form={form}
        onValuesChange={() => {
          if (radioLevelValue !== -1) {
            setRadioLevelValue(-1);
            setTargetMode('');
          }
        }}
        disabled={isLoading}
        style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        {/* Header */}
        <div className={styles.headerSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: HEADER_MARGIN_BOTTOM }}>
            <Typography.Title
              level={4}
              style={{ margin: 0, marginBottom: TITLE_MARGIN_BOTTOM, paddingBottom: 0 }}
              className={styles.stepTitle}
            >
              {t('POPUP_DIALOG.TITLE.EDIT_MULTIPLE_USER')}
            </Typography.Title>
            <span style={{ cursor: 'pointer', color: COLOR_CLOSE_ICON }} onClick={() => setIsModalOpen(false)}>
              ✕
            </span>
          </div>

          <div className={styles.stepNavigation}>
            {stepsConfigs.map((s, index) => (
              <React.Fragment key={s.value}>
                <div className={`${styles.stepItem} ${currentStep >= s.value ? styles.stepActive : ''}`}>
                  <span className={styles.stepBadge}>{s.displayNumber}</span>
                  {s.label}
                </div>
                {index < stepsConfigs.length - 1 && <RightOutlined style={{ fontSize: FONT_SIZE, color: '#000' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: currentStep === 3 ? '0' : BODY_PADDING,
            flex: 1,
            overflowY: currentStep === 3 ? 'hidden' : 'auto',
            minHeight: 0,
            display: currentStep === 3 ? 'flex' : 'block',
            flexDirection: currentStep === 3 ? 'column' : undefined,
          }}
        >
          {/* Step 1 */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <Step1UserForm
              isMultiUser={isMultiUser}
              selectedRowKeys={selectedRowKeys}
              companyList={companyList}
              mappingDivisionList={mappingDivisionList}
              mappingDepartmentList={mappingDepartmentList}
              levelOptions={levelOptions}
              levelValue={levelValue}
              isLoading={isLoading}
              evaluationPeriod={evaluationPeriod}
              timezone={timezone}
              handleDivisionChange={handleDivisionChange}
              onChangeDepartment={onChangeDepartment}
              t={t}
            />
          </div>

          {/* Step 2 */}
          {currentStep === 2 && (
            <Form.Item
              name="radioCheck"
              colon={false}
              valuePropName="checked"
              style={{ padding: '0px 0 0px 0', marginBottom: 0 }}
            >
              <Radio.Group
                value={radioLevelValue}
                onChange={(e) => {
                  setRadioLevelValue(e.target.value);
                  setTargetMode(e.target.value === 1 ? 'reset' : 'update');
                }}
              >
                <Radio
                  value={1}
                  className={`${styles.modeRadioItem} ${radioLevelValue === 1 ? styles.modeRadioSelected : ''}`}
                  style={{ display: 'flex', alignItems: 'flex-start', paddingBottom: '5px', width: '100%' }}
                  disabled={!displayRadioOne}
                >
                  <div>
                    <div style={{ fontWeight: 900, fontSize: FONT_SIZE, color: '#000' }}>{t('IDS_RESET_ALL')}</div>
                    <Typography.Text style={{ fontSize: FONT_SIZE, color: '#6b7280' }}>
                      {t('IDS_RESET_DATA_EVALUATION')}
                    </Typography.Text>
                  </div>
                </Radio>
                <Radio
                  value={2}
                  className={`${styles.modeRadioItem} ${radioLevelValue === 2 ? styles.modeRadioSelected : ''}`}
                  style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
                  disabled={!displayRadioTwo}
                >
                  <div style={{ fontWeight: 900, fontSize: FONT_SIZE, color: '#000' }}>{t('IDS_RESET_BEHAVIOR')}</div>
                </Radio>
              </Radio.Group>
            </Form.Item>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <Step3ConfirmDetail
              dataChanges={dataChanges}
              selectedUserIndex={selectedUserIndex}
              setSelectedUserIndex={setSelectedUserIndex}
              isMultiUser={isMultiUser}
              isLoading={isLoading}
              targetMode={targetMode}
              t={t}
            />
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div style={{ display: 'flex', gap: FOOTER_GAP }}>
            {currentStep < 3 ? (
              <Button type="primary" size="middle" disabled={isNextDisabled} onClick={gotoStep}>
                {t('IDS_POPUP_EIDT_USER.IDS_NEXT_BUTTON')}
              </Button>
            ) : (
              <Button type="primary" size="middle" loading={isLoading} onClick={handleSubmit}>
                {t('IDS_BUTTON_SAVE')}
              </Button>
            )}
          </div>
          <Button
            type="default"
            size="middle"
            onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsModalOpen(false))}
          >
            {currentStep === 1 ? t('IDS_BUTTON_CANCEL') : t('IDS_POPUP_EIDT_USER.IDS_BACK_BUTTON')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;
