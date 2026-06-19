import { Grid, Space, Table, Tooltip } from 'antd';
import { statusEvaluationType } from '../../../../common/status';
import PaginationV2 from '../../../../common/PaginationV2';
import { t } from 'i18next';
import styles from '../../../../common/css/stylesTable.module.css';
import { useNavigate } from 'react-router-dom';
import evaluationDetailApiService from '../../../../common/api/evaluation8-10';
import download from 'downloadjs';
import { Buffer } from 'buffer';
import React, { useState } from 'react';
import PdfPopupConfirm from '../../../../views/user/list-evaluation/PdfPopupConfirm';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import PrintParentEvaluation from '../../../evaluation-print-review/evaluation-list/printParentEvaluation';
import PrintChildrenEvaluation from '../../../evaluation-print-review/evaluation-list/printChildrenEvaluation';
import SortColumnTitle from '../../../../common/SortColumnTitle';
import { ColumnType } from 'antd/lib/table';
import evaluatorApiService from '../../../../common/api/evaluator';
import { SorterResult } from 'antd/lib/table/interface';
import { TableCurrentDataSource } from 'antd/es/table/interface';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  dataSources: { data: []; counts: number };
  isLoading: boolean;
  limit: number;
  conditions: any;
  current: number;
  url: string;
  setCondition: any;
  setDataState: any;
  errorCallBack: (bool: any) => void;
  navigates: any;
  location: any;
  isFirstLoad: boolean;
  setLoading: any;
  mode: string;
  callBackListUserEvaluation: (data: any) => void;
  errorCallBackEvaluation: (bool: boolean) => void;
}

