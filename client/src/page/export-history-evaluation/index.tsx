import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SearchFieldComponent from './component/searchFieldComponent';
import { EvaluationPeriodHelper } from '../../common/utils/datetime/EvaluationPeriodHelper';
import moment from 'moment-timezone';
import exportHistoryEvaluationEvaluatorApiService from '../../common/api/export-history-evaluation-evaluator';
import { useAuth } from '../../hooks/useAuth';
import evaluatorApiService from '../../common/api/evaluator';
import { useTranslation } from 'react-i18next';

const ExportHistoryEvalutionEvaluator = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const auth = useAuth();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [listDepartment, setListDepartment] = useState<{ name: string; id: number; type: number; value: string }[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [yearPeriods, setYearPeriods] = useState<{ label: string; value: string }[]>([]);
  const [departmentConditon, setDepartmentCondition] = useState<{
    yearEvaluate: number;
    periodEvaluate: number;
  }>({
    yearEvaluate: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
    periodEvaluate:
      EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
  });
  const location = useLocation();
  const [conditions, setConditions] = useState(
    location.state || {
      department: [],
      fullName: '',
      yearStart: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      yearEnd: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      firstLoad: true,
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      yearAndPeriod: `${EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo')}_${
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2
      }`,
    },
  );

  useEffect(() => {
    form.setFieldsValue({
      year: [
        dayjs(moment(conditions.yearStart, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(conditions.yearEnd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
      yearAndPeriod: conditions.yearAndPeriod,
    });
    setDisabledPeriods();
  }, []);

  useEffect(() => {
    evaluatorApiService.getDepartments(departmentConditon, callBackDivisionAndDepartment, errorCallBack);
  }, [departmentConditon]);

  const errorCallBackExport = (bool: boolean) => {
    setLoading(bool);
  };
  const errorCallBack = (bool: boolean) => {
    setLoading(bool);
  };

  const callBackDivisionAndDepartment = (data: { name: string; id: number; type: number; value: string }[]) => {
    setListDepartment(data);

    form.setFieldsValue({
      department: conditions.department,
      fullName: conditions.fullName,
      year: [
        dayjs(moment(departmentConditon.yearEvaluate, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(departmentConditon.yearEvaluate, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
    });
  };

  const handleExport = () => {
    exportHistoryEvaluationEvaluatorApiService.exportExcelHistoryEvaluationEvaluator(errorCallBackExport, {
      ...conditions,
      department: form.getFieldValue('department'),
      fullName: form.getFieldValue('fullName'),
      yearStart: dayjs(form.getFieldValue('year')[0], 'YYYY').format('YYYY'),
      yearEnd: dayjs(form.getFieldValue('year')[1], 'YYYY').format('YYYY'),
      reload: true,
      firstLoad: false,
      yearEvaluate: form.getFieldValue('yearAndPeriod').split('_')[0],
      periodEvaluate: form.getFieldValue('yearAndPeriod').split('_')[1],
    });
  };

  const setDisabledPeriods = () => {
    const dayjsCurrentYear = dayjs().year();
    const dayjsCurrentMonth = dayjs().month() + 1;

    const periodsFirsts = [4, 5, 6, 7, 8, 9];
    const periodsSeconds = [10, 11, 12, 1, 2, 3];

    const arrays: { label: string; value: string }[] = [];
    if (periodsFirsts.includes(dayjsCurrentMonth)) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear - 1}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear - 1}_2`,
        },
      );
    } else if (periodsSeconds.includes(dayjsCurrentMonth) && dayjsCurrentYear === new Date().getFullYear()) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear + 1}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear + 1}_1`,
        },
      );
    } else if (periodsSeconds.includes(dayjsCurrentMonth) && dayjsCurrentYear > new Date().getFullYear()) {
      arrays.push(
        {
          label: `${dayjsCurrentYear}${t('IDS_FIRST_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_1`,
        },
        {
          label: `${dayjsCurrentYear}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear}_2`,
        },
        {
          label: `${dayjsCurrentYear + 1}${t('IDS_SECOND_PERIOD_WITH_YEAR')}`,
          value: `${dayjsCurrentYear + 1}_2`,
        },
      );
    }
    setYearPeriods(arrays);
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[3]}</Typography.Title>
      <SearchFieldComponent
        departmentList={listDepartment}
        isLoading={isLoading}
        setLoading={setLoading}
        form={form}
        handleExport={handleExport}
        yearPeriods={yearPeriods}
        setYearPeriods={setYearPeriods}
        setDepartmentCondition={setDepartmentCondition}
      />
    </div>
  );
};
export default ExportHistoryEvalutionEvaluator;
