import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import styles from './BulkUserManagement.module.css';
import EmptyComponent from '../../../../../common/EmptyComponent';
import httpAxios from '../../../../../common/http';
import { UserRecord } from '../../../../../page/admin/user-management/user-list/interfaces/interfaces';
import { compareDatePeriod } from '../../../../../common/util';
import { EvaluationPeriodHelper } from '../../../../../common/utils/datetime/EvaluationPeriodHelper';
import { useAuth } from '../../../../../hooks/useAuth';
import {
  FONT_SIZE,
  COLOR_PRIMARY,
  COLOR_BANNER_BG,
  COLOR_CLOSE_ICON,
  BANNER_PADDING,
  BANNER_BORDER_RADIUS,
  MODAL_TOP,
  MODAL_WIDTH_NORMAL,
  MODAL_WIDTH_STEP3,
  MODAL_WIDTH_STEP3_MULTI,
  HEADER_MARGIN_BOTTOM,
  TITLE_MARGIN_BOTTOM,
  BODY_PADDING,
  FOOTER_GAP,
  ROW_GUTTER,
} from '../../shared/editUserWizard.constants';
import { safeCompare } from '../../shared/editUserWizard.utils';
import { DataChange, ColoredSelect, Step3ConfirmDetail } from '../../shared/EditUserWizardShared';

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

interface ModalEditUserProps {
  selectedRecords: UserRecord[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  setSelectedRows: React.Dispatch<React.SetStateAction<UserRecord[]>>;
  handleSearch: () => void;
}

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
              {`${EvaluationPeriodHelper.getCurrentPeriodYear(timezone)}${t('IDS_YEAR_SUFFIX')}${EvaluationPeriodHelper.getCurrentPeriodIndex(timezone)}`}
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

    // Ghi chú: displayRadioTwo cố ý không lọc theo nhóm level (1–7 / 8–10)
    // khi edit nhiều user. Admin tự do chọn Option 2 cho toàn batch;
    // server sẽ tự xử lý từng user (xem guard trong update_user.sql và
    // message cross-boundary trong service confirmEditListUser).
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
      destroyOnClose
      maskClosable={false}
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
            <Form.Item name="radioCheck" colon={false} style={{ marginBottom: 0 }}>
              <Radio.Group
                value={radioLevelValue}
                onChange={(e) => {
                  setRadioLevelValue(e.target.value);
                  setTargetMode(e.target.value === 1 ? 'reset' : 'update');
                }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Radio value={1} disabled={!displayRadioOne}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: FONT_SIZE }}>{t('IDS_RESET_ALL')}</div>
                      <Typography.Text style={{ fontSize: FONT_SIZE, color: '#6b7280' }}>
                        {t('IDS_RESET_DATA_EVALUATION')}
                      </Typography.Text>
                    </div>
                  </Radio>
                  <Radio value={2} disabled={!displayRadioTwo}>
                    <span style={{ fontWeight: 700, fontSize: FONT_SIZE }}>{t('IDS_RESET_BEHAVIOR')}</span>
                  </Radio>
                </Space>
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
            <Button
              type="default"
              size="middle"
              onClick={() => (currentStep > 1 ? setCurrentStep(currentStep - 1) : setIsModalOpen(false))}
            >
              {currentStep === 1 ? t('IDS_BUTTON_CANCEL') : t('IDS_POPUP_EIDT_USER.IDS_BACK_BUTTON')}
            </Button>
          </div>
     
        </div>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;
