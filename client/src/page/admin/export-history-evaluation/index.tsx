import { Form, Typography } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SearchFieldComponent from './component/searchFieldComponent';
import userApiService from '../../../common/api/user.api';
import exportHistoryEvaluationApiService from '../../../common/api/export-history-evaluation';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import moment from 'moment-timezone';
import { useAuth } from '../../../hooks/useAuth';

const ExportHistoryEvalution = () => {
  const [form] = Form.useForm();
  const [listDepartment, setListDepartment] = useState([]) as any;
  const [listDivision, setListDivision] = useState([]) as any;
  const [isLoading, setLoading] = useState<boolean>(false);
  const auth = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [conditions, setConditions] = useState(
    location.state || {
      division: null,
      department: null,
      userInfo: null,
      status: null,
      yearStart: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      yearEnd: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      firstLoad: true,
    },
  );

  useEffect(() => {
    userApiService.getAllDepartmentTypeDivision2({ callBackTypeDivision, errorCallBack });
    userApiService.getAllDepartmentTypeDepartment2({ callBackTypeDepartment, errorCallBack });
    form.setFieldsValue({
      year: [
        dayjs(moment(conditions.yearStart, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(conditions.yearEnd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
    });
    if (conditions.reload) {
      form.setFieldsValue({
        division: conditions.division,
        department: conditions.department,
        userInfo: conditions.userInfo,
        status: conditions.status,
      });
    }
  }, []);

  useEffect(() => {
    if (conditions.firstLoad === false) {
      exportHistoryEvaluationApiService.exportExcelHistoryEvaluation(errorCallBackExport, conditions);
      navigate(location.pathname, {
        state: { ...conditions, firstLoad: true },
      });
    }
  }, [conditions]);

  const callBackTypeDivision = (data: any) => {
    setListDivision(data);
  };

  const callBackTypeDepartment = (data: any) => {
    setListDepartment(data);
  };
  const errorCallBackExport = (bool: boolean) => {
    setLoading(bool);
  };
  const errorCallBack = () => {
    setLoading(false);
  };

  const handleExport = async () => {
    form
      .validateFields()
      .then(() => {
        const division = form.getFieldValue('division');
        const department = form.getFieldValue('department');
        const userInfo = form.getFieldValue('userInfo');
        const status = form.getFieldValue('status');
        const year = form.getFieldValue('year');
        const yearStart = dayjs(year[0], 'YYYY').format('YYYY');
        const yearEnd = dayjs(year[1], 'YYYY').format('YYYY');
        setConditions({
          ...conditions,
          division,
          department,
          userInfo,
          status,
          yearStart,
          yearEnd,
          reload: true,
          firstLoad: false,
        });
      })
      .catch(() => {});
  };

  return (
    <div>
      <Typography.Title level={3}>{(t('IDL_LIST_MENU_F5', { returnObjects: true }) as any)[3]}</Typography.Title>
      <SearchFieldComponent
        divisions={listDivision}
        departments={listDepartment}
        isLoading={isLoading}
        form={form}
        navigates={navigate}
        handleExport={handleExport}
      />
    </div>
  );
};
export default ExportHistoryEvalution;
