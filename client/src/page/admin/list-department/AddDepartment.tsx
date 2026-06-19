/* eslint-disable prefer-const */
import { Form, Row, Col, Typography, Input, Radio, RadioChangeEvent, Select } from 'antd';
import { MainButton } from '../../../common/MainButton';
import { useEffect, useState } from 'react';
import { validateName } from './processes/getAndValidate';
import { t } from 'i18next';
import EmptyComponent from '../../../common/EmptyComponent';
import departmentApiService from '../../../common/api/department.api';

const AddDepartment: React.FC = () => {
  const [form] = Form.useForm();
  const [listDivisionOracle, setListDivisionOracle] = useState([]) as any;
  const [listMerge, setListMerge] = useState([]) as any;
  const [dataSave, setDataSave] = useState([]) as any;
  const [isShowDivision, setIsShowDivision] = useState(true);
  const [checkOracle, setCheckOracle] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingOracle, setLoadingOracle] = useState(false);
  const { Option } = Select;
  useEffect(() => {
    // const dataList: any[] = [];

    // departmentApiService.getListDepartmentGNW(dataList, setDataSave, setLoading);
    // departmentApiService.getList(setLoading, setDataSave);
    loadData();
  }, []);
  const loadData = () => {
    departmentApiService.getList(setLoading, setDataSave);
  };

  const onCategoryChange = (e: RadioChangeEvent) => {
    if (e.target.value === 1) {
      setIsShowDivision(true);

      // if (listDivisionOracle.length < 1 && checkOracle == 0) {
      departmentApiService.getListDivisionOracle(setListDivisionOracle, setLoadingOracle);

      // }
    } else {
      setIsShowDivision(false);

      // if (listMerge.length < 1)
      departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
    }
    form.setFieldsValue({
      department_oracle: '',
      input_name: '',
      code: '',
      division_oracle: '',
    });
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

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        let code = '';
        let name = '';

        //check oracle or create
        if (form.getFieldValue('class') === 0) {
          if (form.getFieldValue('category') === 1) {
            code = value.division_oracle.split(':')[0].trim();
            name = value.division_oracle.split(':')[1].trim();
          } else {
            code = value.department_oracle.split(':')[0].trim();
            name = value.department_oracle.split(':')[1].trim();
          }
        } else {
          code = 'GNW-' + value.code;
          name = value.input_name;
        }
        const data = {
          code: code,
          name: name,
          class: form.getFieldValue('class'),
          type: form.getFieldValue('category'),
          active: 1,
          division: form.getFieldValue('division_oracle'),
        };
        departmentApiService.saveDivisionDepartment(
          data,
          setLoading,
          form,
          loadData,
          setCheckOracle,
          setIsShowDivision,
        );
      })
      .catch(() => {});
  };
  const handleTypeChange = (e: RadioChangeEvent) => {
    setCheckOracle(e.target.value);
    if (e.target.value === 0) {
      if (listDivisionOracle.length < 1) {
        departmentApiService.getListDivisionOracle(setListDivisionOracle, setLoadingOracle);
      }
      if (listMerge.length < 1 && !isShowDivision) {
        departmentApiService.getListMergerOracle(setListMerge, setLoadingOracle);
      }
    }
    form.setFieldsValue({
      department_oracle: '',
      input_name: '',
      code: '',
      division_oracle: '',
    });
  };

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_ADD_DEPARTMENT')}</Typography.Title>
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 1 }}
        colon={false}
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <Form.Item label={t('IDS_CATEGORIES')} name="category" colon={false} initialValue={1}>
          <Radio.Group onChange={onCategoryChange} disabled={isLoadingOracle}>
            <Radio value={1}>{t('IDS_TYPE_DIVISION')}</Radio>
            <Radio value={0}>{t('IDS_TYPE_DEPARTMENT')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t('IDS_CLASSIFICATION')} name="class" colon={false} initialValue={1}>
          <Radio.Group onChange={handleTypeChange} disabled={isLoadingOracle}>
            <Radio value={1}>{t('IDS_CREATE_MANUAL')}</Radio>
            <Radio value={0}>{t('IDS_ORACLE_DEPARTMENT')}</Radio>
          </Radio.Group>
        </Form.Item>

        {checkOracle === 1 && (
          <>
            {/* <Form.Item
              label={isShowDivision ? t('IDS_DIVISION_CODE') : t('IDS_DEPART_CODE')}
              colon={false}
              name="code"
              rules={[
                {
                  required: true,
                  message: t('MESSAGE.COMMON.IDM_BLANK_ITEM') as string,
                },
                {
                  max: 10,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '10'),
                },
                {
                  validator(_rule, value) {
                    return validateCode(value, form, form.getFieldValue('category'), dataSave);
                  },
                },
              ]}
            >
              <Input addonBefore={t('IDS_GNW_CODE')} maxLength={11} style={{ width: '170px' }} />
            </Form.Item> */}

            <Form.Item
              label={isShowDivision ? t('IDS_TYPE_DIVISION_NAME') : t('IDS_TYPE_DEPARTMENT_NAME')}
              colon={false}
              name="input_name"
              style={{ paddingTop: 0 }}
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
                    return validateName(value, form, form.getFieldValue('category'), dataSave);
                  },
                },
              ]}
            >
              <Input maxLength={101} style={{ width: '200px' }} />
            </Form.Item>
          </>
        )}
        {!isShowDivision && !checkOracle && (
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
        {(checkOracle === 0 || (checkOracle === 1 && !isShowDivision)) && (
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
              {isShowDivision ? oracleOptionList : mergeOptionList}
            </Select>
          </Form.Item>
        )}

        <Row justify="start" align="middle">
          <Col>
            <MainButton
              style={{ marginTop: 10 }}
              type="primary"
              disabled={isLoading}
              htmlType="submit"
              loading={isLoading || isLoadingOracle}
            >
              {t('IDS_BUTTON_ADD')}
            </MainButton>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default AddDepartment;
