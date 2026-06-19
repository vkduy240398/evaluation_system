import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row, Select, Tooltip } from 'antd';
import { t } from 'i18next';
import EmptyComponent from '../../../../common/EmptyComponent';
import { FormInstance } from 'antd/lib';
import { MainButton } from '../../../../common/MainButton';

interface Props {
  form: FormInstance<any>;
  listDepartments: {
    id: number;
    name: string;
  }[];
  isLoading: boolean;
  handleSearchForm: () => void;
}
const EvaluationReferenceSearchForm: React.FC<Props> = (props) => {
  const { form, listDepartments, isLoading, handleSearchForm } = props;
  const listDepDivs = [{ name: t('IDS_ALL'), id: null }, ...listDepartments].map((v) => ({
    label: v.name,
    value: v.id,
  }));
  const matchDepartments = [
    {
      label: t('IDS_ALL'),
      value: null,
    },
    {
      label: t('IDS_MATCH'),
      value: 1,
    },
    {
      label: t('IDS_MISMATCH'),
      value: 0,
    },
  ];

  return (
    <div>
      <Form
        name="create_template_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearchForm}
      >
        <Row
          gutter={{
            xxl: 24,
            xl: 24,
            md: 6,
            sm: 6,
            xs: 6,
          }}
          wrap
        >
          <Col xxl={4} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <Row>
                  <Col xl={18}>{t('IDS_TARGET_AUDIENCE')}</Col>
                  <Col xl={6}>
                    <Tooltip
                      title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <Icon
                        component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                        style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              }
              labelCol={{
                xxl: 10,
                xl: 8,
                lg: 12,
                md: 8,
                sm: 6,
              }}
              colon={false}
              name="targetAudience"
              rules={[
                {
                  max: 30,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
                },
              ]}
            >
              <Input maxLength={31} style={{ maxWidth: '100%', width: '100%' }} disabled={isLoading} />
            </Form.Item>
          </Col>
          <Col xxl={4} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label={t('IDS_DEPARTMENT')}
              name="depDivAudience"
              initialValue={null}
              colon={false}
              labelCol={{
                lg: 4,
                md: 4,
                sm: 6,
              }}
            >
              <Select
                showSearch
                style={{ width: '100%', minWidth: '200px' }}
                options={listDepDivs}
                notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                optionFilterProp="label"
                loading={isLoading}
                disabled={isLoading}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row
          gutter={{
            xxl: 24,
            xl: 24,
            md: 6,
            sm: 6,
            xs: 6,
          }}
          wrap
        >
          <Col xxl={4} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label={
                <Row>
                  <Col xl={18}>{t('IDS_VIEWER')}</Col>
                  <Col xl={6}>
                    <Tooltip
                      title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <Icon
                        component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                        style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              }
              labelCol={{
                xxl: 10,
                xl: 8,
                lg: 12,
                md: 8,
                sm: 6,
              }}
              colon={false}
              name="viewer"
              rules={[
                {
                  max: 30,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
                },
              ]}
            >
              <Input maxLength={31} style={{ width: '100%' }} disabled={isLoading} />
            </Form.Item>
          </Col>
          <Col xxl={4} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label={t('IDS_DEPARTMENT')}
              name="depDivViewer"
              initialValue={null}
              colon={false}
              labelCol={{
                lg: 4,
                md: 4,
                sm: 6,
              }}
            >
              <Select
                showSearch
                style={{ width: '100%', minWidth: '200px' }}
                options={listDepDivs}
                notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                optionFilterProp="label"
                loading={isLoading}
                disabled={isLoading}
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <Row
          gutter={{
            xxl: 24,
            xl: 24,
            md: 6,
            sm: 6,
            xs: 6,
          }}
          wrap
        >
          <Col xxl={4} xl={8} lg={8} md={12} sm={24} xs={24}>
            <Form.Item
              label={<span style={{ whiteSpace: 'pre-line' }}>{t('IDS_DEPARTMENT_MATCH')}</span>}
              labelCol={{
                xxl: 10,
                xl: 8,
                lg: 12,
                md: 8,
                sm: 6,
              }}
              colon={false}
              name="matchDepartment"
              initialValue={null}
            >
              <Select
                showSearch
                style={{ width: '100%' }}
                options={matchDepartments}
                notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
                optionFilterProp="label"
                loading={isLoading}
                disabled={isLoading}
              ></Select>
            </Form.Item>
          </Col>
        </Row>
        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: '20px', marginTop: 20 }}
          loading={props.isLoading}
          htmlType="submit"
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
    </div>
  );
};
export default EvaluationReferenceSearchForm;
