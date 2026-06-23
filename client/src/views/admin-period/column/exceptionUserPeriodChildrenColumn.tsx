import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Button from 'antd/es/button';
import Dropdown from 'antd/es/dropdown';
import { MenuProps } from 'antd/es/menu';
import { t } from 'i18next';

// ** Antd Imports Icons
import { CaretUpOutlined, UndoOutlined } from '@ant-design/icons/lib/icons';
import { Cascader, Row, Tooltip } from 'antd';
import { UserPeriodExceptionChildrenType } from '../../../types/api/adminPeriodType';
import { compareDateEvaluation } from '../../../common/util';
interface Props {
  handleMoveDetail?: (key: any) => void;
  isDisable?: boolean;
  handleOpenSendMail?: (type: 0 | 1, lType: number, record: UserPeriodExceptionChildrenType) => void;
  isFixed?: any;
  buttonShowMore?: any;
  dataEvaluations?: UserPeriodExceptionChildrenType[];
  setIsOpenUndo?: any;
  setDataUndo?: any;
  isEvaluationTime?: any;
}
const exceptionUserPeriodChildrenColumn = (props: Props) => {
  const { handleOpenSendMail, isFixed, buttonShowMore, dataEvaluations, setIsOpenUndo, setDataUndo, isEvaluationTime } =
    props;

  const goalItems: MenuProps['items'] | any = (levelType: number, record: UserPeriodExceptionChildrenType) => [
    {
      key: `Send mail now`,
      label: t('IDS_SEND_MAIL_NOW'),
      onClick() {
        handleOpenSendMail && handleOpenSendMail(0, levelType, record);
      },
    },
    {
      key: 'Send mail with setting time',
      label: t('IDS_SEND_MAIL_SETTING_TIME'),
      onClick() {
        handleOpenSendMail && handleOpenSendMail(1, levelType, record);
      },
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const,
      width: 40,
      render(_, record) {
        const isEvaluationTimeUser = compareDateEvaluation(
          record.timeCommon?.dateEvaluationStart,
          record.timeCommon?.dateEvaluationEnd,
        );
        const isEvaluationTimeDepartment = compareDateEvaluation(
          record.timeCommon?.dateEvaluationDepartmentStart,
          record.timeCommon?.dateEvaluationDepartmentEnd,
        );

        // if (record.creationUser !== null && record.status === 0 && record.createdByCronjob !== 1)
        return (
          <Tooltip placement="top" title={t('IDS_UNDO_EXCEPTION_TOOLTIP')}>
            <Button
              icon={<UndoOutlined />}
              style={{ color: '#007240 ' }}
              onClick={() => {
                setDataUndo(record);
                setIsOpenUndo(true);
              }}
              disabled={isEvaluationTimeUser || isEvaluationTimeDepartment || isEvaluationTime}
            />
          </Tooltip>
        );
      },
    },
    {
      title: t('IDS_COMMON_USER_INFO'),
      dataIndex: 'companyName',
      key: 'companyName',

      width: '18%',
      align: 'left',

      render(text, record) {
        const companyName = record?.companyName;
        const divisionName = record?.divisionName;
        const departmentName = record?.departmentName;

        return (
          <>
            {companyName && <div style={{ textAlign: 'left' }}>会社: {companyName}</div>}
            {divisionName && <div style={{ textAlign: 'left' }}>部署: {divisionName}</div>}
            {departmentName && <div style={{ textAlign: 'left' }}>課名: {departmentName}</div>}
          </>
        );
      },

      // onCell(value: any) {
      //   if (value.isColSpan) return { colSpan: 12 };

      //   return {};
      // },
    },

    // {
    //   title: t('IDS_DEPARTMENT'),
    //   dataIndex: 'divisionName',
    //   key: 'divisionName',

    //   width: '150px',

    //   render(text) {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },

    //   onCell(value: any) {
    //     if (value.isColSpan) return { colSpan: 0 };

    //     return {};
    //   },
    // },
    // {
    //   title: t('IDS_TYPE_DEPARTMENT_NAME'),
    //   dataIndex: 'departmentName',
    //   key: 'departmentName',
    //   width: '150px',

    //   render(text) {
    //     return <div style={{ textAlign: 'left' }}>{text}</div>;
    //   },

    //   onCell(value: any) {
    //     if (value.isColSpan) return { colSpan: 0 };

    //     return {};
    //   },
    // },
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'period',
      key: 'period',
      width: 120,
      align: 'center',

      render(_, record) {
        const startTime = record.periodStart ? dayjs(record.periodStart, 'YYYY/M') : null;
        const endTime = record.periodEnd ? dayjs(record.periodEnd, 'YYYY/M') : null;

        return `${startTime?.format('YYYY/M')} ～ ${endTime?.format('YYYY/M')}`;
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },

    {
      title: t('IDS_CALCULATED_RATIO'),
      dataIndex: 'percentPoint',
      key: 'percentPoint',
      align: 'center' as const,
      width: 50,

      render(text, _) {
        return text;
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      key: 'level',
      align: 'center' as const,
      width: 30,

      render(text) {
        return text;
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },
    {
      title: t('IDS_EVALUATION_SKILL'),

      // dataIndex: 'flagSkill',
      key: 'level',
      align: 'center' as const,
      width: 60,

      render(text) {
        return text.flagSkill === 1 ? t('IDS_HAVE') : t('IDS_NOT_HAVE');
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },

    {
      title: t('IDS_IMPLEMENT_GOAL'),
      dataIndex: 'dateCreationGoalStartEnd',
      key: 'dateCreationGoalStartEnd',
      width: 150,
      align: 'center',

      render(_, record) {
        const startTime = record.dateCreationGoalStart === undefined ? null : record.dateCreationGoalStart;
        const endTime = record.dateCreationGoalEnd === undefined ? null : record.dateCreationGoalEnd;
        if (startTime && endTime)
          return (
            <>
              <>{`${startTime} ～ ${endTime}`}</>
              <Dropdown
                trigger={['click']}
                menu={{ items: goalItems(27, record) }}
                placement="topLeft"
                key={'drop-down-key-3'}
                disabled={record.isAddNew || isFixed}
              >
                <Button className="button-normal" type="primary" size="middle">
                  {t('IDS_SEND_MAIL')}
                  <CaretUpOutlined />
                </Button>
              </Dropdown>
            </>
          );
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },
    {
      title: t('IDS_EVALUATION_IMPLEMENTATION'),
      dataIndex: 'dateEvaluationStartEnd',
      key: 'dateEvaluationStartEnd',
      width: 150,
      align: 'center',

      render(_, record) {
        const startTime = record.dateEvaluationStart === undefined ? null : record.dateEvaluationStart;
        const endTime = record.dateEvaluationEnd === undefined ? null : record.dateEvaluationEnd;
        if (startTime && endTime)
          return (
            <>
              <>{`${startTime} ～ ${endTime}`}</>

              <Dropdown
                trigger={['click']}
                menu={{ items: goalItems(28, record) }}
                placement="topLeft"
                key={'drop-down-key-3'}
                disabled={record.isAddNew || isFixed}
              >
                <Button className="button-normal" type="primary" size="middle">
                  {t('IDS_SEND_MAIL')}
                  <CaretUpOutlined />
                </Button>
              </Dropdown>
            </>
          );
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },
    {
      title: t('IDS_EVALUATOR'),
      dataIndex: 'evaluator05',
      key: 'evaluator05',
      width: 150,
      render(text, record) {
        const evaluator05 = record?.evaluator05Name;
        const evaluator10 = record?.evaluator10Name;
        const evaluator20 = record?.evaluator20Name;

        return (
          <>
            {evaluator05 && <div style={{ textAlign: 'left' }}>仮 : {evaluator05}</div>}
            {evaluator10 && <div style={{ textAlign: 'left' }}>一次 : {evaluator10}</div>}
            {evaluator20 && <div style={{ textAlign: 'left' }}>二次 : {evaluator20}</div>}
          </>
        );
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'template',
      key: 'template',
      align: 'center' as const,

      width: '300px',

      render: (_text: any, record: any, _index: any) => {
        if (record.skillUser?.length > 0) {
          const skills = record.skillUser.map((v: any) => v.skill.name);

          const options: { skillName: string }[] = [];
          const defaultValueList: string[] = [];

          skills.forEach((item: any) => {
            options.push({
              skillName: item,
            });
            defaultValueList.push(item.split(','));
          });

          return (
            <>
              <Row>
                <Cascader
                  style={{ width: '80%' }}
                  multiple
                  allowClear={false}
                  maxTagCount="responsive"
                  value={defaultValueList}
                  open={false}
                  suffixIcon
                  removeIcon
                />
                {typeof buttonShowMore === 'function' ? buttonShowMore(options) : null}
              </Row>
            </>
          );
        }

        return <></>;
      },

      onCell(value: any) {
        if (value.isColSpan) return { colSpan: 0 };

        return {};
      },
    },

    // {
    //   title: t('IDS_EVALUATOR_1'),
    //   dataIndex: 'evaluator10',
    //   key: 'evaluator10',
    //   width: 150,

    //   render(text) {
    //     return text;
    //   },

    //   onCell(value: any) {
    //     if (value.isColSpan) return { colSpan: 0 };

    //     return {};
    //   },
    // },
    // {
    //   title: t('IDS_EVALUATOR_2'),
    //   dataIndex: 'evaluator20',
    //   key: 'evaluator20',
    //   width: 150,
    //   render(text) {
    //     return text;
    //   },

    //   onCell(value: any) {
    //     if (value.isColSpan) return { colSpan: 0 };

    //     return { colSpan: 2, style: { borderRight: 0 } };
    //   },
    // },
  ];

  return columns.filter((v) => (dataEvaluations?.length !== 1 ? v?.key !== 'action' : v));
};

export default exceptionUserPeriodChildrenColumn;
