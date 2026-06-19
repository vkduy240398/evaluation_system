/* eslint-disable @typescript-eslint/naming-convention */
import { Button, Form, Grid, Table, Typography } from 'antd';
import { FormInstance } from 'antd/lib';
import { t } from 'i18next';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RandomHelper } from '../../../../../common/utils/RandomHelper';
import { dataTab17ProSkill } from '../../interfaces/dataSource8_10';
import { ColumnPointPro } from './ColumnPro';

interface formProps {
  form: FormInstance;
  dataSource: dataTab17ProSkill;
  setDataSource: Dispatch<SetStateAction<dataTab17ProSkill>>;
  isEdit: any;
  openNotification: any;
  isLoading: boolean;
  dataTabProSkill: any;
  setDataTabProSkill: any;
}

const { useBreakpoint } = Grid;
const ComponentProSkill = (props: formProps) => {
  const screens = useBreakpoint();
  const location = useLocation();
  const [expandedKey, setExpandedKey] = useState<any>([]);

  useEffect(() => {
    if (props.dataTabProSkill.settingProFormula && props.dataTabProSkill.settingProFormula?.length > 0) {
      const expandRows: any[] = [];
      props.dataTabProSkill.settingProFormula?.map((e: any) => {
        expandRows.push(e.key);
      });
      setExpandedKey(expandRows);
    }
  }, [props.isEdit, location.state?.currentTab]);

  const isValueChange = useRef(false);
  useEffect(() => {
    const arr: any = [];
    props.dataTabProSkill.settingProFormula?.forEach((e: any, _index: any) => {
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
  }, [props.dataTabProSkill]);

  const pointProColumns = ColumnPointPro({
    isEdit: props.isEdit,
    form: props.form,
    dataSource: props.dataSource,
    setDataSource: props.setDataSource,
    isLoading: props.isLoading,
    dataTabProSkill: props.dataTabProSkill,
    setDataTabProSkill: props.setDataTabProSkill,
  });

  // const difficultyColumns = (index: any) =>
  //   ColumnProDiff({
  //     index: index,
  //     openNotification: props.openNotification,
  //     form: props.form,
  //     dataSource: props.dataSource,
  //     setDataSource: props.setDataSource,
  //     isLoading: props.isLoading,
  //     isEdit: props.isEdit,
  //     isValueChange: isValueChange,
  //     dataTabProSkill: props.dataTabProSkill,
  //     setDataTabProSkill: props.setDataTabProSkill,
  //   });

  // const expandedRowRender = (record: any, index: any) => {
  //   return (
  //     <Table
  //       size="small"
  //       dataSource={record.settingProFormulaSub}
  //       columns={difficultyColumns(index)}
  //       pagination={false}
  //       bordered
  //       locale={{
  //         emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
  //       }}
  //     />
  //   );
  // };

  // const onTableRowExpand = (expanded: any, record: any) => {
  //   let keys = [...expandedKey];
  //   if (expanded && expanded === true) {
  //     keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
  //   } else {
  //     keys = expandedKey.filter((item: any) => item !== record.key);
  //   }
  //   setExpandedKey(keys);
  // };

  return (
    <div>
      <Form labelCol={{ xl: { span: 2 } }} labelAlign="left" component={false} form={props.form} preserve={false}>
                {/* <Typography.Title level={4}>{t('IDS_DIFFICULTY')}</Typography.Title>
        <Table
          size="small"
          scroll={{ x: screens.xs ? 1000 : undefined }}
          dataSource={props.dataSource.settingProFormula}
          columns={ColumnProFormula({
            isEdit: props.isEdit,
            form: props.form,
            dataSource: props.dataSource,
            setDataSource: props.setDataSource,
            isLoading: props.isLoading,
            dataTabProSkill: props.dataTabProSkill,
            setDataTabProSkill: props.setDataTabProSkill,
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
        />
        {props.isEdit && (
          <Button
            type="primary"
            className="button-normal"
            onClick={() => {
              // const dataList = [...(props.dataSource.settingProFormula || [])];
              const dataListTab = [...(props.dataTabProSkill.settingProFormula || [])];

              if (dataListTab.length < 10) {
                dataListTab.push({
                  key: RandomHelper.randomString(32),
                  settingProFormulaSub: [{ key: RandomHelper.randomString(32), totalItem: 1 }],
                });
                props.setDataSource({ ...props.dataSource, settingProFormula: dataListTab });
                props.setDataTabProSkill({ ...props.dataTabProSkill, settingProFormula: dataListTab });
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
          dataSource={props.dataSource.settingPointPro?.filter((el: any) => el.type === 3)}
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
              // const dataList = [...(props.dataSource.settingPointPro || [])];
              const dataListTab = [...(props.dataTabProSkill.settingPointPro || [])];

              // range 0 - 10 -> 11 rows
              if (dataListTab.length < 11) {
                dataListTab.push({
                  key: RandomHelper.randomString(32),
                  type: 3,
                });
                props.setDataSource({ ...props.dataSource, settingPointPro: dataListTab });
                props.setDataTabProSkill({ ...props.dataTabProSkill, settingPointPro: dataListTab });
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
