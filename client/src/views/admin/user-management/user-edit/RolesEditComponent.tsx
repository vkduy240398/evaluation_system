import { Checkbox, Col, Empty, Form, FormInstance, Row } from 'antd';
import { DataNode } from 'antd/es/tree';
import React, { useEffect, useState } from 'react';
interface RoleProps {
  id: number;
  name: string;
  value: number;
  label: string;
}
interface Props {
  treeDatas: DataNode[];
  form: FormInstance;
  roles: RoleProps[];
}
const RolesEditComponent = (props: Props) => {
  const { treeDatas, form, roles } = props;

  const [checkedStates, setCheckedStates] = useState<boolean[]>(() =>
    treeDatas.map((treeNode) => (roles || []).some((val) => val.id === treeNode.key)),
  );

  useEffect(() => {
    const initial = treeDatas.map((treeNode) => (roles || []).some((val) => val.id === treeNode.key));
    setCheckedStates(initial);
    form.setFieldsValue({
      roles: initial.map((checked) => ({ role: checked })),
    });
  }, [form]);

  return (
    <>
      <Form form={form} name="rolesForm" layout="vertical">
        {treeDatas.length > 0 ? (
          <Row>
            <Col md={24} lg={15} xl={15} sm={24} xs={24}>
              <Row gutter={[15, 15]}>
                {treeDatas.map((v, i) => {
                  const isChecked = checkedStates[i] ?? false;

                  return (
                    <Col span={6} key={v.key}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          height: '34px',
                          padding: '0 12px',
                          backgroundColor: isChecked ? '#e6f7ff' : '#fafafa',
                          border: `1px solid ${isChecked ? '#91d5ff' : '#d9d9d9'}`,
                          borderRadius: '4px',
                        }}
                      >
                        <Form.Item
                          name={['roles', i, 'role']}
                          valuePropName="checked"
                          style={{ margin: 0, width: '100%' }}
                        >
                          <Checkbox
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              color: isChecked ? '#0050b3' : undefined,
                              fontWeight: isChecked ? 600 : 'normal',
                            }}
                            onChange={(e) => {
                              setCheckedStates((prev) => {
                                const next = [...prev];
                                next[i] = e.target.checked;
                                return next;
                              });
                            }}
                          >
                            {(v?.title as string) || ''}
                          </Checkbox>
                        </Form.Item>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ color: '#bfbfbf', fontSize: '13px' }}>Chưa được setting role nào!</span>}
          />
        )}
      </Form>
    </>
  );
};

export default RolesEditComponent;
