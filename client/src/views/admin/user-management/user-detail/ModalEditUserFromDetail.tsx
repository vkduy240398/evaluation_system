import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  Select,
  Space,
  Button,
  Form,
  Row,
  Col,
  Radio,
  message,
  Typography,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import styles from '../user-list/user-list/BulkUserManagement.module.css';
import { useTranslation } from 'react-i18next';
import { FormInstance } from 'antd/lib';
import { useAuth } from '../../../../hooks/useAuth';
import httpAxios from '../../../../common/http';
import { compareDatePeriod } from '../../../../common/util';
import EmptyComponent from '../../../../common/EmptyComponent';
import { EvaluationPeriodHelper } from '../../../../common/utils/datetime/EvaluationPeriodHelper';
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
  HEADER_MARGIN_BOTTOM,
  TITLE_MARGIN_BOTTOM,
  BODY_PADDING,
  FOOTER_GAP,
  ROW_GUTTER,
} from '../shared/editUserWizard.constants';
import { safeCompare } from '../shared/editUserWizard.utils';
import { DataChange, ColoredSelect, Step3ConfirmDetail } from '../shared/EditUserWizardShared';

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

const { Option } = Select;

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
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const isLoading = isLoadingPage || isLoadingNext || isLoadingSubmit;
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

    setCurrentStep(1);
    setRadioLevelValue(-1);
    setTargetMode('');
    setDataChanges([]);
    setIsLoadingPage(true);

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
      .finally(() => setIsLoadingPage(false));
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
          setIsLoadingNext(true);
          try {
            const res = await httpAxios.Put('/api/v1/f8/management-user/confirm-edit-list-user', {
              dataChange: getDataChange(),
            });
            setDataChanges(res?.data || []);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoadingNext(false);
          }
        }
      })
      .catch(() => {});
  };

  const handleSubmit = async () => {
    if (!selectedRecord) return;
    setIsLoadingSubmit(true);

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
      setIsLoadingSubmit(false);
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
      destroyOnClose
      maskClosable={false}
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
          {/* Step 1 */}
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
                  {`${EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo')}${t('IDS_YEAR_SUFFIX')}${EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo')}`}
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
              selectedUserIndex={0}
              setSelectedUserIndex={() => {}}
              isMultiUser={false}
              isLoading={isLoadingNext}
              targetMode={targetMode}
              t={t}
            />
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div style={{ display: 'flex', gap: FOOTER_GAP }}>
            {currentStep < 3 ? (
              <Button type="primary" size="middle" disabled={isNextDisabled} loading={isLoadingNext} onClick={gotoStep}>
                {t('IDS_POPUP_EIDT_USER.IDS_NEXT_BUTTON')}
              </Button>
            ) : (
              <Button type="primary" size="middle" loading={isLoadingSubmit} onClick={handleSubmit}>
                {t('IDS_BUTTON_SAVE')}
              </Button>
            )}
          </div>
          <Button
            type="default"
            size="middle"
            disabled={isLoading}
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
