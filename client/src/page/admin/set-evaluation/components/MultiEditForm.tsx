/* eslint-disable prefer-const */
import { Cascader, Form, Radio, Select, Space, message } from 'antd';
import { CancelButton, MainButton } from '../../../../common/MainButton';
import { useEffect, useState } from 'react';
import httpAxios from '../../../../common/http';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';

interface Props {
  selectedRecord: any;
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  handleCancel: any;
  handleSearch: any;
  setTextNotify: any;
  setIsVisibleNotify: any;
  temListEvaluators: any;
  state: any;
  setSelectedRows: any;
}

const MultiEditForm: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isDisable, setDisable] = useState(false);
  const [isRequired, setCheckRequired] = useState(false);
  const [isDisableRadio, setDisableRadio] = useState(true);
  const [optionEvaluators, setOptionEvaluator] = useState<{ label: string; value: any; disabled?: boolean }[]>([
    { label: t('IDS_NO_UPDATE'), value: t('IDS_NO_UPDATE') },
  ]);
  const [listSkills, setListSkill] = useState([]) as any;
  useEffect(() => {
    progressData();
  }, []);

  const progressData = async () => {
    /**Get all user have role evaluator */
    await httpAxios.Get('/api/v1/f5/management-evaluation-history/get-list-evaluator').then((res) => {
      if (res && res.status === 200) {
        const temps = res?.data.map((v: any) => ({ label: `${v.employeeNumber}: ${v.fullName}`, value: v.id }));
        const listOptions = [...optionEvaluators, ...temps];
        setOptionEvaluator(listOptions);
      }
    });
    httpAxios.Get('/api/v1/f5/management-evaluation-history/get-all-skill-public').then((res) => {
      if (res && res?.status) {
        const arrays = res?.data.map((v: any) => ({
          label: `${v.name}`,
          value: v.id,
        }));

        const defaultValue = {
          label: t('IDS_NO_UPDATE'),
          value: -1,
        };
        arrays.splice(0, 0, defaultValue);
        setListSkill(arrays);
      }
    });
  };

  const handleSubmit = async () => {
    await form
      .validateFields()
      .then(async (_value) => {
        setDisable(true);

        let evaluatorHaft = _value.evaluatorHaft;
        let evaluatorFirst = _value.evaluatorFirst;
        let evaluatorSecond = _value.evaluatorSecond;
        let listUserSelected = props.selectedRecord;
        let state = props.state;
        let typeEdit = _value.typeEdit;
        let skills = _value.skills.flat();

        if (
          evaluatorHaft == t('IDS_NO_UPDATE') &&
          evaluatorFirst == t('IDS_NO_UPDATE') &&
          evaluatorSecond == t('IDS_NO_UPDATE') &&
          skills.includes(-1)
        ) {
          props.handleCancel();
        } else {
          setDisable(true);
          await httpAxios
            .Put('/api/v1/f5/management-evaluation-history/update-setting-evaluator-list-user', {
              evaluatorHaft,
              evaluatorFirst,
              evaluatorSecond,
              listUserSelected,
              state,
              typeEdit,
              skills,
            })
            .then((res) => {
              if (res && res.status === 200) {
                // message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
                // props.setSelectedRowKeys([]);
                // props.handleCancel();
                // props.handleSearch();
                if (
                  res.data.userInfor.length == 0 &&
                  res.data.userDeleted.length == 0 &&
                  res.data.evaluatorDeleted.length == 0
                ) {
                  message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
                  props.setSelectedRowKeys([]);
                  props.setSelectedRows([]);
                  props.handleCancel();
                  props.handleSearch();
                } else {
                  props.setSelectedRowKeys([]);
                  props.setSelectedRows([]);
                  props.handleCancel();
                  props.handleSearch();

                  /**Set messager notify user cannot delete */
                  let text = t('MESSAGE.COMMON.IDM_RESULT_TITLE') + '\n';
                  if (res.data.userInfor.length > 0) {
                    for (let i = 0; i < res.data.userInfor.length; i++) {
                      text +=
                        res.data.userInfor[i].employeeNumber +
                        ': ' +
                        res.data.userInfor[i].fullName +
                        ' : ' +
                        t('MESSAGE.COMMON.IDM_RESULT_EVALUATOR_SELECTED_DUPLICATE_USER') +
                        '\n';
                    }
                  }

                  if (res.data.userDeleted.length > 0) {
                    for (let i = 0; i < res.data.userDeleted.length; i++) {
                      text +=
                        res.data.userDeleted[i].employeeNumber +
                        ': ' +
                        res.data.userDeleted[i].fullName +
                        ' : ' +
                        t('MESSAGE.COMMON.IDM_USER_DELETED_OR_PERMISSION_DENIED_F1') +
                        '\n';
                    }
                  }

                  if (res.data.evaluatorDeleted.length > 0) {
                    for (let i = 0; i < res.data.evaluatorDeleted.length; i++) {
                      text +=
                        res.data.evaluatorDeleted[i].employeeNumber +
                        ': ' +
                        res.data.evaluatorDeleted[i].fullName +
                        ' : ' +
                        t('MESSAGE.COMMON.IDM_EVALUATOR_DELETED_OR_PERMISSION_DENIED_F2') +
                        '\n';
                    }
                  }

                  text += '\n';

                  props.setTextNotify(text.replace(/\n/g, '<br />'));

                  /**Set notify open */
                  props.setIsVisibleNotify(true);
                }
              }
            });
        }
      })
      .catch(() => {});
    setDisable(false);
  };

  const handleOptionalChange = (_value: any) => {
    props.temListEvaluators.splice(0);
    props.temListEvaluators.push(form.getFieldValue('evaluatorHaft'));
    props.temListEvaluators.push(form.getFieldValue('evaluatorFirst'));
    props.temListEvaluators.push(form.getFieldValue('evaluatorSecond'));
    const vs = optionEvaluators.map((v) => ({
      ...v,
      disabled: v.value !== t('IDS_NO_UPDATE') && props.temListEvaluators.includes(v.value),
    }));
    setOptionEvaluator(vs);
  };

  return (
    <div>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        form={form}
      >
        <Form.Item label={t('IDS_EVALUATOR_0_5')} name="evaluatorHaft" initialValue={t('IDS_NO_UPDATE')}>
          <Select
            style={{ width: '200px' }}
            showSearch
            options={optionEvaluators}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
            onChange={(value) => {
              handleOptionalChange(value);
            }}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>

        <Form.Item label={t('IDS_EVALUATOR_1')} name="evaluatorFirst" initialValue={t('IDS_NO_UPDATE')}>
          <Select
            style={{ width: '200px' }}
            showSearch
            optionFilterProp="id"
            options={optionEvaluators}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
            onChange={(value) => {
              handleOptionalChange(value);
            }}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATOR_2')} name="evaluatorSecond" initialValue={t('IDS_NO_UPDATE')}>
          <Select
            style={{ width: '200px' }}
            showSearch
            optionFilterProp="id"
            options={optionEvaluators}
            filterOption={(inputValue, option) =>
              option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
            }
            onChange={(value) => {
              handleOptionalChange(value);
            }}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>

        <Form.Item
          label={t('IDS_TEMPLATE')}
          name="skills"
          initialValue={[[-1]]}
          style={{ marginBottom: 8, marginTop: 8, width: 600 }}
        >
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: 500 }}
            size="small"
            options={listSkills}
            multiple
            allowClear={false}
            maxTagTextLength={150}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            onChange={(selectedOptions) => {
              const selectedSkills = selectedOptions.flat() as number[];
              if (form.getFieldValue('skills').length !== 0) {
                form.validateFields([`typeEdit`]);
              } else {
                !form.validateFields([`typeEdit`]);
              }

              if (selectedSkills.length > 0) {
                setDisableRadio(false);
                const values = selectedOptions.filter((v) => v[0] !== -1);
                form.setFieldValue('skills', values);
                setCheckRequired(true);
              } else if (selectedSkills.length == 0) {
                form.setFieldValue('skills', [[-1]]);
                form.setFieldValue('typeEdit', null);
                setDisableRadio(true);
                setCheckRequired(false);
              }
            }}
          />
        </Form.Item>
        <div style={{ color: 'red', fontSize: 12, marginLeft: 120, marginTop: -10 }}>
              {t('MESSAGE.COMMON.IDM_NOTE_CHANGE_TEMPLATE_SKILL')}
            </div>
        <Form.Item
          label={' '}
          name="typeEdit"
          colon={false}
          rules={[
            {
              required: isRequired,
              message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
            },
          ]}
        >
          <Radio.Group disabled={isDisableRadio}>
            <Radio value={1}>{t('IDS_REPLACE_ALL')}</Radio>
            <Radio value={2}>{t('IDS_ONLY_ADD_NEW')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Space
          size={'middle'}
          style={{
            marginTop: 10,
          }}
        >
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            onClick={handleSubmit}
            loading={isDisable}
          >
            {t('IDS_BUTTON_SAVE')}
          </MainButton>
          <CancelButton form="form" onClick={props.handleCancel} loading={isDisable}>
            {t('IDS_BUTTON_CANCEL')}
          </CancelButton>
        </Space>
      </Form>
    </div>
  );
};

export default MultiEditForm;
