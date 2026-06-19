/* eslint-disable prefer-const */
import { Col, Radio, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { MainButton } from '../../common/MainButton';
import basicBehaviorApiService from '../../common/api/basicBehavior';
import { t } from 'i18next';
import { SearchOutlined } from '@ant-design/icons';
interface souces {
  dataSources: any[];
  counts: number;
}

interface Props {
  listStatus: any;
  isLoading: boolean;
  conditions: any;
  setCondition: (data: any) => void;
  Form: any;
  setDataState: (data: souces) => void;
  url: string;
  callBackListUserEvaluation: (data: any) => void;
  errorCallBack: (bool: boolean | undefined) => void;
  location: any;
  navigates: any;
}

const SearchComponents = (props: Props) => {
  const {
    listStatus,
    conditions,
    Form,
    url,
    callBackListUserEvaluation,
    errorCallBack,
    navigates,
    location,
    isLoading,
  } = props;
  const [form] = Form.useForm();
  const [type, setType] = useState(conditions.basicBehavior);
  const [, setTypeLevel] = useState(conditions.typeLevel);

  const optionalLevels = [
    { id: t('IDS_ALL'), name: t('IDS_ALL') },
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
    { id: 6, name: 6 },
    { id: 7, name: 7 },
    { id: 8, name: 8 },
    { id: 9, name: 9 },
    { id: 10, name: 10 },
  ];

  const handleSearch = () => {
    const temps = location.state || conditions;

    const results: any = basicBehaviorApiService.listBasicBehavior(url, callBackListUserEvaluation, errorCallBack, {
      ...temps,
      limit: conditions.limit,
      offset: 0,
      ...form.getFieldsValue(['status', 'basicBehavior', 'level', 'flagSkill', 'typeLevel']),
      level: type === 2 && form.getFieldValue('level'),
    });

    results &&
      navigates(location.pathname, {
        replace: true,
        state: {
          ...conditions,
          limit: conditions.limit,
          offset: 0,
          current: 1,
          ...form.getFieldsValue(['status', 'basicBehavior', 'level', 'flagSkill', 'typeLevel']),

          // level: type === 2 ? form.getFieldValue('level') : '1,2,3,4,5,6,7',
          search: true,
        },
      });
  };

  useEffect(() => {
    form.setFieldsValue(conditions);
  }, []);

  return (
    <div>
      <Form
        name="search_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        colon={false}
        form={form}
      >
        <Form.Item label={t('IDS_CLASSIFICATION')} name="basicBehavior">
          <Radio.Group
            onChange={(e) => {
              setType(e.target.value);
            }}
          >
            <Radio value={1}>{t('IDS_BASIC_SKILL')}</Radio>
            <Radio value={2}>{t('IDS_BEHAVIOR')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label={t('IDS_LEVEL')} style={{ marginBottom: 0 }}>
          <Row>
            <Col>
              <Form.Item name="level" hidden={type === 1}>
                <Select
                  style={{ width: '200px' }}
                  size="small"
                  fieldNames={{ label: `name`, value: 'id' }}
                  options={optionalLevels}
                />
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: type == 1 ? '0px' : '10px' }}>
              <Form.Item name="typeLevel" hidden={type === 2}>
                <Radio.Group
                  onChange={(e) => {
                    setTypeLevel(e.target.value);
                  }}
                >
                  <Radio value={1}>{t('IDS_LEVEL_1_7')}</Radio>
                  <Radio value={2}>{t('IDS_LEVEL_8_10')}</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item name="status" label={t('IDS_STATUS')}>
          <Select
            style={{ width: '200px' }}
            onChange={() => {}}
            size="small"
            fieldNames={{ label: `name`, value: 'id' }}
            options={listStatus}
          />
        </Form.Item>
        <Form.Item label={t('IDS_EVALUATION_SKILL')} name="flagSkill" hidden={type === 1}>
          <Radio.Group>
            <Radio value={1}>{t('IDS_HAVE')}</Radio>
            <Radio value={0}>{t('IDS_NOT_HAVE')}</Radio>
          </Radio.Group>
        </Form.Item>
        <MainButton
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          onClick={handleSearch}
          loading={isLoading}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
      </Form>
    </div>
  );
};

export default SearchComponents;
