// Library imports
import { Button, Cascader, Form, Input, Space, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// File imports
import adminEvaluationApiService from '../../../common/api/adminEvaluationPro';
import { DepartmentWithSubClass, SettingSkillType, UserResType } from '../../../types/api/adminEvaluationPro';
import { SkillOptions } from '../../../page/admin-evaluation/setting-evaluation-pro/SettingTemplate';

// Types
type Props = {
  selectedSkill?: SettingSkillForm;
  onCancel: () => void;
  onAddCallback: () => void;
  skillList: any[];
  setSkillOptions?: Dispatch<SetStateAction<SkillOptions[]>>;
};

export type SettingSkillForm = {
  skillId: number;
  skillName: string;
  skillSetters: number[][];
  skillApprovers: number[][];
  departments: number[][];
  divisions: number[][];
};

type Option = { label: string; value: any; disabled?: boolean };

const SettingSkillPopup = ({ selectedSkill, onCancel, onAddCallback, skillList, setSkillOptions }: Props) => {
  // Other hooks
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // useState
  const [setterOptions, setSetterOptions] = useState<Option[]>([]);
  const [approverOptions, setApproverOptions] = useState<Option[]>();
  const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<Option[]>([]);
  const [departmentList, setDepartmentList] = useState<DepartmentWithSubClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartmentOptions, setSelectedDepartmentOptions] = useState<number[]>([]);
  const [selectedDivisionOptions, setSelectedDivisionOptions] = useState<number[]>([]);
  const [isError, setIsError] = useState(false);

  // useEffect
  useEffect(() => {
    const fetchInitForm = async () => {
      setIsLoading(true);

      await Promise.all([
        adminEvaluationApiService.getUserActive({
          callback: (data: { setters: UserResType[]; approvers: UserResType[] }) => {
            const setterOptions = data.setters.map((v) => ({
              label: `${v.employeeNumber}: ${v.fullName}`,
              value: v.id,
            }));
            const approverOptions = data.approvers.map((v) => ({
              label: `${v.employeeNumber}: ${v.fullName}`,
              value: v.id,
            }));
            setSetterOptions(setterOptions);
            setApproverOptions(approverOptions);
          },
        }),
        adminEvaluationApiService.getAllDepartmentsWithSubClass({
          callback: (data) => {
            const departments = data.filter((dep) => dep.type === 0);
            const divisions = data.filter((dep) => dep.type === 1);

            setDivisionOptions(
              divisions.map((div) => ({
                label: div.name,
                value: div.id,
              })),
            );

            if (selectedSkill) {
              const subclasses = selectedSkill?.divisions
                .flat()
                .map((selectedDiv) => divisions.filter((div) => div.id === selectedDiv))
                .flat()
                .map((div) => div.divisionSubclass)
                .flat();

              setDepartmentOptions(
                departments.map((dep) => ({
                  label: dep.name,
                  value: dep.id,
                  disabled: subclasses?.some((sub) => sub.departmentId === dep.id),
                })),
              );
              setSelectedDivisionOptions(selectedSkill.divisions.flat());
              setSelectedDepartmentOptions(selectedSkill.departments.flat());
            } else {
              setDepartmentOptions(
                departments.map((dep) => ({
                  label: dep.name,
                  value: dep.id,
                })),
              );
            }

            setDepartmentList(data);
          },
        }),
      ]);

      setIsLoading(false);
    };

    fetchInitForm();
  }, []);

  // Functional
  const handleSubmitForm = () => {
    form
      .validateFields()
      .then(async (data: SettingSkillType) => {
        // if (!selectedDepartmentOptions.length && !selectedDivisionOptions.length) {
        //   setIsError(true);

        //   return;
        // }

        setIsLoading(true);

        const formData: SettingSkillType = {
          ...data,
          skillApprovers: data.skillApprovers.flat(),
          skillSetters: data.skillSetters.flat(),
          departments: data.departments?.flat() ?? [],
          divisions: data.divisions?.flat() ?? [],
        };

        if (selectedSkill) {
          await adminEvaluationApiService.updateProSkill({
            callback: () => {
              onCancel();
              onAddCallback();
              message.success(t('MESSAGE.COMMON.IDM_EDIT_SKILL_SUCCESS'));

              if (setSkillOptions) {
                setSkillOptions((prev) =>
                  prev.map((option) =>
                    option.value === selectedSkill.skillId ? { ...option, label: formData.skillName } : option,
                  ),
                );
              }
            },
            payload: formData,
            id: selectedSkill.skillId,
          });
        } else {
          await adminEvaluationApiService.addProSkill({
            callback: () => {
              onCancel();
              onAddCallback();
              message.success(t('MESSAGE.COMMON.IDM_ADD_SKILL_SUCCESS'));
            },
            payload: formData,
          });
        }

        setIsLoading(false);
      })
      .catch((e) => {
        if (!selectedDepartmentOptions.length && !selectedDivisionOptions.length) {
          setIsError(true);

          return;
        }
      });
  };

  return (
    <Form
      form={form}
      initialValues={selectedSkill}
      labelCol={{ span: 1 }}
      colon={false}
      requiredMark={false}
      labelAlign="left"
    >
      <Form.Item
        label={t('IDS_TEMPLATE')}
        name="skillName"
        style={{ marginBottom: 8 }}
        rules={[
          { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string },
          { max: 100, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100') },
          {
            validator: async (_, value) => {
              if (selectedSkill) {
                const filteredSkillList = skillList.filter((skill) => skill.skillId !== selectedSkill.skillId);

                if (filteredSkillList.map((skill) => skill.skillName).includes(value?.trim())) {
                  return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_SKILL_NAME_EXIST').toString()));
                }
              } else {
                if (skillList.map((skill) => skill.skillName).includes(value?.trim())) {
                  return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_SKILL_NAME_EXIST').toString()));
                }
              }
            },
          },
        ]}
      >
        <Input style={{ width: 250, borderRadius: 4 }} disabled={isLoading} maxLength={101} />
      </Form.Item>

      <Form.Item
        label={t('IDS_SETTER_PRO_SKILL')}
        name="skillSetters"
        style={{ marginBottom: 8, marginTop: 8 }}
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string }]}
      >
        <Cascader
          className="Cascader"
          showSearch
          style={{ width: 250 }}
          size="small"
          loading={isLoading}
          options={setterOptions}
          multiple
          allowClear={false}
          maxTagTextLength={150}
        />
      </Form.Item>

      <Form.Item
        label={t('IDS_APPROVER_PRO_SKILL')}
        name="skillApprovers"
        style={{ marginBottom: 8, marginTop: 8 }}
        rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string }]}
      >
        <Cascader
          className="Cascader"
          showSearch
          style={{ width: 250 }}
          size="small"
          loading={isLoading}
          options={approverOptions}
          multiple
          allowClear={false}
          maxTagTextLength={150}
        />
      </Form.Item>

      <Form.Item
        label={t('IDS_TYPE_DIVISION')}
        name="divisions"
        style={{ marginBottom: 8, marginTop: 8 }}

        // help={
        //   (form.isFieldTouched('divisions') && !selectedDepartmentOptions.length && !selectedDivisionOptions.length) ||
        //   isError
        //     ? t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM')
        //     : null
        // }
        // validateStatus={
        //   (form.isFieldTouched('divisions') && !selectedDepartmentOptions.length && !selectedDivisionOptions.length) ||
        //   isError
        //     ? 'error'
        //     : undefined
        // }
      >
        <Cascader
          className="Cascader"
          showSearch
          style={{ width: 250 }}
          size="small"
          loading={isLoading}
          options={divisionOptions}
          multiple
          allowClear={false}
          maxTagTextLength={150}
          onChange={(selectedOptions) => {
            setIsError(false);

            const selectedDivisions = selectedOptions.flat() as number[];

            setSelectedDivisionOptions(selectedDivisions);

            /**
             * Check selected divisions have subclass or not
             * -> Disabled department's options if departments belong to subclass
             */
            const filteredDivisions = departmentList.filter((dep) =>
              dep.divisionSubclass.some((sub) => selectedDivisions.includes(sub.divisionId)),
            );

            const subclasses = filteredDivisions.map((div) => div.divisionSubclass).flat();

            setDepartmentOptions((prev) =>
              prev.map((option) =>
                subclasses.some((sub) => sub.departmentId === option.value)
                  ? { ...option, disabled: true }
                  : { ...option, disabled: false },
              ),
            );

            // Filter departments if division selected
            const selectedDepartments = form.getFieldValue('departments') as number[][];

            if (selectedDepartments && selectedDepartments.length) {
              const flattedDepartments = selectedDepartments.flat();

              const newDepartmentOptions = flattedDepartments.filter(
                (dep) => subclasses.findIndex((sub) => dep === sub.departmentId) === -1,
              );

              if (subclasses.length) {
                const set = new Set();

                subclasses.forEach((sub) => set.add(sub.departmentId));

                flattedDepartments.forEach((dep) => {
                  if (set.has(dep)) {
                    form.setFieldValue(
                      'departments',
                      newDepartmentOptions.map((dep) => [dep]),
                    );
                  }
                });
              }
            }
          }}
        />
      </Form.Item>

      <Form.Item
        label={t('IDS_TYPE_DEPARTMENT')}
        name="departments"
        style={{ marginBottom: 8, marginTop: 8 }}

        // help={
        //   (form.isFieldTouched('departments') &&
        //     !selectedDepartmentOptions.length &&
        //     !selectedDivisionOptions.length) ||
        //   isError
        //     ? t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM')
        //     : null
        // }
        // validateStatus={
        //   (form.isFieldTouched('departments') &&
        //     !selectedDepartmentOptions.length &&
        //     !selectedDivisionOptions.length) ||
        //   isError
        //     ? 'error'
        //     : undefined
        // }
      >
        <Cascader
          className="Cascader"
          showSearch
          style={{ width: 250 }}
          size="small"
          loading={isLoading}
          options={departmentOptions}
          multiple
          allowClear={false}
          maxTagTextLength={150}
          onChange={(selectedOptions) => {
            setIsError(false);

            const selectedDepartments = selectedOptions.flat();

            setSelectedDepartmentOptions(selectedDepartments as number[]);
          }}
        />
      </Form.Item>

      <Space size={'middle'}>
        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" loading={isLoading} onClick={handleSubmitForm}>
            {t('IDS_BUTTON_SAVE')}
          </Button>
        </Form.Item>

        <Form.Item noStyle>
          <Button className="cancel_button" onClick={onCancel} loading={isLoading}>
            {t('IDS_BUTTON_CANCEL')}
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default SettingSkillPopup;
