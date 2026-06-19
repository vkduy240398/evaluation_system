import { useEffect, useLayoutEffect, useState } from 'react';
import Form from 'antd/es/form';
import Typography from 'antd/es/typography';
import Space from 'antd/es/space';
import { useForm } from 'antd/es/form/Form';
import adminEvaluationApiService from '../../../common/api/adminEvaluationPro';
import { UserResType } from '../../../types/api/adminEvaluationPro';
import Button from 'antd/es/button';
import { AdminEvaluationProResType } from '../../../types/pages/admin-evaluation-pro/AdminEvaluationProType';
import { t } from 'i18next';
import { Cascader, Checkbox, message } from 'antd';
import Row from 'antd/lib/row';

interface Props {
  isOpen: boolean;
  groups: { label: string; value: any; departmentIds: number[] }[];
  divisionId: number | string;
  selectedRows: AdminEvaluationProResType[];
  setMessageSetter: (str: string) => void;
  setMessageApprover: (str: string) => void;
  setOpenNotification: (bool: boolean) => void;
  setOpen?: (isbool: boolean) => void;
  fnHandle?: () => void;
}

type UserInActivesSetterApproverType = {
  id: string;
  employeeNumber: string;
  fullName: string;
};
const SettingEvaluationPopup = (props: Props) => {
  // ** Props
  const {
    isOpen,
    groups,
    divisionId,
    selectedRows,
    setOpen,
    fnHandle,
    setMessageSetter,
    setMessageApprover,
    setOpenNotification,
  } = props;

  // ** State
  const [optionSetters, setOptionSetter] = useState<{ label: string; value: any; disabled?: boolean }[]>([]);

  const [optionApprovers, setOptionApprover] = useState<{ label: string; value: any; disabled?: boolean }[]>([]);

  const selected = selectedRows.length === 1 ? selectedRows[0] : undefined;

  const optionNotChange: { label: string; value: any } = { label: t('IDS_NO_UPDATE'), value: -1 };

  const [isLoading, setLoading] = useState<boolean>(false);

  const [groupOPtions, setGroupOption] = useState<{ label: string; value: any }[]>([]);

  // const [values, setValue] = useState<{
  //   skillSetters: number[];
  //   skillApprovers: number[];
  //   isCheckedDep: boolean | undefined;
  //   isCheckedDiv: boolean | undefined;
  //   isCheckedGroup: boolean | undefined;
  //   group: number | undefined;
  //   groups: number[];
  // } | null>(null);

  const [isComboboxDisable, setComboboxDisable] = useState<boolean>(true);

  const [messageError, setMessageError] = useState<string>('');

  // ** Hook
  const [formPopup] = useForm();

  // ** Effect
  useEffect(() => {
    adminEvaluationApiService.getUserActive({
      callback: (data: { setters: UserResType[]; approvers: UserResType[] }) => {
        const optionSetters = data.setters.map((v) => ({ label: `${v.employeeNumber}: ${v.fullName}`, value: v.id }));
        const optionApprovers = data.approvers.map((v) => ({
          label: `${v.employeeNumber}: ${v.fullName}`,
          value: v.id,
        }));
        setOptionSetter(optionSetters);
        setOptionApprover(optionApprovers);
      },
    });

    return () => {
      setMessageError('');
    };
  }, []);

  useLayoutEffect(() => {
    if (selected) {
      const filters = groups?.filter((f) => f.departmentIds.includes(selected?.departmentId));

      if (filters) {
        setGroupOption(filters);
        const convertGroupDefaultValues = selected.groups.flat();

        const exitGroupOptions =
          filters.length > 0
            ? convertGroupDefaultValues.filter((f) => filters.findIndex((i) => i.value === f) > -1).map((v) => [v])
            : [];
        if (exitGroupOptions.length > 0) {
          setComboboxDisable(!selected.isCheckedGroup);
          formPopup.setFieldsValue({ isCheckedGroup: selected.isCheckedGroup, groups: exitGroupOptions });
        } else {
          setComboboxDisable(true);
          formPopup.setFieldsValue({ isCheckedGroup: false, groups: [] });
        }
      }

      const skillSetters = selected.skillSetters.map((v) => v.id);
      const skillApprovers = selected.skillApprovers.map((v) => v.id);

      formPopup.setFieldsValue({
        skillSetters: splitIntoChunk(skillSetters),
        skillApprovers: splitIntoChunk(skillApprovers),

        isCheckedDep: selected.isCheckedDep,
        isCheckedDiv: selected.isCheckedDiv,
      });
    } else {
      formPopup.setFieldsValue({
        skillSetters: [-1],
        skillApprovers: [-1],
        group: undefined,
        isCheckedDep: false,
        isCheckedDiv: false,
        isCheckedGroup: false,
        groups: [],
      });
      setComboboxDisable(true);
    }
  }, [selectedRows, isOpen]);

  // ** Functional
  const callback = (data: {
    userInActivesSetters: UserInActivesSetterApproverType[];
    userInActivesApprovers: UserInActivesSetterApproverType[];
  }) => {
    const { userInActivesSetters, userInActivesApprovers } = data;
    if (userInActivesSetters.length > 0 || userInActivesApprovers.length > 0) {
      //
      const messageSetter = userInActivesSetters.map((v) => `${v.employeeNumber}: ${v.fullName}`).toString();
      const messageApprover = userInActivesApprovers.map((v) => `${v.employeeNumber}: ${v.fullName}`).toString();
      setMessageSetter(messageSetter);
      setMessageApprover(messageApprover);
      setOpenNotification(true);
    } else {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS').toString());
    }
    fnHandle && fnHandle();
    setLoading(false);
    handleClosePopup();
  };

  const errorCallback = () => setLoading(false);

  const handleClosePopup = () => {
    setOpen && setOpen(false);
    formPopup.setFieldsValue({
      group: undefined,
      isCheckedDep: false,
      isCheckedDiv: false,
      isCheckedGroup: false,
    });
    setMessageError('');
  };
  const handleCheckboxGroupChange = (e: { target: { checked: boolean } }) => {
    setComboboxDisable(!e.target.checked);
    setMessageError('');
  };

  const handleCheckboxOnChange = () => setMessageError('');

  const onFinish = async (values: {
    skillSetters: number[];
    skillApprovers: number[];
    isCheckedDep: boolean | undefined;
    isCheckedDiv: boolean | undefined;
    isCheckedGroup: boolean | undefined;
    group: number | undefined;
    groups: number[][];
  }) => {
    const { isCheckedDep, isCheckedDiv, isCheckedGroup, groups } = values;
    const convertGroups = [];
    if (groups) {
      if (groups.length) {
        convertGroups.push(...groups.map((group) => group[1] || group[0]));
      }
    }

    const isError = !isCheckedDep && !isCheckedDiv && !isCheckedGroup;

    if (isError) setMessageError(t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string);
    else {
      setMessageError('');

      handleUpdate({ ...values, groups: convertGroups });
    }
  };

  const handleUpdate = async (values: any) => {
    if (values) {
      const { skillSetters, skillApprovers, isCheckedDep, isCheckedDiv, isCheckedGroup, group, groups } = values;
      const arrSkillSetters = skillSetters.flat();
      const arrSkillApprovers = skillApprovers.flat();

      setLoading(true);
      if (selected) {
        const departmentId = selected.departmentId;
        await adminEvaluationApiService.updateDepartmentRole({
          divisionId,
          departmentId,
          skillSetters: arrSkillSetters,
          skillApprovers: arrSkillApprovers,
          isCheckedDep,
          isCheckedDiv,
          isCheckedGroup,
          group,
          groups,
          callback,
          errorCallback,
        });
      } else {
        const departmentIds = selectedRows.map((v) => v.departmentId);
        await adminEvaluationApiService.updateDepartmentRoleMultiple({
          divisionId,
          departmentIds: departmentIds,
          skillSetters: arrSkillSetters,
          skillApprovers: arrSkillApprovers,
          isCheckedDep,
          isCheckedDiv,
          isCheckedGroup,
          group,
          groups,
          callback,
          errorCallback,
        });
      }
    }
  };

  const splitIntoChunk = (arr: number[]) => {
    const results = [[]];
    if (arr && arr.length && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        let tempArray: any;
        // eslint-disable-next-line prefer-const
        tempArray = arr?.slice(i, i + 1);
        results.push(tempArray);
      }
    }

    return results;
  };

  return (
    <>
      <Form
        labelCol={{ span: 1 }}
        form={formPopup}
        colon={false}
        requiredMark={false}
        labelAlign="left"
        onFinish={onFinish}
      >
        {selected ? (
          <Form.Item label={t('IDS_TYPE_DEPARTMENT_NAME')}>
            <Typography style={{ width: 250 }}>{selected?.departmentName}</Typography>
          </Form.Item>
        ) : null}

        <Form.Item
          label={t('IDS_SETTER_PRO_SKILL')}
          name="skillSetters"
          rules={[
            {
              validator(_, value) {
                const values: any[][] = value;
                const isRequired = values.some((s) => s.length > 0);
                if (!isRequired) return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString());

                return Promise.resolve();
              },
            },
          ]}
        >
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: 250 }}
            size="small"
            loading={isLoading}
            options={selected ? [...optionSetters] : [optionNotChange, ...optionSetters]}
            multiple
            allowClear={false}
            maxTagTextLength={150}

            // onChange={(e) => {
            //   let checkItems = [];
            //   if (JSON.stringify(e[e.length - 1]) === '[-1]') {
            //     checkItems = [-1];
            //   } else if (JSON.stringify(e[0]) === '[-1]') {
            //     checkItems = e.slice(1);
            //   } else {
            //     checkItems = e;
            //   }
            //   if (checkItems && checkItems.length) {
            //     formPopup.setFieldsValue({
            //       skillSetters: checkItems,
            //     });
            //   }
            // }}
          />
        </Form.Item>

        <Form.Item
          label={t('IDS_APPROVER_PRO_SKILL')}
          name="skillApprovers"
          style={{ marginBottom: 8, marginTop: 8 }}
          rules={[
            {
              validator(_, value) {
                const values: any[][] = value;
                const isRequired = values.some((s) => s.length > 0);
                if (!isRequired) return Promise.reject(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString());

                return Promise.resolve();
              },
            },
          ]}
        >
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: 250 }}
            size="small"
            loading={isLoading}
            options={selected ? [...optionApprovers] : [optionNotChange, ...optionApprovers]}
            multiple
            allowClear={false}
            maxTagTextLength={150}
            onChange={(e) => {
              let checkItems = [];
              if (JSON.stringify(e[e.length - 1]) === '[-1]') {
                checkItems = [-1];
              } else if (JSON.stringify(e[0]) === '[-1]') {
                checkItems = e.slice(1);
              } else {
                checkItems = e;
              }
              if (checkItems && checkItems.length)
                formPopup.setFieldsValue({
                  skillApprovers: checkItems,
                });
            }}
          />
        </Form.Item>

        <Form.Item label={t('IDS_GROUP_TYPE')} style={{ marginBottom: 8 }}>
          <Space size={'middle'} style={{ height: 15 }}>
            <Form.Item name={'isCheckedDep'} valuePropName="checked">
              <Checkbox style={{ lineHeight: '16px' }} onChange={handleCheckboxOnChange}>
                {t('IDS_TYPE_DEPARTMENT')}
              </Checkbox>
            </Form.Item>

            <Form.Item name={'isCheckedDiv'} valuePropName="checked">
              <Checkbox value={1} style={{ lineHeight: '16px' }} onChange={handleCheckboxOnChange}>
                {t('IDS_TYPE_DIVISION')}
              </Checkbox>
            </Form.Item>

            <Form.Item name={'isCheckedGroup'} valuePropName="checked">
              <Checkbox value={1} style={{ lineHeight: '16px' }} onChange={handleCheckboxGroupChange}>
                {t('IDS_TYPE_GROUP')}
              </Checkbox>
            </Form.Item>
          </Space>
          <Row>
            <Typography.Text type="danger">{messageError}</Typography.Text>
          </Row>
        </Form.Item>

        {/* <Form.Item
          label="Group"
          name="group"
          rules={[{ required: !isComboboxDisable, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
        >
          <Select
            showSearch
            options={groups || []}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
            disabled={isComboboxDisable}
            className="input-selected-table"
          />
        </Form.Item> */}

        <Form.Item
          label={t('IDS_GROUP_NAME')}
          name="groups"
          style={{ marginBottom: 10, marginTop: 0 }}
          rules={[{ required: !isComboboxDisable, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM').toString() }]}
        >
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: 250 }}
            allowClear={false}
            options={groupOPtions}
            multiple
            maxTagTextLength={150}
            size="small"
            disabled={isComboboxDisable}
          />
        </Form.Item>

        <Space size={'middle'}>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {t('IDS_BUTTON_SAVE')}
            </Button>
          </Form.Item>

          <Form.Item noStyle>
            <Button className="cancel_button" onClick={handleClosePopup} loading={isLoading}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </>
  );
};

export default SettingEvaluationPopup;
