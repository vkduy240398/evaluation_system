import { Card, Form, Row, Table, Tooltip, Typography } from 'antd';
import TooltipExplaination from './TooltipExplaination';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { t } from 'i18next';
import DetailProSkillColumnCustomSearchHeader from './DetailProSkillColumnCustomSearchHeader';
import { useEffect, useState } from 'react';
import { Select } from 'antd/lib';
import EmptyComponent from '../../../common/EmptyComponent';

interface Props {
  dataState: any;
  setDataState: any;
}
type Option = { value: string; label: string };
const TableDetailProSkillApproval = (props: Props) => {
  // ** Props
  const {
    dataState: { dataTable, dataSource },
  } = props;
  const [curentForm] = Form.useForm();

  // ** State
  const [dataSources, setDataSource] = useState<any[]>(dataTable?.map((v: any) => ({ ...v })) || []);
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

  useEffect(() => {
    setDataSource(dataTable?.map((v: any) => ({ ...v })));

    setJobType(([...new Set(dataTable.map((v: any) => v.jobType))] as string[]).map((v) => ({ value: v, label: v })));
    setMediumClass(
      ([...new Set(dataTable.map((v: any) => v.mediumClass))] as string[]).map((v) => ({ value: v, label: v })),
    );
    setSmallClass(
      ([...new Set(dataTable.map((v: any) => v.smallClass))] as string[]).map((v) => ({ value: v, label: v })),
    );
  }, [dataTable]);

  const handleSearchHeader = (value: string, name: string) => {
    const { jobType, mediumClass, smallClass } = { ...objSearch, [name]: value } as any;
    const ds = dataTable.filter(
      (f: { [x: string]: any }) =>
        (jobType && jobType.length > 0 ? f.jobType === jobType : true) &&
        (mediumClass && mediumClass.length > 0 ? f.mediumClass === mediumClass : true) &&
        (smallClass && smallClass.length > 0 ? f.smallClass === smallClass : true),
    );

    setDataSource(ds);
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
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <Form
        form={curentForm}
        style={{ width: '100%' }}
        labelCol={{ span: 3 }}
        labelAlign="left"
        requiredMark={false}
        colon={false}
      >
        <Card style={{ marginTop: 15 }}>
          <div>
            <Row>
              <Typography.Title level={4}>{t('IDS_LIST_ITEM_DETAIL_PRO_SKILL')}</Typography.Title>
              {dataSource.status === 3 && (
                <Tooltip title={<TooltipExplaination />} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ color: '#d6af20', fontSize: 18, marginLeft: '7px', marginBottom: '5px' }}
                  />
                </Tooltip>
              )}
            </Row>

            <Table
              bordered
              size="small"
              locale={{
                emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
              }}
              onRow={(_record) => ({
                style: {
                  backgroundColor: _record.delete
                    ? process.env.REACT_APP_BACKGROUND_PRO_SKILL_DEL
                    : _record.isAdd
                    ? process.env.REACT_APP_BACKGROUND_PRO_SKILL_ADD
                    : '',
                  textDecoration: _record.delete ? 'line-through' : '',
                },
              })}
              columns={DetailProSkillColumnCustomSearchHeader({
                searchFieldHeader: searchFieldHeader,
              })}
              dataSource={dataSources || []}
              pagination={false}
              scroll={{ x: 1097, y: 700 }}
            />
          </div>
        </Card>
      </Form>
    </>
  );
};
export default TableDetailProSkillApproval;
