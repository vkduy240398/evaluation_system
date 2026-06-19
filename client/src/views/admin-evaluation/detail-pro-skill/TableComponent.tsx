import { Table, Grid, Form, Select } from 'antd';
import { t } from 'i18next';
import DetailProSkillColumnCustomSearchHeader from '../../../page/detail-pro-skill/components/DetailProSkillColumnCustomSearchHeader';
import { useState } from 'react';
interface Props {
  dataSources: any;
  setDataSources: any;
}
type Option = { value: string; label: string };

const TableComponent = (props: Props) => {
  const { dataSources, setDataSources } = props;
  const breaks = Grid.useBreakpoint();

  const [curentForm] = Form.useForm();

  // ** State
  const jobTypes: Option[] = ([...new Set(dataSources.dataChildrenFilter?.map((v: any) => v.jobType))] as string[])?.map(
    (v) => ({ value: v, label: v }),
  );

  const mediumClasses = ([...new Set(dataSources.dataChildrenFilter?.map((v: any) => v.mediumClass))] as string[])?.map(
    (v) => ({ value: v, label: v }),
  );

  const smallClasses = ([...new Set(dataSources.dataChildrenFilter?.map((v: any) => v.smallClass))] as string[])?.map(
    (v) => ({ value: v, label: v }),
  );

  const [objSearch, setObjSearch] = useState<{
    jobType: string;
    mediumClass: string;
    smallClass: string;
  }>({
    jobType: '',
    mediumClass: '',
    smallClass: '',
  });

  const handleSearchHeader = (value: string, name: string) => {
    const { jobType, mediumClass, smallClass } = { ...objSearch, [name]: value } as any;
    const ds = dataSources.dataChildrenFilter.filter(
      (f: { [x: string]: any }) =>
        (jobType && jobType.length > 0 ? f.jobType === jobType : true) &&
        (mediumClass && mediumClass.length > 0 ? f.mediumClass === mediumClass : true) &&
        (smallClass && smallClass.length > 0 ? f.smallClass === smallClass : true),
    );
    setDataSources({ ...dataSources, childrens: ds });
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
      <Form
        form={curentForm}
        style={{ width: '100%' }}
        labelCol={{ span: 3 }}
        labelAlign="left"
        requiredMark={false}
        colon={false}
      >
        <Table
          bordered
          size="small"
          columns={DetailProSkillColumnCustomSearchHeader({
            searchFieldHeader: searchFieldHeader,
          })}
          dataSource={dataSources.childrens}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ x: breaks.xs ? 900 : breaks.md ? 1024 : undefined, y: 700 }}
          onRow={(_record, _rowIndex) => {
            return {
              onClick: (event) => {
                console.log(event);
              },
            };
          }}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      </Form>
    </>
  );
};

export default TableComponent;
