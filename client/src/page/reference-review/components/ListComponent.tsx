import { Grid, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  dataSources: any;
  isLoading: boolean;
}

type OrderType = 0.5 | 1 | 2;

const ListComponent = ({ dataSources, isLoading }: Props) => {
  const breaks = Grid.useBreakpoint();
  const navigate = useNavigate();

  const displayTypeReference = (record: any) => {
    if (record?.type === undefined || record?.type === null) {
      return '';
    } else if (record?.type === 1) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.1');
    } else if (record?.type === 2) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.2');
    } else if (record?.type === 3) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.3');
    } else if (record?.type === 4) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.4');
    } else if (record?.type === 5) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.5');
    } else if (record?.type === 6) {
      return t('IDL_LIST_PERMISSION_VIEW_EVALUATION.6');
    }
  };

  const orderNames = {
    0.5: t('IDS_POINT_EVALUATOR_0_5'),
    1: t('IDS_POINT_EVALUATOR_1'),
    2: t('IDS_POINT_EVALUATOR_2'),
  };

  const ParentColumns = () => {
    return [
      {
        title: t('IDS_EVALUATION_PERIOD'),
        dataIndex: 'title',
        width: '11%',
        align: 'left' as const,
      },
      {
        title: t('IDS_FULLNAME'),

        // dataIndex: 'fullName',
        width: '17%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{record.employeeNumber + ': ' + record.fullName}</div>;
        },
      },
      {
        title: t('IDS_LEVEL'),
        dataIndex: 'level',
        width: '5%',
        align: 'center' as const,
      },
      {
        title: t('IDS_DEPARTMENT'),

        // dataIndex: 'department',
        width: '20%',
        align: 'left' as const,
        render: (_: any, record: any) => {
          return (
            <div style={{ width: 280 }}>
              {record?.divisionName && `${t('IDS_TYPE_DIVISION')}: ${record?.divisionName}`}
              {record?.departmentName && `\n${t('IDS_TYPE_DEPARTMENT_NAME')}: ${record?.departmentName}`}
            </div>
          );
        },
      },
      {
        title: t('IDS_VIEW_RANGE'),
        dataIndex: 'type',
        width: '25%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{displayTypeReference(record)}</div>;
        },
      },
      {
        title: t('IDS_DISPLAY_ORDER_VIEW'),
        dataIndex: 'order',
        align: 'left' as const,
        render: (text: OrderType) => orderNames[text],
      },
    ] as ColumnType<any>[];
  };
  const ChildrenColumns = () => {
    return [
      {
        dataIndex: 'title',
        width: '10%',
        align: 'left' as const,
      },
      {
        dataIndex: 'fullName',
        width: '17%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{record.employeeNumber + ': ' + record.fullName}</div>;
        },
      },
      {
        dataIndex: 'level',
        width: '6%',
        align: 'center' as const,
      },
      {
        dataIndex: 'department',
        width: '20%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return (
            <div style={{}}>
              {record?.divisionName && `${t('IDS_TYPE_DIVISION')}: ${record?.divisionName}`}
              {record?.departmentName && `\n${t('IDS_TYPE_DEPARTMENT_NAME')}: ${record?.departmentName}`}
            </div>
          );
        },
      },
      {
        dataIndex: 'type',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{displayTypeReference(record)}</div>;
        },
      },
      {
        dataIndex: 'order',
        align: 'left' as const,
        render: (text: OrderType) => orderNames[text],
      },
    ];
  };

  return (
    <>
      <Table
        bordered
        onRow={(record: any, _onExpand) => {
          if (record.id || record.id !== undefined) {
            return {
              onClick: () => {
                if (record.level >= 8)
                  navigate(`${urlCompanyCode()}/reference-review/detail810/${record.id}`, {
                    state: { id: record.id, type: record.type, evaluatorOrderExcep: record.order }, //thêm idEvaluation và type cần xem vào đây
                  });
                else
                  navigate(`${urlCompanyCode()}/reference-review/detail/${record.id}`, {
                    state: { id: record.id, type: record.type, evaluatorOrderExcep: record.order }, //thêm idEvaluation và type cần xem vào đây
                  });
              },
            };
          }

          return record;
        }}
        size="small"
        dataSource={dataSources.data}
        scroll={{ x: breaks.xs || breaks.sm ? 900 : undefined }}
        columns={ParentColumns()}
        pagination={false}
        className={`ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer `}
        expandable={{
          columnWidth: '1%',
          expandRowByClick: true,
          rowExpandable: (_record) => _record.childs?.length > 0,
          expandedRowClassName: (record) => {
            return record.childs?.length > 0 ? 'myspecialclassname' : '';
          },
          expandedRowRender: (_record, _index) => {
            if (_record.childs?.length > 0) {
              return (
                <>
                  <Table
                    dataSource={_record.childs}
                    size="small"
                    locale={{
                      emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                    }}
                    columns={ChildrenColumns()}
                    rowKey={(row) => row.id}
                    // className={`${styles.thread}`}
                    style={{ margin: 0 }}
                    pagination={false}
                    onRow={(record: any, _onExpand) => {
                      if (record.id || record.id !== undefined) {
                        return {
                          onClick: () => {
                            if (record.level >= 8)
                              navigate(`${urlCompanyCode()}/reference-review/detail810/${record.id}`, {
                                state: {
                                  id: record.id,
                                  type: record.type || 3,
                                  evaluatorOrderExcep: record.order,
                                }, //thêm idEvaluation và type cần xem vào đây
                              });
                            else
                              navigate(`${urlCompanyCode()}/reference-review/detail/${record.id}`, {
                                state: {
                                  id: record.id,
                                  type: record.type || 1,
                                  evaluatorOrderExcep: record.order,
                                }, //thêm idEvaluation và type cần xem vào đây
                              });
                          }, // click row
                        };
                      }

                      return record;
                    }}
                  />
                </>
              );
            } else {
              return false;
            }
          },
        }}
        loading={isLoading}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
    </>
  );
};

export default ListComponent;
