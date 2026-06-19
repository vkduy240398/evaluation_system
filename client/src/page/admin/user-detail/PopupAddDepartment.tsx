import { Form, Row, Input, Button, message, Radio, RadioChangeEvent, Select, FormInstance } from 'antd';
import { MainButton } from '../../../common/MainButton';
import httpAxios from '../../../common/http';
import { validateName } from '../list-department/processes/getAndValidate';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import departmentApiService from '../../../common/api/department.api';
import EmptyComponent from '../../../common/EmptyComponent';
interface Props {
  metaModal: any;
  setMetaModal: any;
  form: FormInstance;
  listDepartmentTypeDepartments: DepartmentProps[];
  setListDepartmentTypeDepartment: (args: DepartmentProps[]) => void;
  listDepartmentTypeDivisions: DivisionProps[];
  setListDepartmentTypeDivision: (args: DivisionProps[]) => void;
  recordInfo: StateType;
  handleSetRadioButtonAfterClick: () => void;
}
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
  roles: any[];
  updatedTime: any;
};
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

interface DataProps {
  code: string;
  name: string;
  class: any;
  type: number;
  active: number;
  division: any;
}

interface ResProps {
  id: number;
  class: number;
  type: number;
  code: string;
  name: string;
  active: number;
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

interface DataProps {
  code: string;
  name: string;
  class: any;
  type: number;
  active: number;
  division: any;
}

const PopupAddDepartment: React.FC<any> = (props: Props) => {
  const {
    metaModal,
    setMetaModal,
    form,
    setListDepartmentTypeDepartment,
    setListDepartmentTypeDivision,
    listDepartmentTypeDepartments,
    listDepartmentTypeDivisions,
    recordInfo,
    handleSetRadioButtonAfterClick,
  } = props;

  // const [form] = Form.useForm();
  const { Option } = Select;
  const [dataSave, setDataSave] = useState([]) as any;
  const [isLoading, setLoading] = useState(false);
  const [checkOracle, setCheckOracle] = useState(1);
  const [isLoadingOracle, setLoadingOracle] = useState(false);
  const [listDivisionOracle, setListDivisionOracle] = useState([]) as any;
  const [listMerge, setListMerge] = useState([]) as any;

  useEffect(() => {
    const dataList: any[] = [];
    departmentApiService.getListDepartmentGNW(dataList, setDataSave, setLoading);
    form.setFieldsValue({ class: 1 });

    //neu chot de sdefault la division da chon thi ko can goi list nay nua
    if (listMerge.length < 1 && metaModal.type == 0)
      departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
  }, []);
  const handleSubmit = async () => {
    setLoading(true);

    await form
      .validateFields(['division_oracle', 'department_oracle', 'code', 'input_name'])
      .then(async (values: any) => {
        let code = '';
        let name = '';

        //check oracle or create
        if (form.getFieldValue('class') === 0) {
          if (metaModal.type == 1) {
            code = values.division_oracle.split(':')[0].trim();
            name = values.division_oracle.split(':')[1].trim();
          } else {
            code = values.department_oracle.split(':')[0].trim();
            name = values.department_oracle.split(':')[1].trim();
          }
        } else {
          code = 'GNW-' + values.code;
          name = values.input_name;
        }
        const dataSave: DataProps = {
          code: code,
          name: name,
          class: form.getFieldValue('class'),
          type: Number(metaModal.type),
          active: 1,
          division: form.getFieldValue('division_oracle'),
        };

        await httpAxios.Post('/api/v1/f8/management-user/add-division-deparment', { ...dataSave }).then((res) => {
          if (res?.status === 201) {
            const resData = res.data as ResProps;
            message.success(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_ADDED_NEW_DEPARTMENT_SUCCESSFULLY'));

            // ** Add Only Division
            if (metaModal.type === '1') {
              if (resData) {
                const division = resData;
                form.setFieldsValue({ division: division.id });

                // ** Find division
                const find = listDepartmentTypeDivisions.find((f) => f.divisionId === division.id);

                if (!find) {
                  const divisionItem: DivisionProps = {
                    divisionId: division.id,
                    codeName: `${division.name}`,
                    childrens: [],
                  };

                  // ** Set division new into division exit
                  setListDepartmentTypeDivision([...listDepartmentTypeDivisions, divisionItem]);

                  // ** Set department
                  form.setFieldsValue({ department: '' });

                  setListDepartmentTypeDepartment([]);
                }
              }
            } else {
              const department = resData;

              // const divisonId: number = division?.id || form.getFieldValue('division_oracle');

              // ** Find division
              // const find = listDepartmentTypeDivisions.find((f) => f.divisionId === divisonId);

              // if (!find) {
              //   if (division) {
              //     form.setFieldsValue({ division: division.id });

              //     const divisionItem: DivisionProps = {
              //       divisionId: division.id,
              //       codeName: `${division.code}: ${division.name}`,
              //       childrens: [],
              //     };

              //     const departmentId: DepartmentProps = {
              //       id: department.id,
              //       codeName: `${department.code}: ${department.name}`,
              //     };

              //     // ** Set division new into division exit
              //     setListDepartmentTypeDivision([...listDepartmentTypeDivisions, divisionItem]);

              //     // ** Set department
              //     form.setFieldsValue({ department: department.id || '' });
              //     setListDepartmentTypeDepartment([departmentId]);
              //   }
              // } else
              {
                //
                const departmentId: DepartmentProps = {
                  id: department.id,
                  codeName: `${department.name}`,
                };
                setListDepartmentTypeDepartment([...listDepartmentTypeDepartments, departmentId]);

                // ** Set division new into division exit
                // form.setFieldsValue({ division: find.divisionId });

                // ** Set department
                form.setFieldsValue({ department: department.id || '' });

                // const convertDepartments = [...find.childrens, departmentId].filter(
                //   (v, i, s) => i === s.findIndex((t) => t.id === v.id && t.codeName === v.codeName),
                // );

                // setListDepartmentTypeDepartment([...convertDepartments]);
              }
            }
            form.setFieldsValue({ class: 1, code: '', input_name: '', division_oracle: '', department_oracle: '' });
            setMetaModal({ ...metaModal, isOpen: false, title: '' });
          } else if (res?.status === 204) {
            message.error(t('MESSAGE.SCREEN.DEPARTMENT_CONFIG.IDM_DEPARTMENT_NAME_EXIST'));
          }

          // // const name = 'GNW-' + form.getFieldValue('code') + ' : ' + form.getFieldValue('name');
          // Number(metaModal.type)
          //   ? form.setFieldsValue({ division: res.data.id })
          //   : form.setFieldsValue({ department: res.data.id });
          // const temp = { id: res.data.id, departmentNameTypeDepartment: res.data.code + ': ' + res.data.name };

          // // tempLists = Number(metaModal.type) ? [...listDepartmentTypeDivisions] : [...listDepartmentTypeDepartments];
          // tempLists.push(temp);

          // // Number(metaModal.type)
          // //   ? setListDepartmentTypeDivision(tempLists)
          // //   : setListDepartmentTypeDepartment(tempLists);
          // form.setFieldsValue({ class: 1, code: '', input_name: '', division_oracle: '', department_oracle: '' });
          // setMetaModal({ ...metaModal, isOpen: false, title: '' });
        });
        handleSetRadioButtonAfterClick();
      })
      .catch((err) => console.log({ err }));
    setLoading(false);
  };
  const handleCancel = () => {
    setMetaModal({ ...metaModal, isOpen: false, title: '' });
    form.setFieldsValue({ class: 1, code: '', input_name: '', division_oracle: '', department_oracle: '' });
  };
  const handleTypeChange = async (e: RadioChangeEvent) => {
    setCheckOracle(e.target.value);
    if (e.target.value === 0) {
      if (listDivisionOracle.length < 1) {
        await departmentApiService.getListDivisionOracle(setListDivisionOracle, setLoadingOracle);
      }
      if (listMerge.length < 1) {
        await departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
      }
    }
  };
  const oracleOptionList = listDivisionOracle?.map((item: any) => {
    return (
      <Option value={item.id} key={item.code}>
        {`${item.name}`}
      </Option>
    );
  });
  const mergeOptionList = listMerge?.map((item: any) => {
    return (
      <Option value={item.id} key={item.code}>
        {`${item.name}`}
      </Option>
    );
  });

  return (
    <div>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}

        // onFinish={handleSubmit}
      >
        <Form.Item label={t('IDS_CATEGORIES')} name="type">
          {Number(metaModal.type) ? t('IDS_TYPE_DIVISION') : t('IDS_TYPE_DEPARTMENT')}
        </Form.Item>
        <Form.Item label={t('IDS_CLASSIFICATION')} name="class" colon={false} initialValue={1}>
          <Radio.Group onChange={handleTypeChange}>
            <Radio value={1}>{t('IDS_CREATE_MANUAL')}</Radio>
            <Radio value={0}>{t('IDS_ORACLE_DEPARTMENT')}</Radio>
          </Radio.Group>
        </Form.Item>
        {checkOracle === 1 && (
          <>
            <Form.Item
              label={Number(metaModal.type) ? t('IDS_TYPE_DIVISION_NAME') : t('IDS_TYPE_DEPARTMENT_NAME')}
              name={'input_name'}
              style={{ paddingTop: 5 }}
              rules={[
                {
                  required: true,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
                {
                  max: 100,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100'),
                },
                {
                  validator(_rule, value) {
                    return validateName(value, form, metaModal.type, dataSave);
                  },
                },
              ]}
            >
              <Input maxLength={101} style={{ width: '200px' }} />
            </Form.Item>
          </>
        )}
        {metaModal.type == 0 && checkOracle === 0 && (
          <Form.Item
            label={t('IDS_TYPE_DEPARTMENT_NAME')}
            name="department_oracle"
            colon={false}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: '250px' }}
              filterOption={(inputValue, option) =>
                option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
              }
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              disabled={isLoadingOracle}
              loading={isLoadingOracle}
            >
              {oracleOptionList}
            </Select>
          </Form.Item>
        )}
        {(checkOracle === 0 || (checkOracle === 1 && metaModal.type == 0)) && (
          <Form.Item
            label={t('IDS_TYPE_DIVISION_NAME')}
            name="division_oracle"
            colon={false}
            rules={[
              {
                required: true,
                message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
              },
            ]}
            initialValue={metaModal.type == 0 ? recordInfo.divisionId : ''}
          >
            <Select
              showSearch
              style={{ width: '250px' }}
              filterOption={(inputValue, option) =>
                option?.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())
              }
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
              disabled={isLoadingOracle || metaModal.type == 0}
              loading={isLoadingOracle}
            >
              {metaModal.type == 1 ? oracleOptionList : mergeOptionList}
            </Select>
          </Form.Item>
        )}

        <Row justify="start" align="middle">
          <Row>
            <MainButton
              type="primary"
              style={{ marginTop: 10 }}
              loading={isLoading || isLoadingOracle}
              onClick={handleSubmit}
            >
              {t('IDS_BUTTON_ADD')}
            </MainButton>
            <Button
              style={{ marginLeft: 15, marginTop: 10 }}
              onClick={handleCancel}
              loading={isLoading || isLoadingOracle}
              className="cancel_button"
            >
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
};

export default PopupAddDepartment;
