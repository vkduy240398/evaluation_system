/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { t } from 'i18next';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import httpAxios from '../../../common/http';
import ComponentParent from './componentParent';
import { PropsPdf } from '../../evaluator/list-user-evaluation/interfaces/interfaces';
interface Props {
  params: any;
  role: any;
  isDisabled: boolean;
}
const PrintParentEvaluation: React.FC<Props> = (props: Props) => {
  const { params, role, isDisabled } = props;

  const componentRef = useRef(null) as any;

  const onBeforeGetContentResolve = useRef(null) as any;

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]) as any;

  const [summaryData, setSummaryData] = useState({}) as any;

  const [filename, setFileName] = useState('') as any;

  const [sameLevel, setSameLevel] = useState('1-10') as any;

  const [multiLevel, setMultiLevel] = useState(false);

  const [text, setText] = useState('LOADING');

  const fileNamePDF = () => {
    if (role == 'f1') {
      return `【${params.year}】${params?.userInfo?.fullName}評価表.pdf`;
    } else if (role == 'f2') {
      return `【${params.title}】${params.fullName.split(': ')[1]}評価表.pdf`;
    } else if (role == 'f5') {
      return `【${params.title}】${params.fullName}評価表.pdf`;
    }
  };

  // const handleAfterPrint = useCallback(() => {
  //   console.log('`onAfterPrint` called'); // tslint:disable-line no-console
  // }, []);

  // const handleBeforePrint = useCallback(() => {
  //   console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  // }, []);

  const handleOnBeforeGetContent = useCallback(async () => {
    setLoading(true);
    setText('LOADING ...');

    return await new Promise<void>(async (resolve) => {
      onBeforeGetContentResolve.current = resolve;

      if (role == 'f1') {
        // console.log('role: ', role);
        // console.log('params: ', params);
        const childrenList = [];
        if (params.childrens) {
          params.childrens.map((item: any) => {
            if (item.statusNo === 100) {
              childrenList.push(item);
            }
          });
        } else {
          if (params.statusNo === 100) {
            childrenList.push(params);
          }
        }

        if (childrenList.length > 1) {
          const parameters = {
            childrenArr: childrenList,
            role: 'user',
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/pdf/list', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);
              setSummaryData(res?.data?.summaryData);
              setSameLevel(res?.data?.sameLevel);
              setMultiLevel(res?.data?.multiLevel);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        } else if (childrenList.length === 1) {
          const parameters = {
            evaluationId: params.childrens ? childrenList[0].evaluationId : params.evaluationId,
            role: 'user',
            userId: params.childrens ? childrenList[0].userInfo.id : params.userInfo.id,
            level: params.childrens ? childrenList[0].level : params.level,
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        }
      } else if (role == 'f2') {
        // console.log('role: ', role);
        // console.log('params: ', params);
        const childrenList = [];
        if (params.childs) {
          params.childs.map((item: PropsPdf) => {
            if (item.status >= 98) {
              childrenList.push(item);
            }
          });
        } else {
          if (params.status >= 98) {
            childrenList.push(params);
          }
        }
        if (childrenList.length > 1) {
          const parameters = {
            childrenArr: childrenList,
            role: 'evaluator',
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/pdf/list', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);
              setSummaryData(res?.data?.summaryData);
              setSameLevel(res?.data?.sameLevel);
              setMultiLevel(res?.data?.multiLevel);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        } else if (childrenList.length === 1) {
          const parameters = {
            evaluationId: params.childs ? childrenList[0].evaluationId : params.evaluationId,
            role: 'evaluator',
            userId: params.childs ? childrenList[0].userId : params.userId,
            level: params.childs ? childrenList[0].level : params.level,
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        }
      } else if (role == 'f5') {
        // console.log('role: ', role);
        // console.log('params: ', params);

        const childrenList = [];
        if (params.childs) {
          params.childs.map((item: any) => {
            if (item.status > 0) {
              childrenList.push({
                evaluationId: item.id,
                level: item.level,
              });
            }
          });
        } else {
          if (params.status > 0) {
            childrenList.push({
              evaluationId: params.id,
              level: params.level,
            });
          }
        }
        if (childrenList.length > 1) {
          const parameters = {
            childrenArr: childrenList,
            role: 'admin',
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/pdf/list', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);
              setSummaryData(res?.data?.summaryData);
              setSameLevel(res?.data?.sameLevel);
              setMultiLevel(res?.data?.multiLevel);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        } else if (childrenList.length === 1) {
          const parameters = {
            evaluationId: childrenList[0].evaluationId,
            role: 'admin',
            userId: 1, // giá trị này trong trường hợp này không quan trọng, có thể là số bất kì
            level: childrenList[0].level,
            isF5: role == 'f5' ? true : undefined,
          };

          await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
            if (res && res?.status) {
              setDataSource(res?.data.dataReview);
              setFileName(res?.data.fileName);

              setTimeout(() => {
                setLoading(false);
                setText('LOADED');
                resolve();
              }, 1);
            }
          });
        }
      }
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: fileNamePDF(),
    onBeforeGetContent: handleOnBeforeGetContent,

    // onBeforePrint: handleBeforePrint,
    // onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === 'LOADED' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <div>
      <div style={{ display: 'none' }}>
        <ComponentParent
          componentRef={componentRef}
          dataSource={dataSource}
          summaryData={summaryData}
          sameLevel={sameLevel}
          multiLevel={multiLevel}
        />
      </div>

      <Tooltip placement="topRight" title={isDisabled ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey">
        <Button
          disabled={isDisabled}
          loading={loading}
          icon={<FilePdfOutlined />}
          style={{ color: '#007240 ' }}
          onClick={async (e) => {
            e.stopPropagation();
            await handlePrint();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default PrintParentEvaluation;
