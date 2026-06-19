import { Table, Grid } from 'antd';
import { useNavigate } from 'react-router-dom';
import PaginationV2 from '../../../../common/PaginationV2';
import { t } from 'i18next';
import styles from '../../../../common/css/stylesTable.module.css';
import ParentColumns from '../columns/ParentColumns';
import ChildrenColumns from '../columns/ChildrenColumns';
import { useState } from 'react';
import { Tooltip } from 'antd/lib';
import evaluationDetailApiService from '../../../../common/api/evaluation8-10';
import { ParentProps, PropsPdf } from '../interfaces/interfaces';
import download from 'downloadjs';
import { Buffer } from 'buffer';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import PdfPopupConfirm from '../../../../views/user/list-evaluation/PdfPopupConfirm';
import { SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import evaluatorApiService from '../../../../common/api/evaluator';
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
  setLoading?: any;
  callBackListUserEvaluation: any;
  errorCallBackEvaluation: any;
}
const ListUserEvaluationEvaluatorTable: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const breaks = Grid.useBreakpoint();
  const [isOpenParentPDF, setOpenParentPDF] = useState(false);
  const [isOpenChildPDF, setOpenChildPDF] = useState(false);
  const [optionPdfList, setOptionPdfList] = useState({
    orientation: 'p',
    size: 'a4',
  });
  const [record, setRecord] = useState([] as any);
  const columns = ParentColumns(
    isLoading,
    setIsLoading,
    setOpenParentPDF,
    setRecord,
    'f2',
    props.setCondition,
    props.conditions.sortColumns,
    props.conditions.sortDirections,
  );
  const childrenColumns = ChildrenColumns(isLoading, setIsLoading, setOpenChildPDF, setRecord, 'f2');

  const navigate = useNavigate();
  const rows = (props: any) => {
    return (
      <>
        {props.children[0] && props?.children[0].props?.record?.isInActive ? (
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
  const handleDownLoadParentPDF = async (record: ParentProps) => {
    const childrenList = [];
    if (record.childs) {
      record.childs.map((item: PropsPdf) => {
        if (item.status >= 98) {
          childrenList.push(item);
        }
      });
    } else {
      if (record.status >= 98) {
        childrenList.push(record);
      }
    }
    if (childrenList.length > 1) {
      await evaluationDetailApiService.donwloadListPDF(
        childrenList,
        'evaluator',
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    } else if (childrenList.length === 1) {
      await evaluationDetailApiService.donwloadPDFOnList(
        record.childs ? childrenList[0].evaluationId : record.evaluationId,
        'evaluator',
        record.childs ? childrenList[0].userId : record.userId,
        record.childs ? childrenList[0].level : record.level,
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    }
  };
  const handleDownLoadChildPDF = async (record: PropsPdf) => {
    await evaluationDetailApiService.donwloadPDFOnList(
      record.evaluationId,
      'evaluator',
      record.evaluatorId,
      record.level,
      optionPdfList.orientation,
      optionPdfList.size,
      callBack,
    );
  };
  const callBack = (response: { buffer: string; fileName: string }) => {
    const buffer = Buffer.from(response.buffer);
    const blob = new Blob(['\uFEFF', buffer], {
      type: 'application/pdf',
    });
    download(blob, response.fileName, 'application/pdf');
    setIsLoading(false);
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

  return (
    <div>
      {props.isFirstLoad && (
        <Table
          components={{
            body: {
              row: rows,
            },
          }}
          bordered
          size="small"
          rowKey={(row) => row.id}
          dataSource={props.dataSources.data}
          scroll={{ x: breaks.xs || breaks.sm ? 768 : undefined }}
          columns={columns}
          pagination={false}
          className={`ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer ${styles.table}`}
          onRow={(record, _index) => {
            if (!record.childs && record.level !== undefined) {
              return {
                onClick: () => {
                  if (record.level === 8 || record.level === 9 || record.level === 10)
                    navigate(urlCompanyCode() + `/evaluator/evaluation-8-10/${record.evaluationId}`, {
                      state: { ...record, id: record.evaluationId, evaluatorOrderExcep: null },
                    });
                  else
                    navigate(urlCompanyCode() + `/evaluator/evaluation/${record.evaluationId}`, {
                      state: { ...record, id: record.evaluationId },
                    });
                }, // click row
              };
            }

            return {};
          }}
          expandable={{
            columnWidth: '1%',
            expandRowByClick: true,
            rowExpandable: (record) => record.childs?.length > 0,
            expandedRowClassName: (record) => {
              return record.childs?.length > 0 ? 'myspecialclassname' : '';
            },
            expandedRowRender: (records, _index) => {
              if (records.childs?.length > 0) {
                return (
                  <>
                    <Table
                      components={{
                        body: {
                          row: rows,
                        },
                      }}
                      size="small"
                      locale={{
                        emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                      }}
                      dataSource={records.childs}
                      columns={childrenColumns}
                      className={`${styles.thread}`}
                      style={{ margin: 0 }}
                      pagination={false}
                      rowClassName={(record: any) => {
                        return record.isInActive ? styles.inActiveUser : '';
                      }}
                      onRow={(record, _index) => {
                        if (record.level !== undefined) {
                          return {
                            onClick: () => {
                              if (record.level === 8 || record.level === 9 || record.level === 10) {
                                if (!record.evaluationOrder) {
                                  navigate(urlCompanyCode() + `/evaluator/evaluation-8-10/${record.evaluationId}`, {
                                    state: {
                                      ...record,
                                      id: record.evaluationId,
                                      evaluatorOrderExcep: records.childs[0].evaluationOrder,
                                    },
                                  });
                                } else {
                                  navigate(urlCompanyCode() + `/evaluator/evaluation-8-10/${record.evaluationId}`, {
                                    state: { ...record, id: record.evaluationId },
                                  });
                                }
                              } else
                                navigate(urlCompanyCode() + `/evaluator/evaluation/${record.evaluationId}`, {
                                  state: {
                                    ...record,
                                    id: record.evaluationId,
                                    newestRecord: records.childs[0],
                                  },
                                });
                            }, // click row
                          };
                        }

                        return {};
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
          rowClassName={(record: any) => {
            return record.isInActive ? styles.inActiveUser : '';
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
          errorCallBack={props.errorCallBack}
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
          setIsLoading(true);
          await handleDownLoadParentPDF(record);
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenParentPDF(!open);
          setIsLoading(false);
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
          setIsLoading(true);
          await handleDownLoadChildPDF(record);
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenChildPDF(!open);
          setIsLoading(false);
        }}
        fnHandleCancel={() => {
          setOptionPdfList({ ...optionPdfList, orientation: 'p', size: 'a4' });
          setOpenChildPDF(!open);
        }}
      />
    </div>
  );
};

export default ListUserEvaluationEvaluatorTable;
