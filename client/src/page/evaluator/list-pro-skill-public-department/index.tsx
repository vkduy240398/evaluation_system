import { Button, Form, Select, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { DataState } from '../../../model/DataState';
import ListProSkillTable from '../../../views/evaluator/list-pro-skill-public-department/components/ListProSkillPublicDepartmentTable';
import { t } from 'i18next';
import proSkillSettingService from '../../../common/api/proSkillSetting';
import moment from 'moment-timezone';
import { useLocation, useNavigate } from 'react-router-dom';
import EmptyComponent from '../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
import { ListProSkillPublicDepartmentHelper } from '../../../views/evaluator/list-pro-skill-public-department/components/ListProSkillPublicDepartmentHelper';

const defaultDatasState: DataState<any> = {
  dataSource: [],
  offset: 0,
  limit: 20,
  searchOption: {
    skillId: undefined,
  },
  current: 1,
  total: 0,
};

const ListProSkillPublicDepartmentScreen: React.FC = () => {
  const location = useLocation();
  const [dataState, setDataState] = useState(defaultDatasState);
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigates = useNavigate();
  const buttonFocus = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [condition, setCondition] = useState(
    location.state || {
      skillId: -1,
    },
  );

  useEffect(() => {
    if (location.state) {
      form.setFieldsValue(location.state);
    } else {
      form.setFieldValue('skillId', -1);
    }

    getSkill();
    if (location.state) {
      getData(condition.offset, condition.limit, condition.current, {
        skillId: condition.skillId,
      });
    }
  }, []);

  const getSkill = async () => {
    const callBack = (data: any) => {
      setSkills(data);
    };
    const errorCallBack = () => {};
    await proSkillSettingService.getAllSkill({ callBack, errorCallBack });
  };

  const getData = async (
    offset: any = dataState.offset,
    limit: any = dataState.limit,
    current: any = dataState.current,
    searchOption: any = dataState.searchOption,
  ) => {
    const callBack = (res: any) => {
      const arrays = res?.data.map((v: any) => {
        v.version = `${v.version}.${v.subVersion}`;
        v.updatedTime = moment(v.updatedTime).format('YYYY/M/D H:mm');
        v.publicDate = v.publicDate || '';

        return v;
      });
      setDataState({
        ...dataState,
        dataSource: arrays,
        total: res.total,
        current: current,
        searchOption: searchOption,
        offset: offset,
        limit: limit,
        ...form.getFieldsValue(['skillId']),
      });
      setIsLoading(false);
    };
    const errorCallBack = () => {};
    setIsLoading(true);
    await proSkillSettingService.getListVersionDepartment(
      { ...searchOption, offset: offset, limit: limit },
      { callBack, errorCallBack },
    );
  };

  const onFinish = async (values: any) => {
    setIsLoading(true);
    await getData(0, 20, 1, values);

    navigates(location.pathname, {
      replace: true,
      state: {
        offset: 0,
        limit: 20,
        current: 1,
        ...form.getFieldsValue(['skillId']),
      },
    });
  };

  return (
    <div>
      <Space align="baseline">
        <Typography.Title level={3}>{t('IDS_LIST_PRO_SKILL_PUBLIC')}</Typography.Title>
      </Space>

      <Form
        name="search_form"
        initialValues={{ remember: true }}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        labelAlign="left"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label={t('IDS_TEMPLATE')} name={'skillId'} initialValue={{ label: t('IDS_ALL'), value: -1 }}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={ListProSkillPublicDepartmentHelper.processingSkill(skills || [])}
            filterOption={(input: any, option): any =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>

        <Button
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          htmlType="submit"
          loading={isLoading}
          className="main_button"
          ref={buttonFocus}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
      {location.state && (
        <ListProSkillTable
          dataState={dataState}
          setDataState={setDataState}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          getData={getData}
        />
      )}
    </div>
  );
};

export default ListProSkillPublicDepartmentScreen;
