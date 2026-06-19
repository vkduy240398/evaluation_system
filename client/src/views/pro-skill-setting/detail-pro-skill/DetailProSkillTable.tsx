import { Form, Row, Table, Typography } from 'antd';
import { t } from 'i18next';
import { DataState } from '../../../model/DataState';
import DetailProSkillColumnCustomSearchHeader from '../../../page/detail-pro-skill/components/DetailProSkillColumnCustomSearchHeader';
import { useEffect, useState } from 'react';
import { Select } from 'antd/lib';
import EmptyComponent from '../../../common/EmptyComponent';

interface Props {
  dataState: DataState<any>;
  isReadOnly: boolean;
  versionId: any;
  setDataState: any;
}
type Option = { value: string; label: string };

const DetailProSkillTable = (props: Props) => {
  // ** Props
  const {
    dataState: { dataTable },
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

  // ** Effect
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
    const ds = props.dataState?.dataSource?.children.filter(
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
    <div>
      <Form
        form={curentForm}
        style={{ width: '100%' }}
        labelCol={{ span: 3 }}
        labelAlign="left"
        requiredMark={false}
        colon={false}
      >
        <Row>
          <Typography.Title level={4}>{t('IDS_LIST_ITEM_TABLE_DETAIL_PRO_SKILL')}</Typography.Title>
        </Row>

        <Table
          bordered
          size="small"
          columns={DetailProSkillColumnCustomSearchHeader({
            searchFieldHeader: searchFieldHeader,
          })}
          dataSource={dataSources}
          pagination={false}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
          style={{ wordBreak: 'break-all' }}
          scroll={{ x: 1097, y: 700 }}
        />
      </Form>
    </div>
  );
};

export default DetailProSkillTable;
