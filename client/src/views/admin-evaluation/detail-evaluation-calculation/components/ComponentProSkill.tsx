/* eslint-disable @typescript-eslint/naming-convention */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, Table, Typography, Form, Grid } from 'antd';
import { t } from 'i18next';
import { DetailEvaluationCalculationDto } from '../../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { ColumnPointPro, ColumnProFormula } from '../column/ColumnPro';
import { RandomHelper } from '../../../../common/utils/RandomHelper';
import { useLocation } from 'react-router-dom';
import { ColumnProDiff } from '../column/ColumnProDiff';

interface formProps {
  form: any;
  dataSource: DetailEvaluationCalculationDto;
  setDataSource: Dispatch<SetStateAction<DetailEvaluationCalculationDto>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;
const ComponentProSkill = (props: formProps) => {
  const save = () => {};
  const screens = useBreakpoint();
  const location = useLocation();
  const [expandedKey, setExpandedKey] = useState<any>([]);

  useEffect(() => {
    if (props.dataSource.settingProFormula && props.dataSource.settingProFormula?.length > 0) {
      const expandRows: any[] = [];
      props.dataSource.settingProFormula?.map((e) => {
        expandRows.push(e.key);
      });
      setExpandedKey(expandRows);
    }
  }, [props.isEdit, props.dataSource.updatedTime, location.state?.currentTab]);

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataSource.settingProFormula?.forEach((e: any, _index: any) => {
      e.settingProFormulaSub?.forEach((eSub: any, _indexSub: any) => {
        const countDuplicate =
          e.settingProFormulaSub?.filter((num: any) => eSub.totalItem === num.totalItem && num.totalItem !== 0)
            .length || 0;
        if (countDuplicate > 1 || eSub.totalItem > 0) {
          arr.push(`input_totalitem_${eSub.key}`);
        }
      });
    });

    if (isValueChange.current) {
      props.form.validateFields(arr);
      isValueChange.current = false;
    }
  }, [props.dataSource]);

  const pointProColumns = ColumnPointPro({
    isEdit: props.isEdit,
    form: props.form,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
  });

  const difficultyColumns = (index: any) =>
    ColumnProDiff({
      index: index,
      openNotification: props.openNotification,
      form: props.form,
      dataSource: props.dataSource,
      setDataSource: props.setDataSource,
      isLoading: props.isLoading,
      isEdit: props.isEdit,
      isValueChange: isValueChange,
    });

  //   [
  //     {
  //       title: t('IDS_NUMBER_ITEM'),
  //       dataIndex: 'totalItem',
  //       key: 'totalItem',
  //       align: 'left' as const,
  //       width: '200px',
  //       render: (text: any, _record: any, indexSub: any) => {
  //         return !props.isEdit ? (
  //           <div style={{ whiteSpace: 'pre-wrap' }}>{'>=' + text}</div>
  //         ) : (
  //           <div style={{ whiteSpace: 'pre-wrap' }}>
  //             <Row justify={'center'} align={'middle'}>
  //               <Form.Item
  //                 initialValue={text ? text : ''}
  //                 name={`input_totalitem_${_record.key}`}
  //                 style={{ margin: 0 }}
  //                 required={true}
  //                 rules={[
  //                   {
  //                     validator: async (_, value) => {
  //                       if (!value && value === 0)
  //                         return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
  //                       else {
  //                         if (value < 1)
  //                           return Promise.reject(
  //                             new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMA').replace('{min value}', '1')),
  //                           );
  //                         if (value > 100) {
  //                           return Promise.reject(
  //                             new Error(t('MESSAGE.COMMON.IDM_MAX_VALUE').replace('{max value}', '100')),
  //                           );
  //                         }
  //                         if (!isNumber.test(value)) {
  //                           return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
  //                         }
  //                       }
  //                     },
  //                   },
  //                 ]}
  //               >
  //                 <Input
  //                   defaultValue={text ? text : ''}
  //                   disabled={indexSub === 0 ?? true}
  //                   style={{ width: '100%' }}
  //                   maxLength={3}
  //                   // controls={false}
  //                   prefix=">="
  //                   onChange={(e) => {
  //                     const dataTemp = [...(props.dataSource.settingProFormula || [])];
  //                     const dataSubTemp = [...(dataTemp[index].settingProFormulaSub || [])];
  //                     dataSubTemp[indexSub] = { ...dataSubTemp[indexSub], totalItem: Number(e.target.value) };
  //                     dataTemp[index] = { ...dataTemp[index], settingProFormulaSub: [...dataSubTemp] };
  //                     startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp }));
  //                   }}
  //                 />
  //               </Form.Item>
  //             </Row>
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: t('IDS_COEFFICIENT'),
  //       dataIndex: 'coefficient',
  //       key: 'coefficient',
  //       render: (text: any, _record: any, indexSub: any) => {
  //         return !props.isEdit ? (
  //           <div style={{ whiteSpace: 'pre-wrap' }}>{text ? parseFloat(text) : text}</div>
  //         ) : (
  //           <Form.Item
  //             initialValue={text ? parseFloat(text) : ''}
  //             name={`input_coef_${_record.key}`}
  //             style={{ margin: 0 }}
  //             rules={[
  //               {
  //                 validator: async (_, value) => {
  //                   if (!value || value === '')
  //                     return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()));
  //                   else {
  //                     if (!isDecimalNumber.test(value)) {
  //                       return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_INVALID_NUMBER').toString()));
  //                     }
  //                     if (value < 1) {
  //                       return Promise.reject(
  //                         new Error(t('MESSAGE.COMMON.IDM_MIN_VALUE_DECIMA').replace('{min value}', '1.0')),
  //                       );
  //                     }
  //                     if (value > 10) {
  //                       return Promise.reject(
  //                         new Error(t('MESSAGE.COMMON.IDM_DECIMAL_MAX_VALUE').replace('{max value}', '10.0')),
  //                       );
  //                     }
  //                   }
  //                 },
  //               },
  //             ]}
  //           >
  //             <Input
  //               maxLength={6}
  //               defaultValue={text ? parseFloat(text) : ''}
  //               onChange={(e) => {
  //                 const dataTemp = [...(props.dataSource.settingProFormula || [])];
  //                 const dataSubTemp = [...(dataTemp[index].settingProFormulaSub || [])];
  //                 dataSubTemp[indexSub] = {
  //                   ...dataSubTemp[indexSub],
  //                   coefficient: Number(e.target.value),
  //                 };
  //                 dataTemp[index] = { ...dataTemp[index], settingProFormulaSub: [...dataSubTemp] };
  //                 startTransition(() => props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp }));
  //               }}
  //             />
  //           </Form.Item>
  //         );
  //       },
  //     },
  //     {
  //       title: t('IDS_ACTION'),
  //       dataIndex: 'action',
  //       key: 'action',
  //       width: '100px',
  //       align: 'center' as const,
  //       render: (text: any, record: any, indexSub: any) => {
  //         return (
  //           <Space size={'middle'}>
  //             <Button
  //               icon={<PlusOutlined style={{ color: '#007240 ' }} />}
  //               onClick={async () => {
  //                 const dataTemp = [...(props.dataSource.settingProFormula || [])];
  //                 const dataSubTemp = [...(dataTemp[index].settingProFormulaSub || [])];

  //                 if (dataSubTemp.length < 10) {
  //                   dataSubTemp.push({
  //                     key: RandomHelper.randomString(32),
  //                     formulaId: props.dataSource.settingProFormula![index].id,
  //                     totalItem: undefined,
  //                     coefficient: undefined,
  //                   });
  //                   dataTemp[index] = { ...dataTemp[index], settingProFormulaSub: [...dataSubTemp] };
  //                   props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp });
  //                 } else {
  //                   props.openNotification(
  //                     'bottomRight',
  //                     t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'),
  //                   );
  //                 }
  //               }}
  //               loading={props.isLoading}
  //             ></Button>
  //             {indexSub !== 0 || !record.totalItem ? (
  //               <Button
  //                 icon={<CloseOutlined style={{ color: 'red' }} />}
  //                 onClick={async () => {
  //                   const dataTemp = [...(props.dataSource.settingProFormula || [])];
  //                   const dataSubTemp = [...(dataTemp[index].settingProFormulaSub || [])];
  //                   const dataList = dataSubTemp.filter((item: any) => item.key !== record.key);
  //                   dataTemp[index] = { ...dataTemp[index], settingProFormulaSub: [...dataList] };
  //                   props.setDataSource({ ...props.dataSource, settingProFormula: dataTemp });
  //                 }}
  //                 loading={props.isLoading}
  //               ></Button>
  //             ) : (
  //               <></>
  //             )}
  //           </Space>
  //         );
  //       },
  //     },
  //   ].filter((v) => {
  //     if (!props.isEdit) {
  //       return v.key !== 'action';
  //     }

  //     return v.key;
  //   });

  const expandedRowRender = (record: any, index: any) => {
    return (
      <Table
        size="small"
        dataSource={record.settingProFormulaSub}
        columns={difficultyColumns(index)}
        pagination={false}
        bordered
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
    );
  };

  const onTableRowExpand = (expanded: any, record: any) => {
    let keys = [...expandedKey];
    if (expanded && expanded === true) {
      keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
    } else {
      keys = expandedKey.filter((item: any) => item !== record.key);
    }
    setExpandedKey(keys);
  };

  return (
    <div>
      <Form
        labelCol={{ xl: { span: 2 } }}
        labelAlign="left"
        onFinish={save}
        component={false}
        form={props.form}
        preserve={false}
      >
        {/* <Typography.Title level={4}>{t('IDS_DIFFICULTY')}</Typography.Title> */}
        {/* <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          dataSource={props.dataSource.settingProFormula}
          columns={ColumnProFormula({
            isEdit: props.isEdit,
            form: props.form,
            dataSource: props.dataSource,
            setDataSource: props.setDataSource,
            isLoading: props.isLoading,
          })}
          pagination={false}
          bordered
          style={{ marginBottom: 10 }}
          expandable={{
            onExpand: onTableRowExpand,
            expandedRowKeys: expandedKey,
            expandedRowRender: expandedRowRender,
          }}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
               /> */}
        {/* {props.isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              const dataList = [...(props.dataSource.settingProFormula || [])];

              if (dataList.length < 10) {
                dataList.push({
                  key: RandomHelper.randomString(32),
                  versionId: props.dataSource.id,
                  settingProFormulaSub: [{ key: RandomHelper.randomString(32), totalItem: 1 }],
                });
                props.setDataSource({ ...props.dataSource, settingProFormula: dataList });
              } else {
                props.openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'),
                );
              }
            }}
            style={{ marginBottom: 30 }}
            loading={props.isLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
                )} */}

        <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
        <Table
          bordered
          scroll={{ x: screens.xs ? 1000 : undefined }}
          columns={pointProColumns}
          dataSource={props.dataSource.settingPointPro?.filter((el) => el.type === 3)}
          pagination={false}
          size="small"
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
        {props.isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              const dataList = [...(props.dataSource.settingPointPro || [])];

              // range 0 - 10 -> 11 rows
              if (dataList.length < 11) {
                dataList.push({
                  key: RandomHelper.randomString(32),
                  type: 3,
                  versionId: props.dataSource.id,
                });
                props.setDataSource({ ...props.dataSource, settingPointPro: dataList });
              } else {
                props.openNotification(
                  'bottomRight',
                  t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '11'),
                );
              }
            }}
            style={{ marginTop: 10 }}
            loading={props.isLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ComponentProSkill;
