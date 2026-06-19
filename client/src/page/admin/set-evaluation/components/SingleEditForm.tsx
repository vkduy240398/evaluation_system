/* eslint-disable prefer-const */
import { Cascader, Form, Select, Space, message } from 'antd';
import { CancelButton, MainButton } from '../../../../common/MainButton';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import httpAxios from '../../../../common/http';
import EmptyComponent from '../../../../common/EmptyComponent';

interface Props {
  selectedRecord: any;
  setSelectedRowKeys: any;
  selectedRowKeys: any;
  handleCancel: any;
  handleSearch: any;
  listChangeOptinals: any;
  setTextNotify: any;
  setIsVisibleNotify: any;
  state: any;
  setSelectedRows: any;
}
let temListEvaluators: any[] = [];
let listEvaluatorNotIncludeUserSelects: any[] = [];

const SingleEditForm: React.FC<Props> = (props: Props) => {
  let checkList: any[] = [];

  const [form] = Form.useForm();
  const [optionEvaluators, setOptionEvaluator] = useState<{ label: string; value: any; disabled?: boolean }[]>([]);
  const [isDisable, setDisable] = useState(false);
  const [getValueDelete05, setValueDelete05] = useState('');
  const [getValueDelete10, setValueDelete10] = useState('');
  const [department, setDepartment] = useState('');
  const [listSkills, setListSkill] = useState([]) as any;

  useEffect(() => {
    const level17s = [1, 2, 3, 4, 5, 6, 7];
    const level810s = [8, 9, 10];

    if (props.selectedRecord[0]?.childrens?.length > 0) {
      if (level17s.includes(props.selectedRecord[0]?.childrens[0]?.level)) {
        setDepartment(props.selectedRecord[0]?.childrens[0]?.departmentName);
      } else if (level810s.includes(props.selectedRecord[0]?.childrens[0]?.level)) {
        setDepartment(props.selectedRecord[0]?.childrens[0]?.divisionName);
      }
    } else {
      if (level17s.includes(props.selectedRecord[0]?.evaluatorDefault?.level)) {
        setDepartment(props.selectedRecord[0]?.evaluatorDefault?.departmentName);
      } else if (level810s.includes(props.selectedRecord[0]?.evaluatorDefault?.level)) {
        setDepartment(props.selectedRecord[0]?.evaluatorDefault?.divisionName);
      }
    }

    listEvaluatorNotIncludeUserSelects = [];
    temListEvaluators = [];
    props.selectedRecord[0].evaluatorDefault === null
      ? ''
      : temListEvaluators.push(props.selectedRecord[0]?.evaluatorDefault?.evaluator05?.id);
    props.selectedRecord[0].evaluatorDefault === null
      ? ''
      : temListEvaluators.push(props.selectedRecord[0]?.evaluatorDefault?.evaluator1?.id);
    props.selectedRecord[0].evaluatorDefault === null
      ? ''
      : temListEvaluators.push(props.selectedRecord[0]?.evaluatorDefault?.evaluator2?.id);

    checkList = temListEvaluators.filter((item, index) => temListEvaluators.indexOf(item) === index);

    /**Get all user have role evaluator */
    httpAxios.Get('/api/v1/f5/management-evaluation-history/get-list-evaluator').then((res) => {
      if (res && res.status === 200) {
        const temps = res?.data.map((v: any) => ({ label: `${v.employeeNumber}: ${v.fullName}`, value: v.id }));
        listEvaluatorNotIncludeUserSelects = temps.filter(function (obj: any) {
          return obj.value !== props.selectedRecord[0].id;
        });

        const vs = listEvaluatorNotIncludeUserSelects.map((v: any) => ({
          ...v,
          disabled: checkList.includes(v.value),
        }));
        setOptionEvaluator(vs);
      }
    });

    httpAxios.Get('/api/v1/f5/management-evaluation-history/get-all-skill-public').then((res) => {
      if (res && res?.status) {
        const arrays = res?.data.map((v: any) => ({
          label: `${v.name}`,
          value: v.id,
        }));

        setListSkill(arrays);
      }
    });
  }, []);

  const handleSubmit = async () => {
    form
      .validateFields()
      .then(async (_value) => {
        setDisable(true);
        let evaluatorHaft = _value.evaluatorHaft;
        let evaluatorFirst = _value.evaluatorFirst;
        let evaluatorSecond = _value.evaluatorSecond;
        let userId = props.selectedRecord[0].userId;
        let skills = _value.skills?.flat();
        let state = props.state;

        setDisable(true);
        await httpAxios
          .Put('/api/v1/f5/management-evaluation-history/update-setting-evaluator-of-one-user', {
            evaluatorHaft,
            evaluatorFirst,
            evaluatorSecond,
            userId,
            getValueDelete05,
            getValueDelete10,
            skills,
            state,
          })
          .then((res) => {
            if (res && res.status === 200) {
              if (
                res.data.userDeleted.length == 0 &&
                res.data.evaluatorDeleted.length == 0 &&
                res.data.evaluatorCanNotDeleted == 0
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

                if (res.data.evaluatorCanNotDeleted.length > 0) {
                  for (let i = 0; i < res.data.evaluatorCanNotDeleted.length; i++) {
                    text +=
                      res.data.evaluatorCanNotDeleted[i].employeeNumber +
                      ': ' +
                      res.data.evaluatorCanNotDeleted[i].fullName +
                      t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_REASON') +
                      '\n';
                  }
                  text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_2');
                  text += '\n' + t('MESSAGE.COMMON.IDM_RESULT_DELETE_USER_3');
                }

                text += '\n';

                props.setTextNotify(text.replace(/\n/g, '<br />'));

                /**Set notify open */
                props.setIsVisibleNotify(true);
              }
            }
          });
      })
      .catch(() => {});
    setDisable(false);
  };

  const handleOptionalChange = (_value: any) => {
    props.listChangeOptinals.splice(0);
    props.listChangeOptinals.push(form.getFieldValue('evaluatorHaft'));
    props.listChangeOptinals.push(form.getFieldValue('evaluatorFirst'));
    props.listChangeOptinals.push(form.getFieldValue('evaluatorSecond'));
    const vs = listEvaluatorNotIncludeUserSelects.map((v: any) => ({
      ...v,
      disabled: props.listChangeOptinals.includes(v.value),
    }));

    setOptionEvaluator(vs);
  };

  return (
    <div>
      <Form
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        form={form}
        initialValues={{
          // remember: true,
          evaluatorHaft:
            props.selectedRecord[0].evaluatorDefault === null
              ? undefined
              : props.selectedRecord[0]?.evaluatorDefault?.evaluator05?.id,
          evaluatorFirst:
            props.selectedRecord[0].evaluatorDefault === null
              ? undefined
              : props.selectedRecord[0]?.evaluatorDefault?.evaluator1?.id,
          evaluatorSecond:
            props.selectedRecord[0].evaluatorDefault === null
              ? undefined
              : props.selectedRecord[0]?.evaluatorDefault?.evaluator2?.id,
          skills: props.selectedRecord[0]?.skillUser
            ?.filter((item: any) => item?.evaluationId == null)
            ?.map((v: any) => [v?.skill?.id]),
        }}
      >
        <Form.Item label={t('IDS_FULLNAME')} className="ant-form-item-info">
          {props.selectedRecord[0].employeeNumber + ': ' + props.selectedRecord[0].fullName}
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} className="ant-form-item-info">
          {department}
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATOR_0_5')} name="evaluatorHaft">
          <Select
            allowClear
            onClear={() => {
              setValueDelete05(form.getFieldValue('evaluatorHaft'));
            }}
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
        <Form.Item label={t('IDS_EVALUATOR_1')} name="evaluatorFirst">
          <Select
            allowClear
            onClear={() => {
              setValueDelete10(form.getFieldValue('evaluatorFirst'));
            }}
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
        <Form.Item
          label={t('IDS_EVALUATOR_2')}
          name="evaluatorSecond"
          rules={[
            {
              required: true,
              message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
            },
          ]}
        >
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
        {props.selectedRecord[0].evaluatorDefault.flagSkill == 1 && (
          <>
            <Form.Item
              label={t('IDS_TEMPLATE')}
              name="skills"
              style={{ marginBottom: 8, marginTop: 8, width: 600 }}
              rules={[
                {
                  required: props.selectedRecord[0].evaluatorDefault.flagSkill === 1 ? true : false,
                  message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
                },
              ]}
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
              />
            </Form.Item>
            <div style={{ color: 'red', fontSize: 12, marginLeft: 120, marginTop: -10 }}>
              {t('MESSAGE.COMMON.IDM_NOTE_CHANGE_TEMPLATE_SKILL')}
            </div>
          </>
        )}

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

export default SingleEditForm;
