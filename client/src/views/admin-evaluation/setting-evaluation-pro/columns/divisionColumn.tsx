import { ColumnsType } from 'antd/lib/table';
import { AdminEvaluationProResType } from '../../../../types/pages/admin-evaluation-pro/AdminEvaluationProType';
import { t } from 'i18next';

const divisionColumn = () => {
  const onCell = () => ({ style: { verticalAlign: 'center' } });
  const columns: ColumnsType<AdminEvaluationProResType> = [
    {
      title: t('IDS_TYPE_DIVISION_NAME'),
      dataIndex: 'departmentName',
      key: 'departmentName',
      onCell,

      // width: '50%',
    },

    // {
    //   title: 'type',
    //   dataIndex: 'type',
    //   key: 'type',
    //   width: '50%',
    //   align: 'center',
    //   onCell,
    // },

    // {
    //   title: '専門スキル設定者',
    //   dataIndex: 'skillSetters',
    //   render(text: { fullName: string; id: number }[]) {
    //     if (text.length > 0) {
    //       const skillSetters = text.map((v) => v.fullName);

    //       return skillSetters.join(', ');
    //     }

    //     return <></>;
    //   },
    //   width: '40%',
    //   onCell,
    // },
    // {
    //   title: '専門スキル承認者',
    //   dataIndex: 'skillApprovers',
    //   render(text: { fullName: string; id: number }[]) {
    //     if (text.length > 0) {
    //       const skillSetters = text.map((v) => v.fullName);

    //       return skillSetters.join(', ');
    //     }

    //     return <></>;
    //   },
    //   width: '40%',
    //   onCell,
    // },
  ];

  return columns;
};

export default divisionColumn;
