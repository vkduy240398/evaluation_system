/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import { Button, Table, Typography, message } from 'antd';
import EvaluationAdditionaDepartmentColumn from './evaluationAdditionalDepartmentColumn';
import { AppDispatch, RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import { Grid } from 'antd/lib';
import {
  EvaluationAdditionalAchievement,
  EvaluatorInfo,
  SettingAchievementAdditional,
} from '../interfaces/response.interface';
import {
  calculateAdditionTotal,
  calculateAdditionTotal05,
  calculateAdditionTotal1,
  calculateAdditionTotal2,
} from '../../../../store/total';
import { get2WithoutRound } from './valildateInputField';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { useDispatch } from 'react-redux';
interface Props {
  status: number;
  role: string;
  additionData: EvaluationAdditionalAchievement[];
  setAdditionData: (data: EvaluationAdditionalAchievement[]) => void;
  allowSeeList: EvaluatorInfo[];
  Form: any;
  form: any;
  listEvalutor: EvaluatorInfo[];
  isEvaluationDate: boolean;
  settingAchievementAdditional: SettingAchievementAdditional[];
  isLoading: boolean;
  location: any;
}
const EvaluationAdditionalDepartment: React.FC<any> = (props: Props) => {
  const {
    status,
    additionData,
    setAdditionData,
    allowSeeList,
    Form,
    form,
    role,
    listEvalutor,
    isEvaluationDate,
    settingAchievementAdditional,
    isLoading,
    location,
  } = props;

  const store = useSelector((state: RootState) => state.calculateTotal);
  const dispatch = useDispatch<AppDispatch>();
  const storeLoading = useSelector((state: RootState) => state.loading);
  const [record, setRecord] = useState<any>();

  const [isOpenPopUpConfirm, setIsOpenPopUpConfirm] = useState<boolean>(false);

  const comment05Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '0.5';
  });

  const comment1Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '1.0';
  });

  const comment2Info = listEvalutor.filter((item: EvaluatorInfo) => {
    return item.evaluationOrder === '2.0';
  });

  let isDisplay05: number | boolean = role === 'admin' && comment05Info.length;

  let isDisplay1: number | boolean = role === 'admin' && comment1Info.length;

  let isDisplay2: number | boolean = role === 'admin' && comment2Info.length;

  const breaks = Grid.useBreakpoint();
  allowSeeList.forEach((item: EvaluatorInfo) => {
    if (item.evaluationOrder === '0.5') isDisplay05 = true;
    if (item.evaluationOrder === '1.0') isDisplay1 = true;
    if (item.evaluationOrder === '2.0') isDisplay2 = true;
  });
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Info.length > 0){
  //   isDisplay05 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Info.length > 0){
  //   isDisplay1 = true;
  // }
  // if(location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Info.length > 0){
  //   isDisplay2 = true;
  // }
  const handleDeleteAdditional = (record: any) => {
    const dataList = additionData.filter((item: EvaluationAdditionalAchievement) => item.key !== record.key);
    for (let i = 0; i < dataList.length; i++) {
      dataList[i].itemNo = i + 1;
      dataList[i].key = i + 1;
    }
    dispatch(calculateAdditionTotal2([dataList, settingAchievementAdditional]));
    dispatch(calculateAdditionTotal1([dataList, settingAchievementAdditional]));
    dispatch(calculateAdditionTotal05([dataList, settingAchievementAdditional]));
    dispatch(calculateAdditionTotal([dataList, settingAchievementAdditional]));

    // // dispatch(calculateUserTotal(achievementData));
    setAdditionData([...dataList]);
    setIsOpenPopUpConfirm(false);
  };
  useEffect(() => {
    for (let i = 0; i < additionData.length; i++) {
      form.setFieldsValue({ [`additionTitle_${i + 1}`]: additionData[i]?.titleAdditional });
      form.setFieldsValue({ [`additionAchievementStatus_${i + 1}`]: additionData[i]?.achievementStatus });
      form.setFieldsValue({ [`additionReasonComment_${i + 1}`]: additionData[i]?.reasonComment });
      form.setFieldsValue({ [`additionPointUser_${i + 1}`]: additionData[i]?.pointUser });

      form.setFieldsValue({ [`additionPointEvaluator05_${i + 1}`]: additionData[i]?.pointEvaluator05 });
      form.setFieldsValue({ [`additionPointEvaluator1_${i + 1}`]: additionData[i]?.pointEvaluator1 });
      form.setFieldsValue({ [`additionPointEvaluator2_${i + 1}`]: additionData[i]?.pointEvaluator2 });
    }
  }, [additionData]);

  return (
    <>
      <Typography.Title level={4}>{t('IDS_ADDITIONAL_GOALS')}</Typography.Title>
      <Form form={form}>
        <Table
          size="small"
          style={{ wordBreak: 'break-all' }}
          dataSource={additionData}
          loading={isLoading}
          columns={EvaluationAdditionaDepartmentColumn({
            additionData: additionData,
            status: props.status,
            setAdditionData: setAdditionData,
            role: props.role,
            Form: Form,
            allowSeeList: allowSeeList,
            maxOrder: store.maxOrder,
            form: form,
            listEvalutor: listEvalutor,
            isEvaluationDate: isEvaluationDate,
            settingAchievementAdditional: settingAchievementAdditional,
            store: store,
            setIsOpenPopUpConfirm: setIsOpenPopUpConfirm,
            setRecord: setRecord,
            location,
          })}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
          summary={() =>
            additionData.length ? (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="center" className="cell-total">
                    {t('IDS_SUB_TOTAL')}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={1} align="center" className="cell-total">
                    {store.additionSum !== null ? get2WithoutRound(store.additionSum) : ''}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay05 && status > 53) || (status == 100 && comment05Info[0]) ? 1 : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {store.additionSum05 !== null ? get2WithoutRound(store.additionSum05) : ''}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay1 && status > 56) || (status == 100 && comment1Info[0]) ? 1 : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {store.additionSum1 !== null ? get2WithoutRound(store.additionSum1) : ''}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={
                      (role !== 'user' && isDisplay2 && status > 59) || (status == 100 && comment2Info[0]) ? 1 : 0
                    }
                    align="center"
                    className="cell-total"
                  >
                    {store.additionSum2 !== null ? get2WithoutRound(store.additionSum2) : ''}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            ) : (
              <></>
            )
          }
          pagination={false}
          bordered
          scroll={{ x: !breaks.lg ? 900 : undefined }}
        />
        {((props.role === 'user' && [50, 51, 52].includes(props.status) && isEvaluationDate && !store.isDisable) ||
          (props.role === 'evaluator' &&
            (([54, 55].includes(status) && store.maxOrder === '0.5' && isEvaluationDate) ||
              ([57, 58].includes(status) && store.maxOrder === '1.0' && isEvaluationDate) ||
              ([60, 61].includes(status) && store.maxOrder === '2.0' && isEvaluationDate)))) && (
          <Button
            className="button-normal"
            type="primary"
            size="middle"
            onClick={() => {
              const dataList = [...additionData];
              if (dataList.length < 50) {
                dataList.push({
                  key: dataList.length + 1,
                  itemNo: dataList.length + 1,
                  reasonComment: '',
                  titleAdditional: '',
                  evaluationOrder: Number(store.maxOrder),
                  type: 3,
                });
                setAdditionData(dataList);
              } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', `${50}`));
            }}
            disabled={store.isDisable || isLoading}
            style={{ marginBottom: 15, marginTop: 10 }}
            loading={isLoading || storeLoading.isDetailLoading}
          >
            {t('IDS_BUTTON_ADD')}
          </Button>
        )}
      </Form>
      <ModalCustomComponent
        isOpen={isOpenPopUpConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_DELETE_ADDITIONAL')}
        fnHandleOk={() => {
          handleDeleteAdditional(record);
        }}
        fnHandleCancel={() => setIsOpenPopUpConfirm(false)}
        okText={t('IDS_DELETE') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}

        // loading={isLoading}
      />
    </>
  );
};

export default EvaluationAdditionalDepartment;
