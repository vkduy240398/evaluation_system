import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  Select,
  Table,
  Tag,
  ConfigProvider,
  Button,
  Form,
  Row,
  Col,
  Radio,
  Spin,
  message,
  Typography,
} from 'antd';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from '../user-list/user-list/BulkUserManagement.module.css';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd/lib';
import { useAuth } from '../../../../hooks/useAuth';
import httpAxios from '../../../../common/http';
import { compareDatePeriod } from '../../../../common/util';
import EmptyComponent from '../../../../common/EmptyComponent';
import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';

interface ModalEditUserProps {
  selectedRecord: Record | undefined;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  onSuccess?: () => void;
}

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
interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}
interface Record {
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
}

interface DataChange {
  employeeNumber: number;
  fullName: string;
  userEvaluationChange: string;
  userInforChange: string;
}

const { Option } = Select;

// ── UI constants ──────────────────────────────────────────────────────────────
const FONT_SIZE = 14;
const SELECT_BORDER_RADIUS = 6;
const MODAL_TOP = 20;
const MODAL_WIDTH_NORMAL = 600;
const MODAL_WIDTH_STEP3 = 800;
const HEADER_MARGIN_BOTTOM = 15;
const TITLE_MARGIN_BOTTOM = 15;
const BODY_PADDING = '0 15px';
const FOOTER_GAP = 15;
const ROW_GUTTER: [number, number] = [10, 10];
const SECTION_BORDER_RADIUS = 6;
const SECTION_HEADER_PADDING = '6px 12px';
const SECTION_BODY_PADDING = '8px 12px';
const BANNER_PADDING = '0.5rem';
const BANNER_BORDER_RADIUS = '6px';
const STEP3_HEADER_PADDING = '0px 15px';
const STEP3_SCROLL_PADDING = '15px 15px 0 15px';

// ── Colors ────────────────────────────────────────────────────────────────────
const COLOR_PRIMARY = '#007240';
const COLOR_BANNER_BG = '#f0fdf4';
const COLOR_BORDER = '#e5e7eb';
const COLOR_SECTION_BG = '#f3f4f6';
const COLOR_TEXT_LABEL = '#374151';
const COLOR_TEXT_MAIN = '#1f2937';
const COLOR_TEXT_MUTED = '#9ca3af';
const COLOR_WARNING_BG = '#fffbeb';
const COLOR_WARNING_BORDER = '#fcd34d';
const COLOR_WARNING_TEXT = '#92400e';
const COLOR_CLOSE_ICON = '#d1d5db';

const ColoredSelect = ({ color, ...props }: any) => (
  <ConfigProvider
    theme={{
      components: {
        Select: {
          borderRadius: SELECT_BORDER_RADIUS,
        },
      },
    }}
  >
    <Select {...props} />
  </ConfigProvider>
);

// ── Step 3 helper functions ──────────────────────────────────────────────────

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
  const empty = { userManagement: [] as string[], goalSetting: [] as string[], proposal: [] as string[] };
  if (!text?.trim()) return empty;

  const userManagement: string[] = [];
  const remainingLines: string[] = [];
  for (const line of text.split('\n')) {
    // if (line.includes('【ユーザ管理】')) {
    //   userManagement.push(
    //     line
    //       .trim()
    //       .replace(/^[・]?【ユーザ管理】の/, '')
    //       .trim(),
    //   );
    // } else {
    remainingLines.push(line);
    // }
  }

  const sections = remainingLines.join('\n').split(/\n[ \t]*\n/);
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

  return { userManagement, goalSetting, proposal };
};

const getUserDisplayName = (fullName: string): string => {
  const idx = fullName.indexOf(': ');
  return idx !== -1 ? fullName.substring(idx + 2) : fullName;
};

// ────────────────────────────────────────────────────────────────────────────

