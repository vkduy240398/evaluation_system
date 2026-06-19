import { Table, Grid, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { itemEvaluationList } from '../../../../model/Conditions';
import { t } from 'i18next';
import ColumnListEvaluations from './ColumnListEvaluation';
import ColumnChildrens from './ColumnChildrens';
import styles from '../../../../common/css/stylesTable.module.css';
import { useState } from 'react';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import PdfPopupConfirm from '../../../../views/user/list-evaluation/PdfPopupConfirm';
import evaluationDetailApiService from '../../../../common/api/evaluation8-10';
import download from 'downloadjs';
import { Buffer } from 'buffer';
import { urlCompanyCode } from '../../../../common/util';

interface Props {
  dataState: itemEvaluationList[] | undefined;
  isLoading: boolean;
}

const ListEvaluationTable: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenParentPDF, setOpenParentPDF] = useState(false);
  const [isOpenChildPDF, setOpenChildPDF] = useState(false);
  const [optionPdfList, setOptionPdfList] = useState({
    orientation: 'p',
    size: 'a4',
  });
  const [record, setRecord] = useState([] as any);
  const columns = ColumnListEvaluations(isLoading, setIsLoading, setOpenParentPDF, setRecord, 'f1');
  const ChildrenColumns = ColumnChildrens(isLoading, setIsLoading, setOpenChildPDF, setRecord, 'f1');
  const navigate = useNavigate();
  const breaks = Grid.useBreakpoint();
  const rows = (props: any) => {
    return (
      <>
        {props.children[0] && !props?.children[0].props?.record?.isActive ? (
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
  const handleDownLoadParentPDF = async (record: any) => {
    const childrenList = [];
    if (record.childrens) {
      record.childrens.map((item: any) => {
        if (item.statusNo === 100) {
          childrenList.push(item);
        }
      });
    } else {
      if (record.statusNo === 100) {
        childrenList.push(record);
      }
    }

    if (childrenList.length > 1) {
      await evaluationDetailApiService.donwloadListPDF(
        childrenList,
        'user',
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    } else if (childrenList.length === 1) {
      await evaluationDetailApiService.donwloadPDFOnList(
        record.childrens ? childrenList[0].evaluationId : record.evaluationId,
        'user',
        record.childrens ? childrenList[0].userInfo.id : record.userInfo.id,
        record.childrens ? childrenList[0].level : record.level,
        optionPdfList.orientation,
        optionPdfList.size,
        callBack,
      );
    }
  };
  const handleDownLoadChildPDF = async (record: any) => {
    await evaluationDetailApiService.donwloadPDFOnList(
      record.evaluationId,
      'user',
      record.userInfo.id,
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
    setIsLoading(false);
  };

  return (
    <div>
      <Table
        components={{
          body: {
            row: rows,
          },
        }}
        size="small"
        rowKey={(row: any) => row.id}
        scroll={{ x: breaks.xs ? 900 : undefined }}
        dataSource={props.dataState}
        columns={columns}
        pagination={false}
        bordered
        className={`ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer ${styles.table}`}
        onRow={(record: any, _onExpand) => {
          if (!record.childrens || record?.childrens.length === 0) {
            return {
              onClick: () => {
                if ([8, 9, 10].includes(record.level))
                  navigate(urlCompanyCode() + `/user/evaluation-8-10/${record.evaluationId}`, {
                    state: { ...record, id: record.evaluationId },
                  });
                else
                  navigate(urlCompanyCode() + `/user/evaluation/${record.evaluationId}`, {
                    state: { ...record, id: record.evaluationId },
                  });
              }, // click row
            };
          }

          return record;
        }}
        rowClassName={(record: any) => {
          return !record.isActive ? styles.inActiveUser : '';
        }}
        expandable={{
          expandRowByClick: true,
          rowExpandable: (_record) => _record.childrens?.length > 0,
          expandedRowClassName: (record) => {
            return record.children?.length > 0 ? 'myspecialclassname' : '';
          },
          expandedRowRender: (_record, _index) => {
            if (_record.childrens?.length > 0) {
              return (
                <>
                  <Table
                    components={{
                      body: {
                        row: rows,
                      },
                    }}
                    style={{ margin: 0 }}
                    className={`${styles.threadF1ListEvaluation}`}
                    columns={ChildrenColumns}
                    dataSource={_record.childrens}
                    pagination={false}
                    size="small"
                    onRow={(record: any, _onExpand) => {
                      return {
                        onClick: () => {
                          if ([8, 9, 10].includes(record.level))
                            navigate(urlCompanyCode() + `/user/evaluation-8-10/${record.evaluationId}`, {
                              state: { ...record, id: record.evaluationId },
                            });
                          else
                            navigate(urlCompanyCode() + `/user/evaluation/${record.evaluationId}`, {
                              state: { ...record, id: record.evaluationId },
                            });
                        }, // click row
                      };
                    }}
                    rowClassName={(record: any) => {
                      return !record.isActive ? styles.inActiveUser : '';
                    }}
                  />
                </>
              );
            }

            return false;
          },
        }}
        loading={props.isLoading}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
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

export default ListEvaluationTable;
