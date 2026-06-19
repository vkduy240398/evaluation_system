import { ColumnsType } from 'antd/es/table';
import { ExceptionPeriodType } from '../../../types/pages/exception-period/ExceptionPeriodType';
import { t } from 'i18next';

const exceptionPopupColumn = () => {
  const columns: ColumnsType<ExceptionPeriodType> = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
  ];

  return columns;
};

export default exceptionPopupColumn;
