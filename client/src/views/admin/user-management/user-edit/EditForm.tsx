import { Col, Empty, Radio, Row, Select, Typography, Form, FormInstance, Card, Space, Input, Checkbox } from 'antd';
import React, { useEffect } from 'react';
import { TFunction } from 'i18next';
import { DataNode } from 'antd/lib/tree';
import { UserOutlined } from '@ant-design/icons';
import {
  CompanyProps,
  DepartmentProps,
  DivisionProps,
  LevelProps,
} from '../../../../page/admin/user-management/interfaces';
import httpAxios from '../../../../common/http';
import {
  changeRole1,
  changeRole2,
  changeRole3,
  changeRole4,
  compareArrayNumber,
} from '../../../../page/admin/user-detail/processes';
import RolesEditComponent from './RolesEditComponent';
import InformationEdited from './InformationEdited';

const { Text } = Typography;

interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}

interface Props {
  data:
    | {
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
    | undefined;
  t: TFunction;
  listDepartmentTypeDivisions: DivisionProps[];
  listDepartmentTypeDepartments: DepartmentProps[];
  listCompanys: CompanyProps[];
  levelList: LevelProps[];
  form: FormInstance;
  changeDivision: (e: number) => void;
}

const EditForm = ({
  data,
  t,
  listDepartmentTypeDivisions,
  listCompanys,
  levelList,
  form,
  listDepartmentTypeDepartments,
  changeDivision,
}: Props) => {
  const treeDatas: DataNode[] = [
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1], key: 1, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2], key: 2, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3], key: 3, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4], key: 4, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5], key: 5, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6], key: 6, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7], key: 7, className: 'tree-custom-css' },
    { title: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8], key: 8, className: 'tree-custom-css' },
  ];

  useEffect(() => {
    form.setFieldsValue({
      email: data?.email ?? null,
      company: data?.companyId ?? null,
      level: data?.level ?? null,
      hasSkill: data?.flagSkill ?? null,
      roles: treeDatas.map((treeNode) => ({
        role: (data?.roles || []).some((val) => val.id === treeNode.key),
      })),
      division: data?.divisionId,
      department: data?.departmentId,
      fullName: data?.fullName,
    });
  }, [data]);

  const changeSwitch = (e: boolean) => {
    console.log(e);
  };

  // Style chung cho Select nhằm khống chế chiều cao và chống tràn chữ gây bể layout
  const selectStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '32px', // Giới hạn cứng chiều cao tối đa của Select box
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* KHỐI 1: 詳細情報 */}
      <Card
        title={
          <Space size="small">
            <UserOutlined style={{ color: '#007240' }} />
            <span style={{ fontWeight: 600, fontSize: '14px' }}>
              詳細情報:{' '}
              <Text type="success" style={{ fontWeight: 'normal' }}>
                {data?.email || '---'}
              </Text>
            </span>
          </Space>
        }
        size="small"
        style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <Row gutter={[12, 12]}>
          {/* 1. Mã nhân viên + Họ tên */}

          {/* 2. Trường lựa chọn Công ty (Đã fix lỗi chữ dài) */}
          <InformationEdited
            changeDivision={changeDivision}
            form={form}
            levelList={levelList}
            listCompanys={listCompanys}
            listDepartmentTypeDepartments={listDepartmentTypeDepartments}
            listDepartmentTypeDivisions={listDepartmentTypeDivisions}
            t={t}
          />
        </Row>
      </Card>

      {/* KHỐI 2: システムアクセス制御 */}
      {/* <Card
        title={<span style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>システムアクセス制御</span>}
        size="small"
        style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <RolesEditComponent changeRole={changeRole} treeDatas={treeDatas} />
          </Col>
        </Row>
      </Card> */}
    </Space>
  );
};

export default EditForm;