const ModalEditUserFromDetail: React.FC<ModalEditUserProps> = ({
  selectedRecord,
  setIsModalOpen,
  isModalOpen,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetMode, setTargetMode] = useState<'reset' | 'update' | ''>('');
  const [companyList, setCompanyList] = useState<{ value: number; label: string }[]>([]);
  const [listDepartmentTypeDivisions, setListDepartmentTypeDivision] = useState<DivisionProps[]>([]);
  const [listDepartmentTypeDepartments, setListDepartmentTypeDepartment] = useState<DepartmentProps[]>([]);
  const [listLevels, setListLevel] = useState<{ id: string | number; level: string | number }[]>([]);
  const [radioLevelValue, setRadioLevelValue] = useState(-1);
  const [typeEvaluation, setTypeEvaluation] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [dataChanges, setDataChanges] = useState<DataChange[]>([]);
  const [evaluationPeriod, setEvaluationPeriod] = useState({ departmentGoal: '', personalGoal: '' });

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const auth = useAuth();

  const departmentValue = Form.useWatch('department', form);
  const divisionValue = Form.useWatch('division', form);
  const levelValue = Form.useWatch('level', form);
  const flagSkillValue = Form.useWatch('flagSkill', form);
  const companyName = Form.useWatch('company', form);

  const safeCompare = (val1: any, val2: any) => String(val1 ?? '') === String(val2 ?? '');

  const isNotChangeContentUpdate = (formInstance: FormInstance, recordInfo: any): boolean => {
    return (
      safeCompare(recordInfo?.department?.id, formInstance.getFieldValue('department')) &&
      safeCompare(recordInfo?.division?.id, formInstance.getFieldValue('division')) &&
      safeCompare(recordInfo?.level, formInstance.getFieldValue('level')) &&
      safeCompare(recordInfo?.flagSkill, formInstance.getFieldValue('flagSkill')) &&
      safeCompare(recordInfo?.company?.id, formInstance.getFieldValue('company'))
    );
  };

  const getEvaluationInfo = async (recordId: number) => {
    try {
      const res = await httpAxios.Get('/api/v1/f8/management-user/get-evaluation-by-user', {
        params: { id: recordId },
      });
      if (res && res.status === 200) {
        if (res?.data?.length > 0) {
          const isCompareDatePeriod = compareDatePeriod(
            res?.data[0].level <= 7
              ? res?.data[0].evaluationPeriod.dateCreationGoalStart
              : res?.data[0].evaluationPeriod.dateCreationGoalDepartmentStart,
            res?.data[0].level <= 7
              ? res?.data[0].evaluationPeriod.dateCreationGoalEnd
              : res?.data[0].evaluationPeriod.dateCreationGoalDepartmentEnd,
          );
          setTypeEvaluation(isCompareDatePeriod ? 0 : 1);
        } else {
          setTypeEvaluation(2);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isModalOpen || !selectedRecord) return;

    setIsLoading(true);

    const levelList = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, level: i + 1 }));
    setListLevel(levelList);

    Promise.all([
      httpAxios.Get('/api/v1/common/get-all-company'),
      httpAxios.Get('/api/v1/common/get-all-division-department-by-children'),
      httpAxios.Get('/api/v1/f8/management-user/getEvaluationPeriod'),
    ])
      .then(([companyRes, divisionRes, periodRes]) => {
        if (companyRes?.status === 200) {
          setCompanyList(companyRes.data.map((item: any) => ({ value: item.id, label: item.name })));
        }

        if (divisionRes?.status === 200) {
          const dataList = divisionRes.data as DivisionProps[];
          setListDepartmentTypeDivision(dataList);

          const filters = dataList.find((f) => f.divisionId === selectedRecord?.division?.id);
          if (filters) {
            setListDepartmentTypeDepartment(filters.childrens || []);
          }
        }

        if (periodRes?.status === 200) {
          const data = periodRes.data;
          setEvaluationPeriod({
            personalGoal: data.datePersonal ? `${data.datePersonal}` : '',
            departmentGoal: data.dateDepartment ? `${data.dateDepartment}` : '',
          });
        }

        form.setFieldsValue({
          company: selectedRecord.company?.id,
          division: selectedRecord.division?.id,
          department: selectedRecord.department?.id || null,
          level: selectedRecord.level,
          flagSkill: selectedRecord.flagSkill,
        });

        getEvaluationInfo(selectedRecord.id);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [isModalOpen, selectedRecord]);

  const mapingDivisionList = useMemo(
    () =>
      listDepartmentTypeDivisions.map((division) => ({
        value: division.divisionId,
        label: division.codeName,
      })),
    [listDepartmentTypeDivisions],
  );

  const mapingDepartmentList = useMemo(
    () =>
      listDepartmentTypeDepartments.map((department) => ({
        value: department.id,
        label: department.codeName,
      })),
    [listDepartmentTypeDepartments],
  );

  const levelOptions = useMemo(
    () =>
      listLevels.map((item) => ({
        value: item.id,
        label: item.level,
      })),
    [listLevels],
  );

  const { displayRadioOne, displayRadioTwo } = useMemo(() => {
    if (!selectedRecord) return { displayRadioOne: false, displayRadioZero: false, displayRadioTwo: false };

    const record = selectedRecord as any;
    const oldLevel = Number(record?.level || 0);
    const newLevel = Number(levelValue || form.getFieldValue('level'));
    const isLevelChanged = !safeCompare(oldLevel, newLevel);

    const isOtherFieldsUnchanged =
      safeCompare(record?.company?.id, companyName) &&
      safeCompare(record?.department?.id, departmentValue) &&
      safeCompare(record?.division?.id, divisionValue) &&
      safeCompare(record?.flagSkill, flagSkillValue);

    const isSameLevelGroup = (oldLevel <= 7 && newLevel <= 7) || (oldLevel > 7 && newLevel > 7);
    const isNotChanged = isOtherFieldsUnchanged && !isLevelChanged;

    return {
      displayRadioOne: !isNotChanged && typeEvaluation < 1,
      displayRadioZero: !isNotChanged,
      displayRadioTwo: isOtherFieldsUnchanged && isLevelChanged && isSameLevelGroup,
    };
  }, [selectedRecord, levelValue, companyName, departmentValue, divisionValue, flagSkillValue, typeEvaluation, form]);

  const isNextDisabled = useMemo(() => {
    if (currentStep === 1) {
      if (!selectedRecord) return true;
      const record = selectedRecord as any;
      return (
        safeCompare(record?.company?.id, companyName) &&
        safeCompare(record?.department?.id, departmentValue) &&
        safeCompare(record?.division?.id, divisionValue) &&
        safeCompare(record?.level, levelValue) &&
        safeCompare(record?.flagSkill, flagSkillValue)
      );
    }
    if (currentStep === 2) {
      const bothDisabled = !displayRadioOne && !displayRadioTwo;
      if (typeEvaluation === 2 || bothDisabled) return false;
      return radioLevelValue === -1;
    }
    return false;
  }, [
    currentStep,
    selectedRecord,
    companyName,
    departmentValue,
    divisionValue,
    levelValue,
    flagSkillValue,
    radioLevelValue,
    typeEvaluation,
    displayRadioOne,
    displayRadioTwo,
  ]);

  const handleDivisionChange = (value: string) => {
    const filters = listDepartmentTypeDivisions.find((f) => f.divisionId === value);
    setListDepartmentTypeDepartment(filters?.childrens || []);
    form.setFieldsValue({ department: null });
  };

  const onChangeDepartment = () => {
    if (!selectedRecord) return;
    if (isNotChangeContentUpdate(form, selectedRecord)) {
      setRadioLevelValue(-1);
      setTargetMode('');
    } else if (typeEvaluation === 0) {
      setRadioLevelValue(1);
      setTargetMode('reset');
    }
  };

  const getDataChange = () => {
    return {
      company: form.getFieldValue('company'),
      department: form.getFieldValue('department') === '' ? null : form.getFieldValue('department'),
      division: form.getFieldValue('division'),
      level: form.getFieldValue('level'),
      listId: selectedRecord ? [selectedRecord.id] : [],
      flagSkillValue: form.getFieldValue('flagSkill'),
      radioLevelValue: radioLevelValue,
      listUserSelecteds: selectedRecord ? [selectedRecord] : [],
      languageChange: {
        textItemChanged: t('MESSAGE.IDS_TEXT_TITLE_ITEM_CHANGED'),
        textTitleSkill: t('MESSAGE.IDS_TEXT_TITLE_SKILL'),
        textTitleDepDiv: t('MESSAGE.IDS_TEXT_TITLE_DEP_DIV'),
        textTitleLevel: t('MESSAGE.IDS_TEXT_TITLE_LEVEL'),
        textComma: t('IDS_COMMA'),
      },
    };
  };

  const gotoStep = () => {
    const isLevelUnder8 = Number(levelValue) < 8;
    const requiredFields = isLevelUnder8
      ? ['company', 'division', 'department', 'level', 'flagSkill']
      : ['company', 'division', 'level'];

    form
      .validateFields(requiredFields)
      .then(async () => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        if (nextStep === 3) {
          setIsLoading(true);
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
  };

  const handleSubmit = async () => {
    if (!selectedRecord) return;
    setIsLoading(true);

    const payload = {
      listUserSelecteds: [selectedRecord],
      listId: [selectedRecord.id],
      company: form.getFieldValue('company'),
      department: form.getFieldValue('department') === '' ? null : form.getFieldValue('department'),
      division: form.getFieldValue('division'),
      level: form.getFieldValue('level'),
      radioLevelValue: radioLevelValue,
      flagSkillValue: form.getFieldValue('flagSkill'),
    };

    try {
      const res = await httpAxios.Put('/api/v1/f8/management-user/update-user', payload);
      if (res && res.status === 200) {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
        setIsModalOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stepsConfigs = [
    { displayNumber: 1, label: t('IDS_POPUP_EIDT_USER.IDS_INFORMATION'), value: 1 },
    { displayNumber: 2, label: t('IDS_POPUP_EIDT_USER.IDS_TARGET_TITLE'), value: 2 },
    { displayNumber: 3, label: t('IDS_POPUP_EIDT_USER.IDS_STEP_CONFIRM'), value: 3 },
  ];

  return (
    <Modal
      open={isModalOpen}
      footer={null}
      closable={false}
      width={currentStep === 3 ? MODAL_WIDTH_STEP3 : MODAL_WIDTH_NORMAL}
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
        {/* Header Section */}
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

          {/* Step navigation */}
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

        {/* Form Body Content */}
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
          <div style={{ display: currentStep === 1 ? 'grid' : 'none', gap: '10px' }}>
            {!isLoading && evaluationPeriod.departmentGoal && evaluationPeriod.personalGoal && (
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
                    auth.user?.timeZone || 'Asia/Tokyo',
                  )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo')}`}
                </p>
                <p style={{ color: COLOR_PRIMARY, margin: 0, marginBottom: 0 }} className="font-bold text-sm">
                  {`${t('IDS_PERSONAL_PERIOD')}: ${evaluationPeriod.personalGoal}`}
                </p>
                <p style={{ color: COLOR_PRIMARY, margin: 0 }} className="font-bold text-sm">
                  {`${t('IDS_DEPARTMENT_PERIOD')}: ${evaluationPeriod.departmentGoal}`}
                </p>
              </div>
            )}

            <Row gutter={ROW_GUTTER}>
              <Col span={24}>
                <Form.Item label={t('IDS_COMPANY')} name="company" colon={false} style={{ marginBottom: 0 }}>
                  <ColoredSelect
                    showSearch
                    style={{ width: '100%' }}
                    filterOption={(input: string, option: any) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={companyList}
                    notFoundContent={<EmptyComponent />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={ROW_GUTTER}>
              <Col span={12}>
                <Form.Item
                  label={t('IDS_TYPE_DIVISION_NAME')}
                  name="division"
                  colon={false}
                  style={{ marginBottom: 0 }}
                >
                  <ColoredSelect
                    showSearch
                    style={{ width: '100%' }}
                    filterOption={(input: string, option: any) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={mapingDivisionList}
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
                      required: Number(levelValue) < 8,
                      message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
                    },
                  ]}
                >
                  <ColoredSelect
                    showSearch
                    style={{ width: '100%' }}
                    filterOption={(input: string, option: any) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={mapingDepartmentList}
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
                    filterOption={(input: string, option: any) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    options={levelOptions}
                    notFoundContent={<EmptyComponent />}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill" colon={false} style={{ marginBottom: 0 }}>
                  <ColoredSelect showSearch style={{ width: '100%' }} notFoundContent={<EmptyComponent />}>
                    <Option value={1}>{t('IDS_HAVE')}</Option>
                    <Option value={0}>{t('IDS_NOT_HAVE')}</Option>
                  </ColoredSelect>
                </Form.Item>
              </Col>
            </Row>
          </div>

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

          {currentStep === 3 && (
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              {/* ── Right panel: single user detail (full width, no employee list) ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                {isLoading ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin />
                  </div>
                ) : dataChanges[0] ? (
                  (() => {
                    const user = dataChanges[0];
                    const infoRows = parseUserInfoChange(user.userInforChange);
                    const { userManagement, goalSetting, proposal } = parseEvaluationChange(user.userEvaluationChange);

                    const userName = getUserDisplayName(user.fullName);
                    const changedInfoRows = infoRows.filter((r) => r.after);

                    return (
                      <>
                        {/* Header */}
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
                            <div>
                              <span
                                style={{ fontWeight: 400, color: COLOR_TEXT_MAIN }}
                              >{`${user.employeeNumber}: ${userName}`}</span>
                            </div>
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

                        {/* Scrollable content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: STEP3_SCROLL_PADDING }}>
                          {/* 変更前 / 変更後 table */}
                          <Table
                            dataSource={infoRows.map((r, i) => ({ ...r, key: i }))}
                            size="small"
                            bordered
                            pagination={false}
                            style={{ marginBottom: 10 }}
                            locale={{ emptyText: '変更情報がありません。' }}
                            columns={[
                              {
                                title: (
                                  <span style={{ fontSize: FONT_SIZE }}>
                                    {t('MODAL_EDIT_USER.IDS_COLUMN_CHANGE_INFOR')}
                                  </span>
                                ),
                                dataIndex: 'field',
                                width: '15%',
                                render: (text) => <span style={{ fontSize: FONT_SIZE }}>{text}</span>,
                              },
                              {
                                title: (
                                  <span style={{ fontSize: FONT_SIZE }}>
                                    {t('IDS_POPUP_EDIT_HISTORY.IDS_BEFORE_CHANGE')}
                                  </span>
                                ),
                                dataIndex: 'before',
                                width: '45%',
                                render: (val: string) => (
                                  <span style={{ color: val ? '#858585' : undefined, fontSize: FONT_SIZE }}>
                                    {val || '—'}
                                  </span>
                                ),
                              },
                              {
                                title: (
                                  <span style={{ fontSize: FONT_SIZE }}>
                                    {t('IDS_POPUP_EDIT_HISTORY.IDS_AFTER_CHANGE')}
                                  </span>
                                ),
                                dataIndex: 'after',
                                width: '45%',
                                render: (val: string) => (
                                  <span
                                    style={{
                                      color: val ? '#2c2a2a' : undefined,
                                      fontWeight: val ? 600 : undefined,
                                      fontSize: FONT_SIZE,
                                    }}
                                  >
                                    {val || '変更しない'}
                                  </span>
                                ),
                              },
                            ]}
                          />

                          {/* この変更によるデータへの影響 */}
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '7px 10px',
                                backgroundColor: COLOR_WARNING_BG,
                                border: `1px solid ${COLOR_WARNING_BORDER}`,
                                borderRadius: SELECT_BORDER_RADIUS,
                                marginBottom: 10,
                                fontSize: FONT_SIZE,
                                fontWeight: 600,
                                color: COLOR_WARNING_TEXT,
                              }}
                            >
                              <ExclamationCircleOutlined />
                              {t('IDS_IMPACT_SCOPE')}
                            </div>

                            {/* 【ユーザ管理】画面 */}
                            <div
                              style={{
                                border: `1px solid ${COLOR_BORDER}`,
                                borderRadius: SECTION_BORDER_RADIUS,
                                marginBottom: 10,
                                overflow: 'hidden',
                              }}
                            >
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
                                {t('MODAL_EDIT_USER.IDS_TITLE_POPUP_EIDT_USER')}
                              </div>
                              <div style={{ padding: SECTION_BODY_PADDING }}>
                                {changedInfoRows.length > 0 ? (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 8,
                                      marginBottom: 6,
                                      fontSize: FONT_SIZE,
                                    }}
                                  >
                                    <span>
                                      <span>
                                        {changedInfoRows.map((r) => r.field).join('・') +
                                          t('MODAL_EDIT_USER.IDS_MESSAGE_CHANGE_INFOR')}
                                      </span>
                                    </span>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: FONT_SIZE, color: COLOR_TEXT_MUTED }}>
                                    {t('MODAL_EDIT_USER.IDS_MODAL_INFO_BEFORE_AFTER_UPDATED')}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* 【目標設定】画面 */}
                            <div
                              style={{
                                border: `1px solid ${COLOR_BORDER}`,
                                borderRadius: SECTION_BORDER_RADIUS,
                                marginBottom: proposal.length > 0 ? 10 : 0,
                                overflow: 'hidden',
                              }}
                            >
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
                                {t('MODAL_EDIT_USER.IDS_TITLE_SETTING_GOAL')}
                              </div>
                              <div style={{ padding: SECTION_BODY_PADDING }}>
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
                                          style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 8,
                                            marginBottom: 6,
                                            fontSize: FONT_SIZE,
                                          }}
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
                              </div>
                            </div>

                            {/* 【提案】— only shown when server returns proposal content */}
                            {proposal.length > 0 && (
                              <div
                                style={{
                                  border: '1px solid #e0e7ff',
                                  borderRadius: SECTION_BORDER_RADIUS,
                                  overflow: 'hidden',
                                }}
                              >
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
                                  {t('MODAL_EDIT_USER.IDS_TEXT_PROPOSE')}
                                </div>
                                <div style={{ padding: SECTION_BODY_PADDING }}>
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
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : null}
              </div>
            </div>
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
              <Button type="primary" size="middle" onClick={handleSubmit}>
                {t('IDS_BUTTON_SAVE')}
              </Button>
            )}
          </div>
          <Button
            type="default"
            size="middle"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                setIsModalOpen(false);
              }
            }}
          >
            {currentStep === 1 ? t('IDS_BUTTON_CANCEL') : t('IDS_POPUP_EIDT_USER.IDS_BACK_BUTTON')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalEditUserFromDetail;
