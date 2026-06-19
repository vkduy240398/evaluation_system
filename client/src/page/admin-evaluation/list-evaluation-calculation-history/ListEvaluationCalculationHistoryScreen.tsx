import { Button, Col, Form, Radio, Row, Select, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import evaluationCalculationHistoryApiService from '../../../common/api/evaluation-calculation-history';
import {
  ConditionListEvaluationCalculationHistory,
  getOptionStatuses,
  ListEvaluationCalculationHistory,
} from '../../../model/evaluation-calculation/ListEvaluationCalculationHistoryModel';
import PaginationV2 from '../../../common/PaginationV2';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import ListEvaluationCalculationHistoryTable from '../../../views/admin-evaluation/list-evaluation-calculation-history/ListEvaluationCalculationHistoryTable';
import { FlagSkillValue, VersionSettingType } from '../../../constant/VersionSettingType';

const ListEvaluationCalculationHistoryScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [condition, setCondition] = useState<ConditionListEvaluationCalculationHistory>(
    location.state || {
      offset: 0,
      limit: 20,
      type: 1,
      levelType: 1,
      level17Type: 1,
      status: -1,
      current: 1,
    },
  );
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ListEvaluationCalculationHistory>();
  const [levelType, setLevelType] = useState(location.state?.levelType || VersionSettingType.LEVEL_1_7);
  const [level17Type, setLevel17Type] = useState(location.state?.level17Type || FlagSkillValue.HAVE_SKILL);
  const STATUS_SEARCH_ALL = -1;
  const [status, setStatus] = useState(location.state?.status || STATUS_SEARCH_ALL);
  const [form] = Form.useForm();
  const url = '/api/v1/f6/management-evaluation/list-evaluation-calculation-history';
  const calculateType = (
    radioLevel: VersionSettingType.LEVEL_1_7 | VersionSettingType.LEVEL_8_10 | VersionSettingType.LEVEL_ALL,
    radioFlagSkill: FlagSkillValue,
  ) => {
    let result = 0;

    if (radioLevel === VersionSettingType.LEVEL_1_7 && radioFlagSkill === FlagSkillValue.HAVE_SKILL) {
      result = VersionSettingType.LEVEL_1_7;
    } else if (radioLevel === VersionSettingType.LEVEL_8_10 && radioFlagSkill === FlagSkillValue.HAVE_SKILL) {
      result = VersionSettingType.LEVEL_8_10;
    } else if (radioLevel === VersionSettingType.LEVEL_1_7 && radioFlagSkill === FlagSkillValue.NO_SKILL) {
      result = VersionSettingType.LEVEL_1_7_NO_SKILL;
    } else if (radioLevel === VersionSettingType.LEVEL_8_10 && radioFlagSkill === FlagSkillValue.NO_SKILL) {
      result = VersionSettingType.LEVEL_8_10_NO_SKILL;
    } else if (radioLevel === VersionSettingType.LEVEL_ALL) {
      result = VersionSettingType.LEVEL_ALL;
    }

    return result;
  };

  const handleSearch = () => {
    setCondition({
      ...condition,
      type: calculateType(levelType, level17Type),
      levelType: levelType, // 等級: 1 ～ 7等級
      level17Type: levelType === VersionSettingType.LEVEL_ALL ? FlagSkillValue.HAVE_SKILL : level17Type, // スキル評価: あり | なし
      status: status,
      search: true,
      current: 1,
      offset: 0,
      limit: 20,
    });
  };

  const dataCallBack = (dataSource: ListEvaluationCalculationHistory) => {
    setDataSource(dataSource);
  };

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: condition,
    });

    if (condition?.search) {
      getData();
    }
  }, [condition]);

  // get list data table
  const getData = () => {
    const data = { ...condition };
    delete data.levelType;
    delete data.level17Type;

    evaluationCalculationHistoryApiService.getListEvaluationCalculationHistory(data, dataCallBack, setLoading);
  };

  const onChangeLevelType = (event: any) => {
    setLevelType(event.target.value);

    if (event.target.value === VersionSettingType.LEVEL_ALL) {
      form.setFieldValue('level17Type', FlagSkillValue.HAVE_SKILL);
      setLevel17Type(FlagSkillValue.HAVE_SKILL);
    }
  };
  const onChangeLevel17Type = (event: any) => {
    setLevel17Type(event.target.value);
  };
  const onChangeStatus = (value: any) => {
    setStatus(value);
  };

  useEffect(() => {
    form.setFieldValue('levelType', levelType);
    form.setFieldValue('level17Type', level17Type);
  }, []);

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_TITLE_CALCULATION_SCREEN')}</Typography.Title>

      <Form
        form={form}
        initialValues={{ type: condition.type, status: condition.status }}
        name="create_template_form"
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_LEVEL')} colon={false} name="levelType">
          <Radio.Group onChange={onChangeLevelType}>
            <Radio value={VersionSettingType.LEVEL_1_7}>{t('IDS_LEVEL_1_7')}</Radio>
            <Radio value={VersionSettingType.LEVEL_8_10}>{t('IDS_LEVEL_8_10')}</Radio>
            <Radio value={VersionSettingType.LEVEL_ALL}>
              <Row>
                <Col>{t('IDS_LEVEL_ALL')}</Col>
                <Col>
                  <Tooltip title={t('IDS_TOOLTIP_RADIO_LEVEL_COMMON')}>
                    <InfoCircleOutlined
                      style={{
                        color: '#6e5b14',
                        fontSize: 18,
                        marginLeft: 7,
                        marginTop: 2,
                      }}
                    />
                  </Tooltip>
                </Col>
              </Row> 
            </Radio>
          </Radio.Group>
        </Form.Item>
        {form.getFieldValue('levelType') !== VersionSettingType.LEVEL_ALL && (
          <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} name="level17Type">
            <Radio.Group onChange={onChangeLevel17Type}>
              <Radio value={FlagSkillValue.HAVE_SKILL}>{t('IDS_HAVE')}</Radio>
              <Radio value={FlagSkillValue.NO_SKILL}>{t('IDS_NOT_HAVE')}</Radio>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item label={t('IDS_STATUS')} colon={false} name="status">
          <Select
            style={{ width: '200px' }}
            options={getOptionStatuses()}
            defaultValue={status}
            onChange={onChangeStatus}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            name="Search"
            value="Search"
            loading={isLoading}
            className="main_button"
            style={{ marginBottom: 15, marginTop: 10 }}
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>

      {condition?.search ? (
        <ListEvaluationCalculationHistoryTable
          dataSource={dataSource}
          setDataSource={setDataSource}
          setLoading={setLoading}
          condition={condition}
          setCondition={setCondition}
          isLoading={isLoading}
        />
      ) : null}

      {dataSource?.rows && dataSource?.rows.length > 0 && (
        <PaginationV2
          conditions={condition}
          currents={condition.current}
          dataSources={dataSource}
          errorCallBack={setLoading}
          limit={condition.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSource}
          url={url}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListEvaluationCalculationHistoryScreen;
