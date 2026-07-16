/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Form,
  Typography,
  Table,
  Button,
  Row,
  Col,
  Space,
  Grid,
  ButtonProps,
  Spin,
  Card,
  Affix,
  Input,
  Select,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import proSkillApiService from '../../common/api/proSkill';
import { proSkillPublicStatus } from '../../common/status';
import { t } from 'i18next';
import { DataState } from '../../model/DataState';
import styled from '@emotion/styled';
import useForm from 'antd/es/form/hooks/useForm';
import DetailProSkillColumnCustomSearchHeader from './components/DetailProSkillColumnCustomSearchHeader';
import { SearchOutlined } from '@ant-design/icons';
import { urlCompanyCode } from '../../common/util';
const defaultDataState: DataState<any> = {
  dataSource: {},
  dataTable: [], // dùng cho search trên column header
};
const { useBreakpoint } = Grid;
type Option = { value: string; label: string };

const DetailPublicProSkill = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [form] = useForm();
  const [dataState, setDataState] = useState(defaultDataState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [skillInfor, setSkillInfo] = useState('');
  const [versionId, setVersionId] = useState('');
  const [isAffixed, setIsAffixed] = useState<boolean>();

  // ** State
  // const [dataSources, setDataSource] = useState<any[]>(dataTable?.map((v: any) => ({ ...v })) || []);

  const [jobTypes, setJobType] = useState<Option[]>([]);

  const [mediumClasses, setMediumClass] = useState<Option[]>([]);

  const [smallClasses, setSmallClass] = useState<Option[]>([]);

  const [objSearch, setObjSearch] = useState<{
    jobType: string;
    mediumClass: string;
    smallClass: string;
  }>({
    jobType: '',
    mediumClass: '',
    smallClass: '',
  });

  const dataCallback = async (data: any) => {
    let i = 1;
    setSkillInfo(data.skill);

    setVersionId(data?.result?.id);
    if (data.result && data.result.length > 0) {
      data.result?.children.forEach((e: any) => {
        e.key = i++;
      });
    }

    setJobType(
      ([...new Set(data?.result?.children?.map((v: any) => v.jobType))] as string[]).map((v) => ({ value: v, label: v })),
    );
    setMediumClass(
      ([...new Set(data?.result?.children?.map((v: any) => v.mediumClass))] as string[]).map((v) => ({
        value: v,
        label: v,
      })),
    );
    setSmallClass(
      ([...new Set(data?.result?.children?.map((v: any) => v.smallClass))] as string[]).map((v) => ({
        value: v,
        label: v,
      })),
    );
    setDataState({
      ...dataState,
      dataSource: data?.result,
      dataTable: data?.result?.children,
    });
  };

  const errorCallback = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  useEffect(() => {
    if (id && !Number.isInteger(Number(id))) {
      navigate('/404page');
    } else {
      proSkillApiService.detailProSkillPublicOfDepartment(
        `/api/v1/f4/pro-skill-approval/detail-pro-skill-public-of-skill`,
        id,
        dataCallback,
        errorCallback,
      );
    }
    setLoading(false);
  }, []);

  const ButtonCustom = styled(Button)<ButtonProps>((theme) => ({
    '&.ant-btn-primary': {
      paddingLeft: screens.xs ? 15 : theme.style?.paddingLeft, // '1.5rem'
      paddingRight: screens.xs ? 15 : theme.style?.paddingRight, // '1.5rem'
    },
  }));

  const [curentForm] = Form.useForm();

  const handleSearchHeader = (value: string, name: string) => {
    const { jobType, mediumClass, smallClass } = { ...objSearch, [name]: value } as any;
    const ds = dataState?.dataSource?.children.filter(
      (f: { [x: string]: any }) =>
        (jobType && jobType.length > 0 ? f.jobType === jobType : true) &&
        (mediumClass && mediumClass.length > 0 ? f.mediumClass === mediumClass : true) &&
        (smallClass && smallClass.length > 0 ? f.smallClass === smallClass : true),
    );
    setDataState({ ...dataState, dataTable: ds });
    setObjSearch((dataState) => ({ ...dataState, [name]: value }));
  };

  const searchFieldHeader = (name: string, title: string) => {
    const options: { value: string; label: string }[] = [];
    let placeholder = '';
    switch (name) {
      case 'jobType':
        options.push(...jobTypes);
        placeholder = t('IDS_JOB_TYPE');
        break;

      case 'mediumClass':
        options.push(...mediumClasses);
        placeholder = t('IDS_LARGE_MEDIUM_CATEGORY');
        break;

      default:
        options.push(...smallClasses);
        placeholder = t('IDS_SMALL_CATEGORY');
        break;
    }

    return (
      <>
        <div
          style={{
            fontSize: 13,
            backgroundColor: '#007240',
            color: 'white',
            textAlign: 'center',
            margin: -4,
            marginBottom: 0,
            whiteSpace: 'nowrap',
            padding: '0 4px',
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
        <Form.Item style={{ marginBottom: -1 }}>
          <Select
            options={options}
            style={{ width: '100%', textAlign: 'left' }}
            showSearch
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => handleSearchHeader(value, name)}
            placeholder={placeholder}
            allowClear
          />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      {!isLoading ? (
        <div>
          <Form
            form={curentForm}
            labelAlign="left"
            colon={false}
            requiredMark={false}
            labelCol={{ span: 1 }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
          >
            <Card>
              <Typography.Title level={3} style={{ paddingBottom: 10 }}>
                {t('IDS_DETAIL_PRO_SKILL')}
              </Typography.Title>

              <Form.Item label={t('IDS_TEMPLATE')} className="ant-form-item-info">
                <Typography>
                  {Object.keys(dataState.dataSource).length === 0 ? skillInfor : `${`${dataState.dataSource?.skill}`}`}
                </Typography>
              </Form.Item>
              <Form.Item label={t('IDS_VERSION')} className="ant-form-item-info">
                {Object.keys(dataState.dataSource).length === 0 ? '' : `${`${dataState.dataSource.version}`}`}
              </Form.Item>

              <Form.Item label={t('IDS_STATUS_PUBLIC')} className="ant-form-item-info">
                {Object.keys(dataState.dataSource).length === 0
                  ? ''
                  : `${`${proSkillPublicStatus[dataState.dataSource.publicStatus]}`}`}
              </Form.Item>
              <Form.Item label={t('IDS_SETTER_PRO_SKILL')} className="ant-form-item-info">
                {`${
                  dataState.dataSource?.settersAndApprovers
                    ? dataState.dataSource?.settersAndApprovers.setters.join('、')
                    : ''
                }`}
              </Form.Item>
              <Form.Item label={t('IDS_APPROVER_PRO_SKILL')} className="ant-form-item-info">
                {`${
                  dataState.dataSource?.settersAndApprovers
                    ? dataState.dataSource?.settersAndApprovers.approvers.join('、')
                    : ''
                }`}
              </Form.Item>
              <Form.Item label={t('IDS_LAST_UPDATE_USER')} className="ant-form-item-info">
                {Object.keys(dataState.dataSource).length === 0 ? '' : `${`${dataState.dataSource.userUpdated}`}`}
              </Form.Item>
              <Form.Item label={t('IDS_LAST_UPDATE_DATE')} className="ant-form-item-info">
                {dataState.dataSource?.lastUpdatedTime}
              </Form.Item>
              <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} style={{ marginBottom: 0 }}>
                {dataState.dataSource?.publicDate}
              </Form.Item>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <div>
                <Typography.Title level={4}>{t('IDS_LIST_ITEM_DETAIL_PRO_SKILL')}</Typography.Title>
                <Table
                  bordered
                  size="small"
                  locale={{
                    emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                  }}
                  columns={DetailProSkillColumnCustomSearchHeader({
                    searchFieldHeader: searchFieldHeader,
                  })}
                  dataSource={dataState.dataTable || []}
                  pagination={false}
                  scroll={{ x: screens.xs ? 1000 : undefined, y: 700 }}
                />
              </div>
            </Card>
          </Form>

          {Object.keys(dataState.dataSource).length === 0 ? (
            ''
          ) : (
            <Form form={form}>
              <Affix
                offsetBottom={10}
                onChange={(affixed) => {
                  setIsAffixed(affixed);
                }}
              >
                <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                  <Row>
                    <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'start', paddingBottom: 2 }}></Col>
                    <Col xs={24} md={12} style={{ display: 'flex', justifyContent: screens.xs ? 'start' : 'end' }}>
                      <Space direction="horizontal" wrap>
                        <ButtonCustom
                          className="button-normal"
                          type="primary"
                          size="middle"
                          onClick={() =>
                            window.open(
                              urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${versionId}`,
                              '_blank',
                            )
                          }
                        >
                          {t('IDS_HISTORY_APPROVE')}
                        </ButtonCustom>
                      </Space>
                    </Col>
                  </Row>
                </div>
              </Affix>
            </Form>
          )}
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default DetailPublicProSkill;
