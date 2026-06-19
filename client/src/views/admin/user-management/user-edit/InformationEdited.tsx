import React from 'react';
import {
  CompanyProps,
  DepartmentProps,
  DivisionProps,
  LevelProps,
} from '../../../../page/admin/user-management/interfaces';
import { Col, Form, FormInstance, Radio, Select } from 'antd';
import InfoField from './components/InfoField';
import { TFunction } from 'i18next';
const selectStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: '32px', // Giới hạn cứng chiều cao tối đa của Select box
};
interface Props {
  listCompanys: CompanyProps[];
  levelList: LevelProps[];
  listDepartmentTypeDepartments: DepartmentProps[];
  listDepartmentTypeDivisions: DivisionProps[];
  t: TFunction;
  changeDivision: (e: number) => void;
  form: FormInstance;
}
const InformationEdited = (props: Props) => {
  const {
    listCompanys,
    levelList,
    listDepartmentTypeDepartments,
    listDepartmentTypeDivisions,
    t,
    changeDivision,
    form,
  } = props;

  return (
    <>
      <Col xs={24} sm={12} md={8} xl={8}>
        <InfoField
          label={t('IDS_COMPANY')}
          value={
            <Form.Item name="company" style={{ margin: 0 }}>
              <Select
                options={listCompanys}
                fieldNames={{ label: 'name', value: 'id' }}
                style={selectStyle}
                dropdownMatchSelectWidth={false} // Cho phép menu xổ xuống to hơn nếu tên option dài
                className="responsive-select"
              />
            </Form.Item>
          }
        />
      </Col>
      {/*  */}
      <Col xs={24} sm={12} md={8} xl={8}>
        <InfoField
          label={t('IDS_TYPE_DIVISION_NAME')}
          value={
            <Form.Item name="division" style={{ margin: 0 }}>
              <Select
                options={listDepartmentTypeDivisions}
                showSearch
                fieldNames={{ label: 'codeName', value: 'divisionId' }}
                onChange={changeDivision}
                style={selectStyle}
                dropdownMatchSelectWidth={false}
              />
            </Form.Item>
          }
        />
      </Col>
      <Col xs={24} sm={12} md={8} xl={8}>
        <InfoField
          label={t('IDS_TYPE_DEPARTMENT_NAME')}
          value={
            <Form.Item
              name="department"
              style={{ margin: 0 }}
              rules={[
                {
                  required: Number(form.getFieldValue('level')) < 8,
                  message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string,
                },
              ]}
            >
              <Select
                options={listDepartmentTypeDepartments}
                showSearch
                fieldNames={{ label: 'codeName', value: 'id' }}
                style={selectStyle}
                dropdownMatchSelectWidth={false}
              />
            </Form.Item>
          }
        />
      </Col>
      <Col xs={24} sm={12} md={8} xl={8}>
        <InfoField
          label={t('IDS_LEVEL')}
          value={
            <Form.Item name="level" style={{ margin: 0 }}>
              <Select options={levelList} fieldNames={{ label: 'level', value: 'id' }} style={selectStyle} />
            </Form.Item>
          }
        />
      </Col>
      <Col xs={24} sm={12} md={8} xl={8}>
        <InfoField
          label={t('IDS_EVALUATION_SKILL')}
          value={
            <Form.Item name="hasSkill" style={{ margin: 0 }}>
              <Radio.Group buttonStyle="outline" style={{ display: 'flex', gap: '8px' }}>
                <Radio value={1} style={{ margin: 0 }}>
                  {t('IDS_HAVE')}
                </Radio>
                <Radio value={0} style={{ margin: 0 }}>
                  {t('IDS_NOT_HAVE')}
                </Radio>
              </Radio.Group>
            </Form.Item>
          }
        />
      </Col>
    </>
  );
};

export default InformationEdited;
