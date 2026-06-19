import { Button, Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import EmptyComponent from '../../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import ListProSkillTable from './ListProSkillTable';
import proSkillSettingService from '../../../../common/api/proSkillSetting';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

const defaultDatasState: any = {
  // dataSource: [],
  offset: 0,
  limit: 20,
  searchOption: {
    skillId: -1,
    status: -1,
    divisionId: undefined,
  },
  current: 1,
  total: 0,
  searchEdit: false,
};
interface Props {
  skills: any[];
}
const EditedScreen = (props: Props) => {
  const optionStatus = [
    {
      label: t('IDS_ALL'),
      value: -1,
    },
    {
      label: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[1],
      value: 1,
    },
    {
      label: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[2],
      value: 2,
    },
    {
      label: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[3],
      value: 3,
    },
    {
      label: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[4],
      value: 4,
    },
    {
      label: (t('IDL_LIST_STATUS_PRO_SKILL', { returnObjects: true }) as any)[5],
      value: 5,
    },
  ];
  const { skills } = props;
  const [dataState, setDataState] = useState(defaultDatasState);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigates = useNavigate();
  const buttonFocus = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [condition, setCondition] = useState(
    location.state || {
      searchOption: { skillId: -1, status: -1 },
    },
  );
  useEffect(() => {
    if (location.state?.searchEdit) {
      setIsloading(true);

      getData(condition.offset, condition.limit, condition.current, {
        ...condition.searchOption,
      });
    }
    form.setFieldsValue({
      skillId: location.state?.searchOption.skillId || -1,
      status: location.state?.searchOption.status || -1,
    });
  }, []);

  const onFinish = async (values: any) => {
    setIsloading(true);

    getData(0, 20, 0, values);
    await navigates(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        ...condition,
        searchOption: {
          ...values,
          type: location.state?.currentTab || '1',
        },
        searchEdit: true,
        searchNewsVersion: false,
        type: location.state?.currentTab || '1',
        offset: 0,
        limit: 20,
        current: 1,
      },
    });
  };

  const getData = async (
    offset: any = dataState.offset,
    limit: any = dataState.limit,
    current: any = dataState.current,
    searchOption: any,
  ) => {
    const callBack = (res: any) => {
      const arrays = res?.data.map((v: any) => {
        v.version = `${v.version}.${v.subVersion}`;
        v.updatedTime = moment(v.updatedTime, 'YYYY-MM-DDTHH:mm:ss.SSSSZ').format('YYYY/M/D H:mm');

        return v;
      });

      setIsloading(false);
      setDataState({
        ...dataState,
        dataSource: arrays,
        total: res.total,
        current: current,
        searchOption: searchOption,
        searchEdit: true,
        searchNewsVersion: false,
        type: location.state?.currentTab || '1',
      });
    };
    const errorCallBack = () => {};
    proSkillSettingService.getListVersion(
      {
        ...searchOption,
        offset: offset,
        limit: limit,
        type: location.state?.currentTab || '1',
      },
      { callBack, errorCallBack },
    );
  };

  return (
    <>
      <Form
        form={form}
        name="pro_skill_form_v2"
        initialValues={{ remember: true }}
        colon={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        onFinish={onFinish}
      >
        <Form.Item label={t('IDS_TEMPLATE')} name={'skillId'} initialValue={-1}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={skills}
            filterOption={(input: any, option): any =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} name={'status'} initialValue={-1}>
          <Select
            showSearch
            style={{ width: '200px' }}
            options={optionStatus}
            filterOption={(input: any, option): any =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Button
          loading={isLoading}
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginTop: 15 }}
          htmlType="submit"
          className="main_button"
          ref={buttonFocus}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </Button>
      </Form>
      {location.state?.searchEdit && (
        <ListProSkillTable
          dataState={dataState}
          setDataState={setDataState}
          getData={getData}
          isLoading={isLoading}
          setIsLoading={setIsloading}
          optionStatus={optionStatus}
          type={location.state?.type}
        />
      )}
    </>
  );
};

export default EditedScreen;
