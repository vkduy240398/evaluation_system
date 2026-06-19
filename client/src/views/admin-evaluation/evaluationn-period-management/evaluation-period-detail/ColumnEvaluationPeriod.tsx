import { PlusSquareOutlined, ProfileOutlined } from '@ant-design/icons';
import { Cascader, Checkbox, Row, Tooltip } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';

const ColumnEvaluationPeriod = (
  setOpenPopUp: Dispatch<SetStateAction<boolean>>,
  setUserInfor: Dispatch<any>,
  userInfor: any,
  setData: Dispatch<any>,
  setIsEdit: any,
  showColumnTitle: any,
  isFixed: any,
  setSelectedRowKeys: any,
  selectedRowKeys: any,
  setSelectedRows: any,
  selectedRows: any,
  buttonShowMore: any,
) => {
  return [
    {
      title: showColumnTitle,
      width: '1%',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.userId)}
          disabled={isFixed}
          onChange={(e: any) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.userId]);
              setSelectedRows([...selectedRows, record]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key: any) => key !== record.userId));
              setSelectedRows(selectedRows.filter((row: any) => row.userId !== record.userId));
            }
          }}
        ></Checkbox>
      ),
    },

    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'fullname',
      width: '20%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <>
            <div style={{ textAlign: 'left' }}>{record?.employeeNumber + ': ' + record?.fullName}</div>
            <div style={{ textAlign: 'left' }}>
              {record?.level > 7 ? `目標設定: 2026/05/21 ～ 2026/06/12` : `目標設定: 2026/05/21 ～ 2026/06/12`}
            </div>
            <div style={{ textAlign: 'left' }}>
              {record?.level > 7 ? `評価: 2026/05/21 ～ 2026/06/12` : `評価: 2026/05/21 ～ 2026/06/12`}
            </div>
          </>
        );
      },
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'department',
      width: '15%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        // let value = '';
        // if (record.level >= 1 && record.level <= 7 && record.department) {
        //   value = record.department === null ? '' : record.department.name;
        // } else if (record.level >= 8 && record.level <= 10 && record.division) {
        //   value = record.division === null ? '' : record.division.name;
        // }
        const division =
          record?.childrens?.length > 0 ? record?.childrens[0].divisionName : record?.evaluatorDefault.divisionName;
        const department =
          record?.childrens?.length > 0 ? record?.childrens[0].departmentName : record?.evaluatorDefault.departmentName;

        return (
          <>
            {division && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_DEPARTMENT')}: {division}
              </div>
            )}
            {department && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_TYPE_DEPARTMENT_NAME')}: {department}
              </div>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'center' }}>
            {record?.childrens?.length > 0 ? record?.childrens[0].level : record?.evaluatorDefault.level}
          </div>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_SKILL'),
      dataIndex: 'flagSkill',
      key: 'flagSkill',
      align: 'center' as const,
      width: '6%',
      render: (_text: any, record: any) => {
        return (
          <div>
            {record?.childrens?.length > 0
              ? record?.childrens[0].flagSkill === 1
                ? t('IDS_HAVE')
                : t('IDS_NOT_HAVE')
              : record?.evaluatorDefault.flagSkill === 1
              ? t('IDS_HAVE')
              : t('IDS_NOT_HAVE')}
          </div>
        );
      },
    },
    {
      title: t('IDS_EVALUATOR'),
      dataIndex: 'temp_rating',
      width: '9%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        if (record?.childrens?.length > 0) {
          return <></>;
        }

        const evaluator05 =
          record?.evaluatorDefault === null
            ? ''
            : record?.evaluatorDefault?.evaluator05 === null
            ? ''
            : record?.evaluatorDefault?.evaluator05?.employeeNumber +
              ': ' +
              record?.evaluatorDefault?.evaluator05?.fullName;

        const evaluator1 =
          record?.evaluatorDefault === null
            ? ''
            : record?.evaluatorDefault?.evaluator1 === null
            ? ''
            : record?.evaluatorDefault?.evaluator1?.employeeNumber +
              ': ' +
              record?.evaluatorDefault?.evaluator1?.fullName;
        const evaluator2 =
          record?.evaluatorDefault === null
            ? ''
            : record?.evaluatorDefault?.evaluator2 === null
            ? ''
            : record?.evaluatorDefault?.evaluator2?.employeeNumber +
              ': ' +
              record?.evaluatorDefault?.evaluator2?.fullName;

        return (
          <>
            {evaluator05 && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_POINT_EVALUATOR_0_5')} : {evaluator05}
              </div>
            )}
            {evaluator1 && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_POINT_EVALUATOR_1')} : {evaluator1}
              </div>
            )}
            {evaluator2 && (
              <div style={{ textAlign: 'left' }}>
                {t('IDS_POINT_EVALUATOR_2')} : {evaluator2}
              </div>
            )}
          </>
        );
      },
    },
    {
      title: t('IDS_TEMPLATE'),
      key: 'type-key',
      dataIndex: 'skillDepartments',
      width: '20%',

      render: (_text: any, record: any, _index: any) => {
        if (record?.childrens?.length > 0) {
          return <></>;
        }

        if (record.skillUser?.length > 0) {
          const skills = record?.skillUser
            ?.filter((item: any) => item?.evaluationId == null)
            .map((v: any) => v?.skill?.name);

          const options: { skillName: string }[] = [];
          const defaultValueList: string[] = [];

          skills.forEach((item: any) => {
            options.push({
              skillName: item,
            });
            defaultValueList.push(item.split(','));
          });

          return <>{defaultValueList.toString().substring(0, 100)}</>;
        }

        // }

        return <></>;
      },
    },

    // {
    //   title: t('IDS_EVALUATOR_1'),
    //   dataIndex: 'first_rating',
    //   width: '10%',
    //   align: 'center' as const,
    //   render: (_text: any, record: any, _index: any) => {
    //     return (
    //       <div style={{ textAlign: 'left' }}>
    //         {record?.evaluatorDefault === null
    //           ? ''
    //           : record?.evaluatorDefault?.evaluator1 === null
    //           ? ''
    //           : record?.evaluatorDefault?.evaluator1?.employeeNumber +
    //             ': ' +
    //             record?.evaluatorDefault?.evaluator1?.fullName}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: t('IDS_EVALUATOR_2'),
    //   dataIndex: 'second_rating',
    //   width: '10%',
    //   align: 'center' as const,
    //   render: (_text: any, record: any, _index: any) => {
    //     return (
    //       <div style={{ textAlign: 'left' }}>
    //         {record?.evaluatorDefault === null
    //           ? ''
    //           : record?.evaluatorDefault?.evaluator2 === null
    //           ? ''
    //           : record?.evaluatorDefault?.evaluator2?.employeeNumber +
    //             ': ' +
    //             record?.evaluatorDefault?.evaluator2?.fullName}
    //       </div>
    //     );
    //   },
    // },
  ];
};

export default ColumnEvaluationPeriod;
