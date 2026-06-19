import React, { useEffect, useState } from 'react';
import { goalsPastEvaluation } from '../../../page/user/interfaces/interfacesProps';
import { TFunction } from 'i18next';
import { Button, DatePicker, Form, message, Modal, Radio, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../hooks/useAuth';
import { ColumnsType } from 'antd/es/table';
import Icon, { ProfileOutlined, SearchOutlined } from '@ant-design/icons';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import {
  EvaluationPersonalAchievementOfUser,
  SettingAchievementPersonal,
  SubListNew,
} from '../evaluation-8-10/interfaces/response.interface';
import { userEvaluationPersonalGoalsList } from '../../../store/total';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';

interface Props {
  isOpen: boolean;
  title: string;
  evaluationGoalList: goalsPastEvaluation[];
  setClone: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      evaluationGoalList: goalsPastEvaluation[];
      type: number;
    }>
  >;
  t: TFunction;
  type: number;
  setDataState: React.Dispatch<React.SetStateAction<EvaluationPersonalAchievementOfUser[]>>;
  dataStates: EvaluationPersonalAchievementOfUser[];
  setExpandedRowKey: React.Dispatch<React.SetStateAction<number[]>>;
  filterPersonalForms: any;
  dataSubTemps: SettingAchievementPersonal[];
  evaluationId: number | undefined;
  evaluationPeriodId: number;
}
interface DataType {
  key: React.Key; // Required for Ant Design Table rows
  title: string;
  id: number;
  achievementValue: string;
  method: string;
  weight: number;
  difficulty: number;
  evaluationAchievementPersonalSub: {
    evaluationDecision: string;
    degree: string;
  }[];
}
const PopupPersonalGoal810 = (props: Props) => {
  const {
    isOpen,
    title,
    t,
    setClone,
    type,
    dataStates,
    setDataState,
    setExpandedRowKey,
    evaluationGoalList,
    filterPersonalForms,
    dataSubTemps,
    evaluationId,
    evaluationPeriodId,
  } = props;
  const [form] = Form.useForm();
  const [dataSources, setDataSources] = useState<
    {
      title: string;
      id: number;
      achievementValue: string;
      method: string;
      weight: number;
      difficulty: number;
      evaluationAchievementPersonalSub: {
        evaluationDecision: string;
        degree: string;
        point: string;
      }[];
    }[]
  >(evaluationGoalList || []);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<DataType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowsKeys, setSelectRowsKeys] = useState<number[]>([]);
  const store = useSelector((state: RootState) => state.userEvaluation);
  const [records, setRecords] = useState<{ data: { evaluationDecision: string; degree: string }[]; isOpen: boolean }>({
    data: [],
    isOpen: false,
  });

  const auth = useAuth();
  const [condition, setCondition] = useState({
    year: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
    periodEvaluate:
      EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 2 : 1,
  });
  const columns: ColumnsType<DataType> = [
    {
      title: t('IDS_EVALUATION_PERIOD'),
      dataIndex: 'period',
      key: 'period',
      width: 150,
      align: 'center',
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150,
    },
    {
      title: t('IDS_ACHIEVEMENT_PERSONAL'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('IDS_ACHIEVEMENT_VALUE'),
      dataIndex: 'achievementValue',
      key: 'achievementValue',
    },
    {
      title: t('IDS_METHOD'),
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: t('IDS_WEIGHT'),
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
    },
    {
      title: t('IDS_DIFFICULTY_PERSONAL'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      align: 'center',
      render(value) {
        return value && Number(value).toFixed(1);
      },
    },
    {
      title: t('IDS_EVALUATION_JUDGMENT_INDEX_TITLE'),
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render(value, record) {
        return (
          <>
            <Icon
              component={ProfileOutlined as React.ForwardRefExoticComponent<any>}
              style={{ cursor: 'pointer', color: '#007240', fontSize: 25 }}
              onClick={() => {
                setRecords({
                  data: record.evaluationAchievementPersonalSub,
                  isOpen: true,
                });
              }}
            />
          </>
        );
      },
    },
  ];
  const handleSearch = async () => {
    const year = form.getFieldValue('year');
    const periodIndex = form.getFieldValue('periodEvaluate');

    await initialPopup(Number(dayjs(year).format('YYYY')), periodIndex);
  };
  const initialPopup = async (year: number, periodIndex: number) => {
    const callBack = (
      data: {
        title: string;
        id: number;
        achievementValue: string;
        method: string;
        weight: number;
        difficulty: number;
        evaluationAchievementPersonalSub: {
          evaluationDecision: string;
          degree: string;
          point: string;
        }[];
      }[],
    ) => {
      setDataSources(data);
      setSelectRowsKeys([]);
    };

    const errorCallBack = (isLoading: boolean) => {
      setIsLoading(isLoading);
    };
    await userEvaluationApiService.goalsPastEvaluation(
      { year: year, periodIndex: periodIndex, type: type, evaluationPeriodId: evaluationPeriodId },
      callBack,
      errorCallBack,
    );
  };

  const addRows = () => {
    if (dataStates && dataStates.length + selectedRowsKeys.length <= 10) {
      const filterDataSouces = [...dataSources, ...evaluationGoalList].filter((v) => selectedRowsKeys.includes(v.id));

      const dataList = [...dataStates];
      const dataListNews = dataList.map((v, i) => {
        return {
          ...v,
          key: i,
          achievementValue:
            filterPersonalForms[i].achievementValue !== undefined
              ? filterPersonalForms[i].achievementValue
              : v.achievementValue,
          difficultyUser:
            filterPersonalForms[i].difficultyUser !== undefined
              ? filterPersonalForms[i].difficultyUser
              : v.difficultyUser,
          method: filterPersonalForms[i].method !== undefined ? filterPersonalForms[i].method : v.method,
          title: filterPersonalForms[i].title !== undefined ? filterPersonalForms[i].title : v.title,
          weight: filterPersonalForms[i].weight !== undefined ? filterPersonalForms[i].weight : v.weight,
          evaluationAchievementPersonalSub: v.evaluationAchievementPersonalSub.map((subItem, index) => ({
            ...subItem,
            evaluationDecision:
              filterPersonalForms[i].evaluationAchievementPersonalSub[index].evaluationDecision ||
              subItem.evaluationDecision,
          })),
        };
      }) as EvaluationPersonalAchievementOfUser[];

      for (let index = 0; index < filterDataSouces.length; index++) {
        dataListNews.push({
          key: dataListNews.length > 0 ? dataListNews[dataListNews.length - 1].key + 1 : 0,
          itemNo: dataListNews.length > 0 ? dataListNews[dataListNews.length - 1].itemNo + 1 : 0,
          evaluationAchievementPersonalSub: dataSubTemps.map((v, j) => {
            return {
              key: v.key,
              evaluationDecision: filterDataSouces[index].evaluationAchievementPersonalSub[j]
                ? filterDataSouces[index].evaluationAchievementPersonalSub[j].evaluationDecision
                : '',
              coefficient: Number(v.point),
              parentKey: dataStates.length,
              type: 2,
              degree: String(v.note),
              evaluationId: evaluationId,
            };
          }),
          type: type,
          evaluationId: evaluationId,
          achievementValue: filterDataSouces[index].achievementValue,
          method: filterDataSouces[index].method,
          title: filterDataSouces[index].title,
          difficultyUser: filterDataSouces[index].difficulty,
          weight: filterDataSouces[index].weight,
        });
      }
      setExpandedRowKey([...dataListNews.map((v) => v.key)]);
      setDataState && setDataState(dataListNews);

      dispatch(userEvaluationPersonalGoalsList(dataListNews));
      setClone({ isOpen: false, title: '', evaluationGoalList: [], type: 0 });
    } else message.warning(t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '10'));
  };

  // ===== POPUP detail goal
  const columnsGoals: ColumnsType = [
    {
      title: t('IDS_EVALUATION_JUDGMENT_INDEX'),
      dataIndex: 'evaluationDecision',
      align: 'left',
    },
    {
      title: t('IDS_DEGREE'),
      dataIndex: 'degree',
      align: 'left',
      width: 100,
    },
  ];
  useEffect(() => {
    if (isOpen) {
      initialPopup(condition.year, condition.periodEvaluate);
    }
    form.setFieldsValue({
      year: dayjs().year(condition.year),
      periodEvaluate: condition.periodEvaluate,
    });
  }, [isOpen]);

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <Typography.Title level={4}>
            <span>{title}</span>
          </Typography.Title>
        }
        maskClosable={false}
        destroyOnClose={true}
        width="calc(100vw - 100px)"
        style={{ top: 20 }}
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', maxWidth: 'calc(100vw - 50px)' }}
        onCancel={() => setClone({ isOpen: false, title: '', evaluationGoalList: [], type: 0 })}
        footer={[
          <div style={{ textAlign: 'left' }} key={'Modal-open-key-1'}>
            <Button
              className="button-normal"
              type="primary"
              size="middle"
              loading={isLoading}
              disabled={selectedRowsKeys.length === 0}
              onClick={addRows}
            >
              {t('IDS_BUTTON_ADD')}
            </Button>
            <Button
              className="cancel_button"
              onClick={() => setClone({ isOpen: false, title: '', evaluationGoalList: [], type: 0 })}
              loading={isLoading}
            >
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </div>,
        ]}
      >
        <Space
          direction="vertical"
          size={'small'}
          style={{
            width: '100%',
          }}
        >
          <div>
            <Form form={form} onFinish={handleSearch}>
              <Form.Item label={t('IDS_EVALUATION_PERIOD')} style={{ marginBottom: 0 }} colon={false}>
                <Space direction="horizontal" size={'small'}>
                  <Form.Item name={'year'} colon={false} initialValue={dayjs()}>
                    <DatePicker
                      disabled={isLoading}
                      format={'YYYY'}
                      picker="year"
                      disabledDate={(current) => {
                        return current && current > dayjs().endOf('day');
                      }}
                      size="small"
                      placeholder="YYYY"
                      allowClear={true}
                      clearIcon={false}
                      style={{ width: '100px' }}
                      defaultValue={dayjs()}
                    />
                  </Form.Item>
                  <Form.Item name="periodEvaluate" initialValue={1}>
                    <Radio.Group onChange={async (e) => {}} defaultValue={1} disabled={isLoading}>
                      <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                      <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Space>
              </Form.Item>
              <Form.Item style={{ marginTop: '10px' }}>
                <Button
                  className="button-normal"
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  icon={<SearchOutlined />}
                  loading={isLoading}
                >
                  {t('IDS_BUTTON_SEARCH')}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Table
              className="table-expanded-vertical-top-header-sticky"
              size="small"
              style={{ wordBreak: 'break-word' }}
              columns={columns}
              dataSource={
                dataSources.length > 0
                  ? ([...dataSources].map((item) => ({ key: item.id, ...item })) as DataType[])
                  : evaluationGoalList.map((item) => ({ key: item.id, ...item }))
              }
              locale={{
                emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
              }}
              bordered
              rowSelection={{
                columnTitle: '',
                onChange: (selectedRowsKeys, selectedRow) => {
                  const itemsList = selectedRow.map((item) => ({ ...item })) as DataType[];
                  setItems(itemsList);
                  setSelectRowsKeys(selectedRowsKeys as number[]);
                },
                selectedRowKeys: selectedRowsKeys,
              }}
              loading={isLoading}
              pagination={{
                position: ['bottomLeft'],
                pageSize: 10,
                total: dataSources.length,
                size: 'default',
                showTotal(total, range) {
                  return `${total}${t('IDS_CASE_LABEL')}${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`;
                },
                showSizeChanger: false,
              }}
              onRow={(_record, _index) => {
                return {
                  style: {
                    verticalAlign: 'baseline',
                  },
                };
              }}
            />
          </div>
        </Space>
      </Modal>
      {/*  */}
      <Modal
        title={<Typography.Title level={4}>{t('IDS_EVALUATION_JUDGMENT_INDEX')}</Typography.Title>}
        open={records.isOpen}
        maskClosable={false}
        destroyOnClose={true}
        width="calc(100vw - 100px)"
        style={{ top: 20 }}
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', maxWidth: 'calc(100vw - 50px)' }}
        footer={[
          <div style={{ textAlign: 'right' }} key={'Modal-open-key-1'}>
            <Button className="cancel_button" onClick={() => setRecords({ isOpen: false, data: [] })}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
        onCancel={() => setRecords({ isOpen: false, data: [] })}
      >
        <TableCustomComponent columns={columnsGoals} dataSources={records.data} />
      </Modal>
    </>
  );
};

export default PopupPersonalGoal810;
