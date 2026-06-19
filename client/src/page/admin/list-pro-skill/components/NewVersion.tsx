import { Button, Form, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import EmptyComponent from '../../../../common/EmptyComponent';
import { SearchOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import proSkillSettingService from '../../../../common/api/proSkillSetting';
import { useLocation, useNavigate } from 'react-router-dom';
import TableNewsVersion from './TableNewsVersion';

const defaultDatasState: any = {
  data: [],
  counts: 0,
};
interface Props {
  skills: any[];
}
const NewVersion = (props: Props) => {
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
      skillID: -1,
      current: 1,
      limit: 20,
    },
  );
  useEffect(() => {
    if (location.state?.searchNewsVersion) {
      getData(
        condition.offset,
        condition.limit,
        {
          limit: condition.limit,
          offset: condition.offset,
          type: condition.type,
          skillId: condition.skillId,
        },
        condition.current,
      );
    }
    form.setFieldsValue({
      skillId: location.state?.skillId || -1,
    });
  }, []);
  const onFinish = async (values: any) => {
    setIsloading(true);
    getData(0, 20, values, 1);
  };
  const errorCallBack = (bool: boolean) => {
    setIsloading(bool);
  };

  const getData = async (
    offset: any = dataState.offset,
    limit: any = dataState.limit,
    searchOption: any,
    current: number,
  ) => {
    const callBack = async (res: any) => {
      if (res) {
        setIsloading(false);

        setDataState(res);
        await navigates(location.pathname, {
          replace: true,
          state: {
            ...location.state,
            ...condition,
            ...form.getFieldsValue(['skillId']),
            type: location.state?.currentTab || '2',
            searchEdit: false,
            searchNewsVersion: true,
            offset: offset,
            limit: limit,
            current: current,
          },
        });
      }
    };
    const errorCallBack = (bool: any) => {
      setIsloading(bool);
    };

    await proSkillSettingService.getListVersion(
      {
        ...searchOption,
        offset: offset,
        limit: limit,

        type: location.state?.currentTab || '2',
      },
      { callBack, errorCallBack },
    );
  };

  return (
    <>
      <Form
        form={form}
        name="pro_skill_form"
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
      {location.state?.searchNewsVersion && (
        <TableNewsVersion
          dataSouces={dataState}
          type={location.state?.type || '2'}
          optionStatus={optionStatus}
          location={location}
          conditions={location.state || condition}
          currents={location.state.current || 1}
          errorCallBack={errorCallBack}
          isLoading={isLoading}
          navigates={navigates}
          setDataSources={setDataState}
          url="/api/v1/f3/pro-setting/version-pro-skill"
          setLoading={setIsloading}
        />
      )}
    </>
  );
};

export default NewVersion;
