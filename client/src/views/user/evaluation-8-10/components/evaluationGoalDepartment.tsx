/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react';
import { Button, Table, Typography, message, Grid, Tooltip, Space } from 'antd';
import EvaluationGoalDepartmentColumn from './evaluationGoalDepartmentColumn';
import EvaluationResultsDepartmentColumn from './evaluationResultsDepartmentColumn';
import TextArea from 'antd/es/input/TextArea';
import { MetaModal } from '../../../../model/MetalModel';
import PopupPointDescription from '../../evaluation-8-10/PopupPointDescription';
import ModalPopup from '../../../../common/ModalPopup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { validateTarget } from './valildateInputField';
import { t } from 'i18next';
import { checkWeight2 } from '../../../../store/total';
import {
  EvaluationInfo,
  EvaluationPersonalAchievement,
  EvaluatorInfo,
  SettingAchievementPersonal,
  SubList,
} from '../interfaces/response.interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { goalsPastEvaluation } from '../../../../page/user/interfaces/interfacesProps';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import dayjs from 'dayjs';
import PopupDepartments from '../../evaluation/PopupDepartments';
interface Props {
  setDataSource: (data: EvaluationPersonalAchievement[]) => void;
  dataSource: EvaluationPersonalAchievement[];
  status: number;
  role: string;
  level: string;
  dataSub: SubList;
  allowSeeList: EvaluatorInfo[];
  Form: any;
  form: any;
  defaultExpandedRowKeys: number[];
  setDefaultExpandedRowKeys: (data: number[]) => void;
  isEvaluationDate: boolean;
  isGoalDate: boolean;
  errorExpandedRowKeys: number[];
  listEvalutor: EvaluatorInfo[];
  errorRowIndexList: number[];
  setExpandedRowKeys2: (data: number[]) => void;
  ExpandedRowKeys2: number[];
  settingAchievementPersonalType2: SettingAchievementPersonal[];
  settingAchievementPersonalType1: SettingAchievementPersonal[];
  isLoading: boolean | undefined;
  location: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  evaluationData: EvaluationInfo;
}

let tempList: number[] = [];

