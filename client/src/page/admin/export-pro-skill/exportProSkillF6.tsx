import { Form, Typography } from 'antd';
import { t } from 'i18next';
import SearchFieldComponent from './component/searchFieldComponent';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import exportProSkillApiService from '../../../common/api/export-pro-skill';
import dayjs from 'dayjs';
import TableResult from './component/tableResult';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  role: string;
}

const ExportProSkillExcelF6 = (props: Props) => {
  const { role } = props;
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<[]>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFirstLoad, setFirstLoad] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const years = new Date();
  const auth = useAuth();
  years.setFullYear(location.state?.yearDisplayCalendar || years.getFullYear());

  const [condition, setCondition] = useState(
    location.state || {
      year: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      yearDisplayCalendar: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      role: role,
    },
  );

  const errorCallBack = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  // get list data
  const callBackListDep_Template = (data: any) => {
    setDataSources(data);
    setFirstLoad(true);
  };

  useEffect(() => {
    if (location.state && location.state.Reload && location.state.Reload === true) {
      exportProSkillApiService.listDep_Template(role, callBackListDep_Template, errorCallBack, {
        ...condition,
        year: dayjs(condition.year, 'YYYY').format('YYYY'),
        role: role,
      });
    }
  }, []);

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_EXPORT_PRO_SKILL')}</Typography.Title>
      <SearchFieldComponent
        isLoading={isLoading}
        condition={condition}
        setCondition={setCondition}
        Form={Form}
        callBackListDep_Template={callBackListDep_Template}
        errorCallBack={errorCallBack}
        role={role}
        navigates={navigate}
        form={form}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      <TableResult
        dataSources={dataSources}
        isLoading={isLoading}
        condition={condition}
        isFirstLoad={isFirstLoad}
        role={role}
        setSelectedRowKeys={setSelectedRowKeys}
        selectedRowKeys={selectedRowKeys}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        state={location.state}
        errorCallBack={errorCallBack}
      />
    </div>
  );
};
export default ExportProSkillExcelF6;
