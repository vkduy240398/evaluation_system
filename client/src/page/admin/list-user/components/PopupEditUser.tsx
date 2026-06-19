import { Form, Select, Space, message, Typography, Radio, Row, Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { CancelButton, MainButton } from '../../../../common/MainButton';
import httpAxios from '../../../../common/http';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import PopupConfirmListUserInfor from './PopupConfirmListUserInfor';
import { FormInstance } from 'antd/lib';
import { compareDatePeriod } from '../../../../common/util';

interface Record {
  company: { id: number; name: string };
  department: { id: number; code: string; name: string };
  division: { id: number; code: string; name: string };
  email: string;
  employeeNumber: string;
  flagSkill: number | string; // 0 | 1
  fullName: string;
  id: number;
  level: number;
  roles: { id: number; name: string }[];
  rolesCondition: { id: number; name: string }[];
}
interface Props {
  selectedRecords: Record[];
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  handleCancel: any;
  handleSearch: any;
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

const PopupEditUser: React.FC<Props> = (props: Props) => {
  const { selectedRecords } = props;
  const [form] = Form.useForm();
  const { Option } = Select;
  const [listDepartmentTypeDepartments, setListDepartmentTypeDepartment] = useState<DepartmentProps[]>([]);
  const [listCompany, setListCompany] = useState([]) as any;
  const [listDepartmentTypeDivisions, setListDepartmentTypeDivision] = useState<DivisionProps[]>([]);
  const [listLevel, setListLevel] = useState([]) as any;
  const [isDisable, setDisable] = useState(false);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const [isOpenModalChange, setOpenModalChange] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(!isOpenModal);
  const [, setFormerValues] = useState([]) as any;
  const [typeEvaluation, setTypeEvaluation] = useState(-1);
  const [changeFields, setChangeFields] = useState({
    displayRadioZero: false,
    displayRadioTwo: false,
    displayRadioOne: false,
  });

  useEffect(() => {
    if (selectedRecords.length === 1) {
      form.setFieldsValue({
        company: selectedRecords[0]?.company?.id,
        department: selectedRecords[0]?.department?.id,
        division: selectedRecords[0]?.division?.id,
        level: selectedRecords[0]?.level,
        flagSkill: selectedRecords[0]?.flagSkill,
      });
      getEvaluationInfo();
    }

    /**Get all department type department */
    // httpAxios.Get('/api/v1/common/get-all-department-type-department').then((res) => {
    //   if (res && res.status === 200) {
    //     const temps = [];
    //     if (selectedRecords.length > 1)
    //       temps.push({ id: t('IDS_NO_UPDATE'), departmentNameTypeDepartment: t('IDS_NO_UPDATE') });

    //     res?.data.forEach((item: any) => {
    //       temps.push({ id: item.id, departmentNameTypeDepartment: item.code + ' : ' + item.name });
    //     });
    //     setListDepartmentTypeDepartment(temps);
    //   }
    // });

    /**Get all department type divison */
    httpAxios.Get('/api/v1/common/get-all-division-department-by-children').then((res) => {
      if (res && res.status === 200) {
        const dataList = res.data as DivisionProps[];

        if (selectedRecords.length > 1) {
          setListDepartmentTypeDivision([
            { divisionId: t('IDS_NO_UPDATE'), codeName: t('IDS_NO_UPDATE'), childrens: [] },
            ...dataList,
          ]);
        } else {
          setListDepartmentTypeDivision(dataList);
          const fillters = dataList.find((f) => f.divisionId === selectedRecords[0]?.division?.id);

          if (fillters) {
            setListDepartmentTypeDepartment(fillters.childrens);
          }
        }
      }
    });

    /**Get all company */
    httpAxios.Get('/api/v1/common/get-all-company').then((res) => {
      if (res && res.status === 200) {
        const temps = [];
        if (selectedRecords.length > 1) temps.push({ id: t('IDS_NO_UPDATE'), companyname: t('IDS_NO_UPDATE') });
        res?.data.forEach((item: any) => {
          temps.push({ id: item.id, companyname: item.name });
        });
        setListCompany(temps);
      }
    });

    /**Set list level */
    const levelList = [];
    for (let i = 1; i <= 10; i++) {
      levelList.push({
        id: i,
        level: i,
      });
    }

    const temps = [];
    if (selectedRecords.length > 1) temps.push({ id: t('IDS_NO_UPDATE'), level: t('IDS_NO_UPDATE') });
    levelList.forEach((item: any) => {
      temps.push({ id: item.id, level: item.level });
    });
    setListLevel(temps);
    setFormerValues(form.getFieldsValue());
  }, []);

  const getEvaluationInfo = async () => {
    if (selectedRecords[0]?.id) {
      await httpAxios
        .Get('/api/v1/f8/management-user/get-evaluation-by-user', {
          params: {
            id: selectedRecords[0]?.id,
          },
        })
        .then((res) => {
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
        });
    }
  };

  const checkHas17Level = () => {
    let isSame = false;
    selectedRecords.forEach((item: any) => {
      if (item.level < 8) {
        isSame = true;
      }
    });

    return isSame;
  };

  const handleSubmit = async () => {
    setDisable(true);
    const company = form.getFieldValue('company');

    // if all selected users are 8~10, can leave department = null
    const department = form.getFieldValue('department') === '' ? null : form.getFieldValue('department');
    const division = form.getFieldValue('division');
    const level = form.getFieldValue('level');
    const listId = props.selectedRowKeys;
    const listUserSelecteds = props.selectedRecords;
    const flagSkillValue = form.getFieldValue('flagSkill');

    if (
      company == t('IDS_NO_UPDATE') &&
      department == t('IDS_NO_UPDATE') &&
      division == t('IDS_NO_UPDATE') &&
      level == t('IDS_NO_UPDATE') &&
      flagSkillValue == t('IDS_NO_UPDATE')
    ) {
      setOpenModal(false);
      props.handleCancel();
    } else {
      await httpAxios
        .Put('/api/v1/f8/management-user/update-user', {
          listUserSelecteds,
          listId,
          company,
          department,
          division,
          level,
          radioLevelValue: radioLevelValue,
          flagSkillValue,
        })
        .then((res) => {
          if (res && res.status === 200) {
            message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
            props.setSelectedRowKeys([]);
            props.handleCancel();
            props.handleSearch();
          }
        });
      setOpenModal(false);
      setDisable(false);
    }
  };

  /**company option list */
  const companyOption = listCompany?.map((item: any) => {
    return (
      <Option value={item.id} key={item.id}>
        {item.companyname}
      </Option>
    );
  });

  /**department option list type department */
  const departmentOptionsTypeDepartmentList = listDepartmentTypeDepartments.map((item) => {
    return (
      <Option value={item.id} key={item.id}>
        {item.codeName}
      </Option>
    );
  });

  /**department option list type division */
  const departmentOptionsTypeDivisions = listDepartmentTypeDivisions.map((item) => {
    return (
      <Option value={item.divisionId} key={item.divisionId}>
        {item.codeName}
      </Option>
    );
  });

  /**level option list */
  const levelOption = listLevel?.map((item: any) => {
    return (
      <Option value={item.id} key={item.id}>
        {item.level}
      </Option>
    );
  });

  const [radioLevelValue, setRadioLevelValue] = useState(-1);

  const handleSetRadioButtonAfterClick = () => {
    if (typeEvaluation === 0) {
      setRadioLevelValue(1);
    }

    setChangeFields({
      ...changeFields,
      displayRadioTwo:
        selectedRecords[0]?.department?.id === form.getFieldValue('department') &&
        selectedRecords[0]?.division?.id === form.getFieldValue('division') &&
        ((selectedRecords[0]?.level !== form.getFieldValue('level') &&
          selectedRecords[0]?.level <= 7 &&
          form.getFieldValue('level') <= 7) ||
          (selectedRecords[0]?.level > 7 && form.getFieldValue('level') > 7)) &&
        selectedRecords[0]?.flagSkill === form.getFieldValue('flagSkill'),
      displayRadioOne: true,
      displayRadioZero: true,
    });
  };

  const onChange = (e: any) => {
    setRadioLevelValue(e.target.value);
  };

  const isNotChangeContentUpdate = (form: FormInstance, recordInfo: Record): boolean => {
    return (
      recordInfo?.department?.id === form.getFieldValue('department') &&
      recordInfo?.division?.id === form.getFieldValue('division') &&
      recordInfo?.level === form.getFieldValue('level') &&
      recordInfo.flagSkill === form.getFieldValue('flagSkill')
    );
  };

  const isNotSelectMultiEdit = (form: FormInstance): boolean => {
    return (
      form.getFieldValue('department') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('division') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('flagSkill') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('level') === t('IDS_NO_UPDATE')
    );
  };

  const visibleButtonTwoEditMulti = (form: FormInstance): boolean => {
    return (
      form.getFieldValue('department') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('division') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('flagSkill') === t('IDS_NO_UPDATE') &&
      form.getFieldValue('level') !== t('IDS_NO_UPDATE')
    );
  };

  const onChangeLevel = (e: any) => {
    if (selectedRecords.length > 1) {
      if (t('IDS_NO_UPDATE') !== e) {
        setChangeFields({
          ...changeFields,
          displayRadioTwo: visibleButtonTwoEditMulti(form),
          displayRadioOne: true,
          displayRadioZero: true,
        });
        if (typeEvaluation === 0) {
          setRadioLevelValue(1);
        }
      } else {
        if (
          form.getFieldValue('department') === t('IDS_NO_UPDATE') &&
          form.getFieldValue('division') === t('IDS_NO_UPDATE')
        ) {
          form.setFieldValue('flagSkill', t('IDS_NO_UPDATE'));
          setRadioLevelValue(-1);
          setChangeFields({
            ...changeFields,
            displayRadioTwo: false,
            displayRadioOne: false,
            displayRadioZero: false,
          });
        } else {
          setChangeFields({
            ...changeFields,
            displayRadioTwo: visibleButtonTwoEditMulti(form),
            displayRadioOne: true,
            displayRadioZero: true,
          });
        }
      }
    } else {
      if (
        ([1, 2, 3, 4, 5, 6, 7].includes(selectedRecords[0]?.level) && [8, 9, 10].includes(e)) ||
        ([8, 9, 10].includes(selectedRecords[0]?.level) && [1, 2, 3, 4, 5, 6, 7].includes(e))
      ) {
        setRadioLevelValue(-1);
      }
      if ([1, 2, 3, 4, 5, 6, 7].includes(selectedRecords[0]?.level) && [1, 2, 3, 4, 5, 6, 7].includes(e)) {
        setRadioLevelValue(-1);
      }
      if (isNotChangeContentUpdate(form, selectedRecords[0])) {
        setRadioLevelValue(-1);
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: false,
          displayRadioZero: false,
        });
      } else {
        handleSetRadioButtonAfterClick();
      }
    }
    form.validateFields();
  };

  const onChangeDivision = async (value: string) => {
    if (selectedRecords.length > 1) {
      if (value !== t('IDS_NO_UPDATE')) {
        form.setFieldsValue({ department: '' });
        const fillters = listDepartmentTypeDivisions.find((f) => f.divisionId === value);
        setListDepartmentTypeDepartment(fillters?.childrens || []);
        if (typeEvaluation === 0) {
          setRadioLevelValue(1);
        }
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: true,
          displayRadioZero: true,
        });
      } else {
        form.setFieldsValue({ department: t('IDS_NO_UPDATE') });
        setListDepartmentTypeDepartment([]);
        if (isNotSelectMultiEdit(form)) {
          setRadioLevelValue(-1);
          setChangeFields({
            ...changeFields,
            displayRadioTwo: false,
            displayRadioOne: false,
            displayRadioZero: false,
          });
        } else {
          setChangeFields({
            ...changeFields,
            displayRadioTwo: visibleButtonTwoEditMulti(form),
            displayRadioOne: true,
            displayRadioZero: true,
          });
        }
      }
    } else {
      form.setFieldsValue({ department: '' });
      const fillters = listDepartmentTypeDivisions.find((f) => f.divisionId === value);
      setListDepartmentTypeDepartment(fillters?.childrens || []);
      if (isNotChangeContentUpdate(form, selectedRecords[0])) {
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: false,
          displayRadioZero: false,
        });
        setRadioLevelValue(-1);
      } else {
        handleSetRadioButtonAfterClick();
      }
    }
  };

  const onChangeDepartment = (value: any) => {
    if (selectedRecords.length === 1) {
      if (isNotChangeContentUpdate(form, selectedRecords[0])) {
        setRadioLevelValue(-1);
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: false,
          displayRadioZero: false,
        });
      } else {
        handleSetRadioButtonAfterClick();
      }
    }
  };

  const onChangeFlagSkill = (value: any) => {
    if (selectedRecords.length > 1) {
      if (t('IDS_NO_UPDATE') !== value) {
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: true,
          displayRadioZero: true,
        });
        if (typeEvaluation === 0) {
          setRadioLevelValue(1);
        }
      } else {
        if (
          form.getFieldValue('department') === t('IDS_NO_UPDATE') &&
          form.getFieldValue('division') === t('IDS_NO_UPDATE') &&
          form.getFieldValue('level') === t('IDS_NO_UPDATE')
        ) {
          setRadioLevelValue(-1);
          setChangeFields({
            ...changeFields,
            displayRadioTwo: false,
            displayRadioOne: false,
            displayRadioZero: false,
          });
        } else {
          setChangeFields({
            ...changeFields,
            displayRadioTwo: visibleButtonTwoEditMulti(form),
            displayRadioOne: true,
            displayRadioZero: true,
          });
        }
      }
    } else {
      if (isNotChangeContentUpdate(form, selectedRecords[0])) {
        setRadioLevelValue(-1);
        setChangeFields({
          ...changeFields,
          displayRadioTwo: false,
          displayRadioOne: false,
          displayRadioZero: false,
        });
      } else {
        handleSetRadioButtonAfterClick();
      }
    }
  };

  /**Function validate nút edit */
  const handleValidate = async () => {
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'flagSkill', 'radioCheck'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    const levelValue = form.getFieldValue('level');

    // if all selected users are 8~10, can leave department = null
    await form
      .validateFields(
        (checkHas17Level() && levelValue == t('IDS_NO_UPDATE')) || (levelValue < 8 && levelValue !== t('IDS_NO_UPDATE'))
          ? validateFieldsNames
          : validateFieldsName810s,
      )
      .then(async () => {
        setOpenModal(!isOpenModal);
      })
      .catch(() => {});
  };

  const checkEnableButtonInfoChange = () => {
    const divisionValue = form.getFieldValue('division');
    const departmentValue = form.getFieldValue('department');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue = form.getFieldValue('flagSkill');

    if (selectedRecords.length > 1) {
      if (
        divisionValue !== t('IDS_NO_UPDATE') ||
        departmentValue !== t('IDS_NO_UPDATE') ||
        levelValue !== t('IDS_NO_UPDATE') ||
        flagSkillValue !== t('IDS_NO_UPDATE')
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        divisionValue !== selectedRecords[0]?.division?.id ||
        departmentValue !== selectedRecords[0]?.department?.id ||
        levelValue !== selectedRecords[0]?.level ||
        flagSkillValue !== selectedRecords[0]?.flagSkill
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  /**Function validate nút check data */
  const handleValidateCheckData = async () => {
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'flagSkill', 'radioCheck'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    const levelValue = form.getFieldValue('level');

    // if all selected users are 8~10, can leave department = null
    await form
      .validateFields(
        (checkHas17Level() && levelValue == t('IDS_NO_UPDATE')) || (levelValue < 8 && levelValue !== t('IDS_NO_UPDATE'))
          ? validateFieldsNames
          : validateFieldsName810s,
      )
      .then(async () => {
        const company = form.getFieldValue('company');

        // if all selected users are 8~10, can leave department = null
        const department = form.getFieldValue('department') === '' ? null : form.getFieldValue('department');
        const division = form.getFieldValue('division');
        const level = form.getFieldValue('level');
        const flagSkillValue = form.getFieldValue('flagSkill');
        if (selectedRecords.length === 1) {
          if (
            company == selectedRecords[0]?.company?.id &&
            department == selectedRecords[0]?.department?.id &&
            division == selectedRecords[0]?.division?.id &&
            level == selectedRecords[0]?.level &&
            flagSkillValue == selectedRecords[0]?.flagSkill
          ) {
            setOpenModalChange(false);
          } else {
            setOpenModalChange(true);
          }
        } else {
          if (
            company == t('IDS_NO_UPDATE') &&
            department == t('IDS_NO_UPDATE') &&
            division == t('IDS_NO_UPDATE') &&
            level == t('IDS_NO_UPDATE') &&
            flagSkillValue == t('IDS_NO_UPDATE')
          ) {
            setOpenModalChange(false);
          } else {
            setOpenModalChange(true);
          }
        }
      })
      .catch(() => {});
  };

  const getDataChange = () => {
    const company = form.getFieldValue('company');

    // if all selected users are 8~10, can leave department = null
    const department = form.getFieldValue('department') === '' ? null : form.getFieldValue('department');
    const division = form.getFieldValue('division');
    const level = form.getFieldValue('level');
    const listId = props.selectedRowKeys;
    const flagSkillValue = form.getFieldValue('flagSkill');
    const listUserSelecteds = props.selectedRecords;

    const data = {
      company: company,
      department: department,
      division: division,
      level: level,
      listId: listId,
      flagSkillValue: flagSkillValue,
      radioLevelValue: radioLevelValue,
      listUserSelecteds: listUserSelecteds,
    };

    return data;
  };

  return (
    <div>
      <Typography style={{ color: 'red', fontSize: 12 }}>{t('MESSAGE.COMMON.IDM_NOTE_CHANGE_INFO_USER')}</Typography>
      <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false} form={form}>
        <Form.Item label={t('IDS_COMPANY')} name="company" initialValue={t('IDS_NO_UPDATE')} colon={false}>
          <Select
            showSearch
            style={{ width: '300px' }}
            filterOption={(inputValue, option) =>
              option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          >
            {companyOption}
          </Select>
        </Form.Item>
        <Form.Item label={t('IDS_TYPE_DIVISION_NAME')} name="division" initialValue={t('IDS_NO_UPDATE')} colon={false}>
          <Select
            showSearch
            style={{ width: '300px' }}
            filterOption={(inputValue, option) =>
              option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            onChange={onChangeDivision}
          >
            {departmentOptionsTypeDivisions}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('IDS_TYPE_DEPARTMENT_NAME')}
          name="department"
          initialValue={t('IDS_NO_UPDATE')}
          colon={false}
          rules={[
            {
              required: Number(form.getFieldValue('level')) < 8 ? true : false,
              message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '300px' }}
            filterOption={(inputValue, option) =>
              option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            onChange={onChangeDepartment}
            allowClear={
              Number(form.getFieldValue('level')) > 7 && form.getFieldValue('department') !== t('IDS_NO_UPDATE')
            }
          >
            {departmentOptionsTypeDepartmentList}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('IDS_LEVEL')}
          name="level"
          initialValue={t('IDS_NO_UPDATE')}
          colon={false}
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
            },
          ]}
        >
          <Select
            style={{ width: '150px' }}
            filterOption={(inputValue, option) =>
              option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
            }
            onChange={onChangeLevel}
          >
            {levelOption}
          </Select>
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} name={'flagSkill'} initialValue={t('IDS_NO_UPDATE')} colon={false}>
          <Select showSearch style={{ width: '150px' }} onChange={onChangeFlagSkill}>
            {selectedRecords.length > 1 && (
              <Option value={t('IDS_NO_UPDATE')} key={t('IDS_NO_UPDATE')}>
                {t('IDS_NO_UPDATE')}
              </Option>
            )}
            <Option value={1} key={1}>
              {t('IDS_HAVE')}
            </Option>
            <Option value={0} key={0}>
              {t('IDS_NOT_HAVE')}
            </Option>
          </Select>
        </Form.Item>
        {/* {isChangeLevel && ( */}
        {typeEvaluation !== 2 && (
          <Form.Item label={' '} colon={false} valuePropName="checked" name={'radioCheck'}>
            <Radio.Group onChange={onChange} value={radioLevelValue}>
              <Space direction="vertical">
                {/* <Radio disabled={!changeFields.displayRadioZero} value={-1}>
                {t('IDS_NO_UPDATE_EVALUATION')}
              </Radio> */}
                {typeEvaluation < 1 && (
                  <Radio disabled={!changeFields.displayRadioOne} value={1}>
                    {t('IDS_RESET_ALL')}
                  </Radio>
                )}
                <Radio disabled={!changeFields.displayRadioTwo} value={2}>
                  {t('IDS_RESET_BEHAVIOR')}
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        )}
        {/* )} */}
        <Typography style={{ fontSize: 12 }}>{t('MESSAGE.COMMON.IDM_CONFIRM_SAVE_USER_1_SMALL')}</Typography>
        <Row>
          <MainButton
            type="primary"
            style={{ marginRight: 15, marginTop: 4 }}
            onClick={handleValidate}
            loading={isDisable}
          >
            {t('IDS_BUTTON_SAVE')}
          </MainButton>
          <MainButton
            type="primary"
            style={{ marginRight: 15, marginTop: 4 }}
            onClick={handleValidateCheckData}
            loading={isDisable}
            disabled={!checkEnableButtonInfoChange()}
          >
            {t('IDS_CHECK_BUTTON')}
          </MainButton>
          <CancelButton form="form" style={{ marginTop: 4 }} onClick={props.handleCancel} loading={isDisable}>
            {t('IDS_BUTTON_CANCEL')}
          </CancelButton>
        </Row>
      </Form>

      {/**Popup confirm nút edit  */}
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={handleSubmit}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isDisable}
      />

      {/** Popup confirm user infor change */}
      <PopupConfirmListUserInfor
        isLoading={isDisable}
        isOpenPopup={isOpenModalChange}
        setOpenPopup={setOpenModalChange}
        submitData={handleSubmit}
        dataChange={getDataChange()}
      />
    </div>
  );
};

export default PopupEditUser;