const EvaluationGoalDepartment: React.FC<any> = (props: Props) => {
  const {
    status,
    role,
    dataSource,
    setDataSource,
    allowSeeList,
    Form,
    form,
    defaultExpandedRowKeys,
    setDefaultExpandedRowKeys,
    isEvaluationDate,
    isGoalDate,
    errorExpandedRowKeys,
    listEvalutor,
    errorRowIndexList,
    setExpandedRowKeys2,
    ExpandedRowKeys2,
    settingAchievementPersonalType2,
    settingAchievementPersonalType1,
    isLoading,
    location,
    setLoading,
    evaluationData,
  } = props;
  const store = useSelector((state: RootState) => state.calculateTotal);
  const dispatch = useDispatch<AppDispatch>();
  const [clone, setClone] = useState<{
    isOpen: boolean;
    title: string;
    evaluationGoalList: goalsPastEvaluation[];
    type: number;
  }>({
    isOpen: false,
    title: t('IDS_TITLE_COPY_DEPARTMENT_GOAL'),
    evaluationGoalList: [],
    type: 3,
  });
  const onCell = () => {
    return { style: { verticalAlign: 'top' } };
  };

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

  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 0.5 && comment05Info[0]) {
  //   isDisplay05 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 1 && comment1Info[0]) {
  //   isDisplay1 = true;
  // }
  // if (location.evaluatorOrderExcep && location.evaluatorOrderExcep >= 2 && comment2Info[0]) {
  //   isDisplay2 = true;
  // }

  // const [dataTemp, setDataTemp] = useState([]) as any;
  const [dataSubTemps, setDataSubTemps] = useState([] as SubList[]);

  const expandedRowRender = (_record: any, index: number) => {
    let dataList = [...dataSource];
    dataList = dataList.splice(index, 1);
    const uniqueArray = errorRowIndexList.filter(function (item: number, pos: number) {
      return errorRowIndexList.indexOf(item) == pos;
    });

    if (uniqueArray.includes(index))
      for (let i = 0; i < dataSource.length; i++) {
        if (role === 'evaluator' && (status === 60 || status === 61)) form.validateFields([`2_difficult_${i}`]);
        if (role === 'evaluator' && (status === 57 || status === 58)) form.validateFields([`1_difficult_${i}`]);
        if (role === 'evaluator' && (status === 54 || status === 55)) form.validateFields([`05_difficult_${i}`]);
      }

    return (
      <Table
        size="small"
        style={{ wordBreak: 'break-all' }}
        dataSource={dataList}
        columns={EvaluationGoalDepartmentColumn({
          dataSource: dataSource,
          setDataSource: setDataSource,
          status: status,
          role: role,
          Form: Form,
          allowSeeList: allowSeeList,
          maxOrder: store.maxOrder,
          onOpenAddModal: onOpenAddModal,
          form: form,
          isEvaluationDate: isEvaluationDate,
          isGoalDate: isGoalDate,
          listEvalutor: listEvalutor,
          store: store,
          settingAchievementPersonalType1: settingAchievementPersonalType1,
          setDefaultExpandedRowKeys,
          location,
        })}
        pagination={false}
        bordered
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
    );
  };

  const dataSubTemp: { key: number; evaluationDecision: string; coefficient: number }[] = [];

  if (Array.isArray(settingAchievementPersonalType2)) {
    settingAchievementPersonalType2?.map((item: SettingAchievementPersonal, index: number) => {
      dataSubTemp.push({
        key: index,
        evaluationDecision: '',
        coefficient: item.point,
      });
    });
  }

  const { Text } = Typography;

  const columnsSubTemp = [
    {
      title: (
        <div
          style={{
            fontSize: 13,
          }}
        >
          {t('IDS_EVALUATION_JUDGMENT_INDEX')}
        </div>
      ),
      dataIndex: 'evaluationDecision',
      key: 'evaluationDecision',
      align: 'left' as const,
      onCell,
      render: (text: string, record: SubList, index: number) => {
        return (
          <>
            {role === 'evaluator' ||
            role === 'admin' ||
            ![0, 1, 2].includes(status) ||
            !isGoalDate ||
            store.isDisable ? (
              <Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Text>
            ) : (
              <Form.Item
                name={`index_${record.parentKey}_${record.key}`}
                style={{ verticalAlign: 'top', marginBottom: '0px' }}
                rules={[
                  {
                    validator(_rule: any, value: string) {
                      return validateTarget(value, 1000);
                    },
                  },
                ]}
                initialValue={text}
              >
                <TextArea
                  maxLength={1001}
                  name={`index_${record.parentKey}_${record.key}`}
                  autoSize={{ minRows: 1, maxRows: 100 }}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    dataSource[record.parentKey].evaluationAchievementPersonalSub = {
                      ...dataSource[record.parentKey]?.evaluationAchievementPersonalSub,
                      [index]: {
                        key: index + 1,
                        evaluationDecision: value,
                        coefficient: record.coefficient,
                        parentKey: record.parentKey,
                      },
                    };
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      },
    },
    {
      title: (
        <div
          style={{
            fontSize: 13,
          }}
        >
          {t('IDS_COEFFICIENT')}
        </div>
      ),
      dataIndex: 'coefficient',
      key: 'coefficient',
      align: 'center' as const,
      width: '100px',
      render: (text: string) => {
        return text ? (Number.isInteger(Number(text)) ? Number(text).toFixed(1) : Number(text)) : '';
      },
    },
  ];

  const onExpand = (expanded: boolean, record: EvaluationPersonalAchievement) => {
    tempList = [...defaultExpandedRowKeys];
    if (expanded) tempList.push(record.key);
    else {
      // remove not expanded keys (=false)
      while (tempList.includes(record.key)) {
        const index = tempList.indexOf(record.key);
        if (index > -1) {
          tempList.splice(index, 1);
        }
      }
    }
    setDefaultExpandedRowKeys(tempList);
  };

  const defaultExpandable = {
    expandedRowRender: (record: EvaluationPersonalAchievement, index: number, _indent: any, _expanded: boolean) => {
      const data: SubList[] = [];

      // const sub = record.evaluationAchievementPersonalSub.length
      //   ? record.evaluationAchievementPersonalSub
      //   : dataSubTemp;

      const sub =
        dataSource[record?.evaluationAchievementPersonalSub[0]?.parentKey]?.evaluationAchievementPersonalSub ??
        dataSubTemp;

      Object.keys(sub).forEach((key: any) => {
        data.push({
          key: key,
          achievementPersonalId: sub[key]?.achievementPersonalId,
          coefficient: sub[key]?.coefficient,
          evaluationDecision: sub[key]?.evaluationDecision,
          parentKey: sub[key].parentKey ?? index,
        });
      });

      const uniqueArray = errorExpandedRowKeys.filter(function (item: number, pos: number) {
        return errorExpandedRowKeys.indexOf(item) == pos;
      });
      uniqueArray.forEach((item: number) => {
        for (let i = 0; i < data.length; i++) {
          form.validateFields([`index_${item}_${i}`]);
        }
      });
      for (let i = 0; i < data.length; i++) {
        form.setFieldValue(
          [`index_${record?.evaluationAchievementPersonalSub[0]?.parentKey ?? index}_${i}`],
          data[i].evaluationDecision,
        );
      }

      return (
        <Table
          size="small"
          style={{ wordBreak: 'break-all' }}
          dataSource={data}
          columns={columnsSubTemp}
          pagination={false}
          bordered
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
        />
      );
    },

    onExpand: onExpand,
    expandedRowKeys: defaultExpandedRowKeys,
  };

  const [metaModal, setMetaModal] = useState({
    type: '',
    record: {},
    title: '',
    isOpen: false,
  } as MetaModal);

  const onOpenAddModal = (record: SubList[]) => {
    setMetaModal({
      ...metaModal,
      type: 'add',
      title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
      isOpen: true,
    });
    setDataSubTemps(record);
  };

  const handleCancel = () => {
    setDataSubTemps([]);
    setMetaModal({
      ...metaModal,
      type: '',
      title: '',
      isOpen: false,
    });
  };

  const getFormModal = () => {
    return <PopupPointDescription handleCancel={handleCancel} dataSubTemps={dataSubTemps} />;
  };

  const goalPastAchievement = async () => {
    setClone({
      isOpen: true,
      evaluationGoalList: [],
      title: t('IDS_TITLE_COPY_DEPARTMENT_GOAL'),
      type: 3,
    });
    // const callBack = (
    //   data: {
    //     title: string;
    //     id: number;
    //     achievementValue: string;
    //     method: string;
    //     weight: number;
    //     difficulty: number;
    //     evaluationAchievementPersonalSub: {
    //       evaluationDecision: string;
    //       degree: string;
    //       achievementId: number;
    //       point: string;
    //     }[];
    //   }[],
    // ) => {
    //   setClone({
    //     isOpen: true,
    //     evaluationGoalList: data as goalsPastEvaluation[],
    //     title: t('IDS_TITLE_COPY_DEPARTMENT_GOAL'),
    //     type: 3,
    //   });
    // };

    // const errorCallBack = (isLoading: boolean) => {
    //   setLoading(isLoading);
    // };
    // await userEvaluationApiService.goalsPastEvaluation(
    //   { year: Number(dayjs().format('YYYY')), periodIndex: 1, type: 3 },
    //   callBack,
    //   errorCallBack,
    // );
  };

  return (
    <>
      <div>
        <Typography.Title level={4}>
          <span>{status < 50 ? t('IDS_GOAL_DEPARTMENT') : t('IDS_DEPARTMENT_RESULTS')}</span>
          <Tooltip
            title={t(
              role === 'user' && [0, 1, 2].includes(status)
                ? 'IDS_TOOLTIP_REQUIRED_INPUT_INDEX_EXPLANATION'
                : 'IDS_TOOLTIP_CHECK_INPUT_INDEX_EXPLANATION',
            )}
            overlayInnerStyle={{ fontSize: '11px' }}
          >
            <Icon
              component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'default', paddingLeft: 4 }}
            />
          </Tooltip>
        </Typography.Title>
        {/*  */}
        <Button
          loading={isLoading}
          className="button-normal"
          type="primary"
          size="middle"
          hidden={!(role === 'user' && [0, 1, 2].includes(status)) || !isGoalDate || ![0, 1, 2].includes(status)}
          onClick={goalPastAchievement}
          style={{ marginBottom: '10px' }}
        >
          {t('IDS_BUTTON_COPY_DEPARTMENT_GOAL')}
        </Button>
      </div>
      {(status > 50 || (status === 50 && isEvaluationDate)) && (
        <Form form={form}>
          <Table
            size="small"
            loading={isLoading}
            style={{ wordBreak: 'break-all' }}
            dataSource={dataSource}
            columns={EvaluationResultsDepartmentColumn({
              status: props.status,
              dataSource: dataSource,
              setDataSource: setDataSource,
              role: props.role,
              Form: Form,
              allowSeeList: allowSeeList,
              maxOrder: store.maxOrder,
              listEvalutor: listEvalutor,
              form: form,
              isEvaluationDate: isEvaluationDate,
              settingAchievementPersonalType2: settingAchievementPersonalType2,
              store: store,
              location,
            })}
            pagination={false}
            bordered
            expandable={{
              columnWidth: '1%',
              expandedRowRender,
              expandedRowKeys: ExpandedRowKeys2,
              onExpand(expanded, record) {
                tempList = [...ExpandedRowKeys2];
                if (expanded) tempList.push(record.key);
                else {
                  while (tempList.includes(record.key)) {
                    const index = tempList.indexOf(record.key);
                    if (index > -1) {
                      tempList.splice(index, 1);
                    }
                  }
                }
                setExpandedRowKeys2(tempList);
              },
            }}
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            scroll={{ x: !breaks.lg ? 900 : undefined }}
            summary={() =>
              dataSource.length ? (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="center" className="cell-total">
                      {t('IDS_SUB_TOTAL')}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2} align="center" className="cell-total">
                      {store.userSum ? store.userSum.toFixed(2) : ''}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={2}
                      colSpan={
                        (role !== 'user' && isDisplay05 && status > 53) ||
                        (status == 100 && comment05Info[0] && status > 53)
                          ? 2
                          : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.sumEvaluator05 !== null ? store.sumEvaluator05?.toFixed(2) : ''}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={3}
                      colSpan={
                        (role !== 'user' && isDisplay1 && status > 56) || (status == 100 && comment1Info[0]) ? 2 : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.sumEvaluator1 !== null ? store.sumEvaluator1?.toFixed(2) : ''}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={4}
                      colSpan={
                        (role !== 'user' && isDisplay2 && status > 59) || (status == 100 && comment2Info[0]) ? 2 : 0
                      }
                      align="center"
                      className="cell-total"
                    >
                      {store.sumEvaluator2 !== null ? store.sumEvaluator2?.toFixed(2) : ''}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              ) : (
                <div></div>
              )
            }
          />
        </Form>
      )}
      {(status < 50 || (status === 50 && !isEvaluationDate)) && (
        <>
          <Form form={form}>
            <Table
              size="small"
              style={{ wordBreak: 'break-all' }}
              dataSource={dataSource}
              columns={EvaluationGoalDepartmentColumn({
                dataSource: dataSource,
                setDataSource: setDataSource,
                status: status,
                role: role,
                Form: Form,
                allowSeeList: allowSeeList,
                maxOrder: store.maxOrder,
                onOpenAddModal: onOpenAddModal,
                form: form,
                isEvaluationDate: isEvaluationDate,
                isGoalDate: isGoalDate,
                listEvalutor: listEvalutor,
                store: store,
                settingAchievementPersonalType1: settingAchievementPersonalType1,
                setDefaultExpandedRowKeys,
                location,
              })}
              pagination={false}
              bordered
              expandable={defaultExpandable}
              locale={{
                emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
              }}
              scroll={{ x: !breaks.lg ? 900 : undefined }}
              loading={isLoading}
            />
            {role === 'user' && [0, 1, 2].includes(status) && isGoalDate && !store.isDisable && (
              <Button
                className="button-normal"
                type="primary"
                size="middle"
                onClick={async () => {
                  // setDataTemp([]);
                  dispatch(checkWeight2(true));
                  const dataList = [...dataSource];
                  if (dataList.length < 30) {
                    const temp: SubList[] = [];
                    dataSubTemp.forEach((item: { key: number; evaluationDecision: string; coefficient: number }) => {
                      return temp.push({
                        key: item.key,
                        evaluationDecision: item.evaluationDecision,
                        coefficient: item.coefficient,
                        parentKey: dataList.length,
                        type: 3,
                      });
                    });

                    dataList.push({
                      key: dataList.length + 1,
                      itemNo: dataList.length + 1,
                      evaluationAchievementPersonalSub: temp,
                      type: 3,
                    });
                    const dataKeyList: number[] = dataList.map((v) => v.key);
                    setDefaultExpandedRowKeys(dataKeyList);
                    setDataSource(dataList);
                  } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', `${30}`));
                }}
                style={{ marginTop: 10 }}
                disabled={store.isDisable || isLoading}
                loading={isLoading}
              >
                {t('IDS_BUTTON_ADD')}
              </Button>
            )}
          </Form>
          <PopupDepartments
            evaluationGoalList={clone.evaluationGoalList}
            isOpen={clone.isOpen}
            title={clone.title}
            setClone={setClone}
            t={t}
            type={clone.type}
            setDataState={setDataSource}
            dataStates={dataSource}
            setExpandedRowKey={setDefaultExpandedRowKeys}
            dataSubTemps={dataSubTemp}
            evaluationPeriodId={evaluationData.evaluationPeriod.id}
          />
        </>
      )}

      <ModalPopup
        metaModal={metaModal}
        setMetaModal={setMetaModal}
        FormModal={getFormModal()}
        width="calc(100vw - 100px)"
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        footer={
          <div style={{ textAlign: 'right' }} key={'Modal-open-key-1'}>
            <Button className="cancel_button" onClick={() => setMetaModal({ ...metaModal, isOpen: false })}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>
        }
      />

      {/* {(status > 3 || (role === "evaluator" && status >= 3)) && (
        <div style={{marginTop: 25}}>
          <EvaluationResult status={status} role={role} />
        </div>
      )} */}
    </>
  );
};

export default EvaluationGoalDepartment;
