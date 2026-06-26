/* eslint-disable prefer-const */
/* eslint-disable no-useless-escape */
import { Col, Form, Row, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { listDepartment } from '../../../model/department';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import evaluatorApiService from '../../../common/api/evaluator';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusEvaluationObj1, statusEvaluationType } from '../../../common/status';
import { t } from 'i18next';
import { MainButton } from '../../../common/MainButton';
import SearchEvaluationComponent from './components/SearchEvaluationComponent';
import ListEvaluationTable from './components/ListEvaluationTable';
import httpAxios from '../../../common/http';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import { useAuth } from '../../../hooks/useAuth';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import {
  startExport,
  updateExportProgress,
  updateExportMessage,
  finishExport,
  resetExport,
  errorExport,
} from '../../../store/excel';
import { AppDispatch, RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { cancelExportPolling, setExportPollingInterval } from '../../../common/util';

const ListUserEvaluation: React.FC<any> = (props: any) => {
  const [dataStates, setDataState] = useState<any>({
    data: [],
    counts: 50,
  });

  const [departments, setDepartment] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const years = new Date();
  years.setFullYear(location.state?.yearDisplayCalendar || years.getFullYear());
  const url = `/api/v1/f5/management-evaluation-history/list-user-evaluation/`;

  const status = [
    [t('IDS_ALL'), 0],
    [t('IDS_ALL'), 1],
    [t('IDS_ALL'), 2],
    [t('IDS_ALL'), 3],
    [t('IDS_ALL'), 4],
    [t('IDS_ALL'), 5],
    [t('IDS_ALL'), 6],
    [t('IDS_ALL'), 7],
    [t('IDS_ALL'), 8],
    [t('IDS_ALL'), 49],
    [t('IDS_ALL'), 50],
    [t('IDS_ALL'), 51],
    [t('IDS_ALL'), 52],
    [t('IDS_ALL'), 53],
    [t('IDS_ALL'), 54],
    [t('IDS_ALL'), 55],
    [t('IDS_ALL'), 56],
    [t('IDS_ALL'), 57],
    [t('IDS_ALL'), 58],
    [t('IDS_ALL'), 59],
    [t('IDS_ALL'), 60],
    [t('IDS_ALL'), 61],
    [t('IDS_ALL'), 98],
    [t('IDS_ALL'), 99],
    [t('IDS_ALL'), 100],
  ];
  const auth = useAuth();
  const [condition, setCondition] = useState(
    location.state || {
      email: '',
      department: [t('IDS_ALL')],
      salaryRank: '1,2,3,4,5,6,7,8,9,10',
      year: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      limit: 20,
      offset: 0,
      sortBy: 'periodStart',
      sortType: 'ASC',
      yearDisplayCalendar: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      current: 1,

      stringStatus: Object.keys(statusEvaluationObj1).toString(),
    },
  );

  const levels = [
    { id: '1,2,3,4,5,6,7,8,9,10', name: t('IDS_ALL') },
    { id: '1,2,3,4,5,6,7', name: t('IDS_LEVEL_1_7') },
    { id: '8,9,10', name: t('IDS_LEVEL_8_10') },
  ];
  const [listLevels, setListLevels] = useState([]) as any;
  const [listStatus, setListStatus] = useState<any[]>([]);
  const [isFirstLoad, setFirstLoad] = useState<boolean>(false);
  const [departmentConditon, setDepartmentCondition] = useState<any>({
    year: condition.yearDisplayCalendar,
    periodIndex: condition.periodEvaluate,
  });

  // get listdepartment
  const callBack = (data: listDepartment[]) => {
    setDepartment(data);
  };
  const errorCallBack = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  const errorCallBackEvaluation = (bool: boolean) => {
    setLoading(bool);
  };

  // get list user evaluation
  const callBackListUserEvaluation = (data: any[]) => {
    setDataState(data);
    setFirstLoad(true);
    setLoading(false);
  };

  const exportCSV = async () => {
    setLoading(true);
    await httpAxios
      .Get('/api/v1/f5/management-evaluation-history/export-CSV/', {
        params: {
          // get user list evaluation
          ...condition,
          year: dayjs(condition.year, 'YYYY').format('YYYY'),
          limit: 99999,
          offset: 0,
        },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        if (res && res.status === 200) {
          const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `【${location.state.yearDisplayCalendar}年${
              location.state.periodEvaluate === 1 ? t('IDS_FIRST_PERIOD') : t('IDS_SECOND_PERIOD')
            }】_${t('IDS_EVALUATION_RESULT_AGGREGATE')}_${moment(new Date()).format('YYYYMMDDHHmm')}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    setLoading(false);
  };

  useEffect(() => {
    /**set list level */
    const tempLevels: { id: any; name: any }[] = [];
    levels.forEach((item: any) => {
      tempLevels.push({ id: item.id, name: item.name });
    });
    setListLevels(tempLevels);

    if (location.state && location.state.Reload && location.state.Reload === true) {
      evaluatorApiService.listUserEvaluation(url, callBackListUserEvaluation, errorCallBackEvaluation, {
        // get user list evaluation
        ...condition,
        year: dayjs(condition.year, 'YYYY').format('YYYY'),
      });
    }

    // create status
    const arrayStatus = [];
    const arrayParents = [];
    for (let index = 0; index < Object.keys(statusEvaluationObj1).length; index++) {
      const status: number = parseInt(Object.keys(statusEvaluationObj1)[index]);
      const i: statusEvaluationType = status as statusEvaluationType;
      arrayStatus.push({
        label: statusEvaluationObj1[i],
        value: i,
      });
    }
    arrayParents.push({
      label: t('IDS_ALL'),
      value: t('IDS_ALL'),
      children: arrayStatus,
    });
    setListStatus(arrayParents);
  }, []);
  useEffect(() => {
    userEvaluationApiService.getAllDepartmentEvaluation(departmentConditon, { callBack, errorCallBack }); // get department
  }, [departmentConditon]);
  const setFirsrLoading = () => {
    setFirstLoad(true);
  };

  /** Chức năng xuất file excel*/

  const dispatch = useDispatch<AppDispatch>();

  const { isExporting } = useSelector((state: RootState) => state.excelStore);

  const downloadFileDirectly = (jobId: string) => {
    dispatch(finishExport());

    setTimeout(() => {
      if (!navigator.onLine) {
        dispatch(errorExport());

        return;
      }

      const year = dayjs(condition.year, 'YYYY').format('YYYY');
      const periodEvaluate = condition.periodEvaluate;
      const downloadUrl =
        (process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_API_URL
          : `http://localhost:${process.env.PORT}`) +
        `/api/v1/f5/management-evaluation-history/excel/download?jobId=${jobId}&year=${year}&periodIndex=${periodEvaluate}`;

      try {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        dispatch(errorExport());
      }
    }, 1500);

    setTimeout(() => {
      dispatch(resetExport());
    }, 500);
  };

  const handleExcel = async () => {
    // Check mạng trước khi gọi API
    if (!navigator.onLine) {
      dispatch(errorExport());

      return;
    }

    dispatch(startExport());
    const periodEvaluate = condition.periodEvaluate;
    const year = dayjs(condition.year, 'YYYY').format('YYYY');
    const department = condition.department;
    const salaryRank = condition.salaryRank;
    const email = condition.email;
    const departmentSearchs = condition.departmentSearch;
    const status = condition.stringStatus;
    const param = {
      periodEvaluate: periodEvaluate,
      year: year,
      department: department,
      salaryRank: salaryRank,
      email: email,
      departmentSearch: departmentSearchs,
      status: status,
    };
    let res;
    try {
      res = await httpAxios.Post('/api/v1/f5/management-evaluation-history/excel/start', param);
    } catch (e) {
      dispatch(errorExport());

      return;
    }
    if (!res || !res.data || !res.data.jobId) {
      dispatch(errorExport());
    } else {
      const { jobId } = res.data;

      const interval = setInterval(async () => {
        // Nếu mất mạng trong khi đang polling
        if (!navigator.onLine) {
          clearInterval(interval);
          cancelExportPolling();
          dispatch(errorExport());

          return;
        }
        try {
          const status = await fetch(`/api/v1/f5/management-evaluation-history/excel/status?jobId=${jobId}`);

          if (!status || ![200, 201].includes(status.status)) {
            cancelExportPolling();
            dispatch(errorExport());
          } else {
            const { ready, percent, message } = await status.json();

            if (ready) {
              clearInterval(interval);
              cancelExportPolling();
              downloadFileDirectly(jobId);
            } else {
              dispatch(updateExportProgress(percent));
              dispatch(updateExportMessage(message));
            }
          }
        } catch (err) {
          clearInterval(interval);
          cancelExportPolling();
          dispatch(errorExport());

          console.error(err);
        }
      }, 2000);
      // ✅ lưu interval để có thể huỷ sau
      setExportPollingInterval(interval);
    }
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[1]}</Typography.Title>
      <SearchEvaluationComponent
        errorCallBack={errorCallBack}
        callBackListUserEvaluation={callBackListUserEvaluation}
        Form={Form}
        setCondition={setCondition}
        conditions={condition}
        departments={departments}
        isLoading={isLoading}
        setDataState={setDataState}
        url={url}
        navigates={navigate}
        location={location}
        listStatus={listStatus}
        setFirsrLoading={setFirsrLoading}
        status={status}
        listLevels={listLevels}
        setDepartmentCondition={setDepartmentCondition}
        departmentConditon={departmentConditon}
        errorCallBackEvaluation={errorCallBackEvaluation}
        setLoading={setLoading}
      />
      {isFirstLoad && (
        <div style={{ marginBottom: 20 }}>
          <Row>
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                loading={isLoading}
                onClick={exportCSV}
                disabled={!dataStates || dataStates.counts === 0}
              >
                {t('IDS_BUTTON_OUTPUT_EVALUATION_SUMMARY')}
              </MainButton>
              <Tooltip
                title={t('IDS_EXCEL.IDS_TOOLTIP_EXCEL_POINT')}
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <Icon
                  component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                  style={{
                    color: '#6e5b14',
                    fontSize: 18,
                    marginTop: 2,
                    cursor: 'default',
                    marginLeft: 5,
                    marginRight: 15,
                  }}
                />
              </Tooltip>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'center' }}>
              {isExporting ? (
                <Tooltip
                  title={t('IDS_EXCEL.IDS_TOOLTIP_WAITING_EXPORT_EXCEL')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <MainButton
                    type="primary"
                    name="Search"
                    value="txt_evaluation_search"
                    loading={isExporting}
                    onClick={handleExcel}
                    disabled={!dataStates || dataStates.counts === 0}
                  >
                    {t('IDS_LABLE_OUTPUT_LIST_USER')}
                  </MainButton>
                </Tooltip>
              ) : (
                <MainButton
                  type="primary"
                  name="Search"
                  value="txt_evaluation_search"
                  loading={isExporting}
                  onClick={handleExcel}
                  disabled={!dataStates || dataStates.counts === 0}
                >
                  {t('IDS_LABLE_OUTPUT_LIST_USER')}
                </MainButton>
              )}

              <Tooltip
                title={t('IDS_EXCEL.IDS_TOOLTIP_EXCEL_DETAIL')}
                color="#424242"
                overlayInnerStyle={{ fontSize: '11px' }}
              >
                <Icon
                  component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                  style={{
                    color: '#6e5b14',
                    fontSize: 18,
                    marginTop: 2,
                    cursor: 'default',
                    marginLeft: 5,
                    marginRight: 15,
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
        </div>
      )}
      <ListEvaluationTable
        current={condition.current}
        limit={condition.limit}
        url={url}
        conditions={condition}
        isLoading={isLoading}
        dataSources={dataStates}
        setCondition={setCondition}
        setDataState={setDataState}
        errorCallBack={errorCallBack}
        navigates={navigate}
        location={location}
        isFirstLoad={isFirstLoad}
        mode={props.mode}
        callBackListUserEvaluation={callBackListUserEvaluation}
        errorCallBackEvaluation={errorCallBackEvaluation}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ListUserEvaluation;