const ListEvaluationTable: React.FC<Props> = (props: Props) => {
  const [isLoadingPDF, setIsLoadingPDF] = useState<boolean>(false);
  const [isOpenParentPDF, setOpenParentPDF] = useState(false);
  const [isOpenChildPDF, setOpenChildPDF] = useState(false);
  const [optionPdfList, setOptionPdfList] = useState({
    orientation: 'p',
    size: 'a4',
  });
  const [record, setRecord] = useState([] as any);
  const navigate = useNavigate();
  const breaks = Grid.useBreakpoint();

  const handleDownLoadPDFParent = async (record: any) => {
    const childrenList = [];
    if (record.childs) {
      record.childs.map((item: any) => {
        if (item.status > 0) {
          childrenList.push({
            evaluationId: item.id,
            level: item.level,
          });
        }
      });
    } else {
      if (record.status > 0) {
        childrenList.push({
          evaluationId: record.id,
          level: record.level,
        });
      }
    }
    if (childrenList.length > 1) {
      await evaluationDetailApiService.donwloadListPDF(
        childrenList,
        'admin',
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    } else if (childrenList.length === 1) {
      await evaluationDetailApiService.donwloadPDFOnList(
        childrenList[0].evaluationId,
        'admin',
        1, // giá trị này trong trường hợp này không quan trọng, có thể là số bất kì
        childrenList[0].level,
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    }
  };

  const CustomRow = (props: any) => {
    return (
      <>
        {props.isInActive ? (
          <Tooltip title={t('IDS_EVALUATION_DELETED_USER')}>
            <tr {...props} />
          </Tooltip>
        ) : (
          <>
            <tr {...props} />
          </>
        )}
      </>
    );
  };

  const handleDownLoadPDF = async (record: any) => {
    await evaluationDetailApiService.donwloadPDFOnList(
      record.id,
      'admin',
      1, // giá trị này trong trường hợp này không quan trọng, có thể là số bất kì
      record.level,
      optionPdfList.orientation,
      optionPdfList.size,
      callBack,
    );
  };

  const callBack = (response: any) => {
    const buffer = Buffer.from(response.buffer);
    const blob = new Blob(['\uFEFF', buffer], {
      type: 'application/pdf',
    });
    download(blob, response.fileName, 'application/pdf');
    setIsLoadingPDF(false);
  };

  const getPreviousSortDirection = (row: string): 'ascend' | 'descend' | undefined => {
    const index = props.location.state?.sortColumns?.indexOf(row);
    if (index === undefined || index < 0) {
      return undefined;
    } else {
      return props.location.state?.sortDirections[index];
    }
  };

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
      await evaluatorApiService.listUserEvaluation(
        props.url,
        props.callBackListUserEvaluation,
        props.errorCallBackEvaluation,
        {
          ...newConditions,
          sortDirections: newConditions.sortDirections.map((d: string) =>
            d === 'ascend' ? 'ASC' : d === 'descend' ? 'DESC' : '',
          ),
        },
      );
      props.setCondition(newConditions);
      navigate(location.pathname, {
        replace: true,
        state: { ...newConditions, Reload: true },
      });
    }
  };

  const ParentColumns = () => {
    return [
      {
        title: t('IDS_EVALUATION_PERIOD'),
        dataIndex: 'title',
        width: '10%',
        align: 'left' as const,
      },
      {
        title: t('IDS_FULLNAME'),

        // dataIndex: 'fullName',
        width: '15%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{record.employeeNumber + ': ' + record.fullName}</div>;
        },
      },
      {
        title: ({ sortColumns }) => (
          <SortColumnTitle
            title={t('IDS_LEVEL')}
            sortOrder={sortColumns?.find(({ column }) => column.dataIndex === 'level')?.order}
          />
        ),
        dataIndex: 'level',
        width: '5%',
        align: 'center' as const,
        sorter: { multiple: 3 },
        render: (_text: string, record: any) => {
          return <>{record.childs?.length > 0 ? '' : _text}</>;
        },
        defaultSortOrder: getPreviousSortDirection('level'),
      },
      {
        title: t('IDS_DEPARTMENT'),

        // dataIndex: 'department',
        width: '16%',
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
        title: ({ sortColumns }) => (
          <SortColumnTitle
            title={t('IDS_STATUS')}
            sortOrder={sortColumns?.find(({ column }) => column.dataIndex === 'status')?.order}
          />
        ),
        dataIndex: 'status',
        width: '10%',
        align: 'left' as const,
        render: (_text: statusEvaluationType, record: any) => {
          return <>{record.stringStatus}</>;
        },
        sorter: { multiple: 1 },
        defaultSortOrder: getPreviousSortDirection('status'),
      },
      {
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'evaluator1',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'evaluator2',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        title: t('IDS_EVALUATION_RESULT'),

        // dataIndex: 'summaryPointEvaluator2',
        width: '7%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          // Trường hợp evaluator 2 submit thì mới hiển thị điểm
          return (
            <>
              {/* {record.summaryPointEvaluator2 !== null &&
              record.summaryPointEvaluator2 !== undefined &&
              !isNaN(Number(record.summaryPointEvaluator2))
                ? Number(record.summaryPointEvaluator2).toFixed(
                    record.level ? (record.level >= 8 ? 1 : 0) : isAllHighLevel(record.childs) ? 1 : 0,
                  )
                : record.summaryPointEvaluator2} */}
              {record.status > 61 ? record.summaryPointEvaluator2 : ''}
            </>
          );
        },
      },
      {
        title: t('IDS_OUTPUT'),
        dataIndex: 'action',
        width: '6%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          let isDisabled = true;
          if (record.childs) {
            record.childs.some((item: any) => {
              if (item.status > 0) {
                isDisabled = false;
              }
            });
          } else {
            if (record.status > 0) {
              isDisabled = false;
            }
          }

          return (
            <Space size="middle">
              {/* <Tooltip placement="topRight" title={isDisabled ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey"> */}
              {/* <Button
                  disabled={isDisabled}
                  loading={isLoadingPDF}
                  icon={<FilePdfOutlined />}
                  style={{ color: '#007240 ' }}
                  onClick={(e) => {
                    // setIsLoadingPDF(true);
                    e.stopPropagation();

                    // await handleDownLoadPDFParent(record);
                    // setIsLoadingPDF(false);
                    setRecord(record);
                    setOpenParentPDF(true);
                  }}
                /> */}
              {/* </Tooltip> */}
              <PrintParentEvaluation params={record} role={'f5'} isDisabled={isDisabled} />
            </Space>
          );
        },
      },
    ] as ColumnType<any>[];
  };
  const ChildrenColumns = () => {
    return [
      {
        dataIndex: 'title',
        width: '7%',
        align: 'left' as const,
      },
      {
        dataIndex: 'fullName',
        width: '15%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <div>{record.employeeNumber + ': ' + record.fullName}</div>;
        },
      },
      {
        dataIndex: 'level',
        width: '5%',
        align: 'center' as const,
      },
      {
        dataIndex: 'department',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return (
            <div style={{ width: 280 }}>
              {record?.divisionName && `${t('IDS_TYPE_DIVISION')}: ${record?.divisionName}`}
              {record?.departmentName && `\n${t('IDS_TYPE_DEPARTMENT_NAME')}: ${record?.departmentName}`}
            </div>
          );
        },
      },

      {
        dataIndex: 'status',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <>{record.stringStatus}</>;
        },
      },
      {
        // title: t('IDS_EVALUATOR_1'),
        dataIndex: 'evaluator1',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        // title: t('IDS_EVALUATOR_2'),
        dataIndex: 'evaluator2',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        // title: t('IDS_EVALUATION_RESULT'),
        dataIndex: 'summaryPointEvaluator2',
        width: '6%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          return <>{record.status > 61 ? record.summaryPointEvaluator2 : ''}</>;
        },
      },
      {
        dataIndex: 'action',
        width: '6%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          return (
            <Space size="middle">
              {/* <Tooltip placement="topRight" title={record.status === 0 ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey">
                <Button
                  disabled={record.status === 0}
                  loading={isLoadingPDF}
                  icon={<FilePdfOutlined />}
                  style={{ color: '#007240 ' }}
                  onClick={async (e) => {
                    // setIsLoadingPDF(true);
                    e.stopPropagation();

                    // await handleDownLoadPDF(record);
                    // setIsLoadingPDF(false);
                    setOpenChildPDF(true);
                    setRecord(record);
                  }}
                />
              </Tooltip> */}
              <PrintChildrenEvaluation params={record} role={'f5'} isDisabled={record.status === 0} />
            </Space>
          );
        },
      },
    ];
  };

  const ParentColumnsF7 = () => {
    return [
      {
        title: t('IDS_EVALUATION_PERIOD'),
        dataIndex: 'title',
        width: '15%',
        align: 'left' as const,
      },
      {
        title: t('IDS_FULLNAME'),
        dataIndex: 'fullName',
        width: '15%',
        align: 'left' as const,
      },
      {
        title: t('IDS_LEVEL'),
        dataIndex: 'level',
        width: '6%',
        align: 'center' as const,
      },
      {
        title: t('IDS_DEPARTMENT'),
        dataIndex: 'department',
        width: '16%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return (
            <div style={{ width: 280 }}>
              {[1, 2, 3, 4, 5, 6, 7].includes(parseInt(record.level)) ? record.departmentName : record.divisionName}
            </div>
          );
        },
      },

      {
        title: t('IDS_STATUS'),
        dataIndex: 'status',
        width: '10%',
        align: 'left' as const,
        render: (_text: statusEvaluationType, record: any) => {
          return <>{record.stringStatus}</>;
        },
      },
      {
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'evaluator1',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'evaluator2',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        title: t('IDS_EVALUATION_RESULT'),
        dataIndex: 'summaryPointEvaluator2',
        width: '7%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          return (
            <>
              {record.summaryPointEvaluator2 !== null &&
              record.summaryPointEvaluator2 !== undefined &&
              !isNaN(Number(record.summaryPointEvaluator2))
                ? Number(record.summaryPointEvaluator2).toFixed(
                    record.level ? (record.level >= 8 ? 1 : 0) : isAllHighLevel(record.childs) ? 1 : 0,
                  )
                : record.summaryPointEvaluator2}
            </>
          );
        },
      },
    ];
  };
  const ChildrenColumnsF7 = () => {
    return [
      {
        dataIndex: 'title',
        width: '7%',
        align: 'left' as const,
      },
      {
        dataIndex: 'fullName',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <>{record.summaryPointEvaluator2 !== 0 ? record.summaryPointEvaluator2 : ''}</>;
        },
      },
      {
        dataIndex: 'level',
        width: '8%',
        align: 'center' as const,
      },
      {
        dataIndex: 'department',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return (
            <div style={{ width: 280 }}>
              {[1, 2, 3, 4, 5, 6, 7].includes(parseInt(record.level)) ? record.departmentName : record.divisionName}
            </div>
          );
        },
      },

      {
        dataIndex: 'status',
        width: '10%',
        align: 'left' as const,
        render: (_text: any, record: any) => {
          return <>{record.stringStatus}</>;
        },
      },
      {
        // title: t('IDS_EVALUATOR_1'),
        dataIndex: 'evaluator1',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        // title: t('IDS_EVALUATOR_2'),
        dataIndex: 'evaluator2',
        width: '10%',
        align: 'left' as const,

        // render: (text: statusEvaluationType, record: any) => {
        //   return <>{record.stringStatus}</>;
        // },
      },
      {
        // title: t('IDS_EVALUATION_RESULT'),
        dataIndex: 'summaryPointEvaluator2',
        width: '10%',
        align: 'center' as const,
        render: (_text: any, record: any) => {
          return (
            <>
              {record.summaryPointEvaluator2 !== null &&
              record.summaryPointEvaluator2 !== undefined &&
              !isNaN(Number(record.summaryPointEvaluator2))
                ? Number(record.summaryPointEvaluator2).toFixed(record.level >= 8 ? 1 : 0)
                : ''}
            </>
          );
        },
      },
    ];
  };

  return (
    <div>
      {props.isFirstLoad && (
        <Table
          bordered
          showSorterTooltip={false}
          components={{
            body: {
              row: CustomRow,
            },
          }}
          onRow={(record: any, _onExpand) => {
            if (record.id && record.id !== undefined && record.id !== null) {
              return {
                onClick: () => {
                  if (!props.mode)
                    if (record.level >= 8)
                      navigate(urlCompanyCode() + `/admin-evaluation/evaluation-8-10/${record.id}`, {
                        state: { ...record, id: record.id },
                      });
                    else
                      navigate(urlCompanyCode() + `/admin-evaluation/evaluation/${record.id}`, {
                        state: { ...record, id: record.id },
                      });
                },
                isInActive: record.isInActive, // click row
              };
            }

            return record;
          }}
          size="small"
          dataSource={props.dataSources.data}
          scroll={{ x: breaks.xs || breaks.sm ? 1200 : undefined }}
          columns={!props.mode ? ParentColumns() : ParentColumnsF7()}
          pagination={false}
          className={
            !props.mode
              ? `ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer ${styles.table}`
              : ''
          }
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
                      columns={!props.mode ? ChildrenColumns() : ChildrenColumnsF7()}
                      rowKey={(row) => row.id}
                      className={`${styles.thread}`}
                      style={{ margin: 0 }}
                      pagination={false}
                      rowClassName={(_record: any) => {
                        return _record.isInActive ? styles.inActiveUser : '';
                      }}
                      onRow={(record: any, _onExpand) => {
                        if (record.id && record.id !== undefined && record.id !== null) {
                          return {
                            onClick: () => {
                              if (!props.mode)
                                if (record.level >= 8)
                                  navigate(urlCompanyCode() + `/admin-evaluation/evaluation-8-10/${record.id}`, {
                                    state: { ...record, id: record.id },
                                  });
                                else
                                  navigate(urlCompanyCode() + `/admin-evaluation/evaluation/${record.id}`, {
                                    state: { ...record, id: record.id },
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
          loading={props.isLoading}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
          rowClassName={(_record: any) => {
            return _record.isInActive ? styles.inActiveUser : '';
          }}
          onChange={(_pagination, _filters, sorter, extra) => handleSortChange(sorter, extra)}
        />
      )}

      {props.dataSources?.data?.length > 0 && (
        <PaginationV2
          conditions={props.location.state || props.conditions}
          currents={props.conditions.current}
          limit={props.conditions.limit}
          url={props.url}
          setDataSources={props.setDataState}
          errorCallBack={props.setLoading}
          location={props.location}
          navigates={props.navigates}
          dataSources={props.dataSources}
          loading={props.isLoading}
          setLoading={props.setLoading}
        />
      )}
      <ModalCustomComponent
        isOpen={isOpenParentPDF}
        okText={t('IDS_OUTPUT').toString()}
        header={t('IDS_BUTTON_OUTPUT_PDF')}
        content={<PdfPopupConfirm setOptionPdfList={setOptionPdfList} optionPdfList={optionPdfList} />}
        fnHandleOk={async () => {
          setIsLoadingPDF(true);
          await handleDownLoadPDFParent(record);
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenParentPDF(!open);
          setIsLoadingPDF(false);
        }}
        fnHandleCancel={() => {
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenParentPDF(!open);
        }}
      />
      <ModalCustomComponent
        isOpen={isOpenChildPDF}
        okText={t('IDS_OUTPUT').toString()}
        header={t('IDS_BUTTON_OUTPUT_PDF')}
        content={<PdfPopupConfirm setOptionPdfList={setOptionPdfList} optionPdfList={optionPdfList} />}
        fnHandleOk={async () => {
          setIsLoadingPDF(true);
          await handleDownLoadPDF(record);
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenChildPDF(!open);
          setIsLoadingPDF(false);
        }}
        fnHandleCancel={() => {
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenChildPDF(!open);
        }}
      />
    </div>
  );
};
const isAllHighLevel = (currentValue: any[]) => {
  let isHightlevel = true;
  for (let i = 0; i < currentValue.length; i++) {
    if (currentValue[i]?.level < 7) {
      isHightlevel = false;
      break;
    }
  }

  return isHightlevel;
};
export default ListEvaluationTable;
