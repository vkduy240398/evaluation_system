/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import Icon, { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Radio, RadioChangeEvent, Select, Skeleton, Space, Tree, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import PopupAddDepartment from './PopupAddDepartment';
import { CancelButton } from '../../../common/MainButton';
import { MetaModal } from '../../../model/MetalModel';
import { useLocation, useNavigate } from 'react-router-dom';
import httpAxios from '../../../common/http';
import { changeRole1, changeRole2, changeRole3, changeRole4, compareArrayNumber, getDataList } from './processes';
import { t } from 'i18next';
import EmptyComponent from '../../../common/EmptyComponent';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import type { DataNode } from 'antd/es/tree';
import PopupConfirmUserInfor from './PopupConfirmUserInfor';
import { FormInstance } from 'antd/lib';
import { compareDatePeriod } from '../../../common/util';
import { FlagSkillValue } from '../../../constant/VersionSettingType';

type StateType = {
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
};

interface DepartmentProps {
  id: number;
  code?: string;
  name?: string;
  codeName: string;
}
interface DivisionProps {
  divisionId: number;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}
interface LevelProps {
  id: number;
  level: number;
}
interface CompanyProps {
  id: number;
  name: string;
}
interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}
const UserDetailScreen: React.FC = () => {
  const [form] = Form.useForm();
  const Location = useLocation();
  const id = Location.state;
  const navigates = useNavigate();
  if (!id) {
    navigates('/admin-user/user-list');
  }
  const [typeEvaluation, setTypeEvaluation] = useState(2);
  const [recordInfo, setRecordInfo] = useState<StateType>({
    departmentId: 0,
    department: {
      id: 0,
      name: '',
      code: '',
    },
    companyId: 0,
    company: {
      id: 0,
      name: '',
      code: '',
    },
    divisionId: 0,
    division: {
      id: 0,
      name: '',
      code: '',
    },
    id: 0,
    employeeNumber: '',
    fullName: '',
    email: '',
    level: 0,
    flagSkill: 0,
    roles: [],
    updatedTime: undefined,
  });
  const [levelList, setListLevel] = useState<LevelProps[]>([]);

  const [listDepartmentTypeDepartments, setListDepartmentTypeDepartment] = useState<DepartmentProps[]>([]);

  const [listDepartmentTypeDivisions, setListDepartmentTypeDivision] = useState<DivisionProps[]>([]);

  const [listCompanys, setListCompany] = useState<CompanyProps[]>([]);

  const [isEdit, setIsEdit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isVisableNotify, setIsVisibleNotify] = useState(false);

  const [textNotify, setTextNotify] = useState('');

  const [defaultOption, setdefaultOption] = useState(
    {} as {
      companyId: number;
      divisionId: number;
      departmentId: number;
    },
  );

  const [defaultRoleList, setdefaultRoleList] = useState<number[]>([]);

  const [isLoadingPage, setLoadingPage] = useState(false);

  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const [isOpenModalChange, setOpenModalChange] = useState<boolean>(false);

  const [checkedList, setCheckedList] = useState<number[]>(defaultRoleList);

  const [radioLevelvalue, setRadioButtonValue] = useState(-1);

  const { Option } = Select;

  const [expandedKeys] = useState<React.Key[]>([0]);

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const [changeFields, setChangeFields] = useState({
    displayRadioZero: false,
    displayRadioTwo: false,
    displayRadioOne: false,
  });

  const [isChecked, setChecked] = useState(recordInfo.flagSkill === 1);

  const onChangeCheckBox = (e: RadioChangeEvent) => {
    setChecked(e.target.value);
    if (
      recordInfo.flagSkill === e.target.value &&
      form.getFieldValue('division') === recordInfo.divisionId &&
      form.getFieldValue('department') === recordInfo.departmentId &&
      form.getFieldValue('level') === recordInfo.level
    ) {
      form.setFieldsValue({ radioCheck: 0 });
      setRadioButtonValue(-1);
      setChangeFields({
        ...changeFields,
        displayRadioTwo: false,
        displayRadioOne: false,
        displayRadioZero: false,
      });
    } else {
      handleSetRadioButtonAfterClick();
    }
  };

  const onHandleSubmit = () => {
    if (isEdit) {
      onValidateForm();
    } else {
      setRadioButtonValue(-1);
      setIsEdit(!isEdit);
    }
  };

  const onHandleSubmitCheckData = () => {
    !isEdit && setIsEdit(!isEdit);
    if (isEdit) {
      onValidateFormCheckData();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    setCheckedList(checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[]) => {
    setSelectedKeys(selectedKeysValue);
  };

  const treeDatas: DataNode[] = [
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1],
      key: 1,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2],
      key: 2,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3],
      key: 3,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4],
      key: 4,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5],
      key: 5,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6],
      key: 6,
      className: 'tree-custom-css',
    },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7],
      key: 7,
      className: 'tree-custom-css',
    },

    // {
    //   title: t('IDS_EVALUATION_MANAGEMENT'),
    //   className: 'tree-custom-css',

    //   key: 0,
    //   children: [
    //     { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5], key: 5, className: 'tree-custom-css' },
    //     { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6], key: 6, className: 'tree-custom-css' },
    //     { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7], key: 7, className: 'tree-custom-css' },
    //   ],
    // },
    {
      title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8],
      key: 8,
      className: 'tree-custom-css',
    },
  ];

  const getUserInfo = async () => {
    if (id) {
      setLoadingPage(true);
      await httpAxios
        .Get('/api/v1/f8/management-user/get-user-detail-by-id', {
          params: {
            id,
          },
        })
        .then((res) => {
          if (res && res.status === 200) {
            if (res?.data) {
              setRecordInfo(res?.data);
            }
          }
        });
      setLoadingPage(false);
    }
  };

  const getEvaluationInfo = async () => {
    if (id) {
      setLoadingPage(true);
      await httpAxios
        .Get('/api/v1/f8/management-user/get-evaluation-by-user', {
          params: {
            id,
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
            }
          }
        });
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    getUserInfo();

    /**Set list level */
    const levelList = [];
    for (let i = 1; i <= 10; i++) {
      levelList.push({
        id: i,
        level: i,
      });
    }
    const temps: LevelProps[] = [];
    levelList.forEach((item: LevelProps) => {
      temps.push({ id: item.id, level: item.level });
    });
    setListLevel(temps);
  }, []);

  const levelOptionList = levelList?.map((item: LevelProps) => {
    return (
      <Option value={item.id} key={item.id}>
        {item.level}
      </Option>
    );
  });

  useEffect(() => {
    if (recordInfo) {
      const roleList = recordInfo.roles.map((role: RoleProps) => {
        role.value = role.id;

        return role;
      });
      const defaultOption = {
        companyId: recordInfo?.company?.id,
        divisionId: recordInfo?.division?.id,
        departmentId: recordInfo?.department?.id,
      };

      setdefaultOption(defaultOption);
      const defaultRoleList = roleList?.map((role: RoleProps) => {
        return role.id;
      });
      setdefaultRoleList(defaultRoleList);
      setCheckedList(defaultRoleList);
      setCheckedKeys(defaultRoleList);

      form.setFieldValue(['company'], recordInfo?.companyId);
      form.setFieldValue(['division'], recordInfo?.divisionId);
      form.setFieldValue(['department'], recordInfo?.departmentId);
      form.setFieldValue(['level'], recordInfo?.level);
      form.setFieldValue(['hasSkill'], recordInfo.flagSkill);
      getDataList(
        setListDepartmentTypeDepartment,
        setListDepartmentTypeDivision,
        setListCompany,
        recordInfo?.divisionId,
      );
      if (isEdit) {
        getEvaluationInfo();
      }
    }
  }, [recordInfo, isEdit]);

  const [metaModal, setMetaModal] = useState({
    type: '0',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);

  const handleOpen = (type: string) => {
    form.setFieldsValue({ name: '', code: '' });
    if (type === '0') {
      form.setFieldsValue({ division_oracle: form.getFieldValue('division') });
    }
    setMetaModal({ ...metaModal, isOpen: true, title: t('IDS_ADD_DEPARTMENT'), type: type });
  };

  const isRecordRoleChanged = () => {
    let hasResult = false;

    const oldRoles = recordInfo.roles.map((el) => el.value);
    const newRoles = checkedList.filter((newRole) => [1, 2, 3, 4, 5, 6, 7, 8].includes(newRole));
    for (let i = 1; i <= 8; i++) {
      if (newRoles.includes(i) && !oldRoles.includes(i)) {
        hasResult = true;
        break;
      }
      if (oldRoles.includes(i) && !newRoles.includes(i)) {
        hasResult = true;
        break;
      }
    }

    return hasResult;
  };

  /** function nút edit  */
  const submitData = async () => {
    const userId = id;

    const companyValue = form.getFieldValue('company');
    const depValue = form.getFieldValue('department');
    const divValue = form.getFieldValue('division');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue =
      form.getFieldValue('hasSkill') === undefined ? recordInfo.flagSkill : form.getFieldValue('hasSkill');

    if (
      recordInfo.companyId === companyValue &&
      recordInfo.departmentId === depValue &&
      recordInfo.divisionId === divValue &&
      recordInfo.level === levelValue &&
      recordInfo.flagSkill === flagSkillValue &&
      !isRecordRoleChanged()
    ) {
      setOpenModal(false);
      setIsEdit(false);

      return;
    }

    const company = recordInfo.companyId === companyValue ? undefined : listCompanys.find((f) => f.id === companyValue);

    //user 8~10 co the de trong department
    const department =
      recordInfo.departmentId === depValue
        ? undefined
        : !depValue
        ? null
        : listDepartmentTypeDepartments.find((f) => f.id === depValue);
    const division =
      recordInfo.divisionId === divValue
        ? undefined
        : listDepartmentTypeDivisions.find((f) => f.divisionId === divValue);
    const level = recordInfo.level === levelValue ? undefined : levelValue;

    const roles = compareArrayNumber(defaultRoleList, checkedList)
      ? undefined
      : checkedList.filter((item) => item !== 0);
    const isChangeRoleF2 = changeRole2(defaultRoleList, checkedList);
    const isChangeRoleF3 = changeRole3(defaultRoleList, checkedList);
    const isChangeRoleF4 = changeRole4(defaultRoleList, checkedList);
    const typeChangeRoleF1 = changeRole1(defaultRoleList, checkedList);

    const levelOld = recordInfo.level;
    const oldFlagSkill = recordInfo.flagSkill;

    setIsLoading(true);
    await httpAxios
      .Put('/api/v1/f8/management-user/edit-user', {
        userId,
        company,
        department,
        division,
        level,
        roles,
        isChangeRoleF2,
        isChangeRoleF3,
        isChangeRoleF4,
        typeChangeRoleF1,
        levelOld,
        updatedTime: recordInfo.updatedTime,
        radioLevelvalue: radioLevelvalue,
        oldFlagSkill,
        flagSkillValue,
      })
      .then((res: any) => {
        if (res && res.status === 200) {
          const errorList = res.data;
          const error05 = errorList.role05 ? 'nguoi danh gia 0.5' : '';
          const error1 = errorList.role1 ? 'nguoi danh gia 1' : '';
          const error2 = errorList.role2 ? 'nguoi danh gia 2' : '';
          if (changeRole2(defaultRoleList, checkedList) && (error05 || error1 || error2)) {
            let text = t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_1') + '\n';
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_2');
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4');
            text += '\n';
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_3');
            setTextNotify(text.replace(/\n/g, '<br />'));
            setOpenModal(!isOpenModal);

            /**Set notify open */
            setIsVisibleNotify(true);
          } else {
            message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
            setOpenModal(!isOpenModal);
            getUserInfo();
            setIsEdit(false);
          }
        }
        setIsLoading(false);
      });
    handleResetAfterClick();
  };

  /**Function nút check data */
  const submitDataAfterCheck = async () => {
    const userId = id;

    const companyValue = form.getFieldValue('company');
    const depValue = form.getFieldValue('department');
    const divValue = form.getFieldValue('division');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue =
      form.getFieldValue('hasSkill') === undefined ? recordInfo.flagSkill : form.getFieldValue('hasSkill');

    const company = recordInfo.companyId === companyValue ? undefined : listCompanys.find((f) => f.id === companyValue);

    //user 8~10 co the de trong department
    const department =
      recordInfo.departmentId === depValue
        ? undefined
        : !depValue
        ? null
        : listDepartmentTypeDepartments.find((f) => f.id === depValue);
    const division =
      recordInfo.divisionId === divValue
        ? undefined
        : listDepartmentTypeDivisions.find((f) => f.divisionId === divValue);
    const level = recordInfo.level === levelValue ? undefined : levelValue;

    const roles = compareArrayNumber(defaultRoleList, checkedList)
      ? undefined
      : checkedList.filter((item) => item !== 0);
    const isChangeRoleF2 = changeRole2(defaultRoleList, checkedList);
    const isChangeRoleF3 = changeRole3(defaultRoleList, checkedList);
    const isChangeRoleF4 = changeRole4(defaultRoleList, checkedList);
    const typeChangeRoleF1 = changeRole1(defaultRoleList, checkedList);

    const levelOld = recordInfo.level;
    const oldFlagSkill = recordInfo.flagSkill;

    setIsLoading(true);
    await httpAxios
      .Put('/api/v1/f8/management-user/edit-user', {
        userId,
        company,
        department,
        division,
        level,
        roles,
        isChangeRoleF2,
        isChangeRoleF3,
        isChangeRoleF4,
        typeChangeRoleF1,
        levelOld,
        updatedTime: recordInfo.updatedTime,
        radioLevelvalue: radioLevelvalue,
        oldFlagSkill,
        flagSkillValue,
      })
      .then((res: any) => {
        if (res && res.status === 200) {
          const errorList = res.data;
          const error05 = errorList.role05 ? 'nguoi danh gia 0.5' : '';
          const error1 = errorList.role1 ? 'nguoi danh gia 1' : '';
          const error2 = errorList.role2 ? 'nguoi danh gia 2' : '';
          if (changeRole2(defaultRoleList, checkedList) && (error05 || error1 || error2)) {
            let text = t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_1') + '\n';
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_2');
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_4');
            text += '\n';
            text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_EDIT_USER_3');
            setTextNotify(text.replace(/\n/g, '<br />'));
            setOpenModalChange(!isOpenModalChange);

            /**Set notify open */
            setIsVisibleNotify(true);
          } else {
            message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
            setOpenModalChange(!isOpenModalChange);
            getUserInfo();
            setIsEdit(false);
          }
        }
        setIsLoading(false);
      });
    handleResetAfterClick();
  };

  /** validate nút edit */
  const onValidateForm = async () => {
    // user 8~10 co the de trong department
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'hasSkill'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    const levelValue = form.getFieldValue('level');

    await form
      .validateFields(levelValue && levelValue > 7 ? validateFieldsName810s : validateFieldsNames)
      .then(async () => {
        const companyValue = form.getFieldValue('division');
        if (companyValue) {
          setOpenModal(true);
        }
      })
      .catch(() => {});
  };

  /**validation nút check data */
  const onValidateFormCheckData = async () => {
    // user 8~10 co the de trong department
    const validateFieldsNames = ['company', 'division', 'department', 'level', 'hasSkill'];
    const validateFieldsName810s = ['company', 'division', 'level'];
    const levelValue = form.getFieldValue('level');

    await form
      .validateFields(levelValue && levelValue > 7 ? validateFieldsName810s : validateFieldsNames)
      .then(async () => {
        const companyValue = form.getFieldValue('division');
        if (companyValue) {
          const companyValue = form.getFieldValue('company');
          const depValue = form.getFieldValue('department');
          const divValue = form.getFieldValue('division');
          const levelValue = form.getFieldValue('level');
          const flagSkillValue =
            form.getFieldValue('hasSkill') === undefined ? recordInfo.flagSkill : form.getFieldValue('hasSkill');

          if (
            recordInfo.companyId === companyValue &&
            recordInfo.departmentId === depValue &&
            recordInfo.divisionId === divValue &&
            recordInfo.level === levelValue &&
            recordInfo.flagSkill === flagSkillValue &&
            !isRecordRoleChanged()
          ) {
            setOpenModalChange(false);
          } else {
            setOpenModalChange(true);
          }
        }
      })
      .catch(() => {});
  };

  const buttonAdd = (type: string) => {
    return (
      <div style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0px' }}>
        <Button
          type="text"
          icon={
            <Icon
              component={PlusCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ color: '#00874d', fontSize: 20 }}
            />
          }
          onClick={() => handleOpen(type)}
          style={{ textAlign: 'center' }}
        />
      </div>
    );
  };

  const isNotChangeContentUpdate = (
    form: FormInstance,
    recordInfo: { departmentId: number; divisionId: number; level: number; flagSkill: number },
  ): boolean => {
    return (
      recordInfo.departmentId === form.getFieldValue('department') &&
      recordInfo.divisionId === form.getFieldValue('division') &&
      recordInfo.level === form.getFieldValue('level') &&
      recordInfo.flagSkill === form.getFieldValue('hasSkill')
    );
  };

  const onChangeCheck = (e: RadioChangeEvent) => {
    setRadioButtonValue(e.target.value);
  };

  const onChangeLevel = (e: any) => {
    // if (
    //   ([1, 2, 3, 4, 5, 6, 7].includes(recordInfo.level) && [8, 9, 10].includes(e)) ||
    //   ([8, 9, 10].includes(recordInfo.level) && [1, 2, 3, 4, 5, 6, 7].includes(e))
    // ) {
    //   setRadioButtonValue(1);
    //   form.setFieldsValue({ radioCheck: 1 });
    // }
    // if ([1, 2, 3, 4, 5, 6, 7].includes(recordInfo.level) && [1, 2, 3, 4, 5, 6, 7].includes(e)) {
    //   setRadioButtonValue(0);
    //   form.setFieldsValue({ radioCheck: 0 });
    // }
    if (isNotChangeContentUpdate(form, recordInfo)) {
      setChangeFields({
        ...changeFields,
        displayRadioZero: false,
        displayRadioTwo: false,
        displayRadioOne: false,
      });

      // setRadioButtonValue(0);
      form.setFieldsValue({ radioCheck: 0 });
    } else {
      handleSetRadioButtonAfterClick();
    }
    form.validateFields();
  };

  const onClose = () => {
    setMetaModal({ ...metaModal, isOpen: false, title: '' });
    form.setFieldsValue({ class: 0, code: '', input_name: '', division_oracle: '', department_oracle: '' });
  };

  const onChangeDivision = (divisionId: number) => {
    form.setFieldsValue({ department: '' });
    const fillters = listDepartmentTypeDivisions.find((f) => f.divisionId === divisionId);
    setListDepartmentTypeDepartment(fillters?.childrens || []);

    if (isNotChangeContentUpdate(form, recordInfo)) {
      setChangeFields({
        ...changeFields,
        displayRadioZero: false,
        displayRadioTwo: false,
        displayRadioOne: false,
      });
      setRadioButtonValue(-1);
      form.setFieldsValue({ radioCheck: 0 });
    } else {
      handleSetRadioButtonAfterClick();
    }
  };

  const onChangeDepartment = (departmentId: number) => {
    const level = form.getFieldValue('level');

    if (isNotChangeContentUpdate(form, recordInfo)) {
      setRadioButtonValue(-1);
      form.setFieldsValue({ radioCheck: 0 });
      setChangeFields({
        ...changeFields,
        displayRadioZero: false,
        displayRadioTwo: false,
        displayRadioOne: false,
      });
    } else {
      handleSetRadioButtonAfterClick();
    }
  };
  const handleResetAfterClick = () => {
    form.setFieldsValue({ radioCheck: 0 });
    setChangeFields({
      ...changeFields,
      displayRadioZero: false,
      displayRadioTwo: false,
      displayRadioOne: false,
    });
  };
  const handleSetRadioButtonAfterClick = () => {
    const level = form.getFieldValue('level');
    if (typeEvaluation === 0) {
      setRadioButtonValue(1);
      form.setFieldsValue({ radioCheck: 1 });
    }

    setChangeFields({
      ...changeFields,
      displayRadioTwo:
        recordInfo.departmentId === form.getFieldValue('department') &&
        recordInfo.divisionId === form.getFieldValue('division') &&
        recordInfo.flagSkill === form.getFieldValue('hasSkill') &&
        recordInfo.level !== level &&
        ((recordInfo.level <= 7 && level <= 7) || (recordInfo.level > 7 && level > 7)),
      displayRadioOne: true,
      displayRadioZero: true,
    });
  };

  const getDataChange = () => {
    let data;
    const userId = id;

    const companyValue = form.getFieldValue('company');
    const depValue = form.getFieldValue('department');
    const divValue = form.getFieldValue('division');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue =
      form.getFieldValue('hasSkill') === undefined ? recordInfo.flagSkill : form.getFieldValue('hasSkill');

    const company = recordInfo.companyId === companyValue ? undefined : listCompanys.find((f) => f.id === companyValue);

    //user 8~10 co the de trong department
    const department =
      recordInfo.departmentId === depValue
        ? undefined
        : !depValue
        ? null
        : listDepartmentTypeDepartments.find((f) => f.id === depValue);
    const division =
      recordInfo.divisionId === divValue
        ? undefined
        : listDepartmentTypeDivisions.find((f) => f.divisionId === divValue);
    const level = recordInfo.level === levelValue ? undefined : levelValue;

    const roles = compareArrayNumber(defaultRoleList, checkedList)
      ? undefined
      : checkedList.filter((item) => item !== 0);
    const levelOld = recordInfo.level;
    const oldFlagSkill = recordInfo.flagSkill;

    return (data = {
      userId: userId,
      company: company,
      department: department,
      division: division,
      level: level,
      roles: roles,
      flagSkillValue: flagSkillValue,
      radioLevelvalue: radioLevelvalue,
      oldFlagSkill: oldFlagSkill,
      levelOld: levelOld,
    });
  };

  const checkEnableButtonInfoChange = () => {
    const divisionValue = form.getFieldValue('division');
    const departmentValue = form.getFieldValue('department');
    const levelValue = form.getFieldValue('level');
    const flagSkillValue = form.getFieldValue('hasSkill');

    if (
      divisionValue !== recordInfo.divisionId ||
      departmentValue !== recordInfo.departmentId ||
      levelValue !== recordInfo.level ||
      flagSkillValue !== recordInfo.flagSkill
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        closable={false}
        maskClosable={false}
        footer={[
          // eslint-disable-next-line react/jsx-key
          <div style={{ textAlign: 'right' }}>
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_OK')}
            </Button>
          </div>,
        ]}
      >
        <p dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>
      <Typography.Title level={3}>{t('IDS_USER_DETAIL')}</Typography.Title>
      {isLoadingPage ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          name="create_template_form"
          initialValues={{
            remember: true,
            company: defaultOption?.companyId,
            division: defaultOption?.divisionId,
            department: defaultOption?.departmentId,
            level: recordInfo?.level,
          }}
          colon={false}
          requiredMark={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%' }}
          labelAlign="left"
        >
          {isEdit && (
            <Typography style={{ color: 'red', fontSize: 12 }}>
              {t('MESSAGE.COMMON.IDM_NOTE_CHANGE_INFO_USER')}
            </Typography>
          )}
          <Form.Item label={t('IDS_FULLNAME')} className="ant-form-item-info">
            <Typography.Text>{recordInfo.employeeNumber + ': ' + recordInfo.fullName}</Typography.Text>
          </Form.Item>
          <Form.Item label={t('IDS_EMAIL')} className="ant-form-item-info">
            <Typography.Text>{recordInfo.email}</Typography.Text>
          </Form.Item>
          <Form.Item
            label={t('IDS_COMPANY')}
            className={isEdit ? '' : 'ant-form-item-info'}
            style={{ marginBottom: 0 }}
          >
            {isEdit ? (
              <Form.Item
                name="company"
                className={isEdit ? '' : 'ant-form-item-info'}
                style={{ minWidth: 350, width: 'calc(23% - 8px)' }}
              >
                <Select
                  filterOption={(inputValue, option) =>
                    option?.props.children?.toString().toLocaleLowerCase().includes(inputValue.toLowerCase())
                  }
                  showSearch
                  notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                  style={{ width: 250 }}
                >
                  {listCompanys.map((item: CompanyProps) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <>{recordInfo?.company?.name}</>
            )}
          </Form.Item>
          <Form.Item
            label={t('IDS_TYPE_DIVISION_NAME')}
            className={isEdit ? '' : 'ant-form-item-info'}
            style={{ marginBottom: 0 }}
          >
            {isEdit ? (
              <Form.Item
                name={'division'}
                className={isEdit ? '' : 'ant-form-item-info'}
                style={{ display: 'inline-block', minWidth: 250, width: 'calc(23% - 8px)' }}
                rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
              >
                <Select
                  filterOption={(inputValue, option) =>
                    option?.props.children?.toString().toLocaleLowerCase().includes(inputValue.toLowerCase())
                  }
                  showSearch
                  notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                  style={{ width: 250 }}
                  onChange={onChangeDivision}
                >
                  {listDepartmentTypeDivisions.map((item) => (
                    <Option key={item.divisionId} value={item.divisionId}>
                      {item.codeName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Typography>{recordInfo?.division === null ? '' : `${recordInfo?.division?.name}`}</Typography>
            )}
            {isEdit && <span style={{ position: 'absolute', left: 250 }}>{buttonAdd('1')}</span>}
          </Form.Item>
          <Form.Item
            label={t('IDS_TYPE_DEPARTMENT_NAME')}
            className={isEdit ? '' : 'ant-form-item-info'}
            style={{ marginBottom: 0 }}
          >
            {isEdit ? (
              <Form.Item
                name={'department'}
                className={isEdit ? '' : 'ant-form-item-info'}
                style={{ display: 'inline-block', minWidth: 250, width: 'calc(23% - 8px)' }}
                rules={[
                  {
                    required: Number(form.getFieldValue('level')) < 8 ? true : false,
                    message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                  },
                ]}
              >
                <Select
                  filterOption={(inputValue, option) =>
                    option?.props.children?.toString().toLocaleLowerCase().includes(inputValue.toLowerCase())
                  }
                  showSearch
                  notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                  style={{ width: 250 }}
                  onChange={onChangeDepartment}
                  allowClear={Number(form.getFieldValue('level')) > 7}
                >
                  {listDepartmentTypeDepartments.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.codeName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Typography>{recordInfo?.department === null ? '' : `${recordInfo?.department?.name}`}</Typography>
            )}
            {isEdit && <span style={{ position: 'absolute', left: 250 }}>{buttonAdd('0')}</span>}
          </Form.Item>

          <Form.Item
            label={t('IDS_LEVEL')}
            className={isEdit ? '' : 'ant-form-item-info'}
            name={'level'}
            rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string }]}
          >
            {isEdit ? (
              <Select
                style={{ width: '80px' }}
                filterOption={(inputValue, option) =>
                  option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
                }
                loading={isLoading}
                onChange={onChangeLevel}
              >
                {levelOptionList}
              </Select>
            ) : (
              <>{recordInfo.level}</>
            )}
          </Form.Item>
          <Form.Item label={t('IDS_EVALUATION_SKILL')} name={'hasSkill'} className={isEdit ? '' : 'ant-form-item-info'}>
            {isEdit ? (
              <Radio.Group defaultValue={recordInfo.flagSkill} onChange={onChangeCheckBox}>
                <Radio value={1}>{t('IDS_HAVE')}</Radio>
                <Radio value={0}>{t('IDS_NOT_HAVE')}</Radio>
              </Radio.Group>
            ) : (
              <>{recordInfo.flagSkill === FlagSkillValue.HAVE_SKILL ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}</>
            )}
          </Form.Item>
          {isEdit && typeEvaluation !== 2 && (
            <Form.Item label={' '} colon={false} name={'radioCheck'}>
              <Radio.Group onChange={onChangeCheck} value={radioLevelvalue}>
                <Space direction="vertical">
                  {/* <Radio disabled={!changeFields.displayRadioZero} value={-1}>
                    {t('IDS_NO_UPDATE_EVALUATION')}
                  </Radio> */}
                  {typeEvaluation !== 1 && (
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
          <Form.Item label={t('IDS_ROLE')} initialValue={checkedList}>
            <Tree
              disabled={!isEdit}
              checkable
              expandedKeys={expandedKeys}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeDatas}
              switcherIcon={false}
              className="tree-custom-background-color"
            />
          </Form.Item>
          <Space
            size={'middle'}
            style={{
              marginTop: 10,
            }}
          >
            <Form.Item style={{ margin: 0 }}>
              <Button
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                loading={isLoading}
                onClick={onHandleSubmit}
                disabled={isEdit ? isLoading : false}
              >
                {isEdit ? t('IDS_BUTTON_SAVE') : t('IDS_EDIT')}
              </Button>
            </Form.Item>

            {isEdit && (
              <Button
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                loading={isLoading}
                onClick={onHandleSubmitCheckData}
                disabled={!checkEnableButtonInfoChange()}
              >
                {t('IDS_CHECK_BUTTON')}
              </Button>
            )}

            <CancelButton
              onClick={() => {
                if (isEdit) {
                  getUserInfo();
                  setIsEdit(false);
                  handleResetAfterClick();
                } else {
                  navigates(-1);
                }
              }}
            >
              {t('IDS_BUTTON_CANCEL')}
            </CancelButton>
          </Space>
        </Form>
      )}
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        onCancel={onClose}
        destroyOnClose={true}
        open={metaModal.isOpen}
        title={<Typography.Title level={4}>{metaModal.title}</Typography.Title>}
        centered
        footer={null}
        maskClosable={false}
      >
        <PopupAddDepartment
          metaModal={metaModal}
          setMetaModal={setMetaModal}
          listDepartmentTypeDepartments={listDepartmentTypeDepartments}
          setListDepartmentTypeDepartment={setListDepartmentTypeDepartment}
          listDepartmentTypeDivisions={listDepartmentTypeDivisions}
          setListDepartmentTypeDivision={setListDepartmentTypeDivision}
          form={form}
          recordInfo={recordInfo}
          handleSetRadioButtonAfterClick={handleSetRadioButtonAfterClick}
        />
      </Modal>

      {/**Popup confirm nút edit */}
      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE')}
        fnHandleOk={submitData}
        fnHandleCancel={handleCloseModal}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />

      {/** Popup confirm user infor change */}
      <PopupConfirmUserInfor
        isOpenPopup={isOpenModalChange}
        setOpenPopup={setOpenModalChange}
        submitData={submitDataAfterCheck}
        isLoading={isLoading}
        dataChange={getDataChange()}
      />
    </div>
  );
};

export default UserDetailScreen;
