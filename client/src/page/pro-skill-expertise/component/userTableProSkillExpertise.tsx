import { Table } from 'antd';
import { t } from 'i18next';
import columnUserProSkillExpertise from './columnUserProSkillExpertise';
import { SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import evaluatorApiService from '../../../common/api/evaluator';
import { urlCompanyCode } from '../../../common/util';
interface Props {
  dataState: any[] | undefined;
  isLoading: boolean;
  location: any;
  conditions: any;
  setConditions: any;
  callBack: any;
  setLoading: any;
}
const UserTableProSkillExpertise: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate();

  const columns = columnUserProSkillExpertise(
    props.setConditions,
    props.conditions.sortColumns,
    props.conditions.sortDirections,
  );

  const handleSortChange = async (
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>,
  ) => {
    if (extra.action === 'sort') {
      let sortColumns, sortDirections: string[];
      if (!Array.isArray(sorter)) {
        sortColumns = [sorter.column?.dataIndex];
        sortDirections = [sorter.order ?? ''];
      } else {
        sorter.sort((s1: any, s2: any) => s2.column?.sorter?.multiple - s1.column?.sorter?.multiple);
        sortColumns = sorter.map((s) => s.column?.dataIndex);
        sortDirections = sorter.map((s) => s.order ?? '');
      }

      const newConditions = {
        ...(props.location.state || props.conditions),
        sortColumns,
        sortDirections,
      };

      evaluatorApiService.searchListUserProSkillExpertise(
        {
          ...newConditions,
          sortDirections: newConditions.sortDirections.map((d: string) =>
            d === 'ascend' ? 'ASC' : d === 'descend' ? 'DESC' : '',
          ),
        },
        props.callBack,
        props.setLoading,
      );
      props.setConditions(newConditions);
      navigate(location.pathname, {
        replace: true,
        state: { ...newConditions, Reload: true },
      });
    }
  };

  return (
    <div>
      <Table
        bordered
        rowKey={(row) => row.userId}
        dataSource={props.dataState}
        columns={columns}
        loading={props.isLoading}
        pagination={false}
        size="small"
        className={'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'}
        onRow={(record) => {
          return {
            onClick: async (_e) => {
              // let id = record.id;
              navigate(
                urlCompanyCode() +
                  '/' +
                  window.location.pathname.split('/')[3] +
                  '/development-professional-expertise/detail',
                {
                  state: {
                    ...record,
                    yearStart: props.conditions.yearStart,
                    yearEnd: props.conditions.yearEnd,
                  },
                },
              );

              // navigate('/' + window.location.pathname.split('/')[1] + '/list-user/detail', { state: record });
            }, // click row
          };
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        scroll={{ x: 1097 }}
        onChange={(_pagination, _filters, sorter, extra) => handleSortChange(sorter, extra)}
      />
    </div>
  );
};

export default UserTableProSkillExpertise;
